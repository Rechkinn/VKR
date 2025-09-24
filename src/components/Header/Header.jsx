import styles from "./Header.module.scss";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <h1>Это шапка сайта</h1>
        <a href="https://vk.com/feed" className={styles.a}>
          <span className={styles.vk}>VK</span>
        </a>
        <a href="https://ggsel.net/" className={styles.a}>
          <span className={styles.ggsel}>ggsel</span>
        </a>
        <a href="https://do.academyit.ru/login/index.php" className={styles.a}>
          <span className={styles.softline}>academyit</span>
        </a>
      </header>
    </>
  );
}
