import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import TransferScreen from '../screens/TransferScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
