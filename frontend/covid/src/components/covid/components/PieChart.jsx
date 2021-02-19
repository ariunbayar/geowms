import React, { Component } from "react"
import { Pie } from "react-chartjs-2";


export class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: ['Батлагдсан', 'Эдгэрсэн'],
            datas: [1167, 1647]

        }
    }

    render() {
        const {datas, labels} = this.state
        const dataLine = {
            labels: labels,
            datasets: [
                {
                    data: datas,
                    backgroundColor: ['rgba(184, 185, 210, .3)', "rgb(35, 26, 136)"],
                    options: {
                        responsive: true,
                        maintainAspectRatio: true
                    },
                },
            ]
        }
        return (
            <div class="wrapper">
                <Pie data={dataLine}></Pie>
            </div>
        )
    }

}
