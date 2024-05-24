import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import ComparisonTable from "./components/ComparisonTable";
import Popup from "./components/Popup";

function App() {
  // const [valueSets, setValueSets] = useState([]);
  const [filteredValueSets, setFilteredValueSets] = useState([]);
  const [selectedValueSets, setSelectedValueSets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("id");
  const [selectedPopupValueSet, setSelectedPopupValueSet] = useState(null);

  // get all value sets
  const fetchValueSets = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/value-sets");
      setFilteredValueSets(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValueSetClick = (valueSet) => {
    setSelectedValueSets((prev) => {
      if (prev.includes(valueSet)) {
        return prev.filter((vs) => vs !== valueSet);
      } else if (prev.length < 2) {
        return [...prev, valueSet];
      } else {
        return [prev[1], valueSet];
      }
    });
  };

  const handleCloseComparison = () => {
    setSelectedValueSets([]);
  };

  const handlePopupButtonClick = (valueSet) => {
    setSelectedPopupValueSet(valueSet);
  };

  const handleClosePopup = () => {
    setSelectedPopupValueSet(null);
  };

  // handle the search logic
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchType === "id") {
        const response = await axios.get(`/api/value-sets/${searchQuery}`);
        setFilteredValueSets(response.data ? [response.data] : []); // Convert the response data to an array
      } else if (searchType === "name") {
        const newSearchQuery = encodeURI(
          searchQuery.toString().replace(/%/g, "~~pct~~")
        );

        const response = await axios.get(
          `/api/value-sets/name/${newSearchQuery}`
        );

        setFilteredValueSets(response.data ? response.data : []); // Convert the response data to an array
      } else if (searchType === "medicationName") {
        const newSearchQuery = encodeURI(
          searchQuery.toString().replace(/%/g, "~~pct~~")
        );

        const response = await axios.get(
          `/api/value-sets/medication-name/${newSearchQuery}`
        );
        setFilteredValueSets(response.data ? response.data : []); // Convert the response data to an array
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //set search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // set search type
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  // handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="App">
      <h1>Value Sets Searching System</h1>
      <button onClick={fetchValueSets} className="show-all-button">
        Show All Value Sets
      </button>
      <form onSubmit={handleSearchSubmit}>
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          className="custom-select"
        >
          <option value="id">Search by a Value Set ID</option>
          <option value="name">Search by a Value Set Name</option>
          <option value="medicationName">Search by a Medication Name</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Enter your search query"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {filteredValueSets.length ? (
        <p>Showing {filteredValueSets.length} value sets</p>
      ) : (
        <p>No value set to show</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {filteredValueSets.map((valueSet) => (
            <li
              key={valueSet.value_set_id}
              onClick={() => handleValueSetClick(valueSet)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedValueSets.includes(valueSet)
                  ? "#ccc"
                  : "transparent",
              }}
            >
              {valueSet.value_set_name}
              <button
                className="show-details-button"
                onClick={() => handlePopupButtonClick(valueSet)}
              >
                Show Details
              </button>
            </li>
          ))}
        </ul>
      )}
      {filteredValueSets.length > 1 && selectedValueSets.length === 2 && (
        <div>
          <ComparisonTable
            valueSets={selectedValueSets}
            onClose={handleCloseComparison}
          />
          {/* <button onClick={handleCloseComparison} className="close-button">
            Close Comparison
          </button> */}
        </div>
      )}
      {selectedPopupValueSet && (
        <Popup valueSet={selectedPopupValueSet} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default App;
