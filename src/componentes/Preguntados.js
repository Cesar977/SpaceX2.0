import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const preguntas = [
  {
    pregunta: '¿En qué año SpaceX realizó su primer lanzamiento exitoso?',
    opciones: ['2008', '2010', '2012', '2015'],
    correcta: 0,
  },
  {
    pregunta: '¿Cuál es el nombre del cohete reutilizable de SpaceX?',
    opciones: ['Falcon 1', 'Starship', 'Falcon 9', 'Dragon'],
    correcta: 2,
  },
  {
    pregunta: '¿Cuál es el objetivo principal del proyecto Starlink?',
    opciones: [
      'Exploración de Marte',
      'Internet global por satélites',
      'Lanzar turistas al espacio',
      'Estación espacial privada',
    ],
    correcta: 1,
  },
  {
    pregunta: '¿Cuál fue la primera nave de SpaceX en transportar astronautas a la EEI?',
    opciones: ['Dragon 1', 'Crew Dragon', 'Starship', 'Falcon Heavy'],
    correcta: 1,
  },
  {
    pregunta: '¿Cómo se llama el fundador de SpaceX?',
    opciones: ['Jeff Bezos', 'Richard Branson', 'Elon Musk', 'Bill Gates'],
    correcta: 2,
  },
];

export default function Preguntados() {
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const responder = (opcion) => {
    if (opcion === preguntas[indice].correcta) {
      setPuntaje(puntaje + 1);
    }
    if (indice + 1 < preguntas.length) {
      setIndice(indice + 1);
    } else {
      setTerminado(true);
    }
  };

  if (terminado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Juego terminado! 🚀</Text>
        <Text style={styles.puntaje}>Puntaje: {puntaje} / {preguntas.length}</Text>

        {puntaje > 3 ? (
          <View style={styles.animacionContainer}>
            {/* GIF nave volando */}
            <Image
              source={{ uri: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif' }}
              style={styles.gif}
              resizeMode="contain"
            />
            <Text style={styles.estrellas}>✨✨✨</Text>
          </View>
        ) : (
          <View style={styles.animacionContainer}>
            {/* GIF nave explotando */}
            <Image
              source={{ uri: 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' }}
              style={styles.gif}
              resizeMode="contain"
            />
            <Text style={styles.explosionText}>¡Oops! La nave explotó 💥</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            setIndice(0);
            setPuntaje(0);
            setTerminado(false);
          }}
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Jugar otra vez</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pregunta}>{preguntas[indice].pregunta}</Text>
      {preguntas[indice].opciones.map((opcion, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => responder(i)}
          style={styles.boton}
          activeOpacity={0.7}
        >
          <Text style={styles.textoBoton}>{opcion}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.indicador}>
        Pregunta {indice + 1} de {preguntas.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c10',
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    color: '#66fcf1',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  puntaje: {
    fontSize: 22,
    color: '#c5c6c7',
    textAlign: 'center',
    marginBottom: 20,
  },
  pregunta: {
    fontSize: 20,
    color: '#45a29e',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  boton: {
    backgroundColor: '#1f2833',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#45a29e',
  },
  textoBoton: {
    color: '#66fcf1',
    fontSize: 18,
    textAlign: 'center',
  },
  indicador: {
    marginTop: 20,
    textAlign: 'center',
    color: '#c5c6c7',
    fontSize: 14,
  },
  animacionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  estrellas: {
    fontSize: 36,
    color: '#66fcf1',
    marginTop: 10,
  },
  explosionText: {
    fontSize: 20,
    color: '#ff5555',
    marginTop: 10,
    fontWeight: '700',
  },
  boton: {
    backgroundColor: '#1f2833',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#45a29e',
  },
});
