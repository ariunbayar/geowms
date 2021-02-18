import React, { Component } from "react"
import { Line } from "react-chartjs-2";


export class LineGraph extends Component {

    render() {
        const {line_chart_datas} = this.props
        var datas = []
        var label = []
        line_chart_datas.map((value) => {
            label.push(value.label)
            datas.push(value.datas)
        })

        const dataLine = {
            labels: label,
            datasets: [
                {
                    label: "Батлагдсан",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(35, 26, 136)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(35, 26, 136)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: datas
                },
            ]
        }

        return (
            <Line  width={100} height={30} data={dataLine} options={{ responsive: true }} />
        )
    }

}
