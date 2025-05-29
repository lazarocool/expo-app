import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import { setSalary } from '../redux/financeSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { salary } = useSelector((state) => state.finance);
  
  const [salaryAmount, setSalaryAmount] = useState(salary.amount.toString() || '');
  const [salaryFrequency, setSalaryFrequency] = useState(salary.frequency || 'monthly');
  const [salaryPayday, setSalaryPayday] = useState(salary.payday?.toString() || '1');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const frequencies = [
    { id: 'weekly', name: 'Semanal' },
    { id: 'biweekly', name: 'Quincenal' },
    { id: 'monthly', name: 'Mensual' },
  ];

  const handleSaveSalary = () => {
    if (isNaN(parseFloat(salaryAmount)) || parseFloat(salaryAmount) < 0) {
      alert('Por favor ingresa un monto de salario válido');
      return;
    }

    const paydayNumber = parseInt(salaryPayday);
    if (isNaN(paydayNumber)) {
      alert('Por favor ingresa un día de pago válido');
      return;
    }

    // Validar el día según la frecuencia
    let validPayday = paydayNumber;
    if (salaryFrequency === 'weekly' && (paydayNumber < 0 || paydayNumber > 6)) {
      // Para semanal: 0 (domingo) a 6 (sábado)
      alert('Para frecuencia semanal, el día debe ser entre 0 (domingo) y 6 (sábado)');
      return;
    } else if (salaryFrequency === 'monthly' && (paydayNumber < 1 || paydayNumber > 31)) {
      // Para mensual: 1 a 31
      alert('Para frecuencia mensual, el día debe ser entre 1 y 31');
      return;
    } else if (salaryFrequency === 'biweekly') {
      // Para quincenal: el primer día entre 1 y 16
      if (paydayNumber < 1 || paydayNumber > 16) {
        alert('Para frecuencia quincenal, el día debe ser entre 1 y 16');
        return;
      }
    }

    dispatch(setSalary({
      amount: parseFloat(salaryAmount),
      frequency: salaryFrequency,
      payday: validPayday
    }));

    alert('Configuración de salario guardada con éxito');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Card title="Configuración de salario">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Monto del salario</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={salaryAmount}
            onChangeText={setSalaryAmount}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Frecuencia de pago</Text>
          <View className="flex-row">
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.id}
                onPress={() => setSalaryFrequency(freq.id)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                  salaryFrequency === freq.id ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text className={salaryFrequency === freq.id ? 'text-secondary font-bold' : 'text-gray-700'}>
                  {freq.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">
            {salaryFrequency === 'weekly'
              ? 'Día de la semana (0: Domingo, 6: Sábado)'
              : salaryFrequency === 'biweekly'
              ? 'Primer día de pago (1-16)'
              : 'Día del mes (1-31)'}
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={salaryPayday}
            onChangeText={setSalaryPayday}
            placeholder={salaryFrequency === 'weekly' ? "0-6" : "1-31"}
            keyboardType="numeric"
          />
          {salaryFrequency === 'biweekly' && (
            <Text className="text-gray-500 text-xs mt-1">
              El segundo pago será 15 días después del primer día.
            </Text>
          )}
        </View>

        <Button label="Guardar configuración" onPress={handleSaveSalary} variant="primary" />
      </Card>

      <Card title="Preferencias de la aplicación">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-gray-700">Modo oscuro</Text>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#FFDD00' }}
            thumbColor={darkMode ? '#FFFFFF' : '#f4f3f4'}
            onValueChange={setDarkMode}
            value={darkMode}
          />
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-gray-700">Notificaciones</Text>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#FFDD00' }}
            thumbColor={notifications ? '#FFFFFF' : '#f4f3f4'}
            onValueChange={setNotifications}
            value={notifications}
          />
        </View>
        
        {notifications && (
          <View className="mb-4 pl-4 border-l-2 border-primary">
            <Text className="text-gray-600 mb-2">Se te notificará:</Text>
            <Text className="text-gray-600">• Un día antes de los gastos recurrentes</Text>
            <Text className="text-gray-600">• En los días de pago de salario</Text>
            <Text className="text-gray-600">• Cuando alcances objetivos de ahorro</Text>
          </View>
        )}
      </Card>
      
      <Card title="Acerca de">
        <Text className="text-gray-700 mb-2">FinanzApp v1.0.0</Text>
        <Text className="text-gray-600">
          Aplicación para administrar tus finanzas personales y controlar tus ingresos y gastos.
        </Text>
      </Card>
    </ScrollView>
  );
};

export default SettingsScreen;
