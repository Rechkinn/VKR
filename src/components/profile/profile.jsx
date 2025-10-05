import { useState, useEffect } from "react";
import Cars from "../cars/cars";
import ProfileInfo from "../profile-info/profile-info";
import styles from "./profile.module.css";
import ChangeProfileInfo from "../change-profile-info/change-profile-info";

export default function Profile({
  userInfo,
  hiddenSunAndNavbar,
  showSunAndNavbar,
}) {
  const [activeSection, setActiveSection] = useState("profileInfo");

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userInfo) return <div style={{ color: "#666" }}>No user info</div>;

    let parsed;
    try {
      parsed = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
    } catch (err) {
      return (
        <div style={{ color: "#d32f2f" }}>
          <div>Invalid JSON: {err.message}</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(userInfo)}</pre>
        </div>
      );
    }

    if (!parsed || typeof parsed !== "object") {
      return <div>{String(parsed)}</div>;
    }

    setUserData(parsed);
    // setUserData(user);
  }, []);

  return (
    <>
      {userData && (
        <>
          {activeSection === "profileInfo" && (
            <>
              <ProfileInfo
                userData={userData}
                openFormToChangeProfileInfo={() => {
                  setActiveSection("changeProfileInfo");
                  hiddenSunAndNavbar();
                }}
                // hiddenSunAndNavbar={hiddenSunAndNavbar}
              />
              {/* Здесь будет компонент для отображения автомобилей */}
              {/* <Cars /> */}
            </>
          )}
          {activeSection === "changeProfileInfo" && (
            <>
              <ChangeProfileInfo
                userData={userData}
                showSunAndNavbar={() => {
                  setActiveSection("profileInfo");
                  showSunAndNavbar();
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
