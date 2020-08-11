import React, { Component } from "react"
import { Radar } from "react-chartjs-2";
import {service} from "../service"


export class RadarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            method_id: [],
            method_id_count: []
        }
        this.handleBrowserCount=this.handleBrowserCount.bind(this)
    }
    componentDidMount(){
        this.handleBrowserCount()

    }

    handleBrowserCount(){
        service.crudMethodCount().then(({ method_id , method_id_count}) => {
            if(method_id_count){
                this.setState({method_id, method_id_count})
            }
        })

    }

    render() {
        const {method_id, method_id_count} = this.state
        const dataRadar = {
            labels: method_id,
            datasets: [
                {
                    label: "Үйлдлийн төрлөөр",
                    backgroundColor: "rgba(184, 185, 210, .3)",
                    borderColor: "rgb(35, 26, 136)",
                    data: method_id_count
                },
            ]
        }

        return (
            <Radar data={dataRadar} options={{ responsive: true }} />
        )
    }

}
