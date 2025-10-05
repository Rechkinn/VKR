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
  const [showSun, setShowSun] = useState(true);
  // const [showNavbar, setShowNavbar] = useState(true);
  // const [currentSection, setCurrentSection] = useState("profile");
  return (
    <>
      {showSun && <div className={styles.backgroundYellowCircle}></div>}
      <main className={styles.main}>
        {/* {showNavbar && <Navbar />} */}

        <Authorized
          hiddenSunAndNavbar={() => setShowSun(false)}
          showSunAndNavbar={() => setShowSun(true)}
        />

        {/* {currentSection === "profile" && (
          <Profile
            userInfo={user}
            hiddenSunAndNavbar={() => {
              setShowSun(false);
              setShowNavbar(false);
            }}
            showSunAndNavbar={() => {
              setShowSun(true);
              setShowNavbar(true);
            }}
          />
        )} */}
      </main>
    </>
  );
}
