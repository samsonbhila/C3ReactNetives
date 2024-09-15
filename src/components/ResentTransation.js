import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';

const capitecIcon = require("../../assets/images/capitec.jpg");

const ResentTransation = ({ userEmail }) => {  
  const [transactions, setTransactions] = useState([]);

  // Fetch transaction history from API on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:5229/api/v1/Transactions/transaction_history?email=${userEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          redirect: 'follow', 
        });

        if (response.ok) {
          const data = await response.json();

          const formattedTransactions = data.map(transaction => ({
            Type: mapTransactionType(transaction.transactionType),
            icon: capitecIcon,
            date: formatDate(transaction.transactionDate),
            payment: `+${transaction.transactionAmount}`,
            recipientName: extractRecipientName(transaction.transactionDestinationAccount),
            paymentType: mapTransactionType(transaction.transactionType),
          }));

          // Sort transactions by date, most recent first
          formattedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

          setTransactions(formattedTransactions);
        } else {
          console.error('Failed to fetch transactions:', response.status);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [userEmail]);

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Function to map transaction type to a readable format
  const mapTransactionType = (type) => {
    switch (type) {
      case 1:
        return 'Payment';
      case 2:
        return 'Transfer';
      case 3:
        return 'Withdrawal';
      default:
        return 'Unknown';
    }
  };

  // Function to extract recipient name from email 
  const extractRecipientName = (email) => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return 'Unknown Recipient'; 
    }
    const parts = email.split('@')[0].split('.');
    if (parts.length < 2) {
      return 'Unknown Recipient';
    }
    const [firstName, lastName] = parts;
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
  };


  const renderTransactionItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.icon} style={styles.icon} />
        <View style={styles.detailsContainer}>
          <View style={styles.recipientContainer}>
            <Text style={styles.recipient}>{item.recipientName}</Text>
          </View>
          <View style={styles.paymentTypeContainer}>
            <Text style={styles.paymentType}>{item.paymentType}</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.payment}>{item.payment}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ResentTransation;

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  container: {
    marginTop: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipientContainer: {
    flex: 2,
  },
  recipient: {
    fontSize: 14,
    color: 'gray',
  },
  paymentTypeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  paymentType: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  payment: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateContainer: {
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
});
