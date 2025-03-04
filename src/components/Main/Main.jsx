import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";

function Main({ onCardClick, restaurantItems }) {
  console.log(restaurantItems);
  return (
    <main>
      <section className="main">
        {restaurantItems.length > 0 ? (
          <>
            <p className="main__text">
              Based on your search, here are the restaurants we found:
            </p>
            <ul className="main__items">
              {restaurantItems
                // "+" next to "a.distance" parses the string into a numeric value
                .sort((a, b) => +a.distance - +b.distance)
                .map((selectedItem) => {
                  return (
                    <ItemCard
                      key={selectedItem.id}
                      item={selectedItem}
                      onCardClick={onCardClick}
                    />
                  );
                })}
            </ul>
          </>
        ) : (
          <div className="main__empty-state">
            <h2>Welcome to Restaurant Finder</h2>
            <p>Search for restaurants above to get started</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Main;
