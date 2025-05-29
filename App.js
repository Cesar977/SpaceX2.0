import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Home from './src/componentes/Home';
import Lista from './src/componentes/Lista';
import Filtro from './src/componentes/Filtro';
import Busqueda from './src/componentes/Busqueda';
import Favoritos from './src/componentes/Favoritos';
import Perfil from './src/componentes/Perfil';
import Usuario from './src/componentes/Usuario';
import Multimedia from './src/componentes/Multimedia';
import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Lista" component={Lista} />
      <Tab.Screen name="Filtro" component={Filtro} />
      <Tab.Screen name="Busqueda" component={Busqueda} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Usuarios" component={Usuario} />
      <Tab.Screen name="Multimedia" component={Multimedia} />
      <Tab.Screen name="Perfil" component={Perfil} />
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
      {usuario ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
