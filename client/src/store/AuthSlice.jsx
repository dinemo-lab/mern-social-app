import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update with your backend URL

// Retrieve user from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null; // Return null if the key doesn't exist
    return JSON.parse(user); // Parse the JSON if it exists
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    localStorage.removeItem("user"); // Remove invalid data
    return null; // Return null if parsing fails
  }
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  loading: false,
  error: null,
  successMessage: null,
};

// Create async thunks for better error handling
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        "Login failed. Please check your credentials and try again."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      // Handle different types of errors
      if (error.response?.status === 409) {
        return rejectWithValue("Email already exists. Please use a different email address.");
      }
      return rejectWithValue(
        error.response?.data?.message || 
        "Registration failed. Please try again later."
      );
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // If you have a logout endpoint, uncomment the following line:
      await axios.post(`${API_URL}/logout`);
      return;
    } catch (error) {
      // If there is no logout endpoint, just clear the local state
      localStorage.removeItem("user");
      return rejectWithValue(
        error.response?.data?.message || 
        "Logout failed. Please try again."
      );
    }
  }
);



export const googleLogin = createAsyncThunk("auth/googleLogin", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/google-login`, { token });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.successMessage = null;
    },
    setAuthToken: (state, action) => {
      // Helper for setting auth token if using JWT
      if (action.payload) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.successMessage = "Login successful!";
      localStorage.setItem("user", JSON.stringify(action.payload)); // Ensure valid JSON is stored

      if (action.payload.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });

    // Register cases
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.successMessage = "Registration successful!";
      localStorage.setItem("user", JSON.stringify(action.payload));
      
      // Set token in axios headers if using JWT
      if (action.payload.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });

    // Logout cases
    builder.addCase(logoutUserAsync.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUserAsync.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.successMessage = "Logout successful!";
      localStorage.removeItem("user"); // Clear the user data
      delete axios.defaults.headers.common["Authorization"];
    });
    builder.addCase(logoutUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(googleLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload; // The response itself contains the user data
      state.isAuthenticated = true;
      state.successMessage = "Google login successful!";
      
      // Save the user and token in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload)); // Save the entire user object
      localStorage.setItem("token", action.payload.token); // Save the token separately

      // Set the token in Axios headers for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
    })
    .addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

// Export actions
export const { clearErrors, clearMessages, setAuthToken } = authSlice.actions;

// Set auth token on app initialization if it exists
const token = getUserFromStorage()?.token;
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default authSlice.reducer;
