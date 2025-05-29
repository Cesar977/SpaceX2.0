import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Busqueda() {
  const [launches, setLaunches] = useState([]);
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/launches')
      .then((res) => res.json())
      .then((data) => setLaunches(data));
  }, []);

  const filteredLaunches = launches.filter((launch) =>
    launch.name.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Perfil', { id: item.id })}
    >
      <Text style={styles.launchName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Lanzamientos</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre de lanzamiento..."
        value={query}
        onChangeText={setQuery}
      />

      {filteredLaunches.length > 0 ? (
        <FlatList
          data={filteredLaunches}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No se encontraron resultados.</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  item: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    marginVertical: 6,
    borderRadius: 8,
  },
  launchName: {
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
