import React, { Component } from "react"
import { Radar } from "react-chartjs-2";


export class RadarChart extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const dataRadar = {
            labels: ["2020-07-01", "2020-07-02", "2020-07-03", "2020-07-04", "2020-07-05", "2020-07-06"],
            datasets: [
                {
                    label: "My First dataset",
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(35, 26, 136,)",
                    data: [20, 10, 5, 5, 20, 6, 3]
                },
            ]
        }

        return (
            <Radar data={dataRadar} options={{ responsive: true }} />
        )
    }

}
