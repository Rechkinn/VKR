import styles from "./car-image.module.css";
import exampleCar from "../../image/camryPhoto.png";

const CarImage = ({ type = "default" }) => {
  return <img src={exampleCar} alt="" className={styles[type]} />;
};

export default CarImage;
