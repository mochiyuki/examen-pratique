import React, { Component } from "react";
import "./App.css";
import bgWeather from "./assets/background.png";

class App extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      city: "Geneva",
      time: "",
      temperature: "",
      temp_min: "",
      temp_max: "",
      description: "",
      modal: false,
      otherCity: "",
      units: "",
      tempSymb: "°C"
    };
  }

  componentDidMount() {
    let city = this.state.city;
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&APPID=a89d6186113e2e58907bf91a553e6628"
    )
      .then(res => res.json())
      .then(res =>
        this.setState({
          time: res.list[0].dt,
          temperature: res.list[0].main.temp,
          temp_min: res.list[0].main.temp_min,
          temp_max: res.list[0].main.temp_max,
          description: res.list[0].weather[0].description,
          icon: res.list[0].weather[0].icon
        })
      );
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  handleChange = e => {
    this.setState({ units: e.target.value });
  };

  getWeather = async e => {
    e.preventDefault();

    let otherCity = this.state.otherCity;
    let unitsChosen = this.state.units;

    if (this.state.units === "metric") {
      this.setState({ tempSymb: "°C" });
    } else {
      this.setState({ tempSymb: "°F" });
    }

    this.setState({
      modal: false,
      loading: true,
      otherCity: "",
      city: "",
      time: "",
      temperature: "",
      temp_min: "",
      temp_max: "",
      description: "",
      icon: ""
    });

    await fetch(
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
        otherCity +
        "&units=" +
        unitsChosen +
        "&APPID=a89d6186113e2e58907bf91a553e6628"
    )
      .then(res => res.json())
      .then(res =>
        this.setState({
          loading: false,
          otherCity: res.city.name,
          time: res.list[0].dt,
          temperature: res.list[0].main.temp,
          temp_min: res.list[0].main.temp_min,
          temp_max: res.list[0].main.temp_max,
          description: res.list[0].weather[0].description,
          icon: res.list[0].weather[0].icon
        })
      );
  };

  render() {
    let icon = "http://openweathermap.org/img/w/" + this.state.icon + ".png";

    return (
      <div className="wrapper">
        {this.state.loading === true ? (
          <p>Loading...</p>
        ) : (
          <div className="App">
            <img
              src={bgWeather}
              alt="app background"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh"
              }}
            />
            <div
              style={{
                position: "fixed",
                zIndex: 555
              }}
            >
              <h1>{this.state.temperature + " " + this.state.tempSymb} </h1>
              <p>
                {this.state.temp_min + " " + this.state.tempSymb} |{" "}
                {this.state.temp_max + " " + this.state.tempSymb}
              </p>
              <img src={icon} alt="icon weather" />
              <p>{this.state.description}</p>
              <p>{this.state.otherCity}</p>
              <p
                style={{
                  position: "fixed",
                  bottom: "40px",
                  left: 0
                }}
              >
                {this.state.city}
              </p>
              <p
                style={{
                  position: "fixed",
                  bottom: 0,
                  left: 0
                }}
              >
                {this.state.time}
              </p>
              <button
                style={{
                  position: "fixed",
                  bottom: 0,
                  right: 0
                }}
                onClick={this.openModal}
              >
                Check other cities
              </button>
            </div>
            {this.state.modal === true ? (
              <div
                id="modal"
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "200px",
                  height: "150px",
                  backgroundColor: "white",
                  zIndex: 999
                }}
              >
                <input
                  placeholder="city"
                  onChange={e => this.setState({ otherCity: e.target.value })}
                />

                <div>
                  <input
                    type="radio"
                    id="metric"
                    name="drone"
                    value="metric"
                    onChange={this.handleChange}
                  />
                  <label>Metric (°C)</label>
                </div>

                <div>
                  <input
                    type="radio"
                    id="imperial"
                    name="drone"
                    value="imperial"
                    onChange={this.handleChange}
                  />
                  <label>Imperial (°F)</label>
                </div>

                <button onClick={this.getWeather}>Get weather</button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    );
  }
}

export default App;
