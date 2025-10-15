import styles from "./profile-photo.module.css";
import editProfile from "../../image/edit-profile.svg";
import Button from "../button/button";
import { useDispatch } from "react-redux";
import { SET_ACTIVE_SECTION_PROFILE } from "../../services/actions/profile";
import { SET_VISIBILITY_NAVBAR } from "../../services/actions/navbar";
import { SET_SUN_VISIBILITY_ON_BACKGROUND } from "../../services/actions/background";

export default function ProfilePhoto({
  userData,
  // openFormToChangeUserInfo = null,
  needButtonToEdit = false,
  size = 166,
  className = "",
}) {
  const dispatch = useDispatch();

  function openFormToChangeProfileInfo() {
    dispatch({
      type: SET_VISIBILITY_NAVBAR,
      visibility: false,
    });
    dispatch({
      type: SET_SUN_VISIBILITY_ON_BACKGROUND,
      sunVisibility: false,
    });
    dispatch({
      type: SET_ACTIVE_SECTION_PROFILE,
      activeSection: "changeInfo",
    });
  }

  return (
    <article className={`${className} ${styles.containerPhoto}`}>
      <img
        src={userData.photo_url}
        alt={`${userData.first_name} ${userData.last_name}`}
        className={styles.photo}
        style={{ width: size, height: size }}
      />
      {needButtonToEdit && (
        <Button
          className={`onlyIcon ${styles.buttonEdit}`}
          onClick={openFormToChangeProfileInfo}
        >
          <img src={editProfile} alt="Редактировать" />
        </Button>
      )}
    </article>
  );
}
