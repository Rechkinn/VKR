import styles from "./app.module.css";
import { useEffect, useState } from "react";
import Header from "../Header";
import Profile from "../profile/profile";
import { user } from "../../utils/userInfo";
import StartPage from "../start-page/start-page";
import Authorized from "../authorized/authorized";
import Navbar from "../navbar/navbar";

const body = document.querySelector("body");

export default function App() {
  const [currentSection, setCurrentSection] = useState("profile");
  return (
    <>
      <main className={styles.main}>
        {/* <Navbar /> */}
        {/* <Header /> */}

        <Authorized />

        {/* <div className={styles.backgroundYellowCircle}></div> */}

        {/* {currentSection === "profile" && <Profile userInfo={user} />} */}
      </main>
    </>
  );
}
