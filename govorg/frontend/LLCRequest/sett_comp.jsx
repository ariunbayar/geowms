import React, {Component, Fragment} from "react"
import {service} from './service'

export class LLCSettings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: props.values,
            list_of_datas: []
        }

    }

    componentDidMount() {
        const {id} = this.props.match.params
        service.getFilesDetal(id).then(({list_of_datas}) => {
            this.setState({list_of_datas})
        })
    }

    render () {
        const { list_of_datas } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc( 40vh - 35px - 7px)"}}>
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th scope="col"> № </th>
                                        <th scope="col">Төрөл</th>
                                        <th scope="col">THEME</th>
                                        <th scope="col">PACKAGE</th>
                                        <th scope="col">FEATURE</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list_of_datas.length > 0 ?
                                        list_of_datas.map((value, idx) =>
                                        <tr key={idx}>
                                            <td>
                                                {idx}
                                            </td>
                                            <td>
                                                {value.geom_type}
                                            </td>
                                            <td>
                                                {value.theme}
                                            </td>
                                            <td>
                                                {value.package}
                                            </td>
                                            <td>
                                                {value.feature}
                                            </td>
                                            <td>
                                                <a href="#" onClick={(e) => this.handleProceed(true, value)}></a>
                                            </td>
                                        </tr>
                                        ): <tr><td>дата бүртгэлгүй байна</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
