import React, { Component } from "react"

export default class PostgresqlVersion extends Component {

    constructor(props) {
        super(props)

    }

    render() {

        return (
            <div>
                <p>{this.props.postgreVersion}</p>
                <p>{this.props.versionOfPostGis}</p>
            </div>

        )
    }
}
