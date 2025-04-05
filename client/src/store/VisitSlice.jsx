import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch visit requests
export const fetchVisits = createAsyncThunk("visits/fetchVisits", async ({ userlongitude, userlatitude }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/visit/nearby", {
      params: {
        longitude: userlongitude, latitude: userlatitude
      }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch visits");
  }
});

export const fetchMyVisits = createAsyncThunk("visits/fetchMyVisits", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/visit/my-visits")
     
  
    console.log("MyVisits API response:", data); // Debug log
    return data; // Return the whole data object
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch my visits");
  }
});

export const fetchAllVisits = createAsyncThunk("visits/fetchAllVisits", async (_, { rejectWithValue }) => {
  try {
     
    const { data } = await axios.get("http://localhost:5000/api/visit/all")
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch all visits");
  }
});

// Async thunk to create a new visit request
export const createVisit = createAsyncThunk("visits/createVisit", async (visitData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/visit", visitData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create visit request");
  }
});

// Async thunk to join a visit
export const joinVisit = createAsyncThunk("visits/joinVisit", async (visitId, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`http://localhost:5000/api/visit/${visitId}/join`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to join visit request");
  }
});

// Add this to your existing visitSlice.js file
export const fetchVisitDetails = createAsyncThunk(
  "visits/fetchVisitDetails",
  async (visitId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/visit/${visitId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visit details"
      );
    }
  }
);

export const updateJoinRequestStatus = createAsyncThunk(
  "visits/updateJoinRequestStatus",
  async ({ visitId, requestId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/visit/${visitId}/join-request/${requestId}`,
        { status }
      );
      return { requestId, status, visitId, updatedRequest: response.data.request };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update join request status");
    }
  }
);

export const updateVisitStatus = createAsyncThunk(
  "visits/updateVisitStatus",
  async ({ visitId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/visit/${visitId}/status`,
        { status },
       
      );
      return response.data.visit;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update visit status");
    }
  }
);


// Async thunk to update user profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put("http://localhost:5000/api/users/update-profile", profileData);
      return data; // Return the updated profile data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update profile");
    }
  }
);

// Redux slice
const visitSlice = createSlice({
  name: "visits",
  initialState: {
    visits: [],
    myVisits: [], // Changed from MyVisits to myVisits for consistency
    loading: false,
    currentVisit: null,
    userProfile:null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllVisits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchAllVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVisit.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visits.push(action.payload);
      })
      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinVisit.fulfilled, (state, action) => {
        const updatedVisit = action.payload;
        state.visits = state.visits.map((visit) => (visit._id === updatedVisit._id ? updatedVisit : visit));
      })
      .addCase(joinVisit.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchMyVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.myVisits = action.payload.visits; // Updated to use the correct field name
        console.log("Updated myVisits in state:", state.myVisits); // Debug log
      })
      .addCase(fetchMyVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVisitDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVisit = action.payload;
      })
      .addCase(fetchVisitDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateJoinRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJoinRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { requestId, status } = action.payload;

        // Update the specific join request in the currentVisit state
        if (state.currentVisit) {
          const requestIndex = state.currentVisit.joinRequests.findIndex(
            (req) => req._id === requestId
          );
          if (requestIndex !== -1) {
            state.currentVisit.joinRequests[requestIndex].status = status;
          }
        }
      })
      .addCase(updateJoinRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVisitStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisitStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVisit = action.payload;

        // Update the visit in myVisits
        const index = state.myVisits.findIndex((visit) => visit._id === updatedVisit._id);
        if (index !== -1) {
          state.myVisits[index] = updatedVisit;
        }
      })
      .addCase(updateVisitStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload; // Update the user profile in the state
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default visitSlice.reducer;