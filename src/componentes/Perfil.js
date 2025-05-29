import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Linking, Button, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase'; // ajusta la ruta según tu proyecto

export default function Perfil({ route, navigation }) {
  const { id } = route.params;
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLaunch() {
      setLoading(true);
      try {
        // Traemos documento por ID de Firestore
        const doc = await firestore.collection('launches').doc(id).get();
        if (!doc.exists) {
          setError('No se encontró el lanzamiento.');
        } else {
          setLaunch(doc.data());
        }
      } catch (e) {
        setError('Error al obtener datos');
      }
      setLoading(false);
    }
    fetchLaunch();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando información...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  if (!launch) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el lanzamiento.</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const openWikipedia = () => {
    if (launch.links?.wikipedia) {
      Linking.openURL(launch.links.wikipedia);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{launch.name}</Text>
      <Text><Text style={styles.label}>Fecha:</Text> {new Date(launch.date_utc).toLocaleDateString()}</Text>
      <Text><Text style={styles.label}>Detalles:</Text> {launch.details || 'No hay detalles disponibles.'}</Text>
      <Text><Text style={styles.label}>Éxito:</Text> {launch.success ? 'Sí' : 'No'}</Text>
      <Text><Text style={styles.label}>Fallo:</Text> {launch.failures && launch.failures.length > 0 ? 'Sí' : 'No'}</Text>

      {launch.links?.wikipedia ? (
        <Text style={styles.link} onPress={openWikipedia}>
          Ver en Wikipedia
        </Text>
      ) : null}

      <Button title="Volver a Buscar" onPress={() => navigation.navigate('Busqueda')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  link: {
    marginTop: 12,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
