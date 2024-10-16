import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Moon, Star, Droplets } from 'lucide-react';

function Hero() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Error fetching location:', err);
          setError('Unable to fetch your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }

    // Check if it's night time (between 8 PM and 6 AM)
    const currentHour = new Date().getHours();
    setIsNight(currentHour >= 20 || currentHour < 6);
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    const API_KEY = 'ffb6d26a504c2a613ac37c6a4c71cf01'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data');
    }
  };

  const getWeatherIcon = (weatherCode) => {
    if (isNight) {
      return <Moon className="w-8 h-8 text-yellow-200" />;
    }
    switch (true) {
      case weatherCode >= 200 && weatherCode < 300:
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case weatherCode >= 300 && weatherCode < 600:
        return <CloudRain className="w-8 h-8 text-blue-400" />;
      case weatherCode >= 600 && weatherCode < 700:
        return <Snowflake className="w-8 h-8 text-blue-200" />;
      case weatherCode >= 700 && weatherCode < 800:
        return <Wind className="w-8 h-8 text-gray-400" />;
      case weatherCode === 800:
        return <Sun className="w-8 h-8 text-yellow-400" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-between min-h-screen p-8 lg:p-4 mt-8">
      {/* Left Section: Text and Button */}
      <div className="flex flex-col items-start lg:w-3/5 space-y-8 pr-8 pl-8">
        <h1 className="font-extrabold text-5xl lg:text-6xl leading-tight">
          <span className="text-violet-600">Discover Your Next Adventure with AI:</span> <br />
          <span className="text-black">Personalized Itineraries at Your Fingertips</span>
        </h1>
        <p className="text-2xl text-gray-600 italic">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        <Link to="/create-trip">
          <button className="bg-[#160a09] text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-lg mt-4">
            Get Started, It's Free
          </button>
        </Link>
      </div>

      {/* Right Section: Image and Weather Widget */}
      <div className="flex flex-col lg:w-2/5 mt-8 lg:mt-4">
        <div
          className="w-full h-48 lg:h-72 rounded-lg shadow-lg bg-cover bg-center mb-8"
          style={{
            backgroundImage: "url('/landing.png')",
            backgroundRepeat: 'no-repeat'
          }}
          role="img"
          aria-label="Travel Planning"
        ></div>

        {/* Compact Weather Widget with Humidity and Wind Speed */}
        <div className={`w-1/2 rounded-lg shadow-md p-4 text-white ${isNight ? 'bg-gradient-to-br from-indigo-900 to-purple-900' : 'bg-gradient-to-br from-blue-400 to-purple-500'}`}>
          {weather ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-lg font-semibold">{weather.name}</p>
                  <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°F</p>
                </div>
                <div className="flex flex-col items-center">
                  {getWeatherIcon(weather.weather[0].id)}
                  <p className="text-xs mt-1 capitalize">{weather.weather[0].description}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 mr-1" />
                  <span>{weather.main.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="w-4 h-4 mr-1" />
                  <span>{Math.round(weather.wind.speed)} mph</span>
                </div>
              </div>
              {isNight && (
                <div className="absolute top-2 right-2">
                  <Star className="w-4 h-4 text-yellow-200" />
                  <Star className="w-3 h-3 text-yellow-200 absolute top-3 right-3" />
                  <Star className="w-2 h-2 text-yellow-200 absolute bottom-1 left-1" />
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm">{error || 'Fetching weather...'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;