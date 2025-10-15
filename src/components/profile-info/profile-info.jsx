import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import starEmpty from "../../image/star-empty.svg";
import ProfilePhoto from "../profile-photo/profile-photo";
import Balance from "../balance/balance";

export default function ProfileInfo({ userData }) {
  function renderStars(rating) {
    const array = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      array.push(1);
    }
    for (let i = 0; i < 5 - Math.floor(rating); i++) {
      array.push(-1);
    }
    return array.map((value, i) => {
      if (value === 1)
        return <img src={star} alt="Звезда" key={i} className={styles.star} />;
      else
        return (
          <img src={starEmpty} alt="Звезда" key={i} className={styles.star} />
        );
    });
  }

  return (
    <>
      {userData && (
        <section>
          <header className={styles.header}>
            <div className={styles.headerPart}>
              <h1 className={styles.ratingText}>Рейтинг</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>{renderStars(4.3)}</div>
                <span className={styles.ratingValue}>4.3</span>
              </div>
            </div>
            <div className={styles.headerPart}>
              <Balance balanceValue={2.743} />
            </div>
          </header>

          <div className={styles.content}>
            <ProfilePhoto
              userData={userData}
              needButtonToEdit={true}
              size={166}
            />

            <h2 className={styles.nameUser}>
              {`${userData.first_name} ${userData.last_name}`.trim()}
            </h2>
            <p className={styles.userDescription}>
              В Alltransfer с Января 2025
            </p>
          </div>
        </section>
      )}
    </>
  );
}
