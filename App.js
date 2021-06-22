import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Button 
} from 'react-native';
// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// User Defined Components
import Screen1 from './components/screen1'
import Screen2 from './components/screen2'


// The createStackNavigator is a method from the react-navigation/stack package the returns a Screen and Navigator object
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteNamw="Screen1">
        <Stack.Screen name="Screen1" component={Screen1}/>
        <Stack.Screen name="Screen2" componenet={Screen2}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
