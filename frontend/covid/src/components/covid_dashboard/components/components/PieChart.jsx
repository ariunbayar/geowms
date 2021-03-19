import React, { Component } from "react"
import { Pie } from "react-chartjs-2";


export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        const { labels, datas, backgroundColor, height, label } = this.props

        const dataLine = {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: datas,
                    type: 'doughnut',
                    backgroundColor: backgroundColor,
                    options: {
                        responsive: true,
                        maintainAspectRatio: true
                    },
                },
            ]
        }
        return (
            <div className="wrapper card">
                <div className="card-body">
                    <Pie height={height} data={dataLine} ></Pie>
                </div>
            </div>
        )
    }

}
