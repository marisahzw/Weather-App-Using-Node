
import React, { useState, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import axios from 'axios';
import './WeatherInfo.css';

const API_KEY = '94a8dbb0742a43a3788eba322b441732';

const formatDate = (timestamp) => {
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', options);
};

const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

const WeatherInfo = ({ weatherData }) => {
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState(weatherData.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyForecast(currentLocation);
  }, [currentLocation]);

  const fetchWeeklyForecast = async (location) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`);
      setWeeklyForecast(response.data.list);
      setLoading(false);
    } catch (error) {
      setError('Error fetching weekly forecast data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchLocation.trim() !== "") {
      setCurrentLocation(searchLocation);
    }
  };

  const groupByDay = () => {
    if (!weeklyForecast) return {};

    const grouped = {};
    weeklyForecast.forEach((forecast) => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = {
          temperature: forecast.main.temp,
          icon: forecast.weather[0].icon,
        };
      }
    });
    return grouped;
  };

  const formattedForecast = groupByDay();

  return (
    <div className="weather-info">
      <div className='top-info'>
        <div className="left-section">
          <div className="location-tag">
            <h2>{currentLocation}</h2>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="right-section">
          <div className="today">
            <p className="day">{formatDate(weatherData.dt)}</p>
            <div className="weather-icon">
              <WeatherIcon iconCode={weatherData.weather[0].icon} />
            </div>
            <div className="weather-details">
              <p className="condition">{weatherData.weather[0].description}</p>
              <div className="temperature">
                <p>{kelvinToCelsius(weatherData.main.temp)}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {formattedForecast && (
        <div className="weekly-forecast">
          {Object.entries(formattedForecast).map(([date, data]) => (
            <div key={date} className="daily-forecast">
              <p className="day">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
              <WeatherIcon iconCode={data.icon} />
              <div className="temperature">
                <p>{kelvinToCelsius(data.temperature)}°C</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
