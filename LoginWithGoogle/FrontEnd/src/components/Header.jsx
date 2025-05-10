import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import the custom hook
import { LogOut, Search } from "lucide-react";
import logo from "../assets/logo.png"; // Adjust the path to your logo

function Header({ onSearch, onFilter }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(""); // State for selected region
  const { user, logout } = useAuth(); // Using useAuth hook here
  const navigate = useNavigate();
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  // Handle scroll and Escape key
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 50);
      setLastScrollY(currentScrollY);
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setIsRegionDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [lastScrollY]);

  // Unified navigation handler
  const navigateAndClose = (path) => {
    if (path === "logout") {
      logout();
      path = "/";
    }
    navigate(path);
    setMenuOpen(false);
    setIsRegionDropdownOpen(false);
  };

  // Handle region selection
  const handleRegionSelect = (region) => {
    console.log("Selected region:", region); // Debug log
    setSelectedRegion(region);
    onFilter(region);
    setIsRegionDropdownOpen(false);
  };

  // Menu item component
  const MenuItem = ({ path, label, isButton, isLogout, isMobile }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        navigateAndClose(path);
      }}
      className={
        isButton
          ? `px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-base font-medium rounded-md transition-colors duration-200 ${
              isMobile ? "w-full text-center" : ""
            }`
          : `flex items-center gap-1 text-gray-700 hover:text-black text-base font-medium transition-colors duration-200 ${
              isMobile ? "text-center py-2 w-full" : ""
            }`
      }
      aria-label={isLogout ? "Sign out of your account" : label}
    >
      {isLogout && (
        <LogOut size={16} className="text-gray-700 hover:text-black" />
      )}
      {label}
    </a>
  );

  // Region dropdown item component
  const RegionDropdownItem = ({ label }) => (
    <button
      onClick={() => handleRegionSelect(label)}
      className="block w-full text-left py-2 px-3 rounded-lg text-base text-gray-800 hover:bg-gray-100"
    >
      {label}
    </button>
  );

  // Menu items configuration
  const menuItems = [
    { path: "/favorites", label: "Favorites" },
    ...(user
      ? [
          {
            path: "logout",
            label: "Sign Out",
            isButton: false,
            isLogout: true,
          },
        ]
      : [{ path: "/login", label: "Login", isButton: true }]),
  ];

  return (
    <header
      className={`bg-white mx-auto max-w-full px-4 sm:px-6 md:px-8 py-5 fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center mx-auto max-w-1xl justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            setMenuOpen(false);
            setIsRegionDropdownOpen(false);
            setSelectedRegion("");
            onFilter("");
            console.log("Reset filter to: ''"); // Debug log
          }}
          className="flex items-center space-x-2"
        >
          <img
            src={logo}
            alt="REST Countries Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="text-2xl font-bold text-black">REST Countries</span>
        </Link>

        {/* Hamburger/Close Menu */}
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            setIsRegionDropdownOpen(false);
          }}
          className="md:hidden text-gray-800 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 rounded-md"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Input */}
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search for a country..."
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          {/* Region Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="min-w-48 inline-flex items-center gap-x-2 text-base font-medium rounded-lg bg-gray-100 border border-gray-200 px-3 py-2 text-gray-800 focus:outline-none hover:bg-gray-200"
              aria-haspopup="menu"
              aria-expanded={isRegionDropdownOpen}
              aria-label="Filter by region"
            >
              {selectedRegion || "Filter by Region"}
              <svg
                className={`w-4 h-4 ml-auto ${isRegionDropdownOpen ? "rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isRegionDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg z-50">
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => handleRegionSelect("")}
                    className="block w-full text-left py-2 px-3 rounded-lg text-base text-gray-800 hover:bg-gray-100"
                  >
                    All Regions
                  </button>
                  {regions.map((region) => (
                    <RegionDropdownItem key={region} label={region} />
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Navigation Links */}
          {menuItems.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
          {/* User Greeting */}
          {user && (
            <span className="text-base font-medium text-gray-700">
              Hi, {user.username}
            </span>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col mt-4 space-y-4 px-4 pb-4">
          {/* Search Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search for a country..."
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
