import styles from "./form-car.module.css";
import Button from "../button/button";
import ProfilePhoto from "../profile-photo/profile-photo";
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
import CarImage from "../car-image/car-image";
import SelectCustom from "../select-custom/select-custom";
import { createCar } from "../../services/actions/car";

const FormCar = () => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });
  }, []);

  function closeCarForm() {
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

    const newCar = {};

    const inputs = formRef.current.elements;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "") continue;
      if (inputs[i].name === "year") {
        newCar[inputs[i].name] = Number(inputs[i].value);
        continue;
      }

      newCar[inputs[i].name] = inputs[i].value;
    }

    console.log("newCar");
    console.log(newCar);

    dispatch(createCar(newCar, closeCarForm));
  }

  return (
    <section>
      {/* {changeUserInfoRequest && <Loader>Отправка данных на сервер...</Loader>}
      {!changeUserInfoRequest && changeUserInfoRequestError && (
        <>
          <div style={{ color: "white" }}>Ошибка отправки данных!</div>
          <Link to="/" onClick={closeFormToChangeProfileInfo}>
            Вернуться в профиль
          </Link>
        </>
      )} */}

      <Button onClick={closeCarForm}>
        <img src={arrowLeftIcon} alt="" />
      </Button>

      <div className={styles.carPhoto}>
        <CarImage type="forForm" />
      </div>
      <form action="" ref={formRef} onSubmit={(e) => saveNewData(e)}>
        <Input
          label="Марка"
          type="text"
          name="brand"
          //   initialValue={infoFromTelegram.first_name}
          className={styles.input}
          required
        />
        <Input
          label="Модель"
          type="text"
          name="model"
          //   initialValue={infoFromTelegram.last_name}
          className={styles.input}
          required
        />

        <div className={styles.containerYearAndColor}>
          <Input
            label="Год"
            type="number"
            name="year"
            className={styles.inputYear}
            required
          />
          <Input
            label="Цвет автомобиля"
            type="text"
            name="color"
            className={styles.inputColor}
            required
          />
        </div>

        <Input
          label="Регистрационный номер"
          type="text"
          name="license_plate"
          //   initialValue={infoFromTelegram.first_name}
          className={styles.input}
          required
        />

        <SelectCustom label={"Класс авто"} />

        <div>
          <label htmlFor="additional_info" className={styles.label}>
            Дополнительная информация
          </label>
          <textarea
            name="additional_info"
            id="additional_info"
            className={styles.textarea}
          ></textarea>
        </div>

        <Button className={`yellow ${styles.buttonConfirm}`} type="submit">
          Сохранить
        </Button>
      </form>
    </section>
  );
};

export default FormCar;
