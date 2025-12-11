import styles from "./app.module.css";
import Profile from "../profile/profile";
import Navbar from "../navbar/navbar";
import Trips from "../trips/trips";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "../calendar/calendar";
import { Route, Routes, useNavigate } from "react-router";
import ProfileInfo from "../profile-info/profile-info";
import ChangeProfileInfo from "../change-profile-info/change-profile-info";
import FormForNewTrip from "../form-for-new-trip/form-for-new-trip";
import { useEffect } from "react";
import { PROFILE } from "../../utils/consts";
import { getTrips } from "../../services/actions/trips";
import FormCar from "../form-car/form-car";

export default function App({ customLog }) {
  const { sunVisibility } = useSelector((store) => store.background);

  return (
    <>
      {sunVisibility && <div className={styles.backgroundYellowCircle}></div>}
      <main>
        <Routes>
          <Route path="/" element={<ProfileInfo customLog={customLog} />} />
          <Route path="/profile/change" element={<ChangeProfileInfo />} />

          <Route path="/car/new" element={<FormCar />} />
          {/* <Route path="/car/view/:id" element={<FormCar isForViewing />} /> */}
          <Route path="/car/edit/:id" element={<FormCar isForEditing />} />

          <Route path="/trips" element={<Trips />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/create-new-trip" element={<FormForNewTrip />} />
          <Route
            path="*"
            element={
              <div>
                <a href="/">На главную</a>
              </div>
            }
          />
        </Routes>
        <Navbar />
      </main>
    </>
  );
}
