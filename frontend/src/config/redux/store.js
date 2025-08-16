import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducers/authReducer";
import postReducer from "./reducers/postReducer";
/**
 * STEPS FOR State Management
 * submit action
 * Handle action in its reducer
 * Register here -> Reducer
 */
export const store=configureStore({
    reducer:{
        auth:authReducer,
        post:postReducer
    }
});