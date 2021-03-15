import React, { Component } from "react"
import Charts from './Chart'
import PieChart from './PieChart'

export class Graph extends Component {

    constructor(props) {

        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        {/* <div className="col-md-6">
                            <h5 className="text-uppercase text-center">
                                Албан хаагчдын насаар
                            </h5>
                            <Charts></Charts>
                        </div> */}
                        <div className="col-md-6">
                            <h5 className="text-uppercase text-center">
                                Албан хаагчдын хүйсээр
                            </h5>
                            <PieChart></PieChart>
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
