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
            <div style={{ width: '40em', height: '20em' }}>
                <Bar
                    data={data}

                    options={{ maintainAspectRatio: true }}
                />
            </div >
        );

    }

}

export default BarGraph;
