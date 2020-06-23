import React, { Component } from "react"
import "./styles.css";
import {service} from './service'


export default class BundleFormTable extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: props.values.id,
            check: this.props.roleChecks.checks,
            roles: this.props.roleChecks.roles,
            layerRoles: []
        }

        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.DefaultCheck = this.DefaultCheck.bind(this)

    }
    handleLayerToggle(e) {
        let roles = this.state.roles
        const bundleId = this.props.wmsId
        const roleId = parseInt(e.target.value)
        const layerId = this.props.values.id
        if (e.target.checked) {
            roles.push(roleId)
            const data = {"bundleId":bundleId, "roleId":roleId, "layerId":layerId}
            service.roleCreate(data).then(({success, item}) => {
            })
        } 
        else {
            if(roleId != 5)
            {
                roles = roles.filter((id) => id != roleId)
                const data = {"bundleId":bundleId, "roleId":roleId, "layerId":layerId}
                service.roleRemove(data).then(({success, item}) => {
                })
            }

        }
        this.setState({roles})
    }
    DefaultCheck(e) {
        const bundleId = this.props.wmsId
        const layerId = this.props.values.id
        if (e.target.checked) {
            this.setState({check: 1})
            const data = {"bundleId":bundleId, "layerId":layerId, "check": 1}
            service.defaultCheckUpdate(data).then(({success, item}) => {
                if (success) { }
            })
        } else {
            this.setState({check: 0})
            const data = {"bundleId":bundleId, "layerId":layerId, "check": 0}
            service.defaultCheckUpdate(data).then(({success, item}) => {
                if (success) { }
            })

        }
    }
    componentDidMount(){
        
    }
    render() {
        const {id, name, price} = this.props.values
        return (
            <tr>

                <th >
                   {this.props.wmsId} + {id} + {name}
                </th>

                <td>
                    <input
                        type="checkbox"
                        onChange={this.DefaultCheck}
                        checked={this.state.check > 0}
                        value={id}
                    />
                </td>
                {this.props.role.map(({id}, idx) =>
                    <td>
                        <input
                            type="checkbox"
                            onChange={this.handleLayerToggle}
                            checked={this.state.roles.indexOf(id) > -1}
                            value={id}
                        />
                    </td>
                )}
            </tr>
        )
    }
}
