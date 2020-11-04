import React, { Component } from "react"
import "./styles.css";
import {service} from './service'
import {Notif} from '../../../../../src/components/Notification/index'

export default class BundleFormTable extends Component {

    constructor(props) {

        super(props)

        this.too = 0;

        this.state = {
            id: props.values.id,
            check: this.props.roleChecks.checks,
            roles: this.props.roleChecks.roles,
            layerRoles: []
        }

        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.DefaultCheck = this.DefaultCheck.bind(this)
        this.addNotif = this.addNotif.bind(this)

    }
    handleLayerToggle(e) {
        let roles = this.state.roles
        const check = this.state.check
        const bundleId = this.props.wmsId
        const roleId = parseInt(e.target.value)
        const layerId = this.props.values.id
        if (e.target.checked) {
            roles.push(roleId)
            const data = {"bundleId":bundleId, "roleId":roleId, "layerId":layerId, "check": check}
            service.roleCreate(data).then(({success, item}) => {
                if (success) {
                    this.addNotif('success', 'Амжилттай нэмлээ', 'check')
                }
            })
        }
        else {
            if(roleId != 5)
            {
                roles = roles.filter((id) => id != roleId)
                const data = {"bundleId":bundleId, "roleId":roleId, "layerId":layerId}
                service.roleRemove(data).then(({success, item}) => {
                    if (success) {
                        this.addNotif('success', 'Амжилттай устгалаа', 'times')
                    }
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
                if (success) {
                    this.addNotif('success', 'Амжилттай нэмлээ', 'check')
                }
            })
        } else {
            this.setState({check: 0})
            const data = {"bundleId":bundleId, "layerId":layerId, "check": 0}
            service.defaultCheckUpdate(data).then(({success, item}) => {
                if (success) {
                    this.addNotif('success', 'Амжилттай устгалаа', 'times')
                }
            })

        }
    }

    componentDidMount(){

    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    render() {
        const {id, name, price} = this.props.values
        return (
            <tr>
                <td >
                   {name}
                </td>

                <td>
                    <input
                        type="checkbox"
                        onChange={this.DefaultCheck}
                        checked={this.state.check > 0}
                        value={id}
                    />
                </td>
                {this.props.role.map(({id}, idx) =>
                    <td key={idx}>
                        {
                            id != 5 &&
                        <input
                            type="checkbox"
                            onChange={this.handleLayerToggle}
                            checked={this.state.roles.indexOf(id) > -1}
                            value={id}
                        />
                        }

                    </td>
                )}
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </tr>
        )
    }
}
