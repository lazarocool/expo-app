import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  incomes: [],
  expenses: [],
  salary: {
    amount: 0,
    frequency: 'monthly', // 'monthly', 'biweekly', 'weekly'
    payday: 1, // Día del mes (para mensual), día de la semana (para semanal)
  },
  recurringExpenses: [], // Gastos recurrentes (servicios, suscripciones, etc.)
  savingsGoal: {
    amount: 0,
    deadline: null,
    currentSaved: 0,
  }
};

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // Configurar sueldo
    setSalary: (state, action) => {
      state.salary = action.payload;
    },
    
    // Añadir un ingreso
    addIncome: (state, action) => {
      state.incomes.push(action.payload);
      state.balance += action.payload.amount;
    },
    
    // Añadir un gasto
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
      state.balance -= action.payload.amount;
    },
    
    // Añadir un gasto recurrente
    addRecurringExpense: (state, action) => {
      state.recurringExpenses.push(action.payload);
    },
    
    // Eliminar gasto recurrente
    removeRecurringExpense: (state, action) => {
      state.recurringExpenses = state.recurringExpenses.filter(
        expense => expense.id !== action.payload
      );
    },
    
    // Configurar meta de ahorro
    setSavingsGoal: (state, action) => {
      state.savingsGoal = action.payload;
    },
    
    // Actualizar ahorro actual
    updateSavings: (state, action) => {
      state.savingsGoal.currentSaved = action.payload;
    }
  },
});

export const { 
  setSalary, 
  addIncome, 
  addExpense, 
  addRecurringExpense, 
  removeRecurringExpense,
  setSavingsGoal,
  updateSavings
} = financeSlice.actions;

export default financeSlice.reducer;
