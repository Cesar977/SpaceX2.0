import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lista({ navigation }) {
  const [launches, setLaunches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar lanzamientos desde API SpaceX
  useEffect(() => {
    async function fetchLaunches() {
      try {
        const res = await fetch('https://api.spacexdata.com/v4/launches');
        const data = await res.json();
        // Opcional: ordenar por fecha descendente (más recientes primero)
        const sorted = data.sort(
          (a, b) => new Date(b.date_utc) - new Date(a.date_utc)
        );
        setLaunches(sorted);
      } catch (error) {
        console.error('Error cargando lanzamientos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaunches();
  }, []);

  // Cargar favoritos de AsyncStorage
  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await AsyncStorage.getItem('favorites');
        if (data) setFavorites(JSON.parse(data));
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      }
    }
    loadFavorites();
  }, []);

  // Alternar favorito
  const toggleFavorite = async (launch) => {
    try {
      const isFav = favorites.some((f) => f.id === launch.id);
      const updated = isFav
        ? favorites.filter((f) => f.id !== launch.id)
        : [...favorites, launch];
      setFavorites(updated);
      await AsyncStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  // Render de cada item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate('Perfil', { id: item.id })}
      >
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.date}>
          {item.date_utc ? item.date_utc.split('T')[0] : 'Fecha desconocida'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Text style={[styles.star, isFavorite(item.id) ? styles.starFilled : styles.starEmpty]}>
          {isFavorite(item.id) ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando lanzamientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚀 Lanzamientos recientes</Text>
      {launches.length === 0 ? (
        <Text style={styles.emptyText}>No hay lanzamientos para mostrar.</Text>
      ) : (
        <FlatList
          data={launches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 60 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  item: {
    backgroundColor: '#f4f4f4',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  star: {
    fontSize: 24,
    marginLeft: 12,
  },
  starFilled: {
    color: '#fbc02d', // amarillo
  },
  starEmpty: {
    color: '#bbb', // gris claro
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#666',
  },
});
