import React, { Component } from "react"
import BundleFormTable from "./BundleFormTable"
import {NavLink} from "react-router-dom"


export default class BundleAdminRights extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: props.values.id,
            name: props.values.name,
            price: props.values.price,
            layers: props.values.layers,
            icon: props.values.icon,
            icon_url: props.values.icon_url,
        }


    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers} = this.props.values
            this.setState({id, name, price, layers})
        }

    }

    render() {
        return (
            <div className="shadow-lg p-3 mb-5 bg-white rounded">
                {this.props.formOptions.map(({id, name, layers}, idx) =>
                    <div key={idx}>
                        <dt> {name} </dt>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> Давхаргын нэр </th>
                                    <th scope="col"> Харагдах чек </th>
                                    {this.props.formOptionsRole.map(({id}, idx) =>
                                        (id == 1 ? 
                                        <th key={idx} scope="col">Нээлтэй өгөгдөл</th>:
                                        <th key={idx} scope="col">Эрх {id}</th>
                                        )
                                    )}
                                </tr>
                            </thead>
                                <tbody>
                                    {layers.map((layer) =>
                                        (this.state.layers.indexOf(layer.id) > -1) &&

                                            this.props.values.roles.map((roleChecks) =>

                                                (roleChecks.layer_id == layer.id &&
                                                    <BundleFormTable
                                                        key={layer.id}
                                                        values = {layer}
                                                        wmsId = {this.state.id}
                                                        role={this.props.formOptionsRole}
                                                        roleChecks = {roleChecks}
                                                    />
                                                )

                                            )
                                    )}
                                </tbody>
                        </table>
                    </div>
                )}

                <div className="form-group">
                    <div className="form-group">
                        <NavLink to={`/back/`}>
                            <button className="btn btn-block gp-outline-primary"  >
                                Буцах
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }
}

