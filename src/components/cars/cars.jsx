import Button from "../button/button";
import Car from "../car/car";
import styles from "./cars.module.css";
import addCarIcon from "../../image/profile/addCarIcon.svg";
import { forwardRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";

export const Cars = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <section className={styles.containerCars}>
      <header className={`${styles.header}`}>
        <h2 className={styles.nameSection}>Мои авто</h2>
        <Button className="black withIcon" onClick={openCarForm}>
          <img src={addCarIcon} alt="" />
          <span className={styles.textAddCar}>Добавить</span>
        </Button>
      </header>

      <div ref={ref} style={props.style} className={styles.cars}>
        {[1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3].map(() => {
          return <Car />;
        })}
      </div>
    </section>
  );
});
