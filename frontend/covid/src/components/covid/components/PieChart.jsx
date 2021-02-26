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
        const { labels } = this.state
        const {batlagdsan_tohioldol, edgersen_humuusiin_too, nas_barsan_too} = this.props
        let uwdsun = parseInt(batlagdsan_tohioldol) - parseInt(edgersen_humuusiin_too)
        datas.push(parseInt(uwdsun))
        datas.push(parseInt(edgersen_humuusiin_too))
        datas.push(parseInt(nas_barsan_too))
        const dataLine = {
            labels: labels,
            datasets: [
                {
                    data: datas,
                    backgroundColor: ["rgba(226, 42, 36)", 'rgba(80, 209, 29, 0.8)', 'rgb(169, 165, 165)'],
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
