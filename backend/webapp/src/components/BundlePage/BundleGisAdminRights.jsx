import React, { Component } from "react"
import BundleFormTable from "./BundleFormTable"


export default class BundleGisAdminRights extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: props.values.id,
            name: props.values.name,
            gis_options:[],
            oid_list:[],
        }


    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (this.props.values.id !== prevProps.values.id) {
            const {id, name, price, layers, icon_url, self_module, oid_list} = this.props.values
            const gis_options = this.props.gis_options
            this.setState({id, name, price, layers, icon_url, self_module, module:self_module, gis_options:gis_options, oid_list})
        }
    }


    render() {
        return (
            <>
                {this.props.gis_options.map((oid, idx) =>
                    <div key={idx}>
                        <div className="table-responsive">
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
                                        {this.state.oid_list.map((layer) =>
                                            (this.state.oid_list.indexOf(oid) > -1) &&

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
                    </div>
                )}
            </>
        )
    }
}
