import Button from "../button/button";
import styles from "./cars.module.css";

export default function Cars() {
  return (
    <article className={`global-styles ${styles.article}`}>
      <header className={`${styles.header}`}>
        <h2 className={styles.nameSection}>Мои авто</h2>
        <Button className="black withIcon">Добавить</Button>
      </header>

      {/* Через map перебираем массив авто и рендерим каждое авто в отдельном компоненте */}

      <div></div>
    </article>
  );
}
