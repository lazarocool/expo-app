import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { calculateNextDueDate } from '../utils/financeUtils';

export const useNotifications = (recurringExpenses, salary) => {
  const [upcomingExpenses, setUpcomingExpenses] = useState([]);
  
  useEffect(() => {
    if (!recurringExpenses || recurringExpenses.length === 0) return;
    
    // Buscar gastos próximos a vencer (en los próximos 3 días)
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    const upcoming = recurringExpenses.filter(expense => {
      const nextDueDate = new Date(calculateNextDueDate(expense.frequency, expense.dueDay));
      return nextDueDate >= today && nextDueDate <= threeDaysLater;
    });
    
    setUpcomingExpenses(upcoming);
    
    // Verificar si hay pagos próximos al cargar
    if (upcoming.length > 0) {
      setTimeout(() => {
        Alert.alert(
          'Pagos próximos',
          `Tienes ${upcoming.length} pago${upcoming.length > 1 ? 's' : ''} programado${upcoming.length > 1 ? 's' : ''} para los próximos 3 días.`,
          [{ text: 'OK' }]
        );
      }, 1000);
    }
    
    // Verificar si hoy es día de pago
    if (salary && salary.amount > 0) {
      const currentDate = today.getDate();
      const currentDayOfWeek = today.getDay();
      
      const isPayday = 
        (salary.frequency === 'monthly' && currentDate === salary.payday) ||
        (salary.frequency === 'biweekly' && (currentDate === salary.payday || currentDate === salary.payday + 15)) ||
        (salary.frequency === 'weekly' && currentDayOfWeek === salary.payday);
      
      if (isPayday) {
        setTimeout(() => {
          Alert.alert(
            '¡Día de pago!',
            `Hoy deberías recibir tu pago de $${salary.amount.toFixed(2)}.`,
            [{ text: 'Genial!' }]
          );
        }, 1500);
      }
    }
  }, [recurringExpenses, salary]);
  
  return { upcomingExpenses };
};

export default useNotifications;
