import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, Linking,
  ActivityIndicator, StyleSheet, ScrollView
} from 'react-native';

export default function Multimedia() {
  const [multimedia, setMultimedia] = useState([
    {
      id: '1',
      descripcion: 'Imagen de prueba',
      tipo: 'imagen',
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/SpaceX_Demo-2_Launch_%28NHQ202005300026%29.jpg'
    },
    {
      id: '2',
      descripcion: 'Otra imagen de prueba',
      tipo: 'imagen',
      url: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Falcon_Heavy_Demo_Mission_%2840076788141%29.jpg'
    }
  ]);
  const [spacexImages, setSpacexImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch('https://api.spacexdata.com/v4/launches');
        const launches = await response.json();
        const images = launches
          .flatMap(launch => launch.links?.flickr?.original || [])
          .filter(url => url);
        setSpacexImages(images);
      } catch (apiError) {
        console.error('Error al obtener imágenes de SpaceX:', apiError);
        setError('Error al obtener imágenes de SpaceX.');
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

  const renderSpacexImage = ({ item }) => (
    <View style={styles.mediaItem}>
      <Image source={{ uri: item }} style={styles.mediaImage} />
    </View>
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
      <Text style={styles.title}>📷 Galería de SpaceX</Text>
      {spacexImages.length > 0 ? (
        <FlatList
          data={spacexImages}
          renderItem={renderSpacexImage}
          keyExtractor={(item, idx) => `spacex-${idx}`}
          scrollEnabled={false}
        />
      ) : (
        <Text>No se encontraron imágenes de SpaceX.</Text>
      )}

      <Text style={styles.title}>📁 Mis Multimedia</Text>
      {multimedia.length > 0 ? (
        <FlatList
          data={multimedia}
          renderItem={renderMultimediaItem}
          keyExtractor={(item) => `media-${item.id}`}
          scrollEnabled={false}
        />
      ) : (
        <Text>No tienes multimedia guardada.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaItem: {
    marginBottom: 20,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});
