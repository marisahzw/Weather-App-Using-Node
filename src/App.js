
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInfo from './WeatherInfo';


const API_KEY = '94a8dbb0742a43a3788eba322b441732';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
  
    fetchData('Toronto');
  }, []);

  const fetchData = async (location) => {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

 

  return (
    <div>

      {weatherData && (
        <>
          <WeatherInfo weatherData={weatherData} />
     
        </>
      )}
    </div>
  );
};

export default App;
