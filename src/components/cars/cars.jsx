import Button from "../button/button";
import Car from "../car/car";
import styles from "./cars.module.css";
import addCarIcon from "../../image/profile/addCarIcon.svg";
import { forwardRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";

export const Cars = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getCarsRequest, getCarsRequestError, cars } = useSelector(
    (store) => store.car
  );

  console.log();

  function openCarForm() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: false,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });

    navigate("/car/form");
  }

  // const arr = [
  //   {
  //     brand: "Mercedes-Benz",
  //     model: "AMG GTS 500",
  //     year: 0,
  //     color: "string",
  //     license_plate: "А123МР77",
  //     additional_info: "string",
  //     car_class: "passenger_car",
  //     id: 0,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: false,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "string",
  //     car_class: "passenger_car",
  //     id: 0,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: false,
  //   },
  //   {
  //     brand: "string",
  //     model: "string",
  //     year: 0,
  //     color: "string",
  //     license_plate: "string",
  //     additional_info: "string",
  //     car_class: "passenger_car",
  //     id: 0,
  //     driver_id: 0,
  //     photo_url: "string",
  //     is_active: true,
  //   },
  // ];

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
      {!getCarsRequest && !getCarsRequestError && (
        <section className={styles.containerCars}>
          <header className={`${styles.header}`}>
            <h2 className={styles.nameSection}>Мои авто</h2>
            <Button className="black withIcon" onClick={openCarForm}>
              <img src={addCarIcon} alt="" />
              <span className={styles.textAddCar}>Добавить</span>
            </Button>
          </header>

          <div ref={ref} style={props.style} className={styles.cars}>
            {cars.map((car) => {
              return <Car car={car} />;
            })}
          </div>
        </section>
      )}
    </>
  );
});
