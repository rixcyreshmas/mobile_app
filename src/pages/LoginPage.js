import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8055'; // Android Emulator IP

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      Alert.alert('Login Failed', 'Please fix the errors before continuing.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.data.access_token;

      // Save token to AsyncStorage for persistence
      await AsyncStorage.setItem('userToken', token);

      console.log('Login successful. Token saved.');

      // Navigate to ProfilePage and pass the token (optional, since saved in AsyncStorage)
      navigation.navigate('Profile', { token });
    } catch (error) {
      console.error('Login error:', error.response || error.message || error);
      const errorMessage =
        error.response?.data?.errors?.[0]?.message || 'Login failed. Please try again.';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>WELCOME BACK</Text>
      <Text style={styles.title}>Log In to your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <View style={styles.row}>
        <TouchableOpacity>
          <Text style={styles.smallText}>Remember Me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="LOGIN" onPress={handleLogin} />
      )}

      <Text style={styles.or}>or</Text>
      <Button title="Login with Google" color="#DB4437" onPress={() => {}} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>
          Don't have an account? <Text style={styles.underline}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  smallText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    color: 'blue',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});
