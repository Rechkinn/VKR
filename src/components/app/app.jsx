import styles from "./app.module.css";
import Profile from "../profile/profile";
import Navbar from "../navbar/navbar";
import Trips from "../trips/trips";
import { useSelector } from "react-redux";
import Calendar from "../calendar/calendar";
import { Route, Routes } from "react-router";
import ProfileInfo from "../profile-info/profile-info";
import ChangeProfileInfo from "../change-profile-info/change-profile-info";

export default function App() {
  const { sunVisibility } = useSelector((store) => store.background);

  return (
    <>
      {sunVisibility && <div className={styles.backgroundYellowCircle}></div>}
      <main>
        <Routes>
          <Route path="/" element={<Profile />}>
            <Route path="profile" element={<ProfileInfo />} />
            <Route path="profile/change" element={<ChangeProfileInfo />} />
          </Route>
          <Route path="/trips" element={<Trips />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
        <Navbar />
      </main>
    </>
  );
}
