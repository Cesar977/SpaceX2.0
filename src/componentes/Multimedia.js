import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { auth, firestore } from '../firebase/firebaseConfig'; // Ajusta la ruta

export default function Multimedia() {
  const [multimedia, setMultimedia] = useState([]);
  const [spacexImages, setSpacexImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError('No autenticado');
        setLoading(false);
        return;
      }

      try {
        // Multimedia del usuario
        const querySnapshot = await firestore.collection('multimedia').where('usuarioid', '==', user.uid).get();
        const userMedia = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMultimedia(userMedia);
      } catch (err) {
        setError('Error al cargar multimedia');
      }

      try {
        const response = await fetch('https://api.spacexdata.com/v3/launches');
        const launches = await response.json();
        const images = launches
          .flatMap(launch => launch.links.flickr_images)
          .filter(url => url);
        setSpacexImages(images);
      } catch (apiError) {
        console.error('Error al obtener imágenes de SpaceX:', apiError);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando multimedia...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  const renderSpacexImage = ({ item, index }) => (
    <Image
      source={{ uri: item }}
      style={styles.spacexImage}
      key={index.toString()}
      resizeMode="cover"
    />
  );

  const renderMultimediaItem = ({ item }) => (
    <View style={styles.mediaItem}>
      <Text>{item.descripcion || 'Sin descripción'}</Text>
      {item.tipo === 'imagen' && item.url ? (
        <Image source={{ uri: item.url }} style={styles.mediaImage} />
      ) : item.url ? (
        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
          <Text style={styles.link}>{item.url}</Text>
        </TouchableOpacity>
      ) : (
        <Text>Sin contenido</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Galería de SpaceX</Text>
      {spacexImages.length > 0 ? (
        <FlatList
          data={spacexImages}
          renderItem={renderSpacexImage}
          keyExtractor={(item, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 30 }}
        />
      ) : (
        <Text>No se encontraron imágenes de SpaceX.</Text>
      )}

      <Text style={styles.title}>Mis Multimedia</Text>
      {multimedia.length === 0 ? (
        <Text>No tienes multimedia guardada.</Text>
      ) : (
        <FlatList
          data={multimedia}
          renderItem={renderMultimediaItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacexImage: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  mediaItem: {
    marginBottom: 20,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
