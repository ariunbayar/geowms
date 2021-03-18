import React, { Component } from "react"
import Charts from './Chart'
import PieChart from './PieChart'

export class Graph extends Component {

    constructor(props) {

        super(props)
        this.state = {
            org_id: this.props.match.params.id
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="text-uppercase text-center">
                                Албан хаагчдын насаар
                            </h5>
                            <Charts org_id={this.state.org_id}/>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-uppercase text-center">
                                Албан хаагчдын хүйсээр
                            </h5>
                            <PieChart org_id={this.state.org_id}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
