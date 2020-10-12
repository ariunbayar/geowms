import React, { Component } from "react"


export class Notif extends Component {

    constructor(props) {

        super(props)
        this.alerts = [],
        this.total = [],
        this.array=[],
        this.key = 0
        this.state = {
        }

        this.loadNotif = this.loadNotif.bind(this)
    }

    componentDidUpdate(pP){
        if(pP.too !== this.props.too){
            this.loadNotif()
        }
    }

    loadNotif(){
        const length = this.total.length
        const {too, style, msg} = this.props
        if(this.props.show){
            this.key++
            console.log(length, "urt", too)
            if(length > too && length !=  1){
                console.log("hasasn", this.total)
                this.total.shift()
            }
            if(too > length && length > 0){
                console.log("nemsen")
                this.total = this.total.concat([<li key={this.key} className={`list-group-item list-group-item-${style} `}>{msg}</li>])
            }
            if(length == 0){
                this.total.push(<li key={this.key} className={`list-group-item list-group-item-${style} `}>{msg}</li>)
            }
            if(length == 1 && too == 0){
                console.log("lesa")
                this.total = []
            }
        }
    }

    render() {
        const {arr} = this.state
        return (
            <div className="position-fixed col-md-2" style={{zIndex: 1030, top:0, right:0}}>
                <ul className="list-group">
                    {this.total}
                </ul>
            </div>
        )
    }
}