import React, { Component } from "react"


export default class DataTable extends Component {

    render() {
        const { rows, fields } = this.props.data

        return (
            <div className="table-responsive">
            <div>
                <form>
                    { fields.map((field, idx) =>
                        <div className="form-group" key={ idx }>
                            <label className="">{ field }</label>
                            <input className="form-control" placeholder={ field } />
                        </div>
                    )}
                    <button className="btn gp-btn-primary">Хадгалах</button>
                </form>
            </div>
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
        </div>
        )
    }
}