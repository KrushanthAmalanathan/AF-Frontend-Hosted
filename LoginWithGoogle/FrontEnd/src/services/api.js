import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

// Fetch all countries
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all countries:", error);
    throw error;
  }
};

export const searchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error searching countries by name:", error);
    throw error;
  }
};

export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching countries by region:", error);
    throw error;
  }
};

export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country by code:", error);
    throw error;
  }
};
