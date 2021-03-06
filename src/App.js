import React, { Component } from 'react';
import Weather from "./components/Weather"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import { Form, Col, Button, Row, Container, Image } from 'react-bootstrap';
import BarGraph from './components/BarGraph'
import Img from "./factory.svg"

const apiKey = '8d44c5609ed1f902741d31e3b65a3959';

class App extends Component {

  constructor() {
    super();
    this.state = {
      city: undefined,
      country: undefined,
      search: "",
      icon: undefined,
      temp: undefined,
      description: "",
      display: <h3 style={{ textAlign: 'center' }}>Loading...</h3>,
      latitude: undefined,
      longitude: undefined,
      pressure: undefined,
      humidity: undefined,
      wind: undefined,
      labels: undefined,
      data: undefined,
      aqi: undefined,
      aqiDes: undefined,
      Carbonmonoxide: undefined,
      Nitrogenmonoxide: undefined,
      Nitrogendioxide: undefined,
      Ozone: undefined
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

  getLocalWeather = () => {
    navigator.geolocation.getCurrentPosition((postion) => {
      this.setState({ latitude: postion.coords.latitude, longitude: postion.coords.longitude })
      this.loadWeather()

    }, (err) => {
      this.setState({ display: "" })
      alert("Enable your browser location to check weather at your location")
    })
  }

  getAqi = () => {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${apiKey}`)
      .then(resp => resp.json())
      .then(data => {
        let aqi = data.list[0].main.aqi;
        let des = ""
        if (aqi === 1) {
          des = "Good"
        } else if (aqi === 2) {
          des = "Fair"
        } else if (aqi === 3) {
          des = "Moderate"
        } else if (aqi === 4) {
          des = "Poor"
        } else if (aqi === 5) {
          des = "Very Poor"
        }
        this.setState({
          aqi: aqi,
          aqiDes: des, Carbonmonoxide: data.list[0].components.co,
          Nitrogenmonoxide: data.list[0].components.no, Nitrogendioxide: data.list[0].components.no2, Ozone: data.list[0].components.o3
        })
      })
  }

  componentDidMount() {
    this.getLocalWeather()
  }

  loadWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${apiKey}`)
      .then(resp => resp.json())
      .then(data => {
        if (data.cod === 200) {
          this.setState({
            city: data.name,
            country: data.sys.country,
            temp: Math.floor(data.main.temp - 273.15),
            description: data.weather[0].description,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            wind: data.wind.speed
          })
          this.getIcon(this.Icon, data.weather[0].id);
        }
      })

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${apiKey}`)
      .then(resp => resp.json())
      .then(data => {
        let values = data.hourly.map(t => t.dt)
        let times = []
        for (let i = 1; i < 25; i++) {
          let t = new Date(values[i] * 1000)
          var hours = t.getHours();
          var minutes = t.getMinutes();
          times.push(`${hours}:${minutes}`)
        }
        this.setState({ labels: times })


        let temps = data.hourly.map(t => t.temp)
        let temp = []
        for (let i = 1; i < 25; i++) {
          let t = Math.floor(temps[i] - 273.15)
          temp.push(t)
        }

        this.setState({ data: temp })

      })

    this.getAqi()
  }

  onSearchClick = () => {
    if (this.state.search) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.search}&appid=${apiKey}`)
        .then(resp => resp.json())
        .then(data => {
          if (data.cod === '404') {
            alert("City not found")
          }
          if (data.cod === 200) {
            this.setState({
              city: data.name,
              country: data.sys.country,
              temp: Math.floor(data.main.temp - 273.15),
              description: data.weather[0].description,
              pressure: data.main.pressure,
              humidity: data.main.humidity,
              wind: data.wind.speed,
              longitude: data.coord.lon,
              latitude: data.coord.lat
            }, () => {
              fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${apiKey}`)
                .then(resp => resp.json())
                .then(data => {
                  let values = data.hourly.map(t => t.dt)
                  let times = []
                  for (let i = 1; i < 25; i++) {
                    let t = new Date(values[i] * 1000)
                    var hours = t.getHours();
                    var minutes = t.getMinutes();
                    times.push(`${hours}:${minutes}`)
                  }
                  this.setState({ labels: times })


                  let temps = data.hourly.map(t => t.temp)
                  let temp = []
                  for (let i = 1; i < 25; i++) {
                    let t = Math.floor(temps[i] - 273.15)
                    temp.push(t)
                  }

                  this.setState({ data: temp }, this.getAqi)


                })
            })
            this.getIcon(this.Icon, data.weather[0].id);
          }
        })
    }

  }

  onSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }


  render() {

    let disp = this.state.display

    if (this.state.city !== undefined) {
      disp = <Weather city={this.state.city} temp={this.state.temp} country={this.state.country}
        icon={this.state.icon} description={this.state.description}
        humidity={this.state.humidity} pressure={this.state.pressure} wind={this.state.wind} />
    }

    return (
      <div>
        <Form className="form" style={{ paddingTop: 5 }}>
          <Form.Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                className="mb-2"
                id="inlineFormInput"
                placeholder="City"
                onChange={this.onSearchChange}
                onKeyPress={e => { if (e.key === "Enter") { e.preventDefault(); this.onSearchClick(); } }}
              />
            </Col>
            <Col xs="auto">
              <Button type="button" className="mb-2" variant="info" onClick={this.onSearchClick}>
                Search
              </Button>
              &nbsp;&nbsp;
              <Button type="button" className="mb-2" variant="info" onClick={this.getLocalWeather}>
                Show local weather
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <br />
        <Container>
          <Row>
            <Col>{disp}</Col>
            <Col>
              <h4>Hourly temperature forecast for next 24 hours</h4>
              <BarGraph data={this.state.data} labels={this.state.labels} />
            </Col>
          </Row>
          {this.state.aqi ? (
            <Row>
              <Col style={{ textAlign: 'center' }}>
                <Image src={Img} style={{ height: "8em" }} />
                <div>Air quality index: {this.state.aqi} ( {this.state.aqiDes} ) &nbsp;&nbsp; Carbon monoxide: {this.state.Carbonmonoxide} μg/m3</div>
                <div>Nitrogen monoxide: {this.state.Nitrogenmonoxide} μg/m3 &nbsp;&nbsp; Nitrogen dioxide: {this.state.Nitrogendioxide} μg/m3</div>
                <div>Ozone: {this.state.Ozone} μg/m3</div>
              </Col>
            </Row>
          ) : (
              <div></div>
            )}
        </Container>

      </div >
    );

  }
}

export default App;
