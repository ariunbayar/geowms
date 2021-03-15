import React, { Component } from "react"
import { Pie } from "react-chartjs-2";
// import {service} from "../../Access/service"
import {service} from "../service"

export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_count: 0,
            user_count_null:0

        }
        this.handleBrowserCount=this.handleBrowserCount.bind(this)
    }
    componentDidMount(){
        this.handleBrowserCount()

    }

    handleBrowserCount(){
        service.pageUserCount().then(({ user_count , user_count_null}) => {
            if(user_count_null){
                this.setState({user_count, user_count_null})
            }
        })

    }

    render() {
        const {user_count, user_count_null} = this.state
        const dataLine = {
            labels: ['Эрэгтэй', 'Эмэгтэй'],
            datasets: [
                {
                    data: [user_count,user_count_null],
                    backgroundColor: ['rgba(184, 185, 210, .3)', "rgb(35, 26, 136)"],
                },
            ]
        }

        return (
            <Pie data={dataLine}></Pie>
        )
    }

}
