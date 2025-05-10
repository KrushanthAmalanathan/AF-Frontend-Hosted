import React, { useState, useEffect } from "react";
import { getCountryByCode } from "../services/api";
import { X } from "lucide-react";

export default function CompareModal({ isOpen, onClose }) {
  const [compareList, setCompareList] = useState([]);
  const [countries, setCountries] = useState([]);

  // load list when opening
  useEffect(() => {
    if (isOpen) {
      const list = JSON.parse(localStorage.getItem("compareList") || "[]");
      setCompareList(list);
    }
  }, [isOpen]);

  // fetch both country details
  useEffect(() => {
    if (compareList.length > 0) {
      Promise.all(compareList.map((c) => getCountryByCode(c.cca3)))
        .then(setCountries)
        .catch(console.error);
    }
  }, [compareList]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-6">Compare Countries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {countries.map((c) => (
            <div key={c.cca3} className="border p-4 rounded space-y-2">
              <h3 className="text-lg font-semibold">{c.name.common}</h3>
              <p>
                <span className="font-semibold">Capital:</span>{" "}
                {c.capital?.[0] || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Region:</span> {c.region}
              </p>
              <p>
                <span className="font-semibold">Population:</span>{" "}
                {c.population.toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Area:</span>{" "}
                {c.area.toLocaleString()} km²
              </p>
              <p>
                <span className="font-semibold">Languages:</span>{" "}
                {c.languages
                  ? Object.values(c.languages).join(", ")
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
