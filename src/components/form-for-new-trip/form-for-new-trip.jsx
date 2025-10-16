import { useDispatch } from "react-redux";
import styles from "./form-for-new-trip.module.css";
import closeIcon from "../../image/form-for-new-trip/close-icon.svg";
import dateIcon from "../../image/form-for-new-trip/date-icon.svg";
import watchIcon from "../../image/section-trips/watch-icon.svg";
import startPointIcon from "../../image/section-trips/start-point-icon.svg";
import endPointIcon from "../../image/section-trips/end-point-icon.svg";
import phoneIcon from "../../image/section-trips/phone-icon.svg";
import Button from "../button/button";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import Input from "../input/input";

export default function FormForNewTrip({ actionType }) {
  const dispatch = useDispatch();

  function closeForm(event) {
    event.preventDefault();
    dispatch({
      type: actionType,
    });
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
  }

  return (
    <form className={styles.form}>
      <Button onClick={closeForm} className={styles.closeButton}>
        <img src={closeIcon} alt="Иконка закрытия формы" />
      </Button>

      <div className={styles.containerForTwoInputs}>
        <div className={styles.container40}>
          <Input label="Дата" iconForLabel={dateIcon} type="date" name="date" />
        </div>
        <div className={styles.container60}>
          <Input
            label="Время"
            iconForLabel={watchIcon}
            type="time"
            name="time"
          />
        </div>
      </div>

      <Input
        label="Откуда"
        iconForLabel={startPointIcon}
        type="text"
        name="start-point"
      />
      <Input
        label="Куда"
        iconForLabel={endPointIcon}
        type="text"
        name="end-point"
      />

      <div className={styles.containerForTwoInputs}>
        <div className={styles.container40}>
          <Input
            label="Пассажиры"
            iconForLabel={dateIcon}
            type="number"
            name="passengers"
          />
        </div>
        <div className={styles.container60}>
          <label htmlFor="car-class" className={styles.label}>
            Класс автомобиля
          </label>
          <select name="car-class" id="car-class" className={styles.select}>
            <option value="Эконом">Эконом</option>
            <option value="Комфорт">Комфорт</option>
            <option value="Бизнес">Бизнес</option>
          </select>
        </div>
      </div>

      <Input
        label="Номер телефона"
        iconForLabel={phoneIcon}
        type="phone"
        name="phone"
      />

      <div>
        <label htmlFor="additional-info" className={styles.label}>
          Дополнительная информация
        </label>
        <textarea
          name="additional-info"
          id="additional-info"
          className={styles.textarea}
        ></textarea>
      </div>

      <Button
        className={`yellow ${styles.buttonPushForm}`}
        onClick={(e) => e.preventDefault()}
      >
        Опубликовать
      </Button>
    </form>
  );
}
