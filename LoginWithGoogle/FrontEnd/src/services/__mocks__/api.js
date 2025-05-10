const mockCountries = [
  {
    cca3: "CAN",
    name: { common: "Canada", official: "Canada" },
    capital: ["Ottawa"],
    region: "Americas",
    population: 38000000,
    flags: { png: "https://flagcdn.com/ca.png" },
    languages: { eng: "English", fra: "French" },
  },
  {
    cca3: "AUS",
    name: { common: "Australia", official: "Commonwealth of Australia" },
    capital: ["Canberra"],
    region: "Oceania",
    population: 26000000,
    flags: { png: "https://flagcdn.com/au.png" },
    languages: { eng: "English" },
  },
];

export const getAllCountries = jest.fn().mockResolvedValue(mockCountries);
export const searchCountriesByName = jest.fn().mockImplementation((name) => {
  const filtered = mockCountries.filter((country) =>
    country.name.common.toLowerCase().includes(name.toLowerCase())
  );
  return Promise.resolve(filtered);
});
export const getCountriesByRegion = jest.fn().mockImplementation((region) => {
  const filtered = mockCountries.filter((country) => country.region === region);
  return Promise.resolve(filtered);
});
export const getCountryByCode = jest.fn().mockImplementation((code) => {
  const country = mockCountries.find((country) => country.cca3 === code);
  return Promise.resolve(country);
});
