import React from 'react';
import "./Weather.css"


class Weather extends React.Component {

    render() {

        return (
            <div className='weather' >
                <h1>{this.props.city},{this.props.country}</h1><br /><br />
                <i className={`wi ${this.props.icon} display-1`}></i><br /> <br />
                <h3>{this.props.temp}&deg;C</h3>
                <h3>{this.props.description}</h3>
                <div>
                    <div>Humidity: {this.props.humidity} % &nbsp;&nbsp; Pressure: {this.props.pressure} hPa</div>
                    <div>Wind: {this.props.wind} meter/sec</div>
                </div>
            </div >
        );

    }

}

export default Weather;
