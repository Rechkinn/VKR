import { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./input.module.css";

const Input = forwardRef(
  (
    {
      label = "",
      name = "",
      initialValue = "",
      className = "",
      classNameContainer = "",
      iconForLabel = null,
      errorText = "",
      isSelect = false,
      setAdressError = null,
      readOnly = false,
      swapButton = null,
      ...props
    },
    ref
  ) => {
    const [valueInput, setValueInput] = useState("");

    function formatPhoneNumber(stringPhoneNumber) {
      // Удаляем все нецифровые символы
      let numbers = stringPhoneNumber.replace(/\D/g, "");

      // Ограничиваем длину номера (11 цифр для России)
      numbers = numbers.substring(0, 11);

      // Форматируем номер согласно маске
      let formattedValue = "+7";

      if (numbers.length > 1) {
        formattedValue += " (" + numbers.substring(1, 4);
      }
      if (numbers.length >= 5) {
        formattedValue += ") " + numbers.substring(4, 7);
      }
      if (numbers.length >= 8) {
        formattedValue += "-" + numbers.substring(7, 9);
      }
      if (numbers.length >= 10) {
        formattedValue += "-" + numbers.substring(9, 11);
      }

      setValueInput(formattedValue);
    }

    function formatLicensePlate(value) {
      setValueInput(value.toUpperCase());
    }

    const [isOpenContentSelect, setIsOpenContentSelect] = useState(false);
    const [contentSelect, setContentSelect] = useState([]);
    // const inputRef = useRef();

    function renderContentSelect(value) {
      if (!isSelect) return;

      const url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
      const token = "b537cba152892a63e9e083bcd4ccf47b1b5e3fc9";

      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: value }),
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          setContentSelect(result?.suggestions);
        })
        .catch((error) => console.log("error", error));

      setValueInput(value);
      // setAdressError(true);
    }

    useEffect(() => {
      setValueInput(initialValue);
    }, [initialValue]);

    const [errorStyles, setErrorStyles] = useState({ width: "100%" });

    useEffect(() => {
      if (!ref?.current) return;
      setErrorStyles({ width: ref.current.clientWidth });
    }, [ref?.current]);

    return (
      <div className={classNameContainer}>
        {label && (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label htmlFor={name} className={styles.label}>
              {iconForLabel && (
                <img
                  src={iconForLabel}
                  alt="Иконка для label"
                  className={styles.iconForLabel}
                />
              )}
              {label}
            </label>
            {swapButton && <>{swapButton}</>}
          </div>
        )}

        <input
          {...props}
          ref={ref}
          readOnly={readOnly}
          id={name}
          name={name}
          value={valueInput}
          onChange={(event) => {
            name === "passenger_phone_number" || name === "phone_number"
              ? formatPhoneNumber(event.target.value)
              : name === "from_address" || name === "to_address"
              ? renderContentSelect(event.target.value)
              : name === "license_plate"
              ? formatLicensePlate(event.target.value)
              : setValueInput(event.target.value);
          }}
          className={`${styles.input} ${className}`}
          onFocus={() => setIsOpenContentSelect(true)}
          onBlur={() => setIsOpenContentSelect(false)}
        />

        {!readOnly &&
          isSelect &&
          isOpenContentSelect &&
          contentSelect.length > 0 && (
            <ul className={styles.containerContentSelect}>
              {contentSelect.map((element, i) => {
                return (
                  <li
                    key={i}
                    className={styles.li}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      setValueInput(element.value);
                      setIsOpenContentSelect(false);
                      setAdressError(false);
                    }}
                  >
                    {element.value}
                  </li>
                );
              })}
            </ul>
          )}

        {errorText && (
          <p style={errorStyles} className={styles.errorText}>
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

export default Input;
