import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import starEmpty from "../../image/star-empty.svg";
import ProfilePhoto from "../profile-photo/profile-photo";
import Balance from "../balance/balance";
import { useSelector } from "react-redux";

export default function ProfileInfo() {
  const { infoFromTelegram, infoFromBackend } = useSelector(
    (store) => store.user
  );

  console.log("infoFromTelegram в ProfileInfo");
  console.log(infoFromTelegram);
  console.log("infoFromBackend в ProfileInfo");
  console.log(infoFromBackend);

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
      {infoFromTelegram && (
        <section>
          <header className={styles.header}>
            <div className={styles.headerPart}>
              <h1 className={styles.ratingText}>Рейтинг</h1>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {renderStars(infoFromTelegram.rating_avg)}
                </div>
                <span className={styles.ratingValue}>
                  {infoFromTelegram.rating_avg}
                </span>
              </div>
            </div>
            <div className={styles.headerPart}>
              <Balance balanceValue={infoFromTelegram.balance} />
            </div>
          </header>

          <div className={styles.content}>
            <ProfilePhoto needButtonToEdit={true} size={166} />

            <h2 className={styles.nameUser}>
              {`${infoFromTelegram.first_name} ${infoFromTelegram.last_name}`.trim()}
            </h2>
            <p className={styles.userDescription}>
              {/* В Alltransfer с Января {infoFromTelegram.created_at.split("-")[0]} */}
              В Alltransfer с Января {infoFromTelegram.created_at}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
