import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not Provided!",
        });
      }
      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        name: user.name,
        email: user.email,
        password: user.password,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users");

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );
      thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getConnectionRequests = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/get_connection_requests",
        {
          token: user.token,
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const getAllMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_my_connections", {
        params: {
          token: user.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/accept_connections", {
        token: user.token,
        requestId: user.connectionId,
        action_type: user.action,
      });
      thunkAPI.dispatch(getConnectionRequests({ token: user.token }));
      thunkAPI.dispatch(getAllMyConnectionRequests({ token: user.token }));

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  
  }
);
export const getUserAndUserprofileBasedOnUsername= createAsyncThunk(
  "user/getUser_And_Userprofile_BasedOn_Username",
  async (username, thunkAPI) => {
    try {
      const response = await clientServer.get( `/getUser_And_Userprofile_BasedOn_Username?username=${username}`);
      return thunkAPI.fulfillWithValue(response.data.profile);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

export const deleteEducation= createAsyncThunk(
  "user/delete_education",
  async(education_id,thunkAPI)=>{
    try {
      console.log("Thunk sending:", education_id);
      const response = await clientServer.delete("/delete_education", {
        data: {
          token: localStorage.getItem("token"),
          education_id: education_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went Wrong");
    }
  }
);
export const deletePastWork= createAsyncThunk(
  "user/delete_pastWork",
  async(work_id,thunkAPI)=>{
    try{
      console.log("Thunk sending:", work_id);
      const response = await clientServer.delete("/delete_pastWork", {
        data: {
          token: localStorage.getItem("token"),
          work_id: work_id,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);

    }catch (error) {
      return thunkAPI.rejectWithValue("Something went Wrong");
    }
  }
)




