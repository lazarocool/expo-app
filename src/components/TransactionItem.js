import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransactionItem = ({ transaction, type, onPress }) => {
  const isIncome = type === 'income';
  
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} items-center justify-center mr-3`}>
          <Icon 
            name={isIncome ? 'arrow-downward' : 'arrow-upward'} 
            size={18} 
            color={isIncome ? '#4CAF50' : '#F44336'} 
          />
        </View>
        <View>
          <Text className="font-medium text-base">{transaction.description}</Text>
          <Text className="text-gray-500">{transaction.date}</Text>
        </View>
      </View>
      <Text className={`text-base font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'} ${transaction.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

export default TransactionItem;
