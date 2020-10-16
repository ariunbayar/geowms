import React, { Component } from 'react'

export class Fields extends Component {
    constructor(props){
        super(props)
        this.state = {
            fields: this.props.fields
        }
    }

    render() {
        const {fields} = this.state
        return(<div className="card col-md-6 border border-danger">
            <div className="card-body">
                <table>
                    {fields.map((field, idx) =>
                        <th key={ idx }>
                            { field.name }
                        </th>
                    )}
                    <th>
                        Name
                    </th>
                    <tr>
                        Value
                    </tr>
                </table>
            </div>
        </div>
        )
    }
}