import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

const preguntasOriginales = [
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
  {
    pregunta: '¿Qué nombre recibe el cohete más potente de SpaceX?',
    opciones: ['Falcon Heavy', 'Starship', 'Falcon 9', 'Dragon'],
    correcta: 1,
  },
  {
    pregunta: '¿Cuál fue el primer satélite lanzado para el proyecto Starlink?',
    opciones: ['Starlink-1', 'Starlink-100', 'Starlink-5', 'Starlink-0'],
    correcta: 0,
  },
  {
    pregunta: '¿Qué tipo de combustible usa el cohete Falcon 9?',
    opciones: ['Querosen', 'LOX y RP-1', 'Hidrógeno líquido', 'Metano'],
    correcta: 1,
  },
];

// Función para mezclar un array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Preguntados() {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [terminado, setTerminado] = useState(false);

  // Animaciones
  const vueloAnim = useRef(new Animated.Value(0)).current;
  const estrellasAnim = useRef(new Animated.Value(1)).current;
  const explosionAnim = useRef(new Animated.Value(1)).current;

  // Al montar componente barajamos preguntas
  useEffect(() => {
    const mezcladas = shuffleArray(preguntasOriginales);
    setPreguntas(mezcladas);
  }, []);

  useEffect(() => {
    if (terminado) {
      if (puntaje > 3) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(vueloAnim, {
              toValue: -20,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
            Animated.timing(vueloAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.sin),
            }),
          ])
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(estrellasAnim, {
              toValue: 0.2,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(estrellasAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        Animated.timing(explosionAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [terminado]);

  const responder = (opcion) => {
    if (opcion === preguntas[indice].correcta) setPuntaje(puntaje + 1);
    if (indice + 1 < preguntas.length) setIndice(indice + 1);
    else setTerminado(true);
  };

  if (preguntas.length === 0) {
    // mientras carga las preguntas
    return (
      <View style={styles.container}>
        <Text style={{ color: '#66fcf1' }}>Cargando preguntas...</Text>
      </View>
    );
  }

  if (terminado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Juego terminado! 🚀</Text>
        <Text style={styles.puntaje}>
          Puntaje: {puntaje} / {preguntas.length}
        </Text>

        {puntaje > 3 ? (
          <>
            <Animated.View style={[styles.nave, { transform: [{ translateY: vueloAnim }] }]}>
              <Text style={styles.naveEmoji}>🚀</Text>
            </Animated.View>
            <Animated.Text style={[styles.estrellas, { opacity: estrellasAnim }]}>✨✨✨</Animated.Text>
          </>
        ) : (
          <Animated.View
            style={[styles.nave, { transform: [{ scale: explosionAnim }], opacity: explosionAnim }]}
          >
            <Text style={styles.explosion}>💥</Text>
            <Text style={styles.explosionText}>¡Oops! La nave explotó</Text>
          </Animated.View>
        )}

        <TouchableOpacity
          onPress={() => {
            setIndice(0);
            setPuntaje(0);
            setTerminado(false);
            vueloAnim.setValue(0);
            estrellasAnim.setValue(1);
            explosionAnim.setValue(1);
            setPreguntas(shuffleArray(preguntasOriginales));
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
    alignItems: 'center',
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
    width: '100%',
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
  nave: {
    marginVertical: 20,
  },
  naveEmoji: {
    fontSize: 100,
  },
  estrellas: {
    fontSize: 40,
    color: '#66fcf1',
    marginTop: 10,
  },
  explosion: {
    fontSize: 80,
    color: '#ff5555',
  },
  explosionText: {
    fontSize: 20,
    color: '#ff5555',
    marginTop: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
