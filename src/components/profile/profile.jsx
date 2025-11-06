import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export default function Profile() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/profile");
  // }, []);

  return <Outlet />;
}
