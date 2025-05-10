import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CountryCard from "../components/CountryCard";
import SkeletonCard from "../components/SkeletonCard";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { getCountryByCode } from "../services/api";

function Favorites() {
  const { user, authLoading } = useAuth(); // Use useAuth hook to get user data
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (authLoading) return; // Wait for auth to complete
      console.log("Fetching favorites for user:", user);
      
      try {
        const favoriteCodes = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
        const favoriteCountries = await Promise.all(
          favoriteCodes.map(async (code) => await getCountryByCode(code))
        );
        setFavorites(favoriteCountries);
        setLoading(false);
      } catch (err) {
        setError("Failed to load favorites");
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, authLoading]);

  const handleSearch = (query) => {
    console.log("Search:", query);
  };

  const handleFilter = (region) => {
    console.log("Filter:", region);
  };

  return (
    <div className="min-h-screen pt-24 flex flex-col bg-gray-100">
      <Header onSearch={handleSearch} onFilter={handleFilter} />
      <main className="container max-w-6xl mx-auto flex-grow px-4">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Favorites
        </h1>
        {loading && (
          // Display skeleton cards in the same grid layout
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!user && !loading && (
          <p className="text-center text-gray-600 py-8">
            Please log in to view your favorite countries.
          </p>
        )}
        {user && !loading && !error && favorites.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No favorite countries added yet.
          </p>
        )}
        {user && !loading && !error && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {favorites.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Favorites;
