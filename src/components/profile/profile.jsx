import ProfileInfo from "../profile-info/profile-info";
import styles from "./profile.module.css";

export default function Profile({ userInfo }) {
  return (
    <section>
      <ProfileInfo userInfo={JSON.parse(userInfo.data)} />
      {/* Здесь будет компонент для отображения автомобилей */}
    </section>
  );
}
