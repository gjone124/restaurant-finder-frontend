import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import SearchBarForm from "../SearchBarForm/SearchBarForm";

function Header({ handleAddModalClick, setRestaurantItems }) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const location = useLocation(); // get current path (or page route)

  return (
    <header className="header">
      <div className="header__info">
        <Link to="/">
          <img
            className="header__logo"
            src={logo}
            alt="Restaurant Finder Logo"
          />
        </Link>
        <p className="header__date-and-location">{currentDate}, LOCATION</p>
      </div>

      {/* conditionally render SearchBarForm based on current path
      so it only displays on Main page */}
      {location.pathname !== "/profile" && (
        <SearchBarForm setRestaurantItems={setRestaurantItems} />
      )}

      {/* conditionally render "Add Restaurant" button based on current path
      so it only displays on Profile page */}
      {location.pathname !== "/" && (
        <button
          onClick={handleAddModalClick}
          type="button"
          className="header__add-restaurant-button"
        >
          + Add Restaurant
        </button>
      )}

      <Link to="/profile" className="header__link">
        <div className="header__user-container">
          <p className="header__username">Terrence Tegegne</p>
          <img src={avatar} alt="default avatar" className="header__avatar" />
        </div>
      </Link>
    </header>
  );
}

export default Header;
