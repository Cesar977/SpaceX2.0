import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebaseConfig';

export default function Usuario() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    fecha_nacimiento: '',
    telefono: '',
    rol: '',
  });
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    const cargarUsuario = async () => {
      const user = auth.currentUser;
      if (user) {
        setForm((f) => ({ ...f, correo: user.email }));
        const doc = await firestore.collection('usuarios').doc(user.uid).get();
        if (doc.exists) {
          setUsuario({ id: user.uid, ...doc.data() });
          setForm({
            nombre: doc.data().nombre || '',
            correo: user.email || '',
            fecha_nacimiento: doc.data().fecha_nacimiento || '',
            telefono: doc.data().telefono || '',
            rol: doc.data().rol || '',
          });
          cargarImagenes(user.uid);
        }
      }
    };
    cargarUsuario();
  }, []);

  const cargarImagenes = async (userId) => {
    const querySnapshot = await firestore
      .collection('multimedia')
      .where('usuarioid', '==', userId)
      .get();
    const imgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setImagenes(imgs);
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      await firestore.collection('usuarios').doc(usuario.id).update(form);
      Alert.alert('Éxito', 'Datos actualizados');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const handleEliminarImagen = async (id) => {
    try {
      await firestore.collection('multimedia').doc(id).delete();
      setImagenes(imagenes.filter(img => img.id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la imagen');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUsuario(null);
      setForm({
        nombre: '',
        correo: '',
        fecha_nacimiento: '',
        telefono: '',
        rol: '',
      });
      setImagenes([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  if (!usuario) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      <Text>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={form.nombre}
        onChangeText={text => handleChange('nombre', text)}
      />

      <Text>Correo:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#eee' }]}
        value={form.correo}
        editable={false}
      />

      <Text>Fecha de nacimiento:</Text>
      <TextInput
        style={styles.input}
        value={form.fecha_nacimiento}
        placeholder="YYYY-MM-DD"
        onChangeText={text => handleChange('fecha_nacimiento', text)}
      />

      <Text>Teléfono:</Text>
      <TextInput
        style={styles.input}
        value={form.telefono}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="phone-pad"
      />

      <Text>Rol:</Text>
      <TextInput
        style={styles.input}
        value={form.rol}
        onChangeText={text => handleChange('rol', text)}
      />

      <Button title="Guardar cambios" onPress={handleUpdate} />

      {imagenes.map(img => (
        <View key={img.id} style={styles.imageItem}>
          <Text>{img.url}</Text>
          <Button title="Eliminar" color="red" onPress={() => handleEliminarImagen(img.id)} />
        </View>
      ))}

      <View style={{ marginVertical: 30 }}>
        <Text style={styles.subtitle}>¿Quieres cerrar sesión?</Text>
        <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
  },
  imageItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 8,
  },
};
