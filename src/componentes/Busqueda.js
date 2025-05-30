import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput
} from 'react-native';

export default function Busqueda({ navigation }) {
  const [lanzamientos, setLanzamientos] = useState([]);
  const [filteredLanzamientos, setFilteredLanzamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchLanzamientos() {
      try {
        const res = await fetch('https://api.spacexdata.com/v4/launches');
        const data = await res.json();
        setLanzamientos(data);
        setFilteredLanzamientos(data);
      } catch (err) {
        console.error('Error cargando lanzamientos', err);
      }
      setLoading(false);
    }

    fetchLanzamientos();
  }, []);

  // Filtra lanzamientos cuando cambia search
  useEffect(() => {
    const filtered = lanzamientos.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLanzamientos(filtered);
  }, [search, lanzamientos]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Perfil', { id: item.id })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.date}>
        {new Date(item.date_utc).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Cargando lanzamientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Lanzamientos</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre..."
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
      <FlatList
        data={filteredLanzamientos}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron lanzamientos.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  item: {
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#666',
  },
});
