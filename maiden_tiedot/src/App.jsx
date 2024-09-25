import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryInformation = ({ name }) => {
  const [info, setInfo] = useState({})
  const [coordinateInfo, setCoordinateInfo] = useState({})
  const [weatherInfo, setWeatherInfo] = useState({})
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
    .then(response => {
      setInfo(response.data)
    })
  }, [name])

  useEffect(() => {
    if (info.altSpellings && info.capital) {
      axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${info.capital}&limit=1&appid=${api_key}`)
      .then(response => {
        setCoordinateInfo(response.data[0])
      })
    }
  }, [info])

  useEffect(() => {
    if (coordinateInfo.lat && coordinateInfo.lon) {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinateInfo.lat}&lon=${coordinateInfo.lon}&appid=${api_key}`)
      .then(response => {
        setWeatherInfo(response.data)
      })
    }
  }, [coordinateInfo])

  return (
    <>
      <h1>{name}</h1>
      <p>Capital: {info.capital}</p>
      <p>Area: {info.area}</p>
      <h2>Languages:</h2>
      <ul>
        {info.languages && Object.values(info.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={info.flags && info.flags.png} alt={info.flags && info.flags.alt} />

      <h2>Weather in {info.capital}</h2>
      {weatherInfo.main ? (
        <>
          <p>Temperature {(weatherInfo.main.temp - 273.15).toFixed(2)} °C</p>
          <img src={`http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`}/>
          <p>Wind {(weatherInfo.wind.speed)} m/s</p>
        </>
      ) : (
        <>
          <p>Loading weather data...</p>
        </>
      )}
    </>
  )
}

const Country = ({ name, onShow }) => {
  return (
    <div>
      <p className='countryName'>{name}</p>
      <button onClick={onShow}>Show</button>
    </div>
  )
}

const Countries = ({ countries, onShowCountry }) => {
  if (countries.length === 0) {
    return (
      <>
        <p>No matches, try another filter.</p>
      </>
    )
  } else if (countries.length <= 10 && countries.length !== 1) {
    return (
      <>
        {countries.map((country, index) => (
          <Country key={index} name={country} onShow={() => onShowCountry(country)} />
        ))}
      </>
    )
  } else if (countries.length === 1) {
    return (
      <>
        <CountryInformation name={countries[0]} />
      </>
    )
  } else {
    return (
      <>
        <p>Too many matches, specify another filter</p>
      </>
    )
  }
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setAllCountries(response.data.map(country => country.name.common))
      })
  }, [])

  const filterCountries = (filter) => {
    const newCountries = allCountries.filter(country => country.toLowerCase().includes(filter))
    setFilteredCountries(newCountries)
  }

  const handleChange = (event) => {
    const newFilter = event.target.value.toLowerCase()
    setFilter(newFilter)
    filterCountries(newFilter)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      Find countries
      <input type="text" onChange={handleChange} />

      {selectedCountry ? (
        <CountryInformation name={selectedCountry} />
      ) : (
        <Countries countries={filteredCountries} onShowCountry={handleShowCountry} />
      )}

    </div>
  )
}

export default App