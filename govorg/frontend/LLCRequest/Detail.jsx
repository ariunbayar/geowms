import React, { Component } from "react"
import { DetailModalBody } from "./solveModal"

export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    {
                        <DetailModalBody
                            info={'Дэлгэрэнгүй'}
                            id={id}
                        />
                    }
                </div>
            </div>
        )
    }

}
