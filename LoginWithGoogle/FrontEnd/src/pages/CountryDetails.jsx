import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsComponent from "../components/NewsComponent";
import useWeatherCoords from "../hooks/useWeather";
import { getCountryByCode } from "../services/api";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; // Adjust path if needed
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// point Axios at your backend
axios.defaults.baseURL = "http://localhost:5559";

const { user } = useAuth(); // `user` is null if not logged in

export default function CountryDetails() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    image: null,
    description: "",
  });

  // 1) load country
  useEffect(() => {
    (async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch {
        setError("Failed to load country details");
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  // coords
  const capital = country?.capital?.[0] || "";
  const [lat, lon] = country?.latlng || [null, null];

  // 2) current weather
  const { weather, loading: wxLoading, error: wxError } =
    useWeatherCoords(lat, lon);

  // 3) forecast
  useEffect(() => {
    if (lat == null || lon == null) return;
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
    )
      .then((r) => r.json())
      .then((json) => {
        setHourlyData(
          json.list.slice(0, 12).map((h) => ({
            time: new Date(h.dt * 1000).getHours() + ":00",
            temp: h.main.temp,
          }))
        );
        setDailyData(
          json.list
            .filter((f) => f.dt_txt.endsWith("12:00:00"))
            .slice(0, 5)
            .map((d) => ({
              dt: d.dt,
              temp: d.main.temp,
              icon: d.weather[0].icon,
              date: new Date(d.dt * 1000),
            }))
        );
      })
      .catch(console.error);
  }, [lat, lon]);

  // 4) load articles
  useEffect(() => {
    axios
      .get(`/api/articles/country/${code}`)
      .then((res) => Array.isArray(res.data) && setArticles(res.data))
      .catch(console.error);
  }, [code]);

  // 5) submit new article
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", newArticle.title);
    form.append("description", newArticle.description);
    if (newArticle.image) form.append("image", newArticle.image);

    try {
      await axios.post(`/api/articles/country/${code}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNewArticle({ title: "", image: null, description: "" });
      const { data } = await axios.get(`/api/articles/country/${code}`);
      if (Array.isArray(data)) setArticles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (q) => console.log("Search:", q);
  const handleFilter = (r) => console.log("Filter:", r);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onSearch={handleSearch} onFilter={handleFilter} />

      <main className="container mx-auto p-6 flex-grow">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 rounded px-4 py-2 bg-white shadow hover:bg-gray-100"

        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* country + weather */}
        {loading && <div className="animate-pulse bg-white p-8 rounded-lg" />}
        {error && <div className="text-red-500">{error}</div>}
        {country && (
          <article className="bg-white p-6 rounded-lg shadow mb-10">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={country.flags.png}
                alt={`Flag of ${country.name.common}`}
                className="w-full md:w-1/2 h-64 object-cover rounded-lg"
              />
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl font-bold">{country.name.common}</h1>
                {/* stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Stat label="Official Name" value={country.name.official} />
                  <Stat label="Capital" value={capital} />
                  <Stat label="Region" value={country.region} />
                  <Stat label="Subregion" value={country.subregion || "N/A"} />
                  <Stat label="Population" value={country.population.toLocaleString()} />
                  <Stat label="Area" value={`${country.area.toLocaleString()} km²`} />
                  <Stat
                    label="Languages"
                    value={
                      country.languages
                        ? Object.values(country.languages).join(", ")
                        : "N/A"
                    }
                  />
                  <Stat
                    label="Currencies"
                    value={
                      country.currencies
                        ? Object.values(country.currencies)
                          .map((c) => c.name)
                          .join(", ")
                        : "N/A"
                    }
                  />
                </div>
                {/* weather panels */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Current Weather</h2>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-1 text-sm">
                      {wxLoading && <p>Loading…</p>}
                      {wxError && <p className="text-red-500">Failed</p>}
                      {weather && (
                        <>
                          <p>🌡 {weather.main.temp}°C</p>
                          <p>💧 {weather.main.humidity}%</p>
                          <p>🍃 {weather.wind.speed} m/s</p>
                          <p>📈 {weather.main.pressure} hPa</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Hourly Trend</h2>
                    <div className="h-32 w-full">
                      <ResponsiveContainer>
                        <LineChart data={hourlyData}>
                          <XAxis dataKey="time" fontSize={10} />
                          <Tooltip formatter={(v) => `${v}°C`} />
                          <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#3b82f6"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
                    <div className="flex space-x-2 overflow-x-auto">
                      {dailyData.map((d) => (
                        <div
                          key={d.dt}
                          className="bg-white p-2 rounded-lg shadow text-center min-w-[70px] text-sm"
                        >
                          <p className="font-semibold">
                            {d.date.toLocaleDateString(undefined, {
                              weekday: "short",
                            })}
                          </p>
                          <img
                            src={`http://openweathermap.org/img/wn/${d.icon}.png`}
                            alt=""
                            className="mx-auto"
                          />
                          <p>{Math.round(d.temp)}°C</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* community articles */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Community Articles</h2>

          {user ? (
            <form onSubmit={handleArticleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
              <input
                type="text"
                placeholder="Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                className="border p-2 w-full mb-2"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewArticle({ ...newArticle, image: e.target.files[0] })}
                className="mb-2"
              />
              <textarea
                placeholder="Description"
                value={newArticle.description}
                onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                className="border p-2 w-full mb-2"
                required
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Post Article
              </button>
            </form>
          ) : (
            <div className="bg-white text-center p-4 rounded-lg shadow mb-6 text-gray-500 italic">
              Please sign in to post an article.
            </div>
          )}


          {articles.map((art) => (
            <ArticleCard
              key={art._id}
              article={art}
              onArticleUpdated={(u) =>
                setArticles((a) => a.map((x) => (x._id === u._id ? u : x)))
              }
            />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

// each article + its comments
function ArticleCard({ article, onArticleUpdated }) {
  const [comments, setComments] = useState(article.comments || []);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  // like article
  const likeArt = async () => {
    const { data } = await axios.post(`/api/articles/like/${article._id}`);
    onArticleUpdated(data);
  };

  // post comment
  const postComment = async (parentId = null) => {
    await axios.post(`/api/comments/${article._id}`, {
      content: replyText,
      parentId,
    });
    setReplyText("");
    setReplyTo(null);
    const { data } = await axios.get(`/api/comments/${article._id}`);
    setComments(data);
    onArticleUpdated({ ...article, comments: data });
  };

  // like comment
  const likeComment = async (cid) => {
    const { data } = await axios.post(`/api/comments/like/${cid}`);
    setComments((cs) => cs.map((c) => (c._id === data._id ? data : c)));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 text-left">
      <h3 className="text-xl font-semibold text-center mb-2">
        {article.title}
      </h3>

      {article.imageUrl && (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-84 object-cover rounded-md mb-4"
        />
      )}

      <p className="mb-4">{article.description}</p>

      <div className="flex items-center justify-between mb-4 text-sm">
        <button
          onClick={likeArt}
          className="flex items-center gap-1 text-red-500"
        >
          👍 {article.likes}
        </button>
        <span className="text-gray-600">{comments.length} comments</span>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="pl-1 text-sm">
            <p className="mb-1">{c.content}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setReplyTo(c._id)}
                className="text-gray-500 hover:underline"
              >
                Reply
              </button>
              <button
                onClick={() => likeComment(c._id)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Heart fill="red" size={16} /> {c.likes}
              </button>
            </div>

            {replyTo === c._id && (
              <div className="pl-4 mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border p-1 flex-grow"
                  placeholder="Your reply…"
                />
                <button
                  onClick={() => postComment(c._id)}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  Post
                </button>
              </div>
            )}
          </div>
        ))}

        {/* top-level comment box */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="border p-1 flex-grow"
            placeholder="Add a comment…"
          />
          <button
            onClick={() => postComment(null)}
            className="bg-blue-600 text-white px-3 rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-base text-gray-800">{value}</span>
    </div>
  );
}
