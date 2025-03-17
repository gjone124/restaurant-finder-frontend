import avatar from "../../assets/avatar.svg";
import "./SideBar.css";

function SideBar({ handleEditProfileModalClick }) {
  return (
    <div className="side-bar">
      {/* Desktop View */}
      <div className="side-bar__user-info">
        <img className="side-bar__avatar" src={avatar} alt="default avatar" />
        <p className="side-bar__username">Terrence Tegegne</p>
      </div>
      <div className="side-bar__options">
        <button
          className="side-bar__button"
          type="button"
          onClick={handleEditProfileModalClick}
        >
          Change profile data
        </button>
        <button className="side-bar__button" type="button">
          Log out
        </button>
      </div>

      {/* Mobile View */}
      <div className="side-bar__mobile-view">
        <img className="side-bar__avatar" src={avatar} alt="default avatar" />
        <div className="side-bar__mobile-info">
          <p className="side-bar__username">Terrence Tegegne</p>
          <div className="side-bar__mobile-buttons">
            <button
              className="side-bar__button"
              type="button"
              onClick={handleEditProfileModalClick}
            >
              Change profile data
            </button>
            <button className="side-bar__button" type="button">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
