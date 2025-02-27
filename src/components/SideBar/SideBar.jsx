import "./SideBar.css";
import avatar from "../../assets/avatar.svg";

function SideBar({ handleEditProfileModalClick }) {
  return (
    <div className="side-bar">
      <div className="side-bar__user-info">
        <img className="side-bar__avatar" src={avatar} alt="default avatar" />
        <p className="side-bar__username">Terrence Tegegne</p>
      </div>
      <div className="side-bar__options">
        {" "}
        <button
          className="side-bar__button"
          type="button"
          onClick={handleEditProfileModalClick}
        >
          Change profile data
        </button>
        <button
          className="side-bar__button"
          type="button"
          // onClick={handleLogOut}
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
