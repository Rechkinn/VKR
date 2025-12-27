import Button from "../button/button";
import Car from "../car/car";
import styles from "./cars.module.css";
import addCarIcon from "../../image/profile/addCarIcon.svg";
import { forwardRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import { useModal } from "../../hooks/useModal";
import Settings from "../settings/settings";
import {
  REMOVE_CAR_REQUEST_RESET,
  removeCar,
  SET_CAR_FOR_SETTINGS,
} from "../../services/actions/car";
import Loader from "../loader/loader";
import { isDevelopmentMode } from "../../utils/development-mode";

export const Cars = forwardRef((props, ref) => {
  const { visibilityModal, openModal, closeModal } = useModal();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    getCarsRequest,
    getCarsRequestError,
    cars,
    carForSettings,
    removeCarRequest,
    removeCarRequestError,
  } = useSelector((store) => store.car);

  function hiddenNavbarAndSun() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: false,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });
  }

  function openCarForm(event, path) {
    if (event) event.stopPropagation();
    hiddenNavbarAndSun();
    navigate(`${path}`);
  }

  function openSettingsCar(car) {
    dispatch({
      type: REMOVE_CAR_REQUEST_RESET,
    });
    dispatch({
      type: SET_CAR_FOR_SETTINGS,
      carForSettings: car,
    });
    openModal();
  }
  function closeSettingsCar() {
    dispatch({
      type: SET_CAR_FOR_SETTINGS,
      carForSettings: null,
    });
    closeModal();
  }

  function deleteCar(event, carId) {
    event.stopPropagation();
    dispatch(removeCar(carId, closeSettingsCar));
  }

  return (
    <>
      {!isDevelopmentMode && (
        <>
          {getCarsRequest && <Loader>Ищем ваши авто...</Loader>}
          {!getCarsRequest && getCarsRequestError && (
            <div style={{ color: "red", textAlign: "center" }}>
              Ошибка получения данных об авто!
            </div>
          )}
        </>
      )}

      {/* {true && ( */}
      {/* {!getCarsRequest && !getCarsRequestError && ( */}
      {cars && (
        <>
          {visibilityModal && (
            <Settings closeSettings={closeSettingsCar}>
              {removeCarRequest && (
                <Loader>Пробуем удалить автомобиль...</Loader>
              )}
              {!removeCarRequest && removeCarRequestError && (
                <p className={styles.errorSettings}>Ошибка удаления авто!</p>
              )}
              <Button
                className="modal modalUpper"
                onClick={(e) =>
                  openCarForm(e, `/car/edit/${carForSettings.id}`)
                }
              >
                Изменить
              </Button>
              <Button
                className="modal modalLower"
                onClick={(e) => deleteCar(e, carForSettings.id)}
              >
                Удалить
              </Button>

              <Button className="modal modalSingle" onClick={closeSettingsCar}>
                Отмена
              </Button>
            </Settings>
          )}
          <section className={styles.containerCars}>
            <header className={`${styles.header}`}>
              <h2 className={styles.nameSection}>Мои авто</h2>
              <Button
                className="transparent withIcon"
                onClick={(e) => openCarForm(e, "/car/new")}
              >
                <img src={addCarIcon} alt="" />
                <span className={styles.textAddCar}>Добавить</span>
              </Button>
            </header>

            <div ref={ref} style={props.style} className={styles.cars}>
              {cars.map((car) => {
                if (car.is_active) {
                  return (
                    <Car
                      key={car.id}
                      car={car}
                      openSettings={() => openSettingsCar(car)}
                      openCarForm={(e) => openCarForm(e, `/car/edit/${car.id}`)}
                    />
                  );
                }
              })}
            </div>
          </section>
        </>
      )}
    </>
  );
});
