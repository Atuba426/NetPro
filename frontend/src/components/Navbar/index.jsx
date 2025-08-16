import React from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducers/authReducer";


export default function NavbarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch=useDispatch();
  return (
    <div className={styles.container}>
      <nav className={styles.Navbar}>
      <div className={styles.videoContainer} onClick={() => router.push("/")}>
      <img src="/images/logooo.png" alt="logo" />
</div>

        <div className={styles.navbarOptionContainer}>
         
         {authState.profileFetched && <div>
          <div style={{display:"flex",gap:"1.2rem"}}>
          <p>Hello! &nbsp;{authState.user.userId.name}</p>
          <p onClick={()=>{
            router.push("/profile")
          }} style={{cursor:"pointer", fontWeight:"bold"}}>Profile</p>
          <p onClick={()=>{
            localStorage.removeItem("token")
            router.push("/login")
            dispatch(reset());
          }}style={{cursor:"pointer", fontWeight:"bold"}}>Logout</p>
          </div>
           </div>}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.joinButton}
            >
              <p>Be a Part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
