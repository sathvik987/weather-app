import React from 'react';
import { Bar } from 'react-chartjs-2';

class BarGraph extends React.Component {

    render() {

        const data = {
            labels: this.props.labels,
            datasets: [{
                label: 'Temperature in °c',
                data: this.props.data
            }]
        }

        return (
            <div >
                <Bar
                    data={data}

                    options={{ maintainAspectRatio: true }}
                />
            </div >
        );

    }

}

export default BarGraph;
