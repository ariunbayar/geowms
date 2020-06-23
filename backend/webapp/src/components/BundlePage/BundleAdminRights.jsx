import React, { Component } from "react"
import BundleFormTable from "./BundleFormTable"

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
        console.log(JSON.stringify( this.props.values.roles.indexOf(155)))
        return (
            <div className="shadow-lg p-3 mb-5 bg-white rounded">

                
                {this.props.formOptions.map(({id, name, layers}, idx) =>
                    <div>
                        <dt> {name} </dt>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> Давхаргын нэр </th>
                                    <th scope="col"> Харагдах чек </th>
                                    {this.props.formOptionsRole.map(({id}, idx) =>
                                        <th scope="col">Эрх {id}</th>
                                    )}
                                </tr>
                            </thead>
                                <tbody>
                                    {layers.map((layer) =>
                                        (this.state.layers.indexOf(layer.id) > -1) && 
                                                    
                                            this.props.values.roles.map((roleChecks) =>

                                                (roleChecks.layer_id == layer.id &&
                                                    <BundleFormTable 
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
                    <button className="btn btn-block gp-outline-primary" onClick={this.props.handleCancel} >
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        &nbsp; Буцах
                    </button>
                </div>
            </div>
        )
    }
}

