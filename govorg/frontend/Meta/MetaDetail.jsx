import { toStringHDMS } from "ol/coordinate"
import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { service } from './service'

export class MetaDetail extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: []
        }
        this.getMetaFields = this.getMetaFields.bind(this)
    }

    componentDidMount() {
        const { id } = this.props.match.params
        service
            .getDetail(id)
            .then(({success, meta_data, geo_data_list}) => {
                if (success) {
                    const data_field = Object.keys(meta_data)
                    const geo_data_field = Object.keys(geo_data_list[0])
                    this.setState({ data_field, geo_data_field, meta_data, geo_data_list })
                } else {

                }
            })
        this.getMetaFields()
    }

    getMetaFields() {
        service
            .getMetaFields()
            .then(({success, fields}) => {
                if (success) {
                    this.values = new Object();
                    fields.map((field, idx) => {
                        this.values[field.origin_name] = ''
                    })
                    this.setState({ fields })
                }
            })
    }

    render() {
        const { meta_data, geo_data_list, data_field, fields, geo_data_field } = this.state
        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="col-md-4 mb-4">
                                <NavLink className="btn gp-outline-primary" exact to={"/gov/meta/"}>
                                    Буцах
                                </NavLink>
                            </div>
                            <ul style={{listStyle: 'none'}}>
                                {data_field &&
                                    data_field.map((meta, idx) =>
                                        meta != 'id'
                                        ?
                                        fields && fields.map((field, idx) =>
                                            field.origin_name == meta
                                            ?
                                            <li className="float-left mr-3 mb-2" key={idx}>
                                                <b>{field.name}:</b> <input disabled value={meta_data[meta]} className="form-control"/>
                                            </li>
                                            :
                                                null
                                        )
                                        : null
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                            <tr>
                                                <th scope="col">
                                                    №
                                                </th>
                                                {
                                                    geo_data_field && geo_data_field.map((meta, idx) =>
                                                        <th scope="col" key={idx}>
                                                            {meta}
                                                        </th>
                                                    )
                                                }
                                            </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            geo_data_list && geo_data_list.map((geo_data, idx) =>
                                            <tr key={idx}>
                                                <th scope="row">{idx + 1}</th>
                                                {geo_data_field.map((field, idx) =>
                                                    <td key={idx}>{geo_data[field]}</td>
                                                )}
                                            </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}