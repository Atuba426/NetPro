import { useRouter } from "next/router";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css"
import UserLayout from "@/layout/userLayout";


export default function Home() {
  const router= useRouter();
  return (
    <UserLayout>
    <div className= {styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.maincontainer_left}>
          <p>Connect with Friends without Exaggeration</p>
          <p>A true Social Media Platform with no blufs!!</p>

          <div onClick={()=>{
            router.push("/login")
          }}
          className={styles.joinButton}>
         <p>Join Now</p>
          </div>
        </div>
        <div className={styles.maincontainer_right}>
          <img src="images/heroImage.jpg" alt="image" />
        </div>
      </div>
    </div>
    </UserLayout>
  );
}
