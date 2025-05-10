import axios from "axios";

const API_KEY = "37797819ab7f440fbbfd7fcfe5ef32ee"; // Replace with your NewsAPI.org API key
const BASE_URL = "https://newsapi.org/v2/top-headlines";

export const getTopHeadlines = async (country) => {
  try {
    console.log(country);
    const response = await axios.get(BASE_URL, {
      params: {
        country: country || "US", // Default to 'us' if no country provided
        apiKey: API_KEY,
        pageSize: 10, // Limit to 10 articles for simplicity
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
