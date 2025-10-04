import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import edit from "../../image/edit-profile.svg";
import noPhoto from "../../image/no-photo.webp";
import Button from "../button/button";

// const url =
//   "https://sun9-81.userapi.com/s/v1/if2/U3hQGq7ILnj0qNSHQHWk-cGAi0CC_aptfRfpvCoyiauKMl7wMMxqB-oGrELsiuMnJ46UPd-sIlDPv5lANtLm-XlQ.jpg?quality=95&as=32x20,48x30,72x45,108x67,160x100,240x149,360x224,480x299,540x336,640x398,720x448,1080x672,1157x720&from=bu&cs=1157x0";

export default function ProfileInfo({ userInfo }) {
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
      {"userInfo.photo_url"}
      {userInfo.photo_url}
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
