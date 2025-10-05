import Cars from "../cars/cars";
import ProfileInfo from "../profile-info/profile-info";
import styles from "./profile.module.css";

export default function Profile({ userInfo }) {
  return (
    <section>
      <ProfileInfo userInfo={userInfo} />
      {/* <Cars /> */}
      {/* Здесь будет компонент для отображения автомобилей */}
    </section>
  );
}
