import React, { useContext } from "react";
import { Usercontext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import placesPage from "./placesPage";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(Usercontext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout", { withCredentials: true });
    setRedirect("/");
    setUser(null);
  }
  if (!ready) {
    return <div>Loading ...</div>;
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  function linkClass(type = null) {
    let classes = "py-2 px-6 ";
    if (type === subpage) {
      classes += "bg-primary text-white rounded-full";
    }
    return classes;
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8 ">
        <Link className={linkClass("profile")} to={"/account"}>
          My Profile
        </Link>
        <Link className={linkClass("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className={linkClass("places")} to={"/account/places"}>
          My accommodations
        </Link>
      </nav>
      {subpage === "profile" && (
        <div className="max-w-lg mx-auto text-center">
          <h1>My Profile</h1>
          <p>logged is as ( {user.email})</p>
          <button className="primary max-w-sm mt-2" onClick={logout}>
            {" "}
            logout
          </button>
        </div>
      )}
      {subpage === "places" && <placesPage />}
    </div>
  );
}
