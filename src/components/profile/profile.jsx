import { useState, useEffect } from "react";
import Cars from "../cars/cars";
import ProfileInfo from "../profile-info/profile-info";
import styles from "./profile.module.css";
import ChangeProfileInfo from "../change-profile-info/change-profile-info";
import { useSelector } from "react-redux";

export default function Profile({ userInfo }) {
  // const [userData, setUserData] = useState(null);

  const { activeSection } = useSelector((store) => store.profile);

  // useEffect(() => {
  // if (!userInfo) return <div style={{ color: "#666" }}>No user info</div>;
  // let parsed;
  // try {
  //   parsed = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
  // } catch (err) {
  //   return (
  //     <div style={{ color: "#d32f2f" }}>
  //       <div>Invalid JSON: {err.message}</div>
  //       <pre style={{ whiteSpace: "pre-wrap" }}>{String(userInfo)}</pre>
  //     </div>
  //   );
  // }
  // if (!parsed || typeof parsed !== "object") {
  //   return <div>{String(parsed)}</div>;
  // }
  // setUserData(parsed);
  // }, []);

  // function parsingUserInfo() {
  //   if (!userInfo) return <div style={{ color: "#666" }}>No user info</div>;

  //   let parsed;
  //   try {
  //     parsed = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
  //   } catch (err) {
  //     return (
  //       <div style={{ color: "#d32f2f" }}>
  //         <div>Invalid JSON: {err.message}</div>
  //         <pre style={{ whiteSpace: "pre-wrap" }}>{String(userInfo)}</pre>
  //       </div>
  //     );
  //   }

  //   if (!parsed || typeof parsed !== "object") {
  //     return <div>{String(parsed)}</div>;
  //   }
  // }

  return (
    <>
      {userData && (
        <>
          {activeSection === "info" && (
            <>
              {/* <ProfileInfo userData={userData} /> */}
              <ProfileInfo userData={userInfo} />
              {/* Здесь будет компонент для отображения автомобилей */}
              {/* <Cars /> */}
            </>
          )}
          {activeSection === "changeInfo" && (
            <ChangeProfileInfo userData={userData} />
          )}
        </>
      )}
    </>
  );
}
