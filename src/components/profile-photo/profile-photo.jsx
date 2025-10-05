import styles from "./profile-photo.module.css";
import editProfile from "../../image/edit-profile.svg";
import Button from "../button/button";

export default function ProfilePhoto({
  userData,
  openFormToChangeUserInfo = null,
  size = 166,
  className = "",
}) {
  return (
    <article className={`${className} ${styles.containerPhoto}`}>
      <img
        src={userData.photo_url}
        alt={`${userData.first_name} ${userData.last_name}`}
        className={styles.photo}
        style={{ width: size, height: size }}
      />
      {openFormToChangeUserInfo && (
        <Button
          className={`onlyIcon ${styles.buttonEdit}`}
          onClick={openFormToChangeUserInfo}
        >
          <img src={editProfile} alt="Редактировать" />
        </Button>
      )}
    </article>
  );
}
