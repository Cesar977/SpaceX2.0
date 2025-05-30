import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Íconos para pestañas

// Componentes de pantalla
import Home from './src/componentes/Home';
import Agregar from './src/componentes/Agregar';
import Lista from './src/componentes/Lista';
import Filtro from './src/componentes/Filtro';
import Busqueda from './src/componentes/Busqueda';
import Favoritos from './src/componentes/Favoritos';
import Usuario from './src/componentes/Usuario';
import Perfil from './src/componentes/Perfil';
import Multimedia from './src/componentes/Multimedia';
import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home': iconName = 'home-outline'; break;
            case 'Lista': iconName = 'list-outline'; break;
            case 'Agregar': iconName = 'add-circle-outline'; break;
            case 'Filtro': iconName = 'options-outline'; break;
            case 'Busqueda': iconName = 'search-outline'; break;
            case 'Favoritos': iconName = 'heart-outline'; break;
            case 'Usuarios': iconName = 'people-outline'; break;
            default: iconName = 'ellipse-outline'; break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Lista" component={Lista} />
      <Tab.Screen name="Agregar" component={Agregar} />
      <Tab.Screen name="Filtro" component={Filtro} />
      <Tab.Screen name="Busqueda" component={Busqueda} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Usuarios" component={Usuario} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Multimedia" component={Multimedia} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {usuario ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
