import React, { Component } from "react"
import { Pie } from "react-chartjs-2";
import {service} from "../service"

export default class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count_male: 0,
            count_female: 0

        }
        this.countGender=this.countGender.bind(this)
    }

    componentDidMount(){
        this.countGender()
    }

    countGender(){
        service
            .genderCount()
            .then(({ count_male, count_female }) => {
                this.setState({ count_male, count_female })
            })
    }

    render() {
        const { count_male, count_female } = this.state
        const dataLine = {
            labels: ['Эрэгтэй', 'Эмэгтэй'],
            datasets: [
                {
                    data: [count_male, count_female],
                    backgroundColor: ["rgb(179, 209, 255)", 'rgb(255, 204, 230)'],
                },
            ]
        }
        return (
            <Pie data={dataLine}></Pie>
        )
    }

}
