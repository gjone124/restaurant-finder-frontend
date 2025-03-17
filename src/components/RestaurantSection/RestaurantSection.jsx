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
        <h1 className="restaurant-section__title">
          Restaurants That Interest You
        </h1>
        <button
          className={"restaurant-section__button"}
          onClick={handleAddModalClick}
        >
          + Add New
        </button>
      </div>

      <ul className="restaurant-section__items">
        {defaultRestaurantItems.map((selectedItem) => {
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
