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
  const [showInputCode, setShowInputCode] = useState(false);
  const checkboxRef = useRef();

  const {
    infoFromTelegram,
    changeUserInfoRequest,
    changeUserInfoRequestError,
  } = useSelector((store) => store.user);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState(false);

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

  function validateName(inputValue) {
    const regex = /^[A-Za-zА-Яа-яЁё]{2,200}$/;
    return regex.test(inputValue);
  }

  function validatePhoneNumber(phone) {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

    return phoneRegex.test(phone);
  }

  function saveNewData(e) {
    e.preventDefault();

    if (!formRef.current) return;

    const newData = {};
    const inputs = formRef.current.elements;
    let stop = false;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "username" || inputs[i].name === "referral_id")
        continue;
      if (inputs[i].name === "sbp_bank" && inputs[i].value === "nothing") {
        newData[inputs[i].name] = null;
        continue;
      }

      if (inputs[i].name === "phone_number") {
        if (!validatePhoneNumber(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setPhoneNumberError(true);
          break;
        } else {
          setPhoneNumberError(false);
        }
      }
      if (inputs[i].name === "last_name") {
        if (!validateName(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setLastNameError(true);
          break;
        } else {
          setLastNameError(false);
        }
      }
      if (inputs[i].name === "first_name") {
        if (!validateName(inputs[i].value)) {
          inputs[i].focus();
          stop = true;
          setFirstNameError(true);
          break;
        } else {
          setFirstNameError(false);
        }
      }

      newData[inputs[i].name] = inputs[i].value;
    }
    console.log("newData");
    console.log(newData);
    if (stop) return;
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
              classNameContainer={styles.input}
              errorText={
                firstNameError
                  ? "Введите корректное имя на русском или английском языке от 2 до 200 символов"
                  : ""
              }
            />
            <Input
              label="Фамилия"
              type="text"
              name="last_name"
              initialValue={infoFromTelegram.last_name}
              classNameContainer={styles.input}
              errorText={
                lastNameError
                  ? "Введите корректную фамилию на русском или английском языке от 2 до 200 символов"
                  : ""
              }
            />
            <Input
              label="Telegram"
              type="text"
              name="username"
              initialValue={`@${infoFromTelegram.username}`}
              classNameContainer={styles.input}
              readOnly
            />

            <Input
              label="Номер телефона"
              type="tel"
              name="phone_number"
              placeholder="+7 (___) ___-__-__"
              initialValue={
                infoFromTelegram?.phone_number
                  ? validatePhoneNumber(infoFromTelegram.phone_number)
                    ? infoFromTelegram.phone_number
                    : ""
                  : ""
              }
              errorText={
                phoneNumberError
                  ? "Номер должен быть в формате: +7 (XXX) XXX-XX-XX"
                  : ""
              }
              classNameContainer={styles.input}
              required
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

            <Input
              label="Ваш реферальный код"
              type="number"
              name="referral_id"
              initialValue={infoFromTelegram.telegram_id}
              classNameContainer={styles.mt16}
              readOnly
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

            <Button className={`green ${styles.buttonSave}`} type="submit">
              Сохранить
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
