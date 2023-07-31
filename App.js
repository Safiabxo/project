import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/login';
import SignUp from './src/signup';
import HomePage from './src/homepage';
import Profile from './src/profile';
import Contacts from './src/contacts';


export default class App extends Component {
  render() {
    const Stack = createNativeStackNavigator();

    return (
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='SignUp' component={SignUp}/>
            <Stack.Screen name='HomePage' component={HomePage}/>
            <Stack.Screen name='Profile' component={Profile}/>
            <Stack.Screen name='Contacts' component={Contacts}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
