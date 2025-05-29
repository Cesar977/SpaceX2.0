import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Favoritos() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        setFavorites(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('Error cargando favoritos', error);
      }
    };

    loadFavorites();
  }, []);

  const clearFavorites = async () => {
    try {
      await AsyncStorage.removeItem('favorites');
      setFavorites([]);
    } catch (error) {
      console.error('Error limpiando favoritos', error);
    }
  };

  const renderItem = ({ item }) => {
    if (!item || !item.name || !item.date_utc) return null;
    return (
      <View style={styles.item}>
        <Text style={styles.name}>
          {item.name} ({item.date_utc.split('T')[0]})
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Favoritos</Text>

      {favorites.length === 0 ? (
        <Text style={styles.empty}>No hay favoritos aún.</Text>
      ) : (
        <>
          <View style={styles.button}>
            <Button title="Limpiar favoritos" onPress={clearFavorites} color="#d9534f" />
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  empty: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
  },
  button: {
    marginBottom: 20,
  },
});
