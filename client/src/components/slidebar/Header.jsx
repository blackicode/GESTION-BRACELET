import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/users/search?query=${searchQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error("Erreur lors de la recherche :", error);
        }
      };

      fetchUsers();
    } else {
      setSearchResults([]); // Réinitialiser les résultats si la recherche est vide
    }
  }, [searchQuery]);

  return (
    <header className="bg-blue-600 text-white p-4 flex flex-col items-center">
      {/* Barre de recherche */}
      <form className="flex items-center w-full max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Rechercher..."
          className="w-full p-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
      </form>

      {/* Affichage des résultats */}
      {searchResults.length > 0 && (
        <div className="bg-white text-black w-full max-w-md mt-2 p-2 rounded-md shadow-lg">
          <ul>
            {searchResults.map((user) => (
              <li key={user._id} className="p-2 border-b border-gray-300">
                <strong>{user.firstName} {user.lastName}</strong> - {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
