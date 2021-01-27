import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"

export class Property extends Component {


    constructor(props) {
        super(props)
        this.state = {
            id_list: this.props.id_list,

        }
        this.handleInput = this.handleInput.bind(this)

    }

    handleInput(e){
        let id_list = this.state.id_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }
        this.setState({id_list})
    }
    render() {
        const {fields, fname, view_name} = this.props
        const id_list = this.state.id_list
        return (
                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th colSpan={4} className="text-center">
                                    <h4 className="text-center">{fname}</h4>
                                    {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                                </th>
                            </tr>
                            <tr>
                                <th className="text-center" style={{width: "15%"}}>
                                    Data <br/>type
                                </th>
                                <th className="text-center" style={{width: "15%"}}>
                                    View
                                </th>
                                <th className="text-center" style={{width: "70%"}}>
                                    Property
                                </th>
                            </tr>
                            {fields.map((f_config, idx) =>
                                <>
                                    {f_config.data_types.map((data_type, idx1) =>
                                        <>
                                            <tr key={idx1}>
                                                <th rowSpan={data_type.data_type_configs.length +1}
                                                    className="vertical align-middle text-center"
                                                >
                                                    <span className="text-center text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                                    <span className="text-center align-middle">({data_type.data_type_name_eng})</span>
                                                    <span className="text-center align-middle">{data_type.data_type_name}</span>
                                                </th>
                                            </tr>
                                            {data_type.data_type_configs.map((data_type_config, idy) =>
                                                <>
                                                    <tr key={idy}>
                                                        <th>
                                                            <div className="icheck-primary">
                                                                <input
                                                                    id={data_type_config.property_name}
                                                                    type="checkbox"
                                                                    checked={id_list.indexOf(data_type_config.property_id) > -1}
                                                                    onChange={this.handleInput}
                                                                    value={data_type_config.property_id}
                                                                />
                                                                <label htmlFor={data_type_config.property_name}></label>
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <label
                                                                htmlFor={data_type_config.property_name}
                                                                data-toggle="tooltip" data-placement="right" title={data_type_config.property_definition}
                                                            >
                                                            {data_type_config.property_name}<br/>
                                                            (
                                                            {data_type_config.value_types.map((value_type, idz) =>
                                                                <span key={idz}>{value_type.value_type_name}</span>
                                                            )}
                                                            )
                                                            </label>
                                                        </th>
                                                    </tr>
                                                </>
                                            )}
                                        </>

                                    )}
                                </>
                            )}
                        </thead>
                    </table>
            </div>
        )
        }
    }
