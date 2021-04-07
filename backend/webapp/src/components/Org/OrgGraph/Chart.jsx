import React, { Component } from "react"
import { Line } from "react-chartjs-2";
import {service} from "../service"

export default class Charts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emp_age: [],
            count_emps_age: [],
            org_id: props.org_id
        }
        this.handlePageCount=this.handlePageCount.bind(this)
    }
    componentDidMount() {
        this.handlePageCount()
    }

    handlePageCount() {
        service
            .ageCount(this.state.org_id)
            .then(({ emp_age, count_emps_age }) => {
            if(count_emps_age){
                this.setState({ emp_age, count_emps_age })
            }
        })

    }

    render() {
        const {emp_age , count_emps_age } = this.state
        const dataLine = {
            labels:emp_age,
            datasets: [
                {
                    label: "Насны ангилал",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(0, 153, 255)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    borderWidth: 1,
                    pointBorderColor: "rgb(0, 153, 255)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 7,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: count_emps_age
                },
            ],
        }
        const options = {
            responsive: true,
            scales: {
                yAxes: [
                    {
                        ticks: {
                            stepSize: 10
                        }
                    }
                ]
            }
        }
        return (
            <Line data={ dataLine } options={ options } />
        )
    }
}
