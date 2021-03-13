import React, { Component } from "react"

import { service } from '../../service'

export default class TsegAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fields: [],
        }
        this.getFields = this.getFields.bind(this)
    }

    componentDidMount() {
        this.getFields()
    }

    getFields() {
        service
            .getFormFields()
            .then(({ success, fields }) => {
                if (success) {
                    console.log(fields);
                    this.setState({ fields })
                }
            })
    }

    render() {
        console.log('tseg nemeh');
        return (
            <div>
                <h1>Nemeh bolon zasah</h1>
            </div>
        )
    }
}
