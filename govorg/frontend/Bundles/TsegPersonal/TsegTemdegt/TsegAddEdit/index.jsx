import React, { Component } from "react"

import { service } from '../../service'
import { GPInput } from '@utils/Tools/'

export default class TsegAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fields: [],
            values: {},
        }
        this.getFields = this.getFields.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    getValue(value, name) {
        const { values } = this.state
        values[name] = value
        this.setState({ values })
    }

    componentDidMount() {
        this.getFields()
    }

    getFields() {
        service
            .getFormFields()
            .then(({ success, fields }) => {
                console.log(fields);
                if (success) {
                    this.setState({ fields })
                }
            })
    }

    render() {
        const { fields, values } = this.state
        console.log(values);
        return (
            <div className="card-body">
                <h1>Nemeh bolon zasah</h1>
                {
                    fields.map((field, idx) =>
                        <GPInput key={idx}
                            mn_name={field.property_name}
                            name={field.property_id}
                            placeholder={field.property_name}
                            type={field.value_type_id}
                            sendValue={this.getValue}
                            options={field.data_list}
                            main_values={values}
                        />
                    )
                }
            </div>
        )
    }
}
