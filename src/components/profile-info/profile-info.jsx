import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import edit from "../../image/edit-profile.svg";
import noPhoto from "../../image/no-photo.webp";
import Button from "../button/button";
import { useEffect, useState } from "react";

export default function ProfileInfo({ userInfo }) {
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
  }, []);

  // return (
  //   <div>
  //     {Object.entries(parsed).map(([key, value]) => (
  //       <div key={key} style={{ marginBottom: 6 }}>
  //         <strong>{key}:</strong>{" "}
  //         {typeof value === "object" ? (
  //           <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
  //             {JSON.stringify(value, null, 2)}
  //           </pre>
  //         ) : (
  //           String(value)
  //         )}
  //       </div>
  //     ))}
  //   </div>
  // );

  return (
    <article className={`global-styles ${styles.container}`}>
      <img
        src={userInfo.photo_url ? userInfo.photo_url : noPhoto}
        alt={
          userInfo.last_name || userInfo.first_name
            ? `${userInfo.last_name} ${userInfo.first_name}`
            : "Фото пользователя"
        }
        className={styles.mainImage}
      />

      <h1 className={styles.name}>
        {userInfo.last_name || userInfo.first_name
          ? `${userInfo.last_name} ${userInfo.first_name}`.trim()
          : "Имя Фамилия"}
      </h1>
      <div className={styles.containerRoleAndRating}>
        <div className={styles.role}>Водитель</div>
        <img src={star} alt="Звезда" className={styles.star} />
        <span className={styles.rating}>4.9</span>
      </div>
      <p className={styles.startedWorking}>Работаю с Января 2025</p>
      <Button styleType="black" isButtonWithIcon={true}>
        <img
          src={edit}
          alt="Редактировать профиль"
          className={styles.iconButton}
        />
        Редактировать профиль
      </Button>
    </article>
  );
}
