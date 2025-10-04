import React from "react";
import Header from "./components/Header";
import Profile from "./components/profile/profile";
import { user } from "./utils/userInfo";

export default function App() {
  return (
    <div>
      <Header />

      <main>{/* <Profile userInfo={user} /> */}</main>
    </div>
  );
}
