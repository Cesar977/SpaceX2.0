import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Lista() {
  const [launches, setLaunches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/launches')
      .then(res => res.json())
      .then(data => setLaunches(data.slice(0, 20)));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('favorites').then(data => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const toggleFavorite = async (launch) => {
    const isFav = favorites.some(f => f.id === launch.id);
    let updated;

    if (isFav) {
      updated = favorites.filter(f => f.id !== launch.id);
    } else {
      updated = [...favorites, launch];
    }

    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (id) => {
    return favorites.some(f => f.id === id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.date}>{item.date_utc.split('T')[0]}</Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Text style={styles.star}>{isFavorite(item.id) ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚀 Lanzamientos</Text>
      <FlatList
        data={launches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    flex: 1,
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
    justifyContent: 'space-between',
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
    fontSize: 22,
    color: '#fbc02d',
  },
});
