import React, { Component } from "react"
//import {LogFormTable} from './LogFormTable'
import {service} from './service'


export class LogForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            payment_all:[]
        }
    }

    componentDidMount(){

        this.handleListUpdated()
    }
   
    handleListUpdated(){

        service.getAll().then(({payment_all}) => {
            this.setState({payment_all})
        })

    }
    render() {



        return (
            <a>kcbekdsbvldsnvldsmv;sdm</a>

            
        )

    }


}
