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

    componentDidUpdate(prevProps) {
        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers} = this.props.values
            this.setState({id, name, price, layers})
        }
    }

    render() {
        return (
            <>
                {this.props.formOptions.map(({id, name, layers, is_active, layer_visible}, idx) =>
                    <div key={idx}>
                        {layer_visible &&
                            (is_active ?
                                <div key={idx} className="row ml-1">
                                    <a>
                                        <i className="fa fa-check-circle" style={{color: "green"}} aria-hidden="false"></i>
                                        <span> {name}</span>
                                    </a>
                                </div> :
                                <div key={idx} className="row ml-1" >
                                    <a>
                                        <i className="fa fa-times-circle" style={{color: "#FF4748"}}  ></i>
                                        <del> {name}</del>
                                    </a>
                                </div>
                            )
                        }
                        {layer_visible ?
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"> Давхаргын нэр </th>
                                        <th scope="col"> Харагдах чек </th>
                                        {this.props.formOptionsRole.map(({id}, idx) =>
                                            (id == 1 ?
                                            <th key={idx} scope="col">Нээлтэй өгөгдөл</th>:
                                            id == 2 ?
                                            <th key={idx} scope="col">Дан нэвтэрсэн</th>:
                                            null
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
                                            )
                                        }
                                    </tbody>
                            </table>
                        </div>
                        :null}
                    </div>
                )}
            </>
        )
    }
}
