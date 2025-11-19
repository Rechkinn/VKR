import styles from "./select-custom.module.css";

const SelectCustom = ({ label }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="car_class" className={styles.label}>
        {label}
      </label>
      <select name="car_class" id="car_class" className={styles.select}>
        <option value="passenger_car">Легковой</option>
        <option value="minivan">Минивэн</option>
        <option value="microbus">Микроатобус</option>
        <option value="bus">Автобус</option>
      </select>
    </div>
  );
};

export default SelectCustom;
