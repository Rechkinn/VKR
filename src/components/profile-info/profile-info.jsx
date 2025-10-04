import styles from "./profile-info.module.css";
import star from "../../image/star.svg";
import edit from "../../image/edit-profile.svg";
import noPhoto from "../../image/no-photo.webp";
import Button from "../button/button";

// const url =
//   "https://sun9-81.userapi.com/s/v1/if2/U3hQGq7ILnj0qNSHQHWk-cGAi0CC_aptfRfpvCoyiauKMl7wMMxqB-oGrELsiuMnJ46UPd-sIlDPv5lANtLm-XlQ.jpg?quality=95&as=32x20,48x30,72x45,108x67,160x100,240x149,360x224,480x299,540x336,640x398,720x448,1080x672,1157x720&from=bu&cs=1157x0";

// const userData = {
//   initDataAvailable: true,
//   initDataLength: 549,
//   initDataUnsafe: {
//     query_id: "AAH5M-QzAAAAAPkz5DMf-_FV",
//     user: {
//       id: 870593529,
//       first_name: "Aleks",
//       last_name: "",
//       username: "Rechkinnnn",
//       language_code: "ru",
//       allows_write_to_pm: true,
//       photo_url:
//         "https://t.me/i/userpic/320/JtGPbJBctx4LLq_nm2R9calFGN2KxnnIKkyKLZQyodE.svg",
//     },
//     auth_date: "1759591620",
//     signature:
//       "fkkeRj8iGUqz3kyx_zg9vKXAc9fXsZ0d7Tg_PFK3YLMwAQzwVu0Wl1Mic7KSKgh75__LvDPmiG_DUORyAqd0Bg",
//     hash: "04d7afeee5bc4e85d7d898aa2fd2f0c5f8eebd687a2e6620726bafd4df5926be",
//   },
//   hasToken: true,
// };

// const obj2 = JSON.stringify(userData);

export default function ProfileInfo({ userInfo }) {
  function parseData() {
    if (!userInfo) return <div style={{ color: "#666" }}>No user info</div>;

    let parsed;
    try {
      parsed = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
    } catch (err) {
      return (
        <div style={{ color: "#d32f2f" }}>
          <div>Invalid JSON: {err.message}</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(userInfo)}</pre>
        </div>
      );
    }

    if (!parsed || typeof parsed !== "object") {
      return <div>{String(parsed)}</div>;
    }

    return (
      <div>
        {Object.entries(parsed).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 6 }}>
            <strong>{key}:</strong>{" "}
            {typeof value === "object" ? (
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(value, null, 2)}
              </pre>
            ) : (
              String(value)
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <article className={`global-styles ${styles.container}`}>
      <img
        src={userInfo.photo_url ? userInfo.photo_url : noPhoto}
        alt={
          userInfo.last_name || userInfo.first_name
            ? `${userInfo.last_name} ${userInfo.first_name}`
            : "Фото пользователя"
        }
        className={styles.mainImage}
      />
      <div>
        -------------------------------------------------------------------------------------------------------------------------------------------
      </div>
      {parseData()}
      <div>
        -------------------------------------------------------------------------------------------------------------------------------------------
      </div>

      <div>
        <h1 className={styles.name}>
          {userInfo.last_name || userInfo.first_name
            ? `${userInfo.last_name} ${userInfo.first_name}`.trim()
            : "Имя Фамилия"}
        </h1>
        <div className={styles.containerRoleAndRating}>
          <div className={styles.role}>Водитель</div>
          <img src={star} alt="Звезда" className={styles.star} />
          <span className={styles.rating}>4.9</span>
        </div>
        <p className={styles.startedWorking}>Работаю с Января 2025</p>
        <Button styleType="black" isButtonWithIcon={true}>
          <img
            src={edit}
            alt="Редактировать профиль"
            className={styles.iconButton}
          />
          Редактировать профиль
        </Button>
      </div>
    </article>
  );
}
