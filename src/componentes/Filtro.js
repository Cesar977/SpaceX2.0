import React, { useEffect, useState } from 'react';
import { View, Text, Switch, FlatList, StyleSheet } from 'react-native';

export default function Filtro() {
  const [launches, setLaunches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(false);
  const [failureOnly, setFailureOnly] = useState(false);

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/launches')
      .then((res) => res.json())
      .then((data) => setLaunches(data));
  }, []);

  const filtered = launches.filter((l) => {
    if (successOnly && failureOnly) return false;
    if (successOnly) return l.success === true;
    if (failureOnly) return l.success === false;
    return true;
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.launchName}>
        {item.name} - {item.success ? '✅' : '❌'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar Lanzamientos</Text>

      <View style={styles.switchRow}>
        <Text>Mostrar solo exitosos</Text>
        <Switch
          value={successOnly}
          onValueChange={() => setSuccessOnly(!successOnly)}
        />
      </View>

      <View style={styles.switchRow}>
        <Text>Mostrar solo fallidos</Text>
        <Switch
          value={failureOnly}
          onValueChange={() => setFailureOnly(!failureOnly)}
        />
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>No hay lanzamientos para mostrar.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  item: {
    backgroundColor: '#f1f1f1',
    padding: 12,
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
