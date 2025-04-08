import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import visitReducer from "./VisitSlice";
import expenseReducer from  "./ExpenesSlice"


const store = configureStore({
  reducer: {
    auth: authReducer,
    visits: visitReducer,
    expenses: expenseReducer
  },
});

export default store;
