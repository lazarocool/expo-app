import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import TransactionItem from '../components/TransactionItem';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { balance, incomes, expenses, salary } = useSelector(state => state.finance);
  
  // Obtener las últimas 5 transacciones (combinando ingresos y gastos)
  const getRecentTransactions = () => {
    const allTransactions = [
      ...incomes.map(income => ({...income, type: 'income'})),
      ...expenses.map(expense => ({...expense, type: 'expense'}))
    ];
    
    // Ordenar por fecha, más reciente primero
    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };
  
  const recentTransactions = getRecentTransactions();

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      {/* Balance Card */}
      <Card className="bg-secondary">
        <Text className="text-white text-sm mb-1">Balance actual</Text>
        <Text className="text-primary text-3xl font-bold">${balance.toFixed(2)}</Text>
        <View className="flex-row mt-4 justify-between">
          <View>
            <Text className="text-white text-xs">Ingresos</Text>
            <Text className="text-green-400 text-base font-medium">
              ${incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2)}
            </Text>
          </View>
          <View>
            <Text className="text-white text-xs">Gastos</Text>
            <Text className="text-red-400 text-base font-medium">
              ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </Card>
      
      {/* Actions */}
      <View className="flex-row justify-between my-4">
        <Button 
          label="Añadir ingreso" 
          onPress={() => navigation.navigate('AddIncome')}
          variant="primary"
        />
        <Button 
          label="Añadir gasto" 
          onPress={() => navigation.navigate('AddExpense')}
          variant="secondary"
        />
      </View>
      
      {/* Salary Information */}
      <Card title="Información salarial">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Monto:</Text>
          <Text className="font-medium">${salary.amount.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Frecuencia:</Text>
          <Text className="font-medium capitalize">
            {salary.frequency === 'monthly' ? 'Mensual' : 
             salary.frequency === 'biweekly' ? 'Quincenal' : 'Semanal'}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-600">Día de pago:</Text>
          <Text className="font-medium">
            {salary.frequency === 'monthly' ? `Día ${salary.payday} del mes` : 
             salary.frequency === 'biweekly' ? `Día ${salary.payday} y ${salary.payday + 15}` : 
             `${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][salary.payday]}`}
          </Text>
        </View>
      </Card>
      
      {/* Recent Transactions */}
      <Card title="Transacciones recientes">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              type={transaction.type}
              onPress={() => {}}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center py-4">No hay transacciones recientes</Text>
        )}
        
        <TouchableOpacity 
          className="mt-2 items-center" 
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text className="text-blue-500">Ver todas</Text>
        </TouchableOpacity>
      </Card>
      
      {/* Quick Access */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 items-center flex-1 mr-2 border border-gray-100"
          onPress={() => navigation.navigate('Calendar')}
        >
          <Text className="mb-1 text-gray-600">Calendario</Text>
          <Text className="font-bold">Ver proyección</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 items-center flex-1 ml-2 border border-gray-100"
          onPress={() => navigation.navigate('Savings')}
        >
          <Text className="mb-1 text-gray-600">Ahorro</Text>
          <Text className="font-bold">Simular</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
