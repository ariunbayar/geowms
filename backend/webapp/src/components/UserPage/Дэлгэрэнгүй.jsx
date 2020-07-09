import React, { Component } from "react"
import {service} from './service'


export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
        }
    }

    componentDidMount() {
        service
            .detail(this.props.match.params.id)
            .then(({user_detail}) => {
                this.setState({user_detail})
            })
    }

    render() {
        return (
            <div></div>
        )
    }
}
