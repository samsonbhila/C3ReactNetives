import { useRoute } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [layout, setLayout] = useState({});
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation(); 

  const handleLayout = (event) => {
    const { layout } = event.nativeEvent;
    setLayout(layout);
    console.log(layout);
  };

  const handleLogin = async () => {
    if (pin.length === 0 || pin.length > 4) {
      setErrorMessage('Your PIN must not be less or greater than 4 Digits, Please enter your PIN');
      return;
    }

    if (pin.length === 4 && /^[0-9]+$/.test(pin)) {
      try {
        const response = await axios.post('http://10.0.2.2:5229/api/v1/Accounts/authenticate', { pin });

        const token = response.data;
        const decodedToken = jwtDecode(token);

        const userId = decodedToken.nameid;
        const userName = decodedToken.FirstName;
        const userEmail = decodedToken.unique_name;
        //console.log(userEmail);

        navigation.navigate('Home', { userId, userName, userEmail });

      } catch (error) {
        console.log('Error response:', error.response);
        const errorMessage = error.response?.data?.data || error.response?.data || 'An unexpected error occurred';
        setErrorMessage(errorMessage);
      }
    }
  };

  
  const handleRegister = () => {
    navigation.navigate('Register'); 
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground 
        source={require('../../assets/images/background.jpg')} 
        style={[styles.container, { paddingTop: insets.top }]}>
        
        {/* Register Button at the top */}
        <View style={styles.topButtons}>
          <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

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
            Payments anywhere and anytime easily
          </Text>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TextInput
            style={[styles.input, errorMessage ? styles.errorInput : null]}
            keyboardType='numeric'
            maxLength={4}
            placeholder='Enter 4-digit PIN'
             placeholderTextColor='white'
            value={pin}
            onChangeText={text => setPin(text)}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 20,
  },
  registerButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  registerButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  textTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wrapText: {
    color: '#fff',
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
    marginVertical: 20,
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
});
