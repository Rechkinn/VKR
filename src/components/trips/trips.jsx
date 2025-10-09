import Balance from "../balance/balance";
import Button from "../button/button";
import styles from "./trips.module.css";
import carIcon from "../../image/navbar/carActive.svg";
import Tabs from "../tabs/tabs";
import Trip from "../trip/trip";

export default function Trips() {
  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои поездки</h1>
        <div className={styles.balance}>
          <Balance balanceValue={2.743} />
          <Button className="black">Пополнить</Button>
        </div>
      </header>
      <div className={styles.containerCreateTrip}>
        {true ? (
          <Button className={styles.buttonCreateTrip}>
            <span className={styles.buttonIconBackground}>
              <img src={carIcon} alt="Иконка автомобиля" />
            </span>
            <span className={styles.buttonText}>Создать поездку</span>
          </Button>
        ) : (
          <form></form>
        )}
      </div>

      <Tabs />

      <div className={styles.trips}>
        <Trip />
        <Trip />
        <Trip />
        <Trip />
        <Trip />
      </div>
    </section>
  );
}
