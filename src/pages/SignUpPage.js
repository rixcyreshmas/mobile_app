import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const SignupPage = ({ navigation }) => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
  };

  const handleSignup = async () => {
    if (!role) {
      Alert.alert('Validation Error', 'Please select a role.');
      return;
    }

    if (username.trim().length < 3) {
      Alert.alert('Validation Error', 'Username must be at least 3 characters.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters and include:\n- 1 uppercase letter\n- 1 number\n- 1 special character (!@#$%^&*)'
      );
      return;
    }

    try {
      const token = 'YOUR_ADMIN_TOKEN'; // 🔐 Replace this with your real Directus admin token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const roleMap = {
        student: 'b6b7eaad-e0c9-44e5-9c70-0fb6ee6f1a80', // Replace with your actual role ID
        teacher: 'ba6d6031-dc45-4171-8cc2-18c75a431b8c', // Replace with your actual role ID
      };

      const roleId = roleMap[role];

      if (!roleId) {
        Alert.alert('Error', 'Invalid role selected.');
        return;
      }

      const userRes = await axios.post(
        'http://10.0.2.2:8055/users',
        {
          email,
          password,
          first_name: username,
          role: roleId,
        },
        config
      );

      const userId = userRes.data.data.id;
      console.log('✅ User created:', userId);

      // Post to related collection
      const userFieldName = 'user'; // Change this if your Directus field is named differently

      const data = {
        [userFieldName]: userId,
        name: username,
        email,
      };

      if (role === 'student') {
        await axios.post('http://10.0.2.2:8055/items/students', data, config);
      } else if (role === 'teacher') {
        await axios.post('http://10.0.2.2:8055/items/counselors', data, config);
      }

      Alert.alert('Success', 'Account created! Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      const message =
        error.response?.data?.errors?.[0]?.message || 'Signup failed. Try again.';
      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LET'S GET YOU STARTED</Text>
      <Text style={styles.title}>Create an Account</Text>

      <View style={styles.pickerWrapper}>
        <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue)}>
          <Picker.Item label="Sign up as a" value="" />
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Teacher" value="teacher" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="SIGN UP" onPress={handleSignup} />

      <Text style={styles.or}>or</Text>
      <Button title="Sign up with Google" color="#DB4437" onPress={() => {}} disabled />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.underline}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
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
