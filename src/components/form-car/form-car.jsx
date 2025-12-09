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
import { Link, useLocation, useNavigate, useParams } from "react-router";
import Loader from "../loader/loader";
import CarImage from "../car-image/car-image";
import SelectCustom from "../select-custom/select-custom";
import {
  CAR_CREATE_REQUEST_RESET,
  createCar,
  EDIT_CAR_REQUEST_RESET,
  editCar,
  SET_CAR_FOR_SETTINGS,
} from "../../services/actions/car";

const FormCar = ({ isForViewing, isForEditing }) => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const [carForSettings, setCarForSettings] = useState();
  const {
    cars,
    createCarRequest,
    createCarRequestError,
    editCarRequest,
    editCarRequestError,
  } = useSelector((store) => store.car);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });
    dispatch({
      type: EDIT_CAR_REQUEST_RESET,
    });
    dispatch({
      type: CAR_CREATE_REQUEST_RESET,
    });

    for (let i = 0; i < cars.length; i++) {
      if (cars[i].id === Number(id)) {
        setCarForSettings({ ...cars[i] });
        break;
      }
    }
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
    dispatch({
      type: SET_CAR_FOR_SETTINGS,
      carForSettings: null,
    });
    navigate("/");
  }

  function saveNewData(e) {
    e.preventDefault();

    if (isForViewing) return;

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

    if (isForEditing) {
      dispatch(
        editCar(
          carForSettings.id,
          { ...newCar, is_active: carForSettings.is_active },
          closeCarForm
        )
      );
    } else {
      dispatch(createCar(newCar, closeCarForm));
    }
  }

  return (
    <section>
      {createCarRequest && <Loader>Создаём новый автомобиль...</Loader>}
      {editCarRequest && <Loader>Изменяем данные об автомобиле...</Loader>}

      {(!createCarRequest && createCarRequestError) ||
      (!editCarRequest && editCarRequestError) ? (
        <>
          <div style={{ color: "white" }}>
            {`Ошибка ${
              isForEditing ? "редактирования" : "создания"
            } автомобиля!`}
          </div>
          <Link to="/">Вернуться в профиль</Link>
        </>
      ) : (
        <>
          <Button onClick={closeCarForm}>
            <img src={arrowLeftIcon} alt="Вернуться в профиль" />
          </Button>

          <div className={styles.carPhoto}>
            <CarImage type="forForm" />
          </div>
          <form action="" ref={formRef} onSubmit={(e) => saveNewData(e)}>
            <Input
              label="Марка"
              type="text"
              name="brand"
              initialValue={carForSettings?.brand ?? ""}
              className={styles.input}
              required
              readOnly={isForViewing}
            />
            <Input
              label="Модель"
              type="text"
              name="model"
              initialValue={carForSettings?.model ?? ""}
              className={styles.input}
              required
              readOnly={isForViewing}
            />

            <div className={styles.containerYearAndColor}>
              <Input
                label="Год"
                type="number"
                name="year"
                initialValue={carForSettings?.year ?? ""}
                className={styles.inputYear}
                required
                readOnly={isForViewing}
              />
              <Input
                label="Цвет автомобиля"
                type="text"
                name="color"
                initialValue={carForSettings?.color ?? ""}
                className={styles.inputColor}
                required
                readOnly={isForViewing}
              />
            </div>

            <Input
              label="Регистрационный номер"
              type="text"
              name="license_plate"
              initialValue={carForSettings?.license_plate ?? ""}
              className={styles.input}
              required
              readOnly={isForViewing}
            />

            <SelectCustom
              name="car_class"
              id="car_class"
              label={"Класс авто"}
              defaultValue={carForSettings?.car_class ?? "passenger_car"}
            >
              <option value="passenger_car">Легковой</option>
              <option value="minivan">Минивэн</option>
              <option value="microbus">Микроавтобус</option>
              <option value="bus">Автобус</option>
            </SelectCustom>

            <div>
              <label htmlFor="additional_info" className={styles.label}>
                Дополнительная информация
              </label>
              <textarea
                name="additional_info"
                id="additional_info"
                className={styles.textarea}
                readOnly={isForViewing}
                defaultValue={carForSettings?.additional_info ?? ""}
              ></textarea>
            </div>
            {!isForViewing && (
              <Button
                className={`yellow ${styles.buttonConfirm}`}
                style={{ marginBottom: "20px" }}
                type="submit"
              >
                {carForSettings?.id ? "Сохранить" : "Создать"}
              </Button>
            )}
          </form>
        </>
      )}
    </section>
  );
};

export default FormCar;
