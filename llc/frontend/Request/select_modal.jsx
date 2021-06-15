import React, { Component } from "react"

export default class ModelSelectTools extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleProceed = this.handleProceed.bind(this)
    }

    handleProceed(type, values) {
        this.props.modal_comp_props.handleSelectedTool(type, values)
    }

    render () {
        const { list_of_datas } = this.props
        return (
            <div className="row">
                <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc(40vh - 35px - 7px)"}}>
                    <table className="table table_wrapper_table">
                        <thead>
                            <tr>
                                <th scope="col"> № </th>
                                <th scope="col">Багажны дугаар</th>
                                <th scope="col">Багажны марк</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list_of_datas
                                ?
                                    list_of_datas.map((value, idx) =>
                                        <tr key={idx}>
                                            <td>
                                                {idx}
                                            </td>
                                            <td>
                                                <a className="text-primary" onClick={(e) => this.handleProceed(true, value)}>
                                                    {value.bagaj_dugaar}
                                                </a>
                                            </td>
                                            <td>
                                                {value.bagaj_mark}
                                            </td>
                                        </tr>
                                    )
                                :
                                    <tr>
                                        <td>дата бүртгэлгүй байна</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
