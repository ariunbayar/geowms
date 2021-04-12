import React, { Component } from 'react';
import { NavLink } from "react-router-dom"

class CronTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id
        }
    }
    render() {
        const {id} = this.state
        return (
            <div className="card">
                <div className="card-header">
                   {id} Crontab
                </div>
                <div className="card-body">
                    <div className="row">
                       sdfsdf
                    </div>
                </div>
            </div>
        );
    }
}

export default CronTab;