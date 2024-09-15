import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import ListService from '../components/ListService';
import ResentTransation from '../components/ResentTransation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const route = useRoute();
  const { userName, userId, userEmail } = route.params;
  const [balance, setBalance] = useState(0);
  const [refresh, setRefresh] = useState(false); 

  // Fetch balance function
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5229/api/v1/Accounts/get_account_by_id?Id=${userId}`);

      if (response.data) {
        setBalance(response.data.currentAccountBalance);
      } else {
        console.error('No data found in the response.');
        Alert.alert('Error', 'No account data found.');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error('Server error:', error.response.data);
      Alert.alert('Error', 'Server returned an error. Please try again later.');
    } else if (error.request) {
      console.error('Network error:', error.request);
      Alert.alert('Error', 'Network error. Failed to connect to the server.');
    } else {
      console.error('Error fetching account balance:', error.message);
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  };

  useEffect(() => {
    fetchData(); 

   
    const intervalId = setInterval(() => {
      fetchData();
      setRefresh((prev) => !prev); 
    }, 10000);

   
    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text>Hello</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <Image style={styles.bellRing} source={require('../../assets/images/ic_notif.jpg')} />
        </View>
        <View style={styles.card}>
          <Card userId={userId} balance={balance} />
        </View>
        <View style={styles.list}>
          <ListService userId={userId} userEmail={userEmail} />
        </View>
        <View style={styles.list}>
          <ResentTransation key={refresh} userEmail={userEmail} /> 
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bellRing: {
    width: 33,
    height: 33,
  },
  card: {
    paddingVertical: 14,
  },
  list: {
    marginTop: 10,
  },
});
