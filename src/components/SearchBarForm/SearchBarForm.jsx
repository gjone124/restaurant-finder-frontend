import "./SearchBarForm.css";

const SearchBarForm = ({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  isSearching,
}) => {
  const handleChange = (e) => {
    onSearchQueryChange(e.target.value);
  };

  return (
    <form onSubmit={onSearchSubmit} className="search-bar-form">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Search For Restaurant(s) Here"
        className="search-bar-form__search-bar"
      />
      <button className="search-bar-form__search-button" disabled={isSearching}>
        {isSearching ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBarForm;
