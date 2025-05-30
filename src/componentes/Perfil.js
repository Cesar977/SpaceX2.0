import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Linking,
  Button,
  StyleSheet,
} from 'react-native';

export default function Perfil({ route, navigation }) {
  const { id } = route.params;
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLaunch() {
      try {
        const response = await fetch(`https://api.spacexdata.com/v4/launches/${id}`);
        const data = await response.json();
        setLaunch(data);
      } catch (error) {
        console.error('Error al cargar los detalles del lanzamiento:', error);
        setLaunch(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLaunch();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando información del lanzamiento...</Text>
      </View>
    );
  }

  if (!launch) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>No se encontró información del lanzamiento.</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const openWikipedia = () => {
    const url = launch?.links?.wikipedia;
    if (url) Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{launch.name}</Text>
      <Text>
        <Text style={styles.label}>Fecha:</Text>{' '}
        {new Date(launch.date_utc).toLocaleString()}
      </Text>
      <Text>
        <Text style={styles.label}>Detalles:</Text>{' '}
        {launch.details || 'No hay detalles disponibles.'}
      </Text>
      <Text>
        <Text style={styles.label}>Éxito:</Text>{' '}
        {launch.success ? 'Sí' : 'No'}
      </Text>
      <Text>
        <Text style={styles.label}>Fallo:</Text>{' '}
        {launch.failures?.length > 0 ? 'Sí' : 'No'}
      </Text>

      {launch.links?.wikipedia && (
        <Text style={styles.link} onPress={openWikipedia}>
          Ver en Wikipedia
        </Text>
      )}

      <Button
      title="Volver a Buscar"
      onPress={() => navigation.navigate('Tabs', { screen: 'Busqueda' })}
    />
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
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
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});
