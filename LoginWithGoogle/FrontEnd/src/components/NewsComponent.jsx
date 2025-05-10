import React, { useState, useEffect } from "react";
import { getTopHeadlines } from "../services/newsService";

const NewsComponent = ({ country }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopHeadlines(country);
        setArticles(data.articles || []);
      } catch (err) {
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [country]);

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="news-container">
      <h2>Top Headlines {country ? `in ${country.toUpperCase()}` : ""}</h2>
      {articles.length === 0 ? (
        <p>No news available for this country.</p>
      ) : (
        <div className="articles">
          {articles.map((article, index) => (
            <div key={index} className="article">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="article-image"
                />
              )}
              <h3>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {article.title}
                </a>
              </h3>
              <p>{article.description || "No description available."}</p>
              <p className="source">
                {article.source.name} •{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsComponent;
