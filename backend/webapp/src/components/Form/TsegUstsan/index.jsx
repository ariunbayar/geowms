import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {FormTseg} from './Form'
import {List} from './List'
import { service } from "../service"
import {DanForm} from './DanForm'

export class TsegUstsan extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_dan: false,
        }
        this.checkUser = this.checkUser.bind(this)
    }
    // Hereglegch shalgah
    componentDidMount(){
        this.checkUser()
    }

    checkUser(){
        console.log("haha")
        service.checkDan().then(success => {
            console.log("is_dan", success)
            this.setState({ is_dan: success.success })
        })
    }

    render() {
        const {is_dan} = this.state
        return (
            <Switch>
                <Route exact path={"/back/froms/tseg-ustsan/"} component={List}/>
                {
                    is_dan
                    ?
                    <Route exact path={"/back/froms/tseg-ustsan/add/"} component={DanForm}/>
                    :
                    <Route exact path={"/back/froms/tseg-ustsan/add/"} component={FormTseg}/>
                }
                {
                    is_dan 
                    ? 
                    <Route exact path={"/back/froms/tseg-ustsan/:id/засах"} component={DanForm}/> 
                    :
                    <Route exact path={"/back/froms/tseg-ustsan/:id/засах"} component={FormTseg}/>
                }
            </Switch>
        )

    }

}
