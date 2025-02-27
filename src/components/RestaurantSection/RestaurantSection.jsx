import "./RestaurantSection.css";
import { defaultRestaurantItems } from "../../utils/constants";
import ItemCard from "../ItemCard/ItemCard";

function RestaurantSection({
  onCardClick,
  handleAddModalClick,
  restaurantItems,
}) {
  return (
    <div className="restaurant-section">
      <div className="restaurant-section__header">
        <p className="restaurant-section__title">
          Restaurants That Interest You
        </p>
        <button
          className={"restaurant-section__button"}
          onClick={handleAddModalClick}
        >
          + Add New
        </button>
      </div>
      <ul className="restaurant-section__items">
        {restaurantItems.map((selectedItem) => {
          return (
            <ItemCard
              key={selectedItem._id}
              item={selectedItem}
              onCardClick={onCardClick}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default RestaurantSection;
