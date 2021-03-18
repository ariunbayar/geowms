import React, { Component } from "react"
import { Line } from "react-chartjs-2";


export default class LineGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: props.labels,
            datas: props.datas,

        }
    }
    render() {
        const { labels, datas, graph_color, height, label, lineTension } = this.props


        const dataLine = {
            labels: labels,
            datasets: [
                {
                    label: label,
                    fill: true,
                    lineTension: lineTension || 0.3,
                    backgroundColor: graph_color + "30",  //fill color
                    borderColor: graph_color, //border_color
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: graph_color, // point-color
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 5,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "white",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
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
                <Line height={height} data={dataLine} />
            </div>
        )
    }

}
