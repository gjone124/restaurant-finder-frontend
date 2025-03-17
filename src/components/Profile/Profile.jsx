import RestaurantSection from "../RestaurantSection/RestaurantSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  onCardClick,
  handleAddModalClick,
  handleEditProfileModalClick,
  restaurantItems,
}) {
  return (
    <div className="profile">
      <section className="profile__side-bar">
        <SideBar handleEditProfileModalClick={handleEditProfileModalClick} />
      </section>
      <section className="profile__restaurant-section">
        <RestaurantSection
          onCardClick={onCardClick}
          handleAddModalClick={handleAddModalClick}
          restaurantItems={restaurantItems}
        />
      </section>
    </div>
  );
}

export default Profile;
