import React, { Component } from "react"
import { Line } from "react-chartjs-2";
import {service} from "../service"
// import {service} from "../../Access/service"

export default class Charts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_date: [],
            page_date_count: [],
            org_id: props.org_id
        }
        this.handlePageCount=this.handlePageCount.bind(this)
    }
    componentDidMount(){
        this.handlePageCount()
    }

    handlePageCount(){
        service
            .ageCount(this.state.org_id)
            .then(({ page_date, page_date_count }) => {
            if(page_date_count){
                this.setState({ page_date, page_date_count })
            }
        })

    }

    render() {
        const {page_date , page_date_count } = this.state
        const dataLine = {
            labels:page_date,
            datasets: [
                {
                    label: "Нас",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(0, 153, 255)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(0, 153, 255)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: page_date_count
                },
            ]
        }

        return (
            <Line data={dataLine} options={{ responsive: true }} />
        )
    }

}
