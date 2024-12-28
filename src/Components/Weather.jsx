import React, { useState } from 'react'
import './Weather.css'
import axios from 'axios'


const Weather = () => {

  const [data, setData] = useState({})
  const [location, setLocation] = useState("")

  const search = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=a457bea641e1272416d2c6b98e94fce4`
    const res = await axios.get(url)
    setData(res.data)
    setLocation("")
  }

  const handleInputChange = (e) => {
    setLocation(e.target.value)
  }

  const weatherIcon = (weatherType)=>{
      switch (weatherType){
        case 'Clear':
          return <i className='bx bxs-sun'></i>
        case 'Rain':
          return <i className='bx bxs-sun'></i>
        case 'Clouds':
          return <i className='bx bxs-cloud-rain'></i>
        case 'Thunderstorm':
          return <i className='bx bxs-cloud-lightning'></i>
        case 'Snow':
          return <i className='bx bxs-cloud-snow'></i>
        case 'Haze':
        case 'mist':
          return <i className='bx bxs-cloud-cloud'></i>
        default:
          return <i className='bx bxs-cloud-cloud'></i>
      }
  }

  return (
    <div className='weather'>
      <div className="search">
        <div className="search-top">
          <i className='fa-solid fa-location-dot'></i>
          <div className="location">{data.name}</div>
        </div>
        <div className="search-location">
          <input type="text" placeholder='Enter Location' value={location} onChange={handleInputChange} />
          <i className='fa-solid fa-magnifying-glass' onClick={search}></i>
        </div>
      </div>
      <div className="weather-data">
        {data.weather && data.weather[0] && weatherIcon(data.weather[0].main)}
        <div className="weather-type">
          {data.weather ? data.weather[0].main : null}
        </div>
        <div className="temp">{data.main ? `${data.main.temp}°C` : null}</div>
      </div>
    </div>
  )
}

export default Weather
