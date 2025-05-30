import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase/firebaseConfig';

export default function Registro({ navigation }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegistro = async () => {
    const { nombre, correo, password } = form;

    if (!nombre || !correo || !password) {
      Alert.alert('Campos requeridos', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await firestore.collection('usuarios').doc(user.uid).set({
        nombre,
        correo,
        creadoEn: new Date().toISOString(),
      });

      Alert.alert('Registro exitoso', 'Bienvenido, ahora puedes iniciar sesión.');
      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Error al registrar', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={form.correo}
        onChangeText={(text) => handleChange('correo', text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <Button title="Registrarse" onPress={handleRegistro} />

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes una cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});