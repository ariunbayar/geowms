import React, { Component } from "react"
import { Pie } from "react-chartjs-2";


export class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: props.labels,

        }
    }

    render() {
        let datas = []
        const { labels} = this.state
        const {batlagdsan_tohioldol, edgersen_humuusiin_too} = this.props
        datas.push(parseInt(batlagdsan_tohioldol))
        datas.push(parseInt(edgersen_humuusiin_too))
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
            <div className="wrapper">
                <Pie data={dataLine}></Pie>
            </div>
        )
    }

}
