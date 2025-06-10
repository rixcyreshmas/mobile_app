import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://10.0.2.2:8055'; // Android emulator loopback

const PersonalInfoPage = ({ route }) => {
  const { token } = route.params || {}; // Get token from previous screen

  const [firstName, setFirstName] = useState('');
  const [nicknameOption, setNicknameOption] = useState(null);
  const [nickname, setNickname] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [suffix, setSuffix] = useState('');

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Error', 'Missing authentication token.');
      return;
    }

    // Basic validation
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error', 'Last name is required.');
      return;
    }
    if (nicknameOption === true && !nickname.trim()) {
      Alert.alert('Validation Error', 'Please enter your nickname.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/items/students`, // Replace 'students' with your actual collection name
        {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          suffix: suffix,
          uses_nickname: nicknameOption,
          nickname: nicknameOption === true ? nickname : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Saved profile:', response.data);
      Alert.alert('Success', 'Profile info saved successfully!');
    } catch (error) {
      console.error(error.response?.data || error.message || error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.step}>1. Personal Info</Text>
      <Text style={styles.stepInactive}>2. Family Info</Text>

      <Text style={styles.title}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Legal first/given name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.question}>Would you like to share a different first name that people call you?</Text>
      <View style={styles.radioRow}>
        <TouchableOpacity onPress={() => setNicknameOption(true)}>
          <Text style={nicknameOption === true ? styles.radioSelected : styles.radio}>◉ Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNicknameOption(false)}>
          <Text style={nicknameOption === false ? styles.radioSelected : styles.radio}>◉ No</Text>
        </TouchableOpacity>
      </View>

      {nicknameOption === true && (
        <TextInput
          style={styles.input}
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Middle name"
        value={middleName}
        onChangeText={setMiddleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last/family/surname"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Suffix"
        value={suffix}
        onChangeText={setSuffix}
      />

      <Button title="Save Profile Info" onPress={handleSave} />
    </View>
  );
};

export default PersonalInfoPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
  },
  step: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  stepInactive: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  question: {
    marginTop: 10,
    fontSize: 14,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  radio: {
    marginRight: 20,
    fontSize: 16,
    color: '#555',
  },
  radioSelected: {
    marginRight: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
