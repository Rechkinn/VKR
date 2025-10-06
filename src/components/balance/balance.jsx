import styles from "./balance.module.css";
import Currency from "../currency/currency";

export default function Balance({ balanceValue = 0 }) {
  return (
    <div className={styles.balanceContainer}>
      <h1 className={styles.balanceText}>Баланс</h1>
      <div className={styles.balance}>
        <Currency>RUB</Currency>
        <span className={styles.balanceValue}>{balanceValue}</span>
      </div>
    </div>
  );
}
