import { format, addDays, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear montos a moneda local
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Formatear fechas
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  return format(new Date(date), formatString, { locale: es });
};

// Calcular la próxima fecha de un gasto recurrente
export const calculateNextDueDate = (frequency, dueDay, baseDate = new Date()) => {
  const today = baseDate;
  let nextDate = new Date(today);
  
  switch(frequency) {
    case 'daily':
      nextDate = addDays(today, 1);
      break;
    case 'weekly':
      // Calcular próximo día de la semana
      const daysUntilNextDay = (dueDay - today.getDay() + 7) % 7;
      nextDate = addDays(today, daysUntilNextDay === 0 ? 7 : daysUntilNextDay);
      break;
    case 'biweekly':
      // Para quincenal, usamos el día especificado y el día + 15
      const currentDay = today.getDate();
      if (currentDay < dueDay) {
        // El próximo día de pago es en este mes
        nextDate.setDate(dueDay);
      } else if (currentDay >= dueDay && currentDay < dueDay + 15) {
        // El próximo día de pago es en 15 días después del primer pago
        nextDate.setDate(dueDay + 15);
      } else {
        // El próximo día de pago es en el próximo mes
        nextDate = addMonths(today, 1);
        nextDate.setDate(dueDay);
      }
      break;
    case 'monthly':
      // Para mensual, usar el día del mes
      if (today.getDate() < dueDay) {
        // El próximo día de pago es en este mes
        nextDate.setDate(dueDay);
      } else {
        // El próximo día de pago es en el próximo mes
        nextDate = addMonths(today, 1);
        nextDate.setDate(dueDay);
      }
      break;
    case 'yearly':
      // Para anual, añadir un año
      nextDate = addMonths(today, 12);
      break;
    default:
      nextDate = addMonths(today, 1);
      nextDate.setDate(dueDay);
  }
  
  return format(nextDate, 'yyyy-MM-dd');
};

// Categorizar y agrupar gastos
export const categorizeExpenses = (expenses) => {
  const categories = {};
  
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });
  
  return categories;
};

// Calcular ahorro mensual posible
export const calculatePotentialMonthlySavings = (salary, recurringExpenses) => {
  // Convertir el salario a base mensual
  let monthlyIncome = 0;
  
  if (salary) {
    switch(salary.frequency) {
      case 'monthly':
        monthlyIncome = salary.amount;
        break;
      case 'biweekly':
        monthlyIncome = salary.amount * 2; // 2 pagos al mes
        break;
      case 'weekly':
        monthlyIncome = salary.amount * 4.33; // promedio de semanas por mes
        break;
      default:
        monthlyIncome = salary.amount;
    }
  }
  
  // Calcular gastos mensuales
  const monthlyExpenses = recurringExpenses.reduce((total, expense) => {
    let monthlyAmount = 0;
    
    switch(expense.frequency) {
      case 'monthly':
        monthlyAmount = expense.amount;
        break;
      case 'biweekly':
        monthlyAmount = expense.amount * 2; // 2 veces al mes
        break;
      case 'weekly':
        monthlyAmount = expense.amount * 4.33; // promedio de semanas por mes
        break;
      case 'daily':
        monthlyAmount = expense.amount * 30; // aproximado
        break;
      case 'yearly':
        monthlyAmount = expense.amount / 12; // dividido en 12 meses
        break;
      default:
        monthlyAmount = expense.amount;
    }
    
    return total + monthlyAmount;
  }, 0);
  
  return Math.max(0, monthlyIncome - monthlyExpenses);
};
