import "./ItemCard.css";

function ItemCard({ item, onCardClick }) {
  const handleCardClick = () => {
    onCardClick(item);
  };

  return (
    <li className="item-card" onClick={handleCardClick}>
      <div className="item-card__content">
        <h2 className="item-card__restaurant-name">{item.name}</h2>
        <p className="item-card__restaurant-cuisine">
          {item.cuisine || "Unknown"} Cuisine
        </p>
        <p className="item-card__restaurant-address">{item.address}</p>
        <p className="item-card__restaurant-website">
          {item.website === "No website available" ? (
            "No website available"
          ) : (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </a>
          )}
        </p>
        {item.distance && (
          <p className="item-card__distance">
            Distance From User in Miles: {item.distance}
          </p>
        )}
      </div>
      <div className="item-card__image-container">
        <img
          src={item.image}
          alt={item.name}
          className="item-card__restaurant-image"
        />
      </div>
    </li>
  );
}

export default ItemCard;
