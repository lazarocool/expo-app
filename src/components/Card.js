import React from 'react';
import { View, Text } from 'react-native';

const Card = ({ children, title, className = '' }) => {
  return (
    <View className={`bg-white rounded-lg shadow-md p-4 mb-4 ${className}`}>
      {title && <Text className="text-lg font-bold mb-2">{title}</Text>}
      {children}
    </View>
  );
};

export default Card;
