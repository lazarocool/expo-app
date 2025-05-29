import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import { format, addDays, startOfMonth, endOfMonth, isSameDay, getDate } from 'date-fns';
import { es } from 'date-fns/locale';

const CalendarView = () => {
  const { salary, incomes, expenses, recurringExpenses } = useSelector((state) => state.finance);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [dayTransactions, setDayTransactions] = useState([]);

  // Generar días del calendario para el mes seleccionado
  useEffect(() => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const startDate = new Date(monthStart);
    const days = [];

    // Ajustar el inicio para que comience en lunes
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 es domingo, lo ajustamos para que sea 6
    startDate.setDate(startDate.getDate() - diff);

    // Generar 42 días (6 semanas) para asegurar que cubrimos todo el mes
    for (let i = 0; i < 42; i++) {
      const day = addDays(new Date(startDate), i);
      days.push(day);
    }

    setCalendarDays(days);
  }, [selectedMonth]);

  // Calcular las transacciones para el día seleccionado
  useEffect(() => {
    if (!selectedDay) return;

    let transactions = [];

    // Añadir ingresos del día
    const dayIncomes = incomes.filter(income => 
      isSameDay(new Date(income.date), selectedDay)
    ).map(income => ({
      ...income,
      type: 'income'
    }));

    // Añadir gastos del día
    const dayExpenses = expenses.filter(expense => 
      isSameDay(new Date(expense.date), selectedDay)
    ).map(expense => ({
      ...expense,
      type: 'expense'
    }));

    // Verificar si es día de pago del salario
    if (salary && salary.amount > 0) {
      const currentDate = selectedDay.getDate();
      
      if (
        (salary.frequency === 'monthly' && currentDate === salary.payday) ||
        (salary.frequency === 'biweekly' && (currentDate === salary.payday || currentDate === salary.payday + 15)) ||
        (salary.frequency === 'weekly' && selectedDay.getDay() === salary.payday)
      ) {
        transactions.push({
          id: `salary-${selectedDay.toISOString()}`,
          description: 'Día de pago - Salario',
          amount: salary.amount,
          date: format(selectedDay, 'yyyy-MM-dd'),
          category: 'salary',
          type: 'income',
          projected: true
        });
      }
    }

    // Verificar si hay gastos recurrentes para este día
    recurringExpenses.forEach(expense => {
      const dueDay = expense.dueDay;
      const currentDate = selectedDay.getDate();
      
      // Verificar si el gasto recurrente cae en este día según su frecuencia
      if (
        (expense.frequency === 'daily') ||
        (expense.frequency === 'weekly' && selectedDay.getDay() === dueDay) ||
        (expense.frequency === 'biweekly' && (currentDate === dueDay || currentDate === dueDay + 15)) ||
        (expense.frequency === 'monthly' && currentDate === dueDay) ||
        (expense.frequency === 'yearly' && isSameDay(new Date(expense.nextDueDate), selectedDay))
      ) {
        transactions.push({
          ...expense,
          description: `${expense.description} (Recurrente)`,
          type: 'expense',
          projected: true
        });
      }
    });

    // Combinar todos los eventos
    transactions = [...dayIncomes, ...dayExpenses, ...transactions];

    // Ordenar por tipo (primero ingresos)
    transactions.sort((a, b) => {
      if (a.type === 'income' && b.type !== 'income') return -1;
      if (a.type !== 'income' && b.type === 'income') return 1;
      return 0;
    });

    setDayTransactions(transactions);
  }, [selectedDay, salary, incomes, expenses, recurringExpenses]);

  // Navegar a otro mes
  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  // Verificar si un día tiene eventos
  const checkDayHasEvents = (day) => {
    // Verificar ingresos y gastos registrados
    const hasIncomes = incomes.some(income => isSameDay(new Date(income.date), day));
    const hasExpenses = expenses.some(expense => isSameDay(new Date(expense.date), day));
    
    // Verificar día de pago del salario
    const currentDate = day.getDate();
    const isSalaryDay = 
      (salary.frequency === 'monthly' && currentDate === salary.payday) ||
      (salary.frequency === 'biweekly' && (currentDate === salary.payday || currentDate === salary.payday + 15)) ||
      (salary.frequency === 'weekly' && day.getDay() === salary.payday);
    
    // Verificar gastos recurrentes
    const hasRecurringExpense = recurringExpenses.some(expense => {
      const dueDay = expense.dueDay;
      if (expense.frequency === 'daily') return true;
      if (expense.frequency === 'weekly' && day.getDay() === dueDay) return true;
      if (expense.frequency === 'biweekly' && (currentDate === dueDay || currentDate === dueDay + 15)) return true;
      if (expense.frequency === 'monthly' && currentDate === dueDay) return true;
      if (expense.frequency === 'yearly' && isSameDay(new Date(expense.nextDueDate), day)) return true;
      return false;
    });
    
    return hasIncomes || hasExpenses || isSalaryDay || hasRecurringExpense;
  };

  // Calcular balance proyectado para un día específico
  const calculateProjectedBalance = (targetDate) => {
    let projectedBalance = 0;
    const today = new Date();
    
    // Si la fecha objetivo es anterior a hoy, no proyectamos
    if (targetDate < today) return null;
    
    // Calcular ingresos hasta la fecha proyectada
    const relevantIncomes = incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate <= targetDate && incomeDate >= today;
    });
    
    // Calcular gastos hasta la fecha proyectada
    const relevantExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate <= targetDate && expenseDate >= today;
    });
    
    // Añadir días de pago del salario entre hoy y la fecha proyectada
    if (salary && salary.amount > 0) {
      const currentDate = new Date(today);
      while (currentDate <= targetDate) {
        const dayOfMonth = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();
        
        if (
          (salary.frequency === 'monthly' && dayOfMonth === salary.payday) ||
          (salary.frequency === 'biweekly' && (dayOfMonth === salary.payday || dayOfMonth === salary.payday + 15)) ||
          (salary.frequency === 'weekly' && dayOfWeek === salary.payday)
        ) {
          projectedBalance += salary.amount;
        }
        
        // Avanzar un día
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Añadir gastos recurrentes entre hoy y la fecha proyectada
    recurringExpenses.forEach(expense => {
      const currentDate = new Date(today);
      
      while (currentDate <= targetDate) {
        const dayOfMonth = currentDate.getDate();
        const dayOfWeek = currentDate.getDay();
        
        if (
          (expense.frequency === 'daily') ||
          (expense.frequency === 'weekly' && dayOfWeek === expense.dueDay) ||
          (expense.frequency === 'biweekly' && (dayOfMonth === expense.dueDay || dayOfMonth === expense.dueDay + 15)) ||
          (expense.frequency === 'monthly' && dayOfMonth === expense.dueDay) ||
          (expense.frequency === 'yearly' && isSameDay(new Date(expense.nextDueDate), currentDate))
        ) {
          projectedBalance -= expense.amount;
        }
        
        // Avanzar un día
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Sumar los ingresos y restar los gastos
    projectedBalance += relevantIncomes.reduce((sum, income) => sum + income.amount, 0);
    projectedBalance -= relevantExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return projectedBalance;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Encabezado del calendario */}
      <Card className="mb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Text className="text-blue-500 text-lg">{'<'}</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {format(selectedMonth, 'MMMM yyyy', { locale: es }).charAt(0).toUpperCase() + format(selectedMonth, 'MMMM yyyy', { locale: es }).slice(1)}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Text className="text-blue-500 text-lg">{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* Días de la semana */}
        <View className="flex-row justify-between mb-2">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
            <View key={index} className="items-center w-9">
              <Text className="text-gray-500 font-medium">{day}</Text>
            </View>
          ))}
        </View>

        {/* Días del mes */}
        <View className="flex-wrap flex-row">
          {calendarDays.slice(0, 42).map((day, index) => {
            const isCurrentMonth = day.getMonth() === selectedMonth.getMonth();
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDay);
            const hasEvents = checkDayHasEvents(day);
            
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDay(day)}
                className={`items-center justify-center h-10 w-9 mb-2 rounded-full ${
                  isSelected
                    ? 'bg-primary'
                    : isToday
                    ? 'bg-blue-100'
                    : 'bg-transparent'
                }`}
              >
                <Text
                  className={`${
                    isCurrentMonth
                      ? isSelected
                        ? 'text-secondary font-bold'
                        : 'text-gray-800'
                      : 'text-gray-400'
                  } ${hasEvents ? 'font-bold' : ''}`}
                >
                  {getDate(day)}
                </Text>
                {hasEvents && (
                  <View
                    className={`absolute -bottom-1 w-1 h-1 rounded-full ${
                      isSelected ? 'bg-secondary' : 'bg-primary'
                    }`}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Proyección financiera */}
      <Card title="Proyección financiera">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Balance proyectado:</Text>
          <Text className="font-bold">
            ${calculateProjectedBalance(selectedDay)?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </Card>

      {/* Transacciones del día seleccionado */}
      <Card title={`Transacciones para ${format(selectedDay, 'dd/MM/yyyy', { locale: es })}`}>
        {dayTransactions.length > 0 ? (
          dayTransactions.map((transaction, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  } items-center justify-center mr-3`}
                >
                  <Text
                    className={
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                  </Text>
                </View>
                <View>
                  <Text className="font-medium text-base">{transaction.description}</Text>
                  <Text className="text-gray-500">{transaction.category}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text
                  className={`text-base font-bold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'} ${transaction.amount.toFixed(2)}
                </Text>
                {transaction.projected && (
                  <Text className="text-xs text-blue-500">Proyectado</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 text-center py-4">No hay transacciones para este día</Text>
        )}
      </Card>
    </ScrollView>
  );
};

export default CalendarView;
