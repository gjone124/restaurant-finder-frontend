import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import SearchBarForm from "../SearchBarForm/SearchBarForm";
// import { fetchUserLocation } from "../../utils/googlePlacesApi";
import { fetchUserLocation } from "../../utils/locationService";

function Header({ handleAddModalClick, setRestaurantItems }) {
  const [userLocation, setUserLocation] = useState(
    "Fetching user's location..."
  );
  const currentDate = new Date().toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentUrl = useLocation(); // get current Url path (or page route)

  // fetch user's location on component mount (using Google Places API)
  // useEffect(() => {
  //   fetchUserLocation()
  //     .then((locationData) => setUserLocation(locationData.formattedLocation))
  //     .catch((error) => {
  //       console.error("Error fetching user location:", error);
  //       setUserLocation("User's location unavailable");
  //     });
  // }, []);

  // fetch user's location on component mount (using Open Street Map Overpass API)
  useEffect(() => {
    fetchUserLocation()
      .then((locationData) => {
        setUserLocation(locationData.formattedLocation);
      })
      .catch((error) => {
        console.error("Error fetching user location:", error);
        setUserLocation("User's location unavailable");
      });
  }, []);

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
        <div className="header__date-and-location-container">
          <p className="header__date">{currentDate}</p>
          {/* {userLocation} => replace "LOCATION" below this with this value */}
          <p className="header__location">{userLocation}</p>
        </div>
      </div>

      {/* conditionally render SearchBarForm based on current path
      so it only displays on Main page */}
      {currentUrl.pathname !== "/profile" && (
        <SearchBarForm setRestaurantItems={setRestaurantItems} />
      )}

      {/* conditionally render "Add Restaurant" button based on current path
      so it only displays on Profile page */}
      {currentUrl.pathname !== "/" && (
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
