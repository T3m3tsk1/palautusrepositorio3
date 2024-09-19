import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryInformation = ({ name }) => {
  const [info, setInfo] = useState({})

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
    .then(response => {
      setInfo(response.data)
    })
  }, [name])

  return (
    <>
      <h2>{name}</h2>
      <p>Capital: {info.capital}</p>
      <p>Area: {info.area}</p>
      <h3>Languages:</h3>
      <ul>
        {info.languages && Object.values(info.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={info.flags && info.flags.png} alt={info.flags && info.flags.alt} />
    </>
  )
}

const Country = ({ name }) => {
  return (
    <>
      <p>{name}</p>
    </>
  )
}

const Countries = ({ countries }) => {
  if (countries.length <= 10 && countries.length !== 1) {
    return (
      <>
        {countries.map((country, index) => (
          <Country key={index} name={country} />
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
  }

  return (
    <div>
      Find countries
      <input type="text" onChange={handleChange} />

      <Countries countries={filteredCountries} />
    </div>
  )
}

export default App