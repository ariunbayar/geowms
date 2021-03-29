import React, { Component } from "react"
import { Radar } from "react-chartjs-2";

export default class RadarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const {height, datas, backgroundColor, borderColor, label, labels} = this.props
        const dataRadar = {
            labels: labels,
            datasets: [
                {
                    label: label,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    data: datas
                },
            ]
        }

        return (
            <Radar height={height} data={dataRadar} options={{ responsive: true }} />
        )
    }

}
