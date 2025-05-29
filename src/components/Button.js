import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ onPress, label, variant = 'primary' }) => {
  const styles = {
    primary: 'bg-primary rounded-full py-3 px-6 items-center justify-center',
    secondary: 'bg-white border border-gray-300 rounded-full py-3 px-6 items-center justify-center',
    success: 'bg-success text-white rounded-full py-3 px-6 items-center justify-center',
    danger: 'bg-danger text-white rounded-full py-3 px-6 items-center justify-center',
    link: 'py-2 px-4',
  };

  const textStyles = {
    primary: 'text-secondary font-bold text-center',
    secondary: 'text-secondary text-center',
    success: 'text-white font-bold text-center',
    danger: 'text-white font-bold text-center',
    link: 'text-blue-500 text-center',
  };

  return (
    <TouchableOpacity onPress={onPress} className={styles[variant]}>
      <Text className={textStyles[variant]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
