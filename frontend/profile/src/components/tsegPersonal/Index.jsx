import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"

import { DanForm } from './TsegUstsan/DanForm';
import Forms from './TsegPersonal/Form'

export class Bar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_display: props.is_display,
        }
        this.setButton = this.setButton.bind(this)
    }

    setButton(is_display) {
        if (is_display) {
            this.props.history.push(`/profile/tseg-personal/`)
        }
        this.setState({ is_display })
    }

    render() {
        const { is_display } = this.state
        return (
            <div>
                <div className="container">
                    <div className="card">
                        {
                            is_display
                            &&
                                <div className="card-body">
                                    <div className="col-md-12 py-0 my-0">
                                        <NavLink
                                            to="/profile/tseg-personal/tseg-info/tseg-ustsan/"
                                            className="list-group-item col-md-12 ml-2 text-center"
                                            activeClassName="text-white gp-bg-primary"
                                            onClick={() => this.setButton(false)}
                                        >
                                            Устсан цэг тэмдэгтийн мэдээллийг илгээх
                                        </NavLink>
                                    </div>
                                </div>
                        }
                        <div>
                        <Switch>
                            <Route exact
                                path="/profile/tseg-personal/tseg-info/tseg-ustsan/"
                                component={
                                    (props) => <DanForm {...props} setButton={this.setButton}/>
                                }
                            />
                            <Route exact path="/profile/tseg-personal/"/>
                        </Switch>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}