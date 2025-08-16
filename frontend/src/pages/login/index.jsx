import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { toast } from "react-toastify";
import { emptyMessage } from "@/config/redux/reducers/authReducer";

const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setuserLoginMethod] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (authState.message?.message) {
      if (authState.message.type === "success") {
        toast.success(authState.message.message);
      } else if (authState.message.type === "error") {
        toast.error(authState.message.message);
      }
      setTimeout(() => dispatch(emptyMessage()), 3000);
    }
  }, [authState.message]);
  useEffect(() => {
    if (authState.message?.type === "success" && !userLoginMethod) {
      // Delay the state switch slightly so the form rerenders empty
      setTimeout(() => {
        setuserLoginMethod(true);
        setUsername("");
        setName("");
        setEmail("");
        setPassword("");
      }, 0);
    }
  }, [authState.message]);
  

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    console.log("registering!!");
    dispatch(registerUser({ username, name, email, password }));
  };
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardLeft}>
            <p className={styles.cardLeftHeading}>
              {userLoginMethod ? "Login" : "SignUp"}
            </p>

            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputFeild}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputFeild}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}
              <input
               value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputFeild}
                type="email"
                placeholder="Email"
              />
              <input
               value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputFeild}
                type="Number"
                placeholder="Password"
              />
              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
                type="submit"
              >
                <p id={styles.buttonText}>
                  {userLoginMethod ? "Login" : "SignUp"}
                </p>
              </div>
              <div>
                {userLoginMethod ? (
                  <p>
                    Don't Have an Account?{""}
                    <span
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setuserLoginMethod(false)}
                    >
                      Sign up
                    </span>
                  </p>
                ) : (
                  <p>
                    Already Have an Account? {""}
                    <span
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => setuserLoginMethod(true)}
                    >
                      Login
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.cardRight}>
            <img src="images/networking.jpg" alt="image" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
