import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, TouchableOpacity, TextInput, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [layout, setLayout] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    pin: '',
    confirmPin: '',
    initialDeposit: 0.01,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLayout = (event) => {
    const { layout } = event.nativeEvent;
    setLayout(layout);
    console.log(layout);
  };

  const validateInputs = () => {
    const { firstName, lastName, phoneNumber, email, pin, confirmPin, initialDeposit } = formData;

    if (!firstName || !lastName || !phoneNumber || !email || !pin || !confirmPin || initialDeposit < 0.01) {
      setErrorMessage('All fields are required and the initial deposit must be at least 0.01');
      return false;
    }

    if (pin !== confirmPin) {
      setErrorMessage('PINs do not match.');
      return false;
    }

    if (pin.length !== 4 || !/^[0-9]+$/.test(pin)) {
      setErrorMessage('PIN must be exactly 4 digits.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post('http://10.0.2.2:5229/api/v1/Accounts/register_new_account', formData);
      // Show modal and navigate back to WelcomeScreen when click"OK" 
      setModalVisible(true);
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.log('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.response?.data || 'An unexpected error occurred';
      setErrorMessage(errorMessage);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground 
        source={require('../../assets/images/background.jpg')} 
        style={[styles.container, { paddingTop: insets.top }]}>
        
        <View style={styles.logoView}>
          <View onLayout={handleLayout}>
            {layout.width && layout.height && ( 
              <Image 
                source={require('../../assets/images/bg_card_welcome.png')}
                style={[styles.cardImg1, { width: layout.width, height: layout.height }]}
                resizeMode="contain"
              />
            )}
            <Image 
              source={require('../../assets/images/bh_card_welcome.png')} 
              style={styles.cardImg2} 
            />
          </View>
        </View>

        <View style={styles.wrapText}>
          <Text style={styles.textTitle}>
            Create a new account
          </Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder='First Name'
             placeholderTextColor='white'
            value={formData.firstName}
            onChangeText={text => handleInputChange('firstName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Last Name'
             placeholderTextColor='white'
            value={formData.lastName}
            onChangeText={text => handleInputChange('lastName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Phone Number'
            placeholderTextColor='white'
            value={formData.phoneNumber}
            onChangeText={text => handleInputChange('phoneNumber', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Email'
            placeholderTextColor='white'
            keyboardType='email-address'
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Enter 4-digit PIN'
            placeholderTextColor='white'
            secureTextEntry
            maxLength={4}
            value={formData.pin}
            onChangeText={text => handleInputChange('pin', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Confirm PIN'
             placeholderTextColor='white'
            secureTextEntry
            maxLength={4}
            value={formData.confirmPin}
            onChangeText={text => handleInputChange('confirmPin', text)}
          />
          <TextInput
            style={styles.input}
            placeholder='Initial Deposit'
             placeholderTextColor='white'
            keyboardType='numeric'
            value={formData.initialDeposit.toString()}
            onChangeText={text => handleInputChange('initialDeposit', parseFloat(text))}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Registration successful! Please login.</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Welcome');
                }}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </ScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapText: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    width: '80%',
    marginVertical: 10,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  cardImg1: {
    position: 'absolute',
    zIndex: 2,
    right: 20,
    bottom: 10,
  },
  logoView: {
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});
