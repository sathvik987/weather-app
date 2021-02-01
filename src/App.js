import React, { Component } from 'react';
import Weather from "./components/Weather"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';

const apiKey = '8d44c5609ed1f902741d31e3b65a3959';

class App extends Component {

  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      min: undefined,
      max: undefined,
      main: undefined,
      temp: undefined,
      description: ""
    };

    this.Icon = {
      drizzle: "wi-sleet",
      rain: "wi-storm-showers",
      thunderstorm: "wi-thunderstorm",
      snow: "wi-snow",
      atmosphere: "wi-fog",
      clouds: "wi-day-fog",
      clear: "wi-day-sunny",
    }


  }

  getIcon = (icons, id) => {

    if (id >= 200 && id < 232) {
      this.setState({ icon: icons.thunderstorm });
    } else if (id >= 300 && id <= 321) {
      this.setState({ icon: icons.drizzle });
    } else if (id >= 500 && id <= 521) {
      this.setState({ icon: icons.rain });
    } else if (id >= 600 && id <= 622) {
      this.setState({ icon: icons.snow });
    } else if (id >= 701 && id <= 781) {
      this.setState({ icon: icons.atmosphere });
    } else if (id === 800) {
      this.setState({ icon: icons.clear });
    } else if (id >= 801 && id <= 804) {
      this.setState({ icon: icons.clouds });
    }
  }

  componentDidMount() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=bengaluru,india&appid=${apiKey}`)
      .then(resp => resp.json())
      .then(data => {

        if (data.cod === 200) {
          this.setState({
            city: data.name,
            country: data.sys.country,
            temp: Math.floor(data.main.temp - 273.15),
            min: Math.floor(data.main.temp_min - 273.15),
            max: Math.floor(data.main.temp_max - 273.15),
            description: data.weather[0].description
          })
          this.getIcon(this.Icon, data.weather[0].id);
        }
      })

  }


  render() {

    return (

      <Weather city={this.state.city} country={this.state.country} temp={this.state.temp}
        icon={this.state.icon} min={this.state.min} max={this.state.max} description={this.state.description} />

    );

  }
}

export default App;
