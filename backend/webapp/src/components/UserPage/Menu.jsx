import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import {Жагсаалт} from './Жагсаалт'
import {NavLink} from "react-router-dom"

export class Menu extends Component {


    constructor(props) {

        super(props)

        this.state = {
            page_active: true,
            user_count: 0,
        }
        this.pageTrue=this.pageTrue.bind(this)
        this.pageFalse=this.pageFalse.bind(this)
        this.userCount=this.userCount.bind(this)

    }
    pageTrue(){
        this.setState({page_active: true})
        this.userCount()
    }

    pageFalse(){
        this.setState({page_active: false})
    }

    componentDidMount() {
        this.userCount()
    }

    userCount() {
        service.userCount().then(({user_count}) => {
            this.setState({user_count})
        })
    }

    render() {
        const {page_active, user_count} = this.state
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                
                <div class="list-group list-group-horizontal-lg col-md-12">
                    <div class={"list-group-item d-flex justify-content-between align-items-center col-md-6 " + (page_active ? "active" : " ")} onClick={this.pageTrue}>
                        Хэрэглэгч
                        <span class={"badge " + (page_active ? "badge-light badge-pill text-primary" : "gp-bg-primary badge-pill")} >{user_count}</span>
                    </div>
                    <div class={"list-group-item d-flex justify-content-between align-items-center col-md-6 " + (page_active ? " " : "active")} onClick={this.pageFalse}>
                        Байгууллагын эрх
                    </div>
                </div>
                {page_active ? 
                <div>
                    <Жагсаалт></Жагсаалт>
                </div>:
                <div>
                    <ul class="list-group col-md-12">
                        <NavLink exact to={'/back/user/govorg/level/1/'} className="list-group-item d-flex justify-content-between align-items-center">
                            <h4>1-р түвшин</h4>
                        </NavLink>
                        <NavLink exact to={'/back/user/govorg/level/2/'} className="list-group-item d-flex justify-content-between align-items-center">
                            <h4>2-р түвшин</h4>
                        </NavLink>
                        <NavLink exact to={'/back/user/govorg/level/3/'} className="list-group-item d-flex justify-content-between align-items-center">
                            <h4>3-р түвшин</h4>
                        </NavLink>
                        <NavLink exact to={'/back/user/govorg/level/4/'} className="list-group-item d-flex justify-content-between align-items-center">
                            <h4>4-р түвшин</h4>
                        </NavLink>
                    </ul>
                </div>
                }

            </div>
        )
    }
}
