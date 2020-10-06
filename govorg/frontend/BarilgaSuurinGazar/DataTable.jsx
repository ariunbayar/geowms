import React, { Component } from "react"


export default class DataTable extends Component {

    render() {

        const { rows, fields } = this.props.data

        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr>
                        { fields.map((field, idx) =>
                            <th key={ idx }>
                                { field }
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>

                    { rows.map((row, idx) =>

                        <tr key={ idx }>

                            { fields.map((field, idx) =>

                                <td key={ idx }>
                                    { row[field] }
                                </td>

                            )}

                        </tr>

                    )}
                </tbody>
            </table>
        )
    }
}
