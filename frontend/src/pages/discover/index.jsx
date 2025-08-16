import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from "./index.module.css"
import { useRouter } from 'next/router';

export default function Discoverpage() {
  const authState= useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  useEffect(()=>{
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
    }
  },[])
  const router= useRouter();
  return (
    <UserLayout>
    <DashboardLayout>
     <div>
       <h1>
        Discover
       </h1>
       <div className={styles.allUserProfiles}>
   {authState.all_profiles_fetched && authState.all_users.map((user)=>{
    return(
      <div onClick={()=>{
        router.push(`/view_profile/${user.userId.username}`)
      }} key={user._id} className={styles.userProfileCard}>
<img className={styles.userCardImage} src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
<div>
<h2>{user.userId.name}</h2>
<p>{user.userId.username}</p>
</div>
<p></p>
      </div>
    )
   })}
       </div>
     </div>
    </DashboardLayout>
   </UserLayout>
  )
}
