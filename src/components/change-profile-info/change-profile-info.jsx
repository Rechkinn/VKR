import Button from "../button/button";
import ProfilePhoto from "../profile-photo/profile-photo";
import styles from "./change-profile-info.module.css";
import arrowLeftIcon from "../../image/change-profile-info/arrow-left.svg";
import { useRef, useState } from "react";
import Input from "../input/input";
import moreDetailIcon from "../../image/change-profile-info/more-details.svg";
import { useDispatch, useSelector } from "react-redux";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import { SET_ACTIVE_SECTION_PROFILE } from "../../services/actions/profile";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { SET_USER_TELEGRAM_INFO } from "../../services/actions/user";

export default function ChangeProfileInfo() {
  // если чекбокс будет активным, то будет показываться поле для вода числового кода
  const [showInputCode, setShowInputCode] = useState(false);
  const checkboxRef = useRef();

  const { infoFromTelegram } = useSelector((store) => store.user);
  console.log("infoFromTelegram");
  console.log(infoFromTelegram);

  const formRef = useRef();
  const dispatch = useDispatch();

  function closeFormToChangeProfileInfo() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: true,
    });
    dispatch({
      type: SET_ACTIVE_SECTION_PROFILE,
      activeSection: "info",
    });
  }

  function saveNewData(e) {
    e.preventDefault();

    if (!formRef.current) {
      console.log("formRef не существует");
      console.log(formRef);
      return;
    }

    const newData = {};

    const inputs = formRef.current.elements;
    console.log("Массив inputs");
    console.log(inputs);

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "username") continue;
      newData[inputs[i].name] = inputs[i].value;
    }

    console.log("Объект newData");
    console.log(newData);

    const option = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newData),
    };

    fetch("https://xn--80aqak6ae.xn--p1ai/api/v1/users/me", option)
      .then((response) => {
        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        console.log(response);
        return response.json();
      })
      .then((user) => {
        dispatch({
          type: SET_USER_TELEGRAM_INFO,
          infoFromTelegram: user,
        });
        console.log(user);
        closeFormToChangeProfileInfo();
      })
      .catch((error) => console.log(error));
  }

  return (
    <section>
      <header className={styles.header}>
        <Button onClick={closeFormToChangeProfileInfo}>
          <img src={arrowLeftIcon} alt="" />
        </Button>
        <h1 className={styles.headerText}>Редактировать аккаунт</h1>
      </header>
      <div className={styles.profilePhoto}>
        <ProfilePhoto size={114} />
      </div>
      <form action="" ref={formRef} onSubmit={(e) => saveNewData(e)}>
        <Input
          label="Имя"
          type="text"
          name="first_name"
          initialValue={infoFromTelegram.first_name}
          className={styles.input}
        />
        <Input
          label="Фамилия"
          type="text"
          name="last_name"
          initialValue={infoFromTelegram.last_name}
          className={styles.input}
        />
        <Input
          label="Telegram"
          type="text"
          name="username"
          initialValue={`@${infoFromTelegram.username}`}
          className={styles.input}
          readOnly
        />
        <Input
          label="Номер телефона"
          type="text"
          name="phone_number"
          initialValue={
            infoFromTelegram?.phone_number ? infoFromTelegram.phone_number : ""
          }
          className={styles.mb18}
        />

        {/* <div className={styles.customCheckboxContainer}>
          <label
            htmlFor="become-driver"
            onClick={() => {
              console.log("123");
              setShowInputCode(checkboxRef?.current?.checked);
            }}
            className={styles.customChekcboxText}
          >
            <input
              ref={checkboxRef}
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
        )} */}

        <Button
          className={`yellow ${styles.buttonSave}`}
          // onClick={(e) => {
          //   e.preventDefault();
          // }}
          type="submit"
        >
          Сохранить
        </Button>
      </form>
    </section>
  );
}
