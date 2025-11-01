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
import { useRef } from "react";

export default function FormForNewTrip({ actionType }) {
  const dispatch = useDispatch();

  const formRef = useRef();

  function closeForm() {
    dispatch({
      type: actionType,
    });
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: true,
    });
  }

  function createNewTrip(e) {
    // departure_datetime

    e.preventDefault();

    console.log("formRef.current");
    console.log(formRef.current);

    if (!formRef.current) {
      console.log("formRef для создания заказа не существует");
      console.log(formRef);
      return;
    }

    const newData = {
      trip_type: "delegated",
      is_delegation_active: true,
    };

    const inputs = formRef.current.elements;
    console.log("Массив inputs");
    console.log(inputs);

    let date = "";
    let time = "";
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name === "" || inputs[i].value === "") continue;

      if (inputs[i].name === "date") {
        date = `${inputs[i].value}`;
        if (date !== "" && time !== "" && !newData?.departure_datetime) {
          newData["departure_datetime"] = `${date}T${time}:00.007Z`;
        }
        continue;
      }
      if (inputs[i].name === "time") {
        time += `${inputs[i].value}`;
        if (date !== "" && time !== "" && !newData?.departure_datetime) {
          newData["departure_datetime"] = `${date}T${time}:00.007Z`;
        }
        continue;
      }

      if (
        inputs[i].name === "delegation_commission" ||
        inputs[i].name === "price" ||
        inputs[i].name === "total_seats"
      ) {
        newData[inputs[i].name] = Number(inputs[i].value);
        continue;
      }

      newData[inputs[i].name] = inputs[i].value;
    }

    console.log("Объект newData");
    console.log(newData);

    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwicm9sZSI6ImRyaXZlciIsImV4cCI6MTc2MjA5ODg2NH0.sqHaieRqXjYZCLLfPS_MGcVo1vA4AtrjLR1Pm-20_8A";
    // Authorization: `Bearer ${token}`,

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(newData),
    };

    fetch("https://xn--80aqak6ae.xn--p1ai/api/v1/trips", option)
      .then((response) => {
        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        console.log(response);
        return response.json();
      })
      .then((trip) => {
        console.log("trip");
        console.log(trip);
        closeForm();
      })
      .catch((error) => console.log(error));
  }

  return (
    <form
      action=""
      ref={formRef}
      className={styles.form}
      onSubmit={(e) => createNewTrip(e)}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          closeForm();
        }}
        className={styles.closeButton}
      >
        <img src={closeIcon} alt="Иконка закрытия формы" />
      </Button>

      <div className={styles.containerForTwoInputs}>
        <div className={styles.container40}>
          <Input
            label="Дата"
            iconForLabel={dateIcon}
            type="date"
            name="date"
            required
          />
        </div>
        <div className={styles.container60}>
          <Input
            label="Время"
            iconForLabel={watchIcon}
            type="time"
            name="time"
            required
          />
        </div>
      </div>

      <Input
        label="Откуда"
        iconForLabel={startPointIcon}
        type="text"
        name="from_address"
        required
      />

      <Input
        label="Куда"
        iconForLabel={endPointIcon}
        type="text"
        name="to_address"
        required
      />

      <div className={styles.containerForTwoInputs}>
        <div className={styles.container40}>
          <Input
            label="Пассажиры"
            iconForLabel={dateIcon}
            type="number"
            name="total_seats"
            required
          />
        </div>
        <div className={styles.container60}>
          <label htmlFor="car_class" className={styles.label}>
            Класс автомобиля
          </label>
          <select name="car_class" id="car_class" className={styles.select}>
            <option value="passenger_car">Легковой</option>
            <option value="minivan">Минивэн</option>
            <option value="microbus">Микроатобус</option>
            <option value="bus">Автобус</option>
          </select>
        </div>
      </div>

      <Input
        label="Номер телефона пассажира"
        iconForLabel={phoneIcon}
        type="tel"
        name="passenger_phone_number"
        required
      />

      <Input label="Стоимость" type="number" name="price" />

      <Input
        label="Комссия"
        type="number"
        name="delegation_commission"
        required
      />

      <div>
        <label htmlFor="description" className={styles.label}>
          Дополнительная информация
        </label>
        <textarea
          name="description"
          id="description"
          className={styles.textarea}
        ></textarea>
      </div>

      <Button
        type="submit"
        // onClick={(e) => e.preventDefault()}
        className={`yellow ${styles.buttonPushForm}`}
      >
        Отправить в канал
      </Button>
    </form>
  );
}
