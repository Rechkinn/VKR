import Button from "../button/button";
import ProfilePhoto from "../profile-photo/profile-photo";
import styles from "./change-profile-info.module.css";
import arrowLeftIcon from "../../image/change-profile-info/arrow-left.svg";
import { useEffect, useRef, useState } from "react";
import Input from "../input/input";
import moreDetailIcon from "../../image/change-profile-info/more-details.svg";
import { useDispatch, useSelector } from "react-redux";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import {
  CHANGE_USER_INFO_REQUEST_SUCCESS,
  changeUserInfo,
  SET_USER_TELEGRAM_INFO,
} from "../../services/actions/user";
import { Link, useNavigate } from "react-router";
import Loader from "../loader/loader";
import SelectCustom from "../select-custom/select-custom";

export default function ChangeProfileInfo() {
  // если чекбокс будет активным, то будет показываться поле для вода числового кода
  const [showInputCode, setShowInputCode] = useState(false);
  const checkboxRef = useRef();

  const {
    infoFromTelegram,
    changeUserInfoRequest,
    changeUserInfoRequestError,
  } = useSelector((store) => store.user);
  console.log("infoFromTelegram");
  console.log(infoFromTelegram);

  const formRef = useRef();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: CHANGE_USER_INFO_REQUEST_SUCCESS,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });
  }, []);

  function closeFormToChangeProfileInfo() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: true,
    });

    navigate("/");
  }

  function saveNewData(e) {
    e.preventDefault();

    if (!formRef.current) return;

    const newData = {};

    const inputs = formRef.current.elements;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "username") continue;
      if (inputs[i].name === "sbp_bank" && inputs[i].value === "nothing") {
        newData[inputs[i].name] = null;
        continue;
      }

      newData[inputs[i].name] = inputs[i].value;
    }
    console.log("newData");
    console.log(newData);
    dispatch(changeUserInfo(newData, closeFormToChangeProfileInfo));
  }

  return (
    <section>
      {changeUserInfoRequest && <Loader>Отправка данных на сервер...</Loader>}
      {!changeUserInfoRequest && changeUserInfoRequestError && (
        <>
          <div style={{ color: "white" }}>Ошибка отправки данных!</div>
          <Link to="/" onClick={closeFormToChangeProfileInfo}>
            Вернуться в профиль
          </Link>
        </>
      )}

      {!changeUserInfoRequest && !changeUserInfoRequestError && (
        <>
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
                infoFromTelegram?.phone_number
                  ? infoFromTelegram.phone_number
                  : ""
              }
              className={styles.mb18}
            />
            <SelectCustom
              defaultValue={infoFromTelegram.sbp_bank ?? undefined}
              label="Банк СБП"
              id="sbp_bank"
              name="sbp_bank"
            >
              {/* <option value={"nothing"}>Не выбрано</option> */}
              <option value="nothing">Не выбрано</option>
              <option value="Сбербанк">Сбербанк</option>
              <option value="Газпромбанк">Газпромбанк</option>
              <option value="ВТБ">ВТБ</option>
              <option value="Райффайзенбанк">Райффайзенбанк</option>
              <option value="Совкомбанк">Совкомбанк</option>
              <option value="Альфа-банк">Альфа-банк</option>
              <option value="Т-Банк">Т-Банк</option>
            </SelectCustom>

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

            <Button className={`yellow ${styles.buttonSave}`} type="submit">
              Сохранить
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
