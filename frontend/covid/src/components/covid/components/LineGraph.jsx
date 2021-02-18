import React, { Component } from "react"
import { Line } from "react-chartjs-2";


export class LineGraph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            label: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
            count: [2, 4, 12, 78, 12, 44, 22]
        }
    }
    componentDidMount(){

    }

    render() {
        const {label , count } = this.state
        const { graph_color } = this.props
        const dataLine = {
            labels: label,
            datasets: [
                {
                    label: "Батлагдсан",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: graph_color + "70",  //fill color
                    borderColor: graph_color, //border_color
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: graph_color, // point-color
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: count
                },
            ]
        }

        return (
            <Line  width={100} height={30} data={dataLine} options={{ responsive: true }} />
        )
    }

}
