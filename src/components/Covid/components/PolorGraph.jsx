import React, { Component } from "react"
import {Polar} from 'react-chartjs-2';

export default class PolorGraph extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { labels, datas, backgroundColor, label, height } = this.props
        const dataLine = {
            labels: labels,
            datasets: [
                {
                    label: label,
                    backgroundColor: backgroundColor,
                    data: datas,
                    options: {
                        responsive: true,
                        maintainAspectRatio: true
                    },
                },
            ]
        }

        return (
            <div className="wrapper">
                <Polar height={height} data={dataLine} />
            </div>
        )
    }

}
