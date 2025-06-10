import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from './src/pages/LoginPage';
import SignupPage from './src/pages/SignUpPage';
import ProfilePage from './src/pages/ProfilePage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
