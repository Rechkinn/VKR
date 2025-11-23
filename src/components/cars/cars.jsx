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
import { SET_CAR_FOR_SETTINGS } from "../../services/actions/car";

export const Cars = forwardRef((props, ref) => {
  const { visibilityModal, openModal, closeModal } = useModal();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getCarsRequest, getCarsRequestError, cars, carForSettings } =
    useSelector((store) => store.car);
  console.log("перед рендером cars");
  console.log(cars);

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
    event.stopPropagation();
    hiddenNavbarAndSun();
    navigate(`${path}`);
  }

  function openSettingsCar(car) {
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

  return (
    <>
      {getCarsRequest && (
        <div style={{ color: "red", textAlign: "center" }}>
          Ищем ваши авто...
        </div>
      )}
      {!getCarsRequest && getCarsRequestError && (
        <div style={{ color: "red", textAlign: "center" }}>
          Ошибка получения данных об авто!
        </div>
      )}
      {/* {true && ( */}
      {!getCarsRequest && !getCarsRequestError && (
        <>
          {visibilityModal && (
            <Settings closeSettings={closeSettingsCar}>
              {/* {removeTripRequest && <Loader>Пробуем удалить поездку...</Loader>}
              {!removeTripRequest && removeTripRequestError && (
                <p style={{ color: "red", textAlign: "center" }}>
                  Ошибка удаления поездки!
                </p>
              )} */}
              <Button
                className="modal modalUpper"
                onClick={(e) =>
                  openCarForm(e, `/car/edit/${carForSettings.id}`)
                }
              >
                Изменить
              </Button>
              <Button
                className="modal modalMiddle"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Удалить
              </Button>

              <Button
                className="modal modalMiddle"
                onClick={(e) =>
                  openCarForm(e, `/car/view/${carForSettings.id}`)
                }
              >
                Узнать детали
              </Button>

              <Button
                className="modal modalLower"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Сделать активной
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
                className="black withIcon"
                onClick={(e) => openCarForm(e, "/car/new")}
              >
                <img src={addCarIcon} alt="" />
                <span className={styles.textAddCar}>Добавить</span>
              </Button>
            </header>

            <div ref={ref} style={props.style} className={styles.cars}>
              {cars.map((car) => {
                return (
                  <Car
                    key={car.id}
                    car={car}
                    openSettings={() => openSettingsCar(car)}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
    </>
  );
});
