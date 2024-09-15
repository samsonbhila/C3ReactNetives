// Card.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';

const width_screen = Dimensions.get("window").width;

const Card = ({ userId, onBalanceFetched }) => {
    const [accountData, setAccountData] = useState({
        firstName: '',
        lastName: '',
        currentAccountBalance: 0,
        accountNumberGenerated: '',
    });

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`http://10.0.2.2:5229/api/v1/Accounts/get_account_by_id?Id=${userId}`);
                    setAccountData({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        currentAccountBalance: response.data.currentAccountBalance,
                        accountNumberGenerated: response.data.accountNumberGenerated,
                    });
                    if (onBalanceFetched) {
                        onBalanceFetched(response.data.currentAccountBalance);
                    }
                } catch (error) {
                    console.error('Error fetching account data:', error);
                }
            };

            fetchData();
        }
    }, [userId]);

    return (
        <ImageBackground 
            source={require('../../assets/images/card_solver.jpg')}
            style={styles.card}
        >
            <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>{accountData.accountNumberGenerated}</Text>
            </View>
            <View>
                <View>
                    <Text style={styles.balance}>Balance: R {accountData.currentAccountBalance.toFixed(2)}</Text>
                    <Text>Card holder</Text>
                    <Text>{`${accountData.firstName} ${accountData.lastName}`}</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
        width: 390,
        height: 249,
        borderRadius: 20,
        overflow: 'hidden',
        padding: 24, 
    },
    cardNumber: {
        flex: 1,
        justifyContent: 'center',
    },
    cardNumberText: {
        color: 'darkgoldenrod',
        fontSize: 22,
        fontWeight: '600',
        paddingLeft: 90,
    },
    balance: {
        paddingLeft: 280,
        fontWeight: 'bold',
    }
});
