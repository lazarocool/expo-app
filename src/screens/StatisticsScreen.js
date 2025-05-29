import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Chart from '../components/Chart';
import TransactionItem from '../components/TransactionItem';
import { format, parse, startOfWeek, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const StatisticsScreen = () => {
  const { incomes, expenses } = useSelector((state) => state.finance);
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'year'
  const [chartType, setChartType] = useState('incomeVsExpense');
  const [transactions, setTransactions] = useState([]);
  
  // Función para obtener datos del gráfico según el período seleccionado
  const getChartData = () => {
    const today = new Date();
    let filteredIncomes = [];
    let filteredExpenses = [];
    let labels = [];
    
    switch (period) {
      case 'week':
        // Filtrar transacciones de la semana actual
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        
        // Crear etiquetas para cada día de la semana
        for (let i = 0; i < 7; i++) {
          const day = new Date(startOfCurrentWeek);
          day.setDate(startOfCurrentWeek.getDate() + i);
          labels.push(format(day, 'EEE', { locale: es }).charAt(0).toUpperCase());
          
          // Filtrar ingresos y gastos para este día
          const dayIncomes = incomes.filter(income => 
            new Date(income.date).toDateString() === day.toDateString()
          );
          
          const dayExpenses = expenses.filter(expense => 
            new Date(expense.date).toDateString() === day.toDateString()
          );
          
          filteredIncomes.push(dayIncomes.reduce((sum, income) => sum + income.amount, 0));
          filteredExpenses.push(dayExpenses.reduce((sum, expense) => sum + expense.amount, 0));
        }
        break;
        
      case 'month':
        // Filtrar transacciones del mes actual
        const startOfCurrentMonth = startOfMonth(today);
        
        // Dividimos el mes en semanas
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        
        for (let i = 0; i < 4; i++) {
          // Calcular fechas para cada semana
          const weekStart = new Date(startOfCurrentMonth);
          weekStart.setDate(startOfCurrentMonth.getDate() + (i * 7));
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          // Filtrar ingresos y gastos para esta semana
          const weekIncomes = incomes.filter(income => {
            const incomeDate = new Date(income.date);
            return incomeDate >= weekStart && incomeDate <= weekEnd;
          });
          
          const weekExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= weekStart && expenseDate <= weekEnd;
          });
          
          filteredIncomes.push(weekIncomes.reduce((sum, income) => sum + income.amount, 0));
          filteredExpenses.push(weekExpenses.reduce((sum, expense) => sum + expense.amount, 0));
        }
        break;
        
      case 'year':
        // Filtrar transacciones del último año
        // Crear etiquetas para los últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(today, i);
          labels.push(format(monthDate, 'MMM', { locale: es }));
          
          const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
          
          // Filtrar ingresos y gastos para este mes
          const monthIncomes = incomes.filter(income => {
            const incomeDate = new Date(income.date);
            return incomeDate >= monthStart && incomeDate <= monthEnd;
          });
          
          const monthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= monthStart && expenseDate <= monthEnd;
          });
          
          filteredIncomes.push(monthIncomes.reduce((sum, income) => sum + income.amount, 0));
          filteredExpenses.push(monthExpenses.reduce((sum, expense) => sum + expense.amount, 0));
        }
        break;
    }
    
    // Dependiendo del tipo de gráfico seleccionado, retornamos diferentes datos
    if (chartType === 'incomeVsExpense') {
      return {
        labels,
        datasets: [
          {
            data: filteredIncomes,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            strokeWidth: 2
          },
          {
            data: filteredExpenses,
            color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
            strokeWidth: 2
          }
        ],
        legend: ["Ingresos", "Gastos"]
      };
    } else if (chartType === 'categories') {
      // Para este ejemplo, simplificaremos y mostraremos solo gastos por categoría
      const categories = {};
      
      // Agrupar gastos por categoría
      expenses.forEach(expense => {
        if (!categories[expense.category]) {
          categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
      });
      
      return {
        labels: Object.keys(categories).map(cat => {
          const categoryMap = {
            food: 'Comida',
            transportation: 'Transporte',
            utilities: 'Servicios',
            entertainment: 'Entret.',
            health: 'Salud',
            education: 'Educ.',
            clothing: 'Ropa',
            rent: 'Renta',
            other: 'Otro'
          };
          return categoryMap[cat] || cat;
        }),
        datasets: [
          {
            data: Object.values(categories),
            color: (opacity = 1) => `rgba(255, 221, 0, ${opacity})`,
          }
        ]
      };
    }
    
    return {
      labels,
      datasets: [
        {
          data: [0, 0, 0],
        }
      ]
    };
  };
  
  const chartData = getChartData();
  
  // Filtrar transacciones según el período seleccionado
  useEffect(() => {
    const today = new Date();
    let filtered = [];
    
    switch (period) {
      case 'week':
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
        filtered = [...incomes, ...expenses].filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startOfCurrentWeek && itemDate <= today;
        });
        break;
        
      case 'month':
        const startOfCurrentMonth = startOfMonth(today);
        filtered = [...incomes, ...expenses].filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startOfCurrentMonth && itemDate <= today;
        });
        break;
        
      case 'year':
        const startOfCurrentYear = new Date(today.getFullYear(), 0, 1);
        filtered = [...incomes, ...expenses].filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= startOfCurrentYear && itemDate <= today;
        });
        break;
    }
    
    // Ordenar las transacciones por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Añadir el tipo de transacción (ingreso o gasto)
    filtered = filtered.map(item => ({
      ...item,
      type: incomes.some(income => income.id === item.id) ? 'income' : 'expense'
    }));
    
    setTransactions(filtered);
  }, [period, incomes, expenses]);

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Selector de período */}
      <View className="flex-row mb-4">
        {['week', 'month', 'year'].map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            className={`mr-2 px-6 py-2 rounded-full ${
              period === p ? 'bg-primary' : 'bg-gray-100'
            }`}
          >
            <Text className={period === p ? 'font-bold text-secondary' : 'text-gray-700'}>
              {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Selector de tipo de gráfico */}
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setChartType('incomeVsExpense')}
          className={`mr-2 px-4 py-2 rounded-full ${
            chartType === 'incomeVsExpense' ? 'bg-primary' : 'bg-gray-100'
          }`}
        >
          <Text className={chartType === 'incomeVsExpense' ? 'font-bold text-secondary' : 'text-gray-700'}>
            Ingresos vs Gastos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setChartType('categories')}
          className={`px-4 py-2 rounded-full ${
            chartType === 'categories' ? 'bg-primary' : 'bg-gray-100'
          }`}
        >
          <Text className={chartType === 'categories' ? 'font-bold text-secondary' : 'text-gray-700'}>
            Categorías
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Gráfico */}
      <Chart
        type={chartType === 'incomeVsExpense' ? 'line' : 'bar'}
        data={chartData}
        title={
          chartType === 'incomeVsExpense' 
          ? `Ingresos vs Gastos (${period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'})` 
          : `Gastos por categoría (${period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'})`
        }
      />
      
      {/* Lista de transacciones */}
      <Card title="Transacciones">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              type={transaction.type}
              onPress={() => {}}
            />
          ))
        ) : (
          <Text className="text-gray-500 text-center py-4">No hay transacciones en este período</Text>
        )}
      </Card>
      
      {/* Resumen */}
      <Card title="Resumen">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Total Ingresos:</Text>
          <Text className="font-medium text-green-500">
            ${transactions
              .filter((t) => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Total Gastos:</Text>
          <Text className="font-medium text-red-500">
            ${transactions
              .filter((t) => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between pt-2 border-t border-gray-200">
          <Text className="text-gray-800 font-medium">Balance:</Text>
          <Text className="font-bold">
            ${(transactions
              .filter((t) => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0) - 
              transactions
              .filter((t) => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0))
              .toFixed(2)}
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

export default StatisticsScreen;
