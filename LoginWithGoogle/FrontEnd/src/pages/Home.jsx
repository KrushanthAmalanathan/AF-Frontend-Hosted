import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CountryCard from '../components/CountryCard'
import SkeletonCard from '../components/SkeletonCard'
import StatsDashboard from '../components/StatsDashboard'
import {
  getAllCountries,
  searchCountriesByName,
  getCountriesByRegion,
} from '../services/api'

export default function Home() {
  const [countries, setCountries] = useState([])
  const [displayedCountries, setDisplayedCountries] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const INITIAL_LIMIT = 16

  useEffect(() => {
    ;(async () => {
      try {
        await new Promise((r) => setTimeout(r, 2000))
        const data = await getAllCountries()
        setCountries(data)
        setDisplayedCountries(data.slice(0, INITIAL_LIMIT))
      } catch {
        setError('Failed to load countries')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSearch = async (query) => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      const data = query.trim()
        ? await searchCountriesByName(query)
        : await getAllCountries()
      setCountries(data)
      setDisplayedCountries(data.slice(0, INITIAL_LIMIT))
      setShowAll(false)
      setError(null)
    } catch {
      setError('No countries found')
      setCountries([])
      setDisplayedCountries([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async (region) => {
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 2000))
      const data = region
        ? await getCountriesByRegion(region)
        : await getAllCountries()
      setCountries(data)
      setDisplayedCountries(data.slice(0, INITIAL_LIMIT))
      setShowAll(false)
      setError(null)
    } catch {
      setError('No countries found for this region')
      setCountries([])
      setDisplayedCountries([])
    } finally {
      setLoading(false)
    }
  }

  const handleShowAll = () => {
    setDisplayedCountries(countries)
    setShowAll(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleSearch} onFilter={handleFilter} />

      {/* Top banner */}
      <div className="w-full flex flex-col md:flex-row items-stretch bg-white p-4">
        <div className="w-full md:w-1/2">
          <img
            src="/map2.png"
            alt="World map"
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Explore Country Details
          </h2>
          <p className="text-gray-800 font-semibold leading-relaxed">
            Discover in-depth information about every country—from demographics and geography to culture and economic indicators.  
            Use the map on the left to navigate visually or scroll down for data summaries and insights.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 flex-grow">
        {/* At-a-Glance Cards */}
        <section className="py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Identity, finance and community for every human.
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* … your four cards … */}
          </div>
        </section>

        {/* Global Stats */}
        <StatsDashboard />

        {/* All Countries (horizontal scroll) */}
        <section className="mt-12">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
            All Countries
          </h1>

          {loading && (
            <div className="flex space-x-4 overflow-x-auto py-4">
              {Array.from({ length: INITIAL_LIMIT }).map((_, i) => (
                <SkeletonCard key={i} className="flex-shrink-0 w-64" />
              ))}
            </div>
          )}

          {error && (
            <p className="text-center text-red-500 py-8">{error}</p>
          )}

          {!loading && !error && displayedCountries.length === 0 && (
            <p className="text-center text-gray-600 py-8">
              No countries match your search or filter.
            </p>
          )}

          {!loading && !error && displayedCountries.length > 0 && (
            <>
              <div className="flex space-x-6 overflow-x-auto py-4">
                {displayedCountries.map((c) => (
                  <div key={c.cca3} className="flex-shrink-0 w-74">
                    <CountryCard country={c} />
                  </div>
                ))}
              </div>

              {!showAll && countries.length > INITIAL_LIMIT && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleShowAll}
                    className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition"
                  >
                    Show All Countries
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Country & Region Insights */}
        <section className="mt-16 bg-gray-50 py-12 px-6 rounded-lg">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start">
            <h2 className="text-xl font-bold md:w-1/3">
              Country & Region Insights
            </h2>
            <p className="mt-4 md:mt-0 md:pl-8 md:w-2/3 text-gray-700 leading-relaxed">
              Dive deeper into regional trends and country-level data: economic indicators, cultural highlights, population dynamics, and more.  
              Filter by region or search by name to uncover the stories behind the numbers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
