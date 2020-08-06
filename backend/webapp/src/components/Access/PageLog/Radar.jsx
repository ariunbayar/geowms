import React, { Component } from "react"
import { Radar } from "react-chartjs-2";
import {service} from "../service"


export class RadarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_browser_names_counts: [],
            user_browser_count: []
        }
        this.handleBrowserCount=this.handleBrowserCount.bind(this)
    }
    componentDidMount(){
        this.handleBrowserCount()

    }

    handleBrowserCount(){
        service.browserCount().then(({ user_browser_names_counts , user_browser_count}) => {
            if(user_browser_count){
                this.setState({user_browser_names_counts, user_browser_count})
            }
        })

    }

    render() {
        const {user_browser_names_counts, user_browser_count} = this.state
        const dataRadar = {
            labels: user_browser_names_counts,
            datasets: [
                {
                    label: "Хандалтын төхөөрөмжийн тоогоор",
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(35, 26, 136)",
                    data: user_browser_count
                },
            ]
        }

        return (
            <Radar data={dataRadar} options={{ responsive: true }} />
        )
    }

}
