import React, { Component } from "react"


export class Notification extends Component {

    constructor(props) {

        super(props)
        this.alerts = [],
        this.check = 0,
        this.hasah = 0,
        this.state = {
            arr: [],
            show: '',
        }
        this.loadNotif = this.loadNotif.bind(this)
    }

    loadNotif(too){
        if(this.props.show){
            const length = this.alerts.length
            console.log(too, "in index", length)
            if(length == 0 || length >= too){
                this.hasah ++
                console.log("hasah", this.hasah)
                this.alerts.shift()
            }if(too > this.alerts.length){
                this.check ++
                console.log("nemeh ", this.check)
                this.alerts.push(<div className={`alert alert-danger col-md-2 float-right`} role="alert">This is a danger alert—check it out!</div>)
            }
        }
    }

    componentDidUpdate(pP){
        console.log(pP.too, "odasoidasjdasdsas", this.props.too)
    }

    render() {
        const {arr} = this.state
        return (
            <div className="fixed-top">
                {this.alerts}
            </div>
        )
    }
}