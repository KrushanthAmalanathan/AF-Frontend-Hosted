import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Heart } from "lucide-react";

function CountryCard({ country }) {
  const { user } = useAuth();
  const { name, capital, region, population, flags, languages, cca3 } = country;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favs.includes(cca3));
    }
  }, [user, cca3]);

  const toggleFavorite = () => {
    if (!user) return alert("Please log in to add favorites");
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = isFavorite ? favs.filter(c => c !== cca3) : [...favs, cca3];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <article className="relative max-w-sm mx-auto h-64 rounded-2xl overflow-hidden shadow-xl">
      {/* Blurred background image */}
      <img
        src="/map1.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      {/* Light overlay for contrast */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>

      {/* Content */}
      <Link
        to={`/country/${cca3}`}
        className="relative z-10 flex h-full text-gray-900"
        aria-label={`View details for ${name.common}`}
      >
        {/* Flag */}
        <div className="w-1/2 flex items-center justify-center p-4">
          <img
            src={flags.png}
            alt={`Flag of ${name.common}`}
            className="h-20 w-auto object-cover rounded-lg border-2 border-white shadow"
          />
        </div>

        {/* Details */}
        <div className="w-1/2 p-4 flex flex-col justify-center space-y-1">
          <h2 className="text-xl font-bold">{name.common}</h2>
          <p className="text-sm">
            <span className="font-semibold">Capital:</span> {capital?.[0] || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Region:</span> {region}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Population:</span> {population.toLocaleString()}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Languages:</span>{" "}
            {languages ? Object.values(languages).join(", ") : "N/A"}
          </p>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition z-10"
        aria-label={
          isFavorite
            ? `Remove ${name.common} from favorites`
            : `Add ${name.common} to favorites`
        }
      >
        <Heart
          size={18}
          className={
            isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-500"
          }
        />
      </button>
    </article>
  );
}

export default CountryCard;
