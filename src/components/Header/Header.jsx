import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import SearchBarForm from "../SearchBarForm/SearchBarForm";

function Header({
  handleAddModalClick,
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  isSearching,
  userLocation,
  isMenuOpen,
  onMenuOpen,
}) {
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentUrl = useLocation(); // get current Url path (or page route)

  return (
    <header className="header">
      {/* first row includes website logo, date, location,
      add restaurant button, username, and username logo */}
      <div className="header__top-row">
        <div className="header__info">
          <Link to="/">
            <img
              className="header__logo"
              src={logo}
              alt="Restaurant Finder Logo"
            />
          </Link>
          <div className="header__date-and-location-container">
            <p className="header__date">{currentDate}</p>
            <p className="header__location">
              {userLocation || "Fetching user's location..."}
            </p>
          </div>
        </div>

        <div
          className={`header__menu ${isMenuOpen ? "header__menu_opened" : ""}`}
        >
          <button
            type="button"
            className={`header__menu-button ${
              isMenuOpen ? "header__menu-button_opened" : ""
            }`}
            onClick={onMenuOpen}
          ></button>

          {/* conditionally render "Add Restaurant" button based on current path
          so it only displays on Profile page */}
          {currentUrl.pathname !== "/" && (
            <button
              type="button"
              className={`header__add-restaurant-button ${
                !isMenuOpen
                  ? "header__add-restaurant-button_type_menu-closed"
                  : ""
              }`}
              onClick={handleAddModalClick}
            >
              + Add Restaurant
            </button>
          )}

          <Link to="/profile" className="header__link">
            <div
              className={`header__user-container ${
                !isMenuOpen ? "header__user-container_type_menu-closed" : ""
              }`}
            >
              <p className="header__username">Terrence Tegegne</p>
              <img
                src={avatar}
                alt="default avatar"
                className="header__avatar"
              />
            </div>
          </Link>
        </div>
      </div>
      {/* conditionally render SearchBarForm on 2nd row based on current path
       so it only displays on Main page */}
      {currentUrl.pathname === "/" && (
        <div className="header__bottom-row">
          <SearchBarForm
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
            onSearchSubmit={onSearchSubmit}
            isSearching={isSearching}
          />
        </div>
      )}
    </header>
  );
}

export default Header;
