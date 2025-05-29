import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import Card from '../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addIncome } from '../redux/financeSlice';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const AddIncomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('salary');

  const categories = [
    { id: 'salary', name: 'Salario' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'investment', name: 'Inversiones' },
    { id: 'gift', name: 'Regalo' },
    { id: 'other', name: 'Otro' },
  ];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddIncome = () => {
    if (!description || !amount || isNaN(parseFloat(amount))) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const incomeData = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: format(date, 'yyyy-MM-dd'),
      category,
      createdAt: new Date().toISOString(),
    };

    dispatch(addIncome(incomeData));
    navigation.goBack();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Card>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Descripción</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={description}
            onChangeText={setDescription}
            placeholder="Ej: Salario Mayo"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Monto</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Fecha</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white border border-gray-200 rounded-lg p-3"
          >
            <Text>{format(date, 'dd/MM/yyyy', { locale: es })}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Categoría</Text>
          <View className="flex-row flex-wrap">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                  category === cat.id ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text className={`${category === cat.id ? 'text-secondary font-bold' : 'text-gray-700'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          label="Guardar ingreso"
          onPress={handleAddIncome}
          variant="primary"
        />
      </Card>
    </ScrollView>
  );
};

export default AddIncomeScreen;
