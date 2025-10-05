import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import starEmpty from "../../image/star-empty.svg";

import { useEffect, useState } from "react";
import Currency from "../currency/currency";
import editProfile from "../../image/edit-profile.svg";

// import { user } from "../../utils/userInfo";
import Button from "../button/button";

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
    // setUserData(user);
  }, []);

  function renderStars(rating) {
    const array = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      array.push(1);
    }
    for (let i = 0; i < 5 - Math.floor(rating); i++) {
      array.push(-1);
    }
    return array.map((value) => {
      if (value === 1)
        return <img src={star} alt="Звезда" className={styles.star} />;
      else return <img src={starEmpty} alt="Звезда" className={styles.star} />;
    });
  }

  return (
    <>
      {userData && (
        <article className={` ${styles.container}`}>
          <header className={styles.header}>
            <div className={styles.headerPart}>
              <h1 className={styles.ratingText}>Рейтинг</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>{renderStars(4.3)}</div>
                <span className={styles.ratingValue}>4.3</span>
              </div>
            </div>
            <div className={styles.headerPart}>
              <h1 className={styles.balanceText}>Баланс</h1>
              <div className={styles.balance}>
                <Currency>RUB</Currency>
                <span className={styles.balanceValue}>2.754</span>
              </div>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.containerPhoto}>
              <img
                src={userData.photo_url}
                alt={`${userData.first_name} ${userData.last_name}`}
                className={styles.photo}
              />
              <Button className={`onlyIcon ${styles.buttonEdit}`}>
                <img src={editProfile} alt="Редактировать" />
              </Button>
            </div>

            <h2 className={styles.nameUser}>
              {`${userData.first_name} ${userData.last_name}`.trim()}
            </h2>
            <p className={styles.userDescription}>
              В Alltransfer с Января 2025
            </p>
          </div>
        </article>
      )}
    </>
  );
}
