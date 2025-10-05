import styles from "./start-page.module.css";
import mainImage from "../../image/main-image.svg";
import Button from "../button/button";
import arrow from "../../image/arrow-right.svg";

export default function StartPage({ functionContinue }) {
  return (
    <div className={styles.container}>
      <img src={mainImage} alt="Логотип" />
      <h1 className={styles.nameApp}>Alltransfer</h1>
      <div className={styles.continue}>
        <p className={styles.continueText}>
          Продолжая, вы принимаете условия...
        </p>
        <Button className="onlyIcon" onClick={functionContinue}>
          <img src={arrow} alt="Стрелочка для продолжения" />
        </Button>
      </div>
    </div>
  );
}
