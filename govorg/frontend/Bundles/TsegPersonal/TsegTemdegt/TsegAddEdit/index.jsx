import React, { Component } from "react"

import { service } from '../../service'
import { GPInput } from '@utils/Tools/'

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
        const { fields } = this.state
        return (
            <div className="card-body">
                <h1>Nemeh bolon zasah</h1>
                {
                    fields.map((field, idx) =>
                        <GPInput key={idx}
                            mn_name={field.property_name}
                            name={field.property_code}
                            placeholder={field.property_name}
                            type={field.value_type_id}
                            sendValue={this.getValue}
                        />
                    )
                }
            </div>
        )
    }
}
