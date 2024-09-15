import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Modal, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation for navigation
import Card from '../components/Card';
import axios from 'axios';

const TransferScreen = () => {
  const [balance, setBalance] = useState(0);
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionPin, setTransactionPin] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const route = useRoute();
  const navigation = useNavigation(); 
  const { userId, userEmail } = route.params || {}; 

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5229/api/v1/Accounts/get_account_by_id?Id=${userId}`);
      setBalance(response.data.currentAccountBalance);
    } catch (error) {
      console.error('Error fetching account balance:', error);
    }
  };

  const handleSubmit = async () => {
    const senderEmail = userEmail;
    if (!toEmail || !amount || !transactionPin) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:5229/api/v1/Transactions/make_funds_transfer?FromEmail=${senderEmail}&ToEmail=${toEmail}&Amount=${amount}&TransactionPin=${transactionPin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setMessage('Transaction completed successfully!');
        setModalVisible(true); // Show the modal
        setToEmail('');
        setAmount('');
        setTransactionPin('');
        fetchBalance(); 
      } else {
        const data = await response.json();
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again later.');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Home', { userId, userEmail });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Funds</Text>
      <Card userId={userId} style={styles.card} /> 
      <TextInput
        style={styles.input}
        placeholder="To Email"
        value={toEmail}
        onChangeText={setToEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={text => setAmount(text.replace(/[^0-9.]/g, ''))}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Transaction Pin"
        value={transactionPin}
        onChangeText={setTransactionPin}
        secureTextEntry
      />
      <Button title="Send" onPress={handleSubmit} />

      {/* Modal for success message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{message}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleCloseModal}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
});

export default TransferScreen;
