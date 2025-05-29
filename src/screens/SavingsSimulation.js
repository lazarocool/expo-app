import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { setSavingsGoal } from '../redux/financeSlice';
import { format, differenceInMonths, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import Chart from '../components/Chart';

const SavingsSimulation = () => {
  const dispatch = useDispatch();
  const { balance, salary, expenses, recurringExpenses, savingsGoal } = useSelector(
    (state) => state.finance
  );
  
  const [amount, setAmount] = useState(savingsGoal.amount.toString() || '');
  const [deadline, setDeadline] = useState(savingsGoal.deadline ? new Date(savingsGoal.deadline) : addMonths(new Date(), 12));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState('');
  const [isValidSavingsGoal, setIsValidSavingsGoal] = useState(true);
  const [simulationResults, setSimulationResults] = useState(null);
  
  // Calcular gastos mensuales promedio
  const calculateMonthlyExpenses = () => {
    const recurringMonthly = recurringExpenses
      .filter(expense => expense.frequency === 'monthly')
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const recurringWeekly = recurringExpenses
      .filter(expense => expense.frequency === 'weekly')
      .reduce((sum, expense) => sum + expense.amount * 4, 0); // 4 semanas al mes aprox
      
    const recurringBiweekly = recurringExpenses
      .filter(expense => expense.frequency === 'biweekly')
      .reduce((sum, expense) => sum + expense.amount * 2, 0); // 2 veces al mes
      
    const recurringDaily = recurringExpenses
      .filter(expense => expense.frequency === 'daily')
      .reduce((sum, expense) => sum + expense.amount * 30, 0); // 30 días al mes aprox
      
    const recurringYearly = recurringExpenses
      .filter(expense => expense.frequency === 'yearly')
      .reduce((sum, expense) => sum + expense.amount / 12, 0); // dividido en 12 meses
    
    // Sumar todos los gastos recurrentes convertidos a mensual
    return recurringMonthly + recurringWeekly + recurringBiweekly + recurringDaily + recurringYearly;
  };
  
  // Calcular ingreso mensual
  const calculateMonthlyIncome = () => {
    if (!salary) return 0;
    
    switch(salary.frequency) {
      case 'monthly':
        return salary.amount;
      case 'biweekly':
        return salary.amount * 2; // 2 veces al mes
      case 'weekly':
        return salary.amount * 4; // 4 semanas al mes aprox
      default:
        return 0;
    }
  };
  
  // Ejecutar simulación
  const runSimulation = () => {
    const goalAmount = parseFloat(amount);
    const monthsUntilDeadline = differenceInMonths(deadline, new Date());
    const monthlySavingsAmount = parseFloat(monthlySavings);
    
    if (isNaN(goalAmount) || goalAmount <= 0 || monthsUntilDeadline <= 0) {
      setIsValidSavingsGoal(false);
      return;
    }
    
    // Comprobar si el ahorro mensual es suficiente para alcanzar la meta
    const requiredMonthlySavings = goalAmount / monthsUntilDeadline;
    const isSavingsFeasible = monthlySavingsAmount >= requiredMonthlySavings;
    
    // Generar datos para el gráfico
    const chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          color: (opacity = 1) => `rgba(255, 221, 0, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
    
    // Calcular proyección mes a mes
    let currentSavings = savingsGoal.currentSaved || 0;
    const projectionData = [];
    
    for (let i = 0; i <= monthsUntilDeadline; i++) {
      const month = addMonths(new Date(), i);
      const monthName = format(month, 'MMM', { locale: es });
      
      // Añadir al gráfico cada 3 meses para no sobrecargar
      if (i === 0 || i === monthsUntilDeadline || i % 3 === 0) {
        chartData.labels.push(monthName);
        chartData.datasets[0].data.push(currentSavings);
      }
      
      // Añadir a los datos de proyección
      projectionData.push({
        month: monthName,
        year: month.getFullYear(),
        savings: currentSavings,
        percentage: (currentSavings / goalAmount) * 100
      });
      
      // Incrementar para el próximo mes
      currentSavings += monthlySavingsAmount;
    }
    
    // Guardar resultados de la simulación
    setSimulationResults({
      requiredMonthlySavings,
      isSavingsFeasible,
      projectionData,
      chartData,
      monthsUntilDeadline,
      expectedFinalSavings: currentSavings - monthlySavingsAmount, // Restamos el último incremento
      willReachGoal: currentSavings >= goalAmount
    });
    
    // Guardar meta de ahorro en Redux
    dispatch(setSavingsGoal({
      amount: goalAmount,
      deadline: deadline.toISOString(),
      currentSaved: savingsGoal.currentSaved || 0
    }));
  };
  
  // Para mostrar la capacidad de ahorro mensual
  useEffect(() => {
    const monthlyIncome = calculateMonthlyIncome();
    const monthlyExpenses = calculateMonthlyExpenses();
    const availableForSavings = monthlyIncome - monthlyExpenses;
    
    if (availableForSavings > 0) {
      setMonthlySavings(availableForSavings.toFixed(2));
    } else {
      setMonthlySavings('0.00');
    }
  }, [salary, recurringExpenses]);
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Formulario de simulación */}
      <Card title="Simular ahorro">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Meta de ahorro ($)</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Fecha límite</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="bg-white border border-gray-200 rounded-lg p-3"
          >
            <Text>{format(deadline, 'dd/MM/yyyy', { locale: es })}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={deadline}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Ahorro mensual estimado</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-lg p-3"
            value={monthlySavings}
            onChangeText={setMonthlySavings}
            placeholder="0.00"
            keyboardType="numeric"
          />
          <Text className="text-gray-500 text-xs mt-1">
            Esta es la cantidad mensual que puedes ahorrar según tus ingresos y gastos.
          </Text>
        </View>
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Ahorrado actualmente</Text>
          <Text className="text-lg font-bold">${(savingsGoal.currentSaved || 0).toFixed(2)}</Text>
        </View>
        
        {!isValidSavingsGoal && (
          <View className="mb-4 bg-red-50 p-3 rounded-lg">
            <Text className="text-red-500">
              Por favor ingresa una meta de ahorro válida y una fecha futura.
            </Text>
          </View>
        )}
        
        <Button
          label="Simular"
          onPress={runSimulation}
          variant="primary"
        />
      </Card>
      
      {/* Resultado de la simulación */}
      {simulationResults && (
        <>
          <Card title="Resultado de la simulación">
            <View className="mb-4">
              <Text className="text-gray-700">Ahorro mensual requerido:</Text>
              <Text className="text-lg font-bold">${simulationResults.requiredMonthlySavings.toFixed(2)}</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700">¿Es viable tu plan de ahorro?</Text>
              <Text className={`text-lg font-bold ${simulationResults.isSavingsFeasible ? 'text-green-500' : 'text-red-500'}`}>
                {simulationResults.isSavingsFeasible ? 'Sí' : 'No'}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                {simulationResults.isSavingsFeasible 
                  ? `Tu ahorro mensual es suficiente para alcanzar la meta en ${simulationResults.monthsUntilDeadline} meses.`
                  : `Necesitas aumentar tu ahorro mensual o extender el plazo para alcanzar la meta.`
                }
              </Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700">Ahorros proyectados al final del periodo:</Text>
              <Text className="text-lg font-bold">${simulationResults.expectedFinalSavings.toFixed(2)}</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-700">¿Alcanzarás tu meta?</Text>
              <Text className={`text-lg font-bold ${simulationResults.willReachGoal ? 'text-green-500' : 'text-red-500'}`}>
                {simulationResults.willReachGoal ? 'Sí' : 'No'}
              </Text>
            </View>
          </Card>
          
          {/* Gráfico de proyección */}
          <Chart
            type="line"
            data={simulationResults.chartData}
            title="Proyección de ahorro"
          />
          
          {/* Tabla de proyección */}
          <Card title="Proyección mensual">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View className="flex-row bg-gray-100 py-2">
                  <Text className="font-bold w-24 px-2">Periodo</Text>
                  <Text className="font-bold w-24 px-2 text-right">Ahorrado</Text>
                  <Text className="font-bold w-24 px-2 text-right">% Meta</Text>
                </View>
                {simulationResults.projectionData.map((item, index) => (
                  <View 
                    key={index}
                    className={`flex-row py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                      item.percentage >= 100 ? 'bg-green-50' : ''
                    }`}
                  >
                    <Text className="w-24 px-2">{`${item.month} ${item.year}`}</Text>
                    <Text className="w-24 px-2 text-right">${item.savings.toFixed(2)}</Text>
                    <Text className={`w-24 px-2 text-right ${
                      item.percentage >= 100 ? 'text-green-500 font-bold' : ''
                    }`}>
                      {item.percentage.toFixed(0)}%
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

export default SavingsSimulation;
