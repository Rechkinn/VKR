import { useEffect, useState } from "react";
import styles from "./select-custom.module.css";

const SelectCustom = ({ label, disabled = false, defaultValue }) => {
  const [option, setOption] = useState();
  console.log("option", option);

  useEffect(() => {
    setOption(defaultValue);
  }, [defaultValue]);

  return (
    <div className={styles.container}>
      <label htmlFor="car_class" className={styles.label}>
        {label}
      </label>
      <select
        value={option}
        onChange={(e) => setOption(e.target.value)}
        name="car_class"
        id="car_class"
        className={styles.select}
      >
        <option value="passenger_car">Легковой</option>
        <option value="minivan">Минивэн</option>
        <option value="microbus">Микроавтобус</option>
        <option value="bus">Автобус</option>
      </select>
    </div>
  );
};

export default SelectCustom;
