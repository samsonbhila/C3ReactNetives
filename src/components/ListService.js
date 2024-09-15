import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const listService = [
  {
    name: 'Wallet',
    icon: require("../../assets/images/wallet1.jpg"),
  },
  {
    name: 'Transfer',
    icon: require("../../assets/images/transfer2.jpg"),
  },
  {
    name: 'Pay',
    icon: require("../../assets/images/pay2.jpg"),
  },
  {
    name: 'Top Up',
    icon: require("../../assets/images/top2.jpg"),
  },
];

const ListService = ({ userId, userEmail }) => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    if (item.name === 'Transfer') {
      navigation.navigate('Transfer', { userId, userEmail }); 
    }
  };

  const renderServiceItem = (item) => (
    <TouchableOpacity key={item.name} onPress={() => handlePress(item)}>
      <View style={styles.iconItem}>
        <Image source={item.icon} style={styles.icon} />
      </View>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={styles.title}>Services</Text>
      <View style={styles.list}>{listService.map(renderServiceItem)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E5E5E5',
    shadowColor: '#000', // iOS only
    shadowOffset: { height: 10, width: 8 }, // iOS only
    shadowOpacity: 0.5, // iOS only
    shadowRadius: 10, // iOS only
    elevation: 5, // Android only
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListService;
