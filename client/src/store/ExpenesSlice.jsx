import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = `${import.meta.env.VITE_LOCAL_URL}/api/expenses`;



// Fetch expenses for a visit
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (visitId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${visitId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add a new expense to a visit
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async ({ visitId, expenseData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${visitId}`, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Settle a debt between users
export const settleDebt = createAsyncThunk(
  "expenses/settleDebt",
  async ({ visitId, debtId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${visitId}/settle`, debtId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    settlements: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchExpenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.settlements = action.payload.settlements || [];
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch expenses";
      })
      
      // addExpense
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload.expense);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add expense";
      })
      
      // settleDebt
      .addCase(settleDebt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(settleDebt.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses;
        state.settlements = action.payload.settlements || [];
      })
      .addCase(settleDebt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to settle debt";
      });
  },
});

export default expenseSlice.reducer;