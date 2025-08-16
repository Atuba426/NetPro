import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./index.module.css";
import  {acceptConnection, getAllMyConnectionRequests } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';
import { connection } from 'next/server';

export default function MyConnections() {
  const dispatch= useDispatch();
  const authState=useSelector((state)=>state.auth);
  const router=useRouter();
  useEffect(()=>{
    dispatch(getAllMyConnectionRequests({token:localStorage.getItem("token")}));
  },[]);
  useEffect(()=>{
    if(authState.connectionRequest.lenght!=0){
      console.log(authState.connectionRequest)
    }
  },[authState.connectionRequest])
  return (
    <UserLayout>
    <DashboardLayout>
     <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
       
       <h3>My Connections</h3>
       {authState.connectionRequest.lenght ===0 && <h1>No Connection Request Pending</h1>}
       {
        authState.connectionRequest.lenght !=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted===null).map((user,index)=>{
return(
  <div onClick={()=>{
    router.push(`view_profile/${user.userId.username}`)
  }}className={styles.userCard} key={index}>
    <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
      <div className={styles.profilePicture}>
       <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
      </div>
      <div className={styles.userInfo}>
        
        <h3>{user.userId.name}</h3>
        <p>@{user.userId.username}</p>
      </div>
      <button onClick={(e)=>{
     e.stopPropagation();
     dispatch(acceptConnection({
      connectionId:user._id,
      token:localStorage.getItem('token'),
      action:"accept"

     }))
      }}className={styles.connect_btn}>Accept</button>
    </div>
   
  </div>
)
        })
       }
       <h2>My Network</h2>
    
        {authState.connectionRequest.filter((connection)=>connection.status_accepted !== null).map((user,index)=>{
          return(
           <div onClick={()=>{
            router.push(`view_profile/${user.userId.username}`)
          }}className={styles.userCard} key={index}>
            <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
              <div className={styles.profilePicture}>
               <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
              </div>
              <div className={styles.userInfo}>
                <h3>{user.userId.name}</h3>
                <p>@{user.userId.username}</p>
              </div>
              
            </div>
           
          </div>
          )
        })}
     </div>
    </DashboardLayout>
   </UserLayout>
  )
}
