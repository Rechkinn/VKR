import Button from "../button/button";
import ProfilePhoto from "../profile-photo/profile-photo";
import styles from "./change-profile-info.module.css";
import arrowLeftIcon from "../../image/change-profile-info/arrow-left.svg";
import { useRef, useState } from "react";
import Input from "../input/input";
import moreDetailIcon from "../../image/change-profile-info/more-details.svg";

export default function ChangeProfileInfo({ userData, showSunAndNavbar }) {
  const checkboxChecked = useRef();
  const [showInputCode, setShowInputCode] = useState(false);

  return (
    <section>
      <header className={styles.header}>
        <Button onClick={showSunAndNavbar}>
          <img src={arrowLeftIcon} alt="" />
        </Button>
        <h1 className={styles.headerText}>Редактировать аккаунт</h1>
      </header>
      <div className={styles.profilePhoto}>
        <ProfilePhoto userData={userData} size={114} />
      </div>
      <form action="">
        <Input
          label="Имя"
          type="text"
          name="first-name"
          initialValue={userData.first_name}
          className={styles.input}
        />
        <Input
          label="Фамилия"
          type="text"
          name="last-name"
          initialValue={userData.last_name}
          className={styles.input}
        />
        <Input
          label="Telegram"
          type="text"
          name="username"
          initialValue={`@${userData.username}`}
          className={styles.input}
        />
        <Input
          label="Номер телефона"
          type="text"
          name="phone-number"
          initialValue={
            localStorage.getItem("account1")
              ? localStorage.getItem("account1").phone
              : ""
          }
          className={styles.mb18}
        />

        <div className={styles.customCheckboxContainer}>
          <label
            htmlFor="become-driver"
            onClick={() => {
              console.log("123");
              setShowInputCode(checkboxChecked?.current?.checked);
            }}
            className={styles.customChekcboxText}
          >
            <input
              ref={checkboxChecked}
              type="checkbox"
              id="become-driver"
              name="become-driver"
              className={styles.originalChekcbox}
            />
            <span className={styles.customChekcbox}>
              <span className={styles.customChekcboxIconArrow}></span>
            </span>
            Стать водителем
          </label>
          <Button
            className={styles.moreDetail}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <img src={moreDetailIcon} alt="Подробнее" />
          </Button>
        </div>
        {showInputCode && (
          <Input
            type="text"
            name="code"
            initialValue={
              localStorage.getItem("account1")
                ? localStorage.getItem("account1").phone
                : ""
            }
            placeholder="Введите код"
            className={styles.inputCode}
          />
        )}

        <Button
          className={`mainStyle ${styles.buttonSave}`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Сохранить
        </Button>
      </form>
    </section>
  );
}
