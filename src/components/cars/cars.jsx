import Button from "../button/button";
import Car from "../car/car";
import styles from "./cars.module.css";
import addCarIcon from "../../image/profile/addCarIcon.svg";
import { forwardRef } from "react";

export const Cars = forwardRef((props, ref) => {
  return (
    <section className={styles.containerCars}>
      <header className={`${styles.header}`}>
        <h2 className={styles.nameSection}>Мои авто</h2>
        <Button className="black withIcon">
          <img src={addCarIcon} alt="" />
          <span className={styles.textAddCar}>Добавить</span>
        </Button>
      </header>

      {/* Через map перебираем массив авто и рендерим каждое авто в отдельном компоненте */}

      <div ref={ref} style={props.style} className={styles.cars}>
        {[1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3].map(() => {
          return <Car />;
        })}
      </div>
    </section>
  );
});
