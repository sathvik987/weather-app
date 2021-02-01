import React from 'react';



class Weather extends React.Component {

    render() {

        return (
            <div className="App">
                <h1>{this.props.city},{this.props.country}</h1><br /> <br />
                <i className={`wi ${this.props.icon} display-1`}></i><br /> <br />
                <h3>{this.props.temp}&deg;C</h3>
                <div>
                    <span> Min: {this.props.min}&deg;C &nbsp; &nbsp; Max: {this.props.max}&deg;C</span>
                </div>
                <br />
                <h3>{this.props.description}</h3>
            </div>
        );

    }

}

export default Weather;
