import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import Card from '../components/Card';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addExpense, addRecurringExpense } from '../redux/financeSlice';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const AddExpenseScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('food');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [dueDay, setDueDay] = useState('1');

  const categories = [
    { id: 'food', name: 'Comida' },
    { id: 'transportation', name: 'Transporte' },
    { id: 'utilities', name: 'Servicios' },
    { id: 'entertainment', name: 'Entretenimiento' },
    { id: 'health', name: 'Salud' },
    { id: 'education', name: 'Educación' },
    { id: 'clothing', name: 'Ropa' },
    { id: 'rent', name: 'Renta' },
    { id: 'other', name: 'Otro' },
  ];
  
  const frequencies = [
    { id: 'daily', name: 'Diario' },
    { id: 'weekly', name: 'Semanal' },
    { id: 'biweekly', name: 'Quincenal' },
    { id: 'monthly', name: 'Mensual' },
    { id: 'yearly', name: 'Anual' },
  ];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleAddExpense = () => {
    if (!description || !amount || isNaN(parseFloat(amount))) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    const expenseData = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      date: format(date, 'yyyy-MM-dd'),
      category,
      createdAt: new Date().toISOString(),
    };

    dispatch(addExpense(expenseData));
    
    // Si es un gasto recurrente, también lo guardamos en los gastos recurrentes
    if (isRecurring) {
      const recurringData = {
        ...expenseData,
        frequency,
        dueDay: parseInt(dueDay),
        nextDueDate: calculateNextDueDate(frequency, parseInt(dueDay)),
      };
      dispatch(addRecurringExpense(recurringData));
    }
    
    navigation.goBack();
  };
  
  // Función para calcular la próxima fecha de pago basado en la frecuencia y día de vencimiento
  const calculateNextDueDate = (freq, day) => {
    const today = new Date();
    let nextDate = new Date();
    
    switch(freq) {
      case 'daily':
        nextDate.setDate(today.getDate() + 1);
        break;
      case 'weekly':
        // Establecer al próximo día de la semana (0: domingo, 6: sábado)
        nextDate.setDate(today.getDate() + ((day - today.getDay() + 7) % 7));
        if (nextDate <= today) {
          nextDate.setDate(nextDate.getDate() + 7);
        }
        break;
      case 'biweekly':
        // Para quincenal usamos el día actual + 15
        nextDate.setDate(today.getDate() + 15);
        break;
      case 'monthly':
        // Para mensual establecemos el día del mes
        nextDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
        if (today.getDate() > day) {
          nextDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
        } else if (today.getDate() === day) {
          nextDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
        }
        break;
      case 'yearly':
        // Para anual incrementamos un año
        nextDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        break;
      default:
        nextDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
    }
    
    return format(nextDate, 'yyyy-MM-dd');
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
            placeholder="Ej: Compra supermercado"
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row">
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
          </ScrollView>
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-gray-700 font-medium">¿Es un gasto recurrente?</Text>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#FFDD00' }}
            thumbColor={isRecurring ? '#FFFFFF' : '#f4f3f4'}
            onValueChange={() => setIsRecurring(!isRecurring)}
            value={isRecurring}
          />
        </View>

        {isRecurring && (
          <View className="mb-4">
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Frecuencia</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {frequencies.map((freq) => (
                    <TouchableOpacity
                      key={freq.id}
                      onPress={() => setFrequency(freq.id)}
                      className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                        frequency === freq.id ? 'bg-primary' : 'bg-gray-100'
                      }`}
                    >
                      <Text className={`${frequency === freq.id ? 'text-secondary font-bold' : 'text-gray-700'}`}>
                        {freq.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {frequency !== 'daily' && (
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">
                  {frequency === 'weekly' ? 'Día de la semana' : frequency === 'yearly' ? 'Día del año' : 'Día del mes'}
                </Text>
                <TextInput
                  className="bg-white border border-gray-200 rounded-lg p-3"
                  value={dueDay}
                  onChangeText={setDueDay}
                  placeholder={frequency === 'weekly' ? "1-7 (Lun-Dom)" : "1-31"}
                  keyboardType="numeric"
                />
              </View>
            )}
          </View>
        )}

        <Button
          label="Guardar gasto"
          onPress={handleAddExpense}
          variant="primary"
        />
      </Card>
    </ScrollView>
  );
};

export default AddExpenseScreen;
