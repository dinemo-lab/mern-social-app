import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import visitReducer from "./VisitSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    visits: visitReducer,
  },
});

export default store;
