import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../Home";
import { AuthContext } from "../../context/AuthContext";
import * as api from "../../services/api";

jest.mock("../../services/api");

const mockCountries = [
  {
    cca3: "CAN",
    name: { common: "Canada" },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38000000,
    flags: { png: "https://flagcdn.com/ca.png" },
    languages: { eng: "English" },
  },
  {
    cca3: "AUS",
    name: { common: "Australia" },
    capital: ["Canberra"],
    region: "Oceania",
    population: 25000000,
    flags: { png: "https://flagcdn.com/au.png" },
    languages: { eng: "English" },
  },
];

test("renders loading state initially", () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading countries...")).toBeInTheDocument();
});

test("renders countries after API call", async () => {
  api.getAllCountries.mockResolvedValueOnce(mockCountries);

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("Australia")).toBeInTheDocument();
  });
});

test("displays error on API failure", async () => {
  api.getAllCountries.mockRejectedValueOnce(new Error("API error"));

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Failed to load countries")).toBeInTheDocument();
  });
});

test("filters countries by search", async () => {
  api.getAllCountries.mockResolvedValueOnce(mockCountries);
  api.searchCountriesByName.mockResolvedValueOnce([mockCountries[0]]); // Only Canada for search

  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <Home />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("Australia")).toBeInTheDocument();
  });

  const searchInput = screen.getByPlaceholderText("Search for a country...");
  fireEvent.change(searchInput, { target: { value: "Canada" } });

  await waitFor(() => {
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.queryByText("Australia")).not.toBeInTheDocument();
  });
});
