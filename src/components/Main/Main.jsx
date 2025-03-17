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
              Based on your search and current location, here are the 6 closest
              restaurants to you from closest to farthest:
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
            <h1 className="main__empty-state-header">
              Welcome to Restaurant Finder
            </h1>
            <p>Search for restaurants above to get started</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Main;
