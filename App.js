import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Para web, importamos los estilos CSS
if (Platform.OS === 'web') {
  // Web necesita importar los estilos dinámicamente
  require('./src/styles/tailwind.css');
}


// Importación de pantallas
import HomeScreen from './src/screens/HomeScreen';
import AddIncomeScreen from './src/screens/AddIncomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CalendarView from './src/screens/CalendarView';
import SavingsSimulation from './src/screens/SavingsSimulation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#3E88FF',
            },
            headerTintColor: '#333',
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Mi Presupuesto' }} />
          <Stack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: 'Registrar Ingreso' }} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Registrar Gasto' }} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: 'Estadísticas' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
          <Stack.Screen name="Calendar" component={CalendarView} options={{ title: 'Calendario' }} />
          <Stack.Screen name="Savings" component={SavingsSimulation} options={{ title: 'Simulación de Ahorro' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    </GestureHandlerRootView>
  );
}
