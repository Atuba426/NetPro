import { createSlice } from "@reduxjs/toolkit";
import { getConnectionRequests, getAllMyConnectionRequests, loginUser, registerUser } from "../../action/authAction";
import { getAboutUser } from "../../action/authAction";
import { getAllUsers } from "../../action/authAction";
const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoadind: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections:[],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "Hello!";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        (state.isLoadind = true), (state.message = "processing!!");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoadind = false,
          state.isError = false,
          state.isSuccess = true,
          state.loggedIn = true,
          state.message = {
            message:"All set! Your professional network is just a click away.",
            type: "success",
          };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoadind = false,
          state.isError = true,
          state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
       state.isLoadind = true,
         state.message = {
            message: " Registration is processing!!",
            type: "pending",
          };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
       state.isLoadind = false,
         state.isError = false,
         state.isSuccess = true,
         state.message = {
            message: "Registeration is Successfull! Please Login",
            type: "success",
          };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoadind = false,
          state.isError = true,
          state.message = {
            message: action.payload,
            type: "error",
          };
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoadind = false,
          state.isError = false,
          state.profileFetched = true,
          state.user = action.payload.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoadind = false,
          state.isError = false,
          state.all_profiles_fetched = true,
          state.all_users = action.payload.profiles
         
      })
      .addCase(getConnectionRequests.fulfilled,(state,action)=>{
        state.connections=action.payload.connections
      })
      .addCase(getConnectionRequests.rejected,(state,action)=>{
        state.message=action.payload
      })
      .addCase(getAllMyConnectionRequests.fulfilled,(state,action)=>{
        state.connectionRequest=action.payload.connections
        console.log(`REDUCER:`,state.connectionRequest)
      })
      .addCase(getAllMyConnectionRequests.rejected,(state,action)=>{
        state.message=action.payload
      })
  },
});
export const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;
export default authSlice.reducer;
