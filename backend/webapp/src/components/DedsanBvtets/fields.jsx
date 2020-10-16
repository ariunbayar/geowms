import React, { Component } from 'react'

export class Fields extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        const { fields } = this.props
        return(<div className="card col-md-6 border border-danger">
            <div className="card-body ">
                <table className="table position-sticky table-responsive" style={{top:0}}>
                    <thead>
                        <tr>
                            {fields.map((field, idx) =>
                                <th key={ idx }>
                                    { field }
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        )
    }
}