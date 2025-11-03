import styles from "./app.module.css";
import Profile from "../profile/profile";
import StartPage from "../start-page/start-page";
import Navbar from "../navbar/navbar";
import Trips from "../trips/trips";
import { useSelector } from "react-redux";
import { CALENDAR, PROFILE, TRIPS } from "../../utils/consts";
import Calendar from "../calendar/calendar";

export default function App() {
  const { sunVisibility } = useSelector((store) => store.background);
  const { activeSection } = useSelector((store) => store.navbar);

  return (
    <>
      {sunVisibility && <div className={styles.backgroundYellowCircle}></div>}
      <main>
        {activeSection === PROFILE && <Profile />}
        {activeSection === TRIPS && <Trips />}
        {activeSection === CALENDAR && <Calendar />}
        <Navbar />
      </main>
    </>
  );
}
