import React, { Component } from "react"
import { Line } from "react-chartjs-2";
import {service} from "../service"


export class Charts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            crud_date: [],
            crud_date_count: []
        }
        this.handleBrowserCount=this.handleBrowserCount.bind(this)
    }
    componentDidMount(){
        this.handleBrowserCount()

    }

    handleBrowserCount(){
        service.crudDateCount().then(({ crud_date , crud_date_count}) => {
            if(crud_date_count){
                this.setState({crud_date, crud_date_count})
            }
        })

    }

    render() {
        const {crud_date , crud_date_count } = this.state
        const dataLine = {
            labels:crud_date,
            datasets: [
                {
                    label: "Хандалтын тоогоор",
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
                    data: crud_date_count
                },
            ]
        }

        return (
            <Line data={dataLine} options={{ responsive: true }} />
        )
    }

}
