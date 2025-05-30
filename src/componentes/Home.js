import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Preguntados')} style={{ marginRight: 15 }}>
          <Ionicons name="game-controller-outline" size={24} color="tomato" />
        </TouchableOpacity>
      ),
      headerShown: true,
      title: 'Home',
    });
  }, [navigation]);

  const noticias = [
    {
      titulo: 'SpaceX lanza 60 satélites Starlink',
      fecha: '22 de mayo, 2025',
      resumen: 'SpaceX lanzó con éxito 60 satélites para su constelación Starlink desde Cabo Cañaveral.',
    },
    {
      titulo: 'Nuevo vuelo tripulado a la EEI',
      fecha: '18 de mayo, 2025',
      resumen: 'La misión Crew-9 transportó a 4 astronautas a la Estación Espacial Internacional.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bienvenido a SpaceX Explorer 🚀</Text>
      <Text style={styles.subtitle}>
        Tu portal para explorar el universo SpaceX: lanzamientos, misiones, multimedia exclusiva y más.
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Multimedia')}>
          <Text style={styles.buttonText}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.outline]} onPress={() => navigation.navigate('Agregar')}>
          <Text style={[styles.buttonText, styles.outlineText]}>Agregar imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Busqueda')}>
          <Text style={styles.buttonText}>Buscar ahora</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.newsTitle}>📰 Últimas noticias</Text>
      {noticias.map((n, i) => (
        <View key={i} style={styles.newsItem}>
          <Text style={styles.newsHeadline}>{n.titulo}</Text>
          <Text style={styles.newsDate}>{n.fecha}</Text>
          <Text style={styles.newsText}>{n.resumen}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0052cc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  outline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0052cc',
  },
  secondary: {
    backgroundColor: '#444',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  outlineText: {
    color: '#0052cc',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  newsItem: {
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  newsHeadline: {
    fontSize: 16,
    fontWeight: '600',
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
  },
  newsText: {
    fontSize: 14,
    color: '#333',
  },
});
