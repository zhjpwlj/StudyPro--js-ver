import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, MoonIcon, MapPinIcon, MicrophoneIcon, SnowflakeIcon } from './icons/Icons.jsx';
import useDictation from '../hooks/useDictation.js';

const wmoCodeToCondition = (code) => {
    if (code === 0) return 'Sunny';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'Snow';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Cloudy'; // Default
};

const PartCloudyIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const RainIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 14v1"/><path d="M8 19v1"/><path d="M12 14v1"/><path d="M12 19v1"/><path d="M16 14v1"/><path d="M16 19v1"/></svg>;
const ThunderstormIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.74 18A5.002 5.002 0 0 0 17 13h-1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h2.74a4 4 0 0 1 4 4Z"/><path d="M13 12a5.002 5.002 0 0 0-5-5h-1a4 4 0 0 0-4 4v2a4 4 0 0 0 4 4h5"/><path d="m13.5 18.5-2-4-2 3h4l-2 4"/></svg>;

const WeatherConditionIcon = ({ condition, isDay = true, className = "w-6 h-6" }) => {
    switch (condition.toLowerCase()) {
        case 'sunny': return isDay ? <SunIcon className={className} /> : <MoonIcon className={className}/>;
        case 'partly cloudy':
        case 'cloudy':
        case 'fog':
             return <PartCloudyIcon className={className} />;
        case 'rain':
        case 'showers':
             return <RainIcon className={className} />;
        case 'thunderstorm': return <ThunderstormIcon className={className} />;
        case 'snow': return <SnowflakeIcon className={className} />;
        default: return <PartCloudyIcon className={className} />;
    }
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [locationInput, setLocationInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [inputError, setInputError] = useState(false);
    
    const editLocationRef = useRef(null);
    const { isListening, start, stop, hasRecognitionSupport } = useDictation();
    
    const fetchWeather = async (lat, lon, name) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`);
            const data = await response.json();

            if (data.error) throw new Error(data.reason);

            const formattedData = {
                city: name,
                temp: Math.round(data.current.temperature_2m),
                condition: wmoCodeToCondition(data.current.weather_code),
                isDay: data.current.is_day === 1,
                high: Math.round(data.daily.temperature_2m_max[0]),
                low: Math.round(data.daily.temperature_2m_min[0]),
                forecast: data.daily.time.slice(1, 6).map((day, index) => ({
                    day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
                    condition: wmoCodeToCondition(data.daily.weather_code[index + 1]),
                    high: Math.round(data.daily.temperature_2m_max[index + 1]),
                }))
            };
            setWeather(formattedData);
        } catch (e) {
            setError(e.message || "Failed to fetch weather data.");
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchCoordinates = async (cityName) => {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { latitude, longitude, name, admin1 } = data.results[0];
                return { lat: latitude, lon: longitude, name: admin1 ? `${name}, ${admin1}` : name };
            }
            return null;
        } catch (e) {
            console.error("Failed to fetch coordinates", e);
            return null;
        }
    };

    useEffect(() => {
        const loadInitialWeather = () => {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(`https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`);
                        const data = await response.json();
                        const cityName = data.address?.city || data.address?.town || data.address?.village || "Your Location";
                        await fetchWeather(latitude, longitude, cityName);
                    } catch {
                        await fetchWeather(latitude, longitude, "Your Location");
                    }
                },
                async () => {
                    setError("Location access denied. Using default.");
                    const coords = await fetchCoordinates('San Francisco');
                    if (coords) await fetchWeather(coords.lat, coords.lon, coords.name);
                    else setError("Failed to load default location.");
                }
            );
        };
        loadInitialWeather();
    }, []);
    
    useEffect(() => {
        if (locationInput.length < 3 || isListening) {
            setSuggestions([]);
            return;
        }
        const handler = setTimeout(async () => {
            try {
                const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}&count=5`);
                const data = await response.json();
                if (data.results) setSuggestions(data.results);
            } catch {
                setSuggestions([]);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [locationInput, isListening]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isEditingLocation && editLocationRef.current && !editLocationRef.current.contains(event.target)) {
                setIsEditingLocation(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditingLocation]);

    const handleLocationSelect = async (location) => {
        const { latitude, longitude, name, admin1 } = location;
        const displayName = admin1 ? `${name}, ${admin1}` : name;
        await fetchWeather(latitude, longitude, displayName);
        setIsEditingLocation(false);
        setLocationInput('');
        setSuggestions([]);
        setInputError(false);
    };

    const handleSearch = async () => {
        if (suggestions.length > 0) {
            handleLocationSelect(suggestions[0]);
        } else {
            const coords = await fetchCoordinates(locationInput);
            if (coords) {
                handleLocationSelect({ latitude: coords.lat, longitude: coords.lon, name: coords.name, admin1: null });
            } else {
                setError(`Cannot find "${locationInput}".`);
                setInputError(true);
            }
        }
    };

    const startDictation = () => {
        setLocationInput('');
        start(async (result, isFinal) => {
            setLocationInput(result);
            if (isFinal && result.trim()) {
                await handleSearch();
            }
        });
    };

    if (loading && !weather) {
        return <div className="h-full flex items-center justify-center">Loading weather...</div>;
    }
    
    if (!weather) {
        return <div className="h-full flex items-center justify-center text-red-500">Could not load weather data.</div>;
    }

    return (
        <div className="relative h-full flex flex-col text-center text-gray-800 dark:text-white bg-gradient-to-br from-primary-200 to-blue-300 dark:from-primary-900 dark:to-blue-950 p-4 rounded-lg -m-4">
            {error && <p className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded z-10">{error}</p>}
            <div className="flex-grow flex flex-col justify-center items-center">
                 <div className="relative">
                    <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => { if (!isEditingLocation) { setLocationInput(''); setError(null); setInputError(false); setIsEditingLocation(true); }}}>
                        <h2 className="text-2xl font-bold">{weather.city}</h2>
                        <MapPinIcon className="w-5 h-5 opacity-0 group-hover:opacity-70 transition-opacity" />
                    </div>
                    {isEditingLocation && (
                        <div ref={editLocationRef} className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-lg shadow-xl p-3 z-20">
                            <div className="relative">
                                <input type="text" placeholder="Search city..." value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className={`w-full bg-black/10 dark:bg-white/10 p-2 rounded-md focus:outline-none text-sm ${inputError ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-primary-500'}`} autoFocus />
                                {hasRecognitionSupport && ( <button onClick={isListening ? stop : startDictation} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}> <MicrophoneIcon className="w-4 h-4" /> </button> )}
                            </div>
                            {suggestions.length > 0 && <div className="mt-2 text-left text-sm space-y-1 max-h-40 overflow-y-auto">
                                {suggestions.map(loc => ( <button key={loc.id} onClick={() => handleLocationSelect(loc)} className="block w-full text-left px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10 truncate"> {loc.admin1 ? `${loc.name}, ${loc.admin1}` : loc.name}, {loc.country} </button> ))}
                            </div>}
                        </div>
                    )}
                </div>
                <p className="text-6xl font-thin my-1">{weather.temp}°</p>
                <p className="font-semibold">{weather.condition}</p>
                <div className="flex space-x-2 text-sm">
                    <span>H:{weather.high}°</span>
                    <span>L:{weather.low}°</span>
                </div>
            </div>
            <div className="flex-shrink-0 border-t border-white/30 pt-3 mt-4">
                <div className="flex justify-around">
                    {weather.forecast.map((day, index) => (
                        <div key={index} className="flex flex-col items-center space-y-1">
                            <span className="text-sm font-semibold">{day.day}</span>
                            <WeatherConditionIcon condition={day.condition} className="w-8 h-8 opacity-90"/>
                            <span className="text-sm">{day.high}°</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
