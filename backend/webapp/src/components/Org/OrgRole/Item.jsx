import React, { Component } from "react"
import {Notif} from '../../../../../../src/components/Notification/index'

export class Item extends Component {

    constructor(props) {
        super(props)

        this.too = 0

        this.state = {
            org_role: this.props.org_role,
        }

        this.handlePermChange = this.handlePermChange.bind(this)
        this.addNotif = this.addNotif.bind(this)
    }

    handlePermChange(e) {
        const {org_role} = this.state
        org_role[e.target.name] = e.target.checked
        this.props.handleChange(org_role)
        this.addNotif('success', 'Амжилттай устгалаа', 'times')
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
        const {
            bundle,
            perm_view,
            perm_create,
            perm_remove,
            perm_revoke,
            perm_review,
            perm_approve,
        } = this.props.org_role

        return (
            <tr>
                <td>{bundle.name}</td>
                <td><input type="checkbox" name="perm_view" checked={perm_view} onChange={this.handlePermChange}/></td>
                <td><input type="checkbox" name="perm_create" checked={perm_create} onChange={this.handlePermChange}/></td>
                <td><input type="checkbox" name="perm_remove" checked={perm_remove} onChange={this.handlePermChange}/></td>
                <td><input type="checkbox" name="perm_revoke" checked={perm_revoke} onChange={this.handlePermChange}/></td>
                <td><input type="checkbox" name="perm_review" checked={perm_review} onChange={this.handlePermChange}/></td>
                <td><input type="checkbox" name="perm_approve"checked={perm_approve} onChange={this.handlePermChange}/></td>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </tr>
        )
    }
}
