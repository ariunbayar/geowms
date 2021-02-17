import React, { Component } from "react"
import { Line } from "react-chartjs-2";
// import {service} from "../service"


export default class Graphic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_log_date: [],
            user_log_date_count: []
        }
        // this.handleBrowserCount=this.handleBrowserCount.bind(this)
    }
    // componentDidMount(){
    //     this.handleBrowserCount()

    // }

    // handleBrowserCount(){
    //     service.loginDateCount().then(({ user_log_date , user_log_date_count}) => {
    //         if(user_log_date_count){
    //             this.setState({user_log_date, user_log_date_count})
    //         }
    //     })

    // }

    render() {
        const {user_log_date , user_log_date_count } = this.state
        const dataLine = {
            labels:user_log_date,
            datasets: [
                {
                    label: this.props.text,
                    numberplus: this.props.numberplus,
                    numbercount: this.props.numbercount,
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    // backgroundColor: this.props.color,
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
                    data: user_log_date_count
                },
            ]
        }

        return (
            <Line width={100} height={30} data={dataLine} options={{ responsive: true }} />
        )
    }
}
