import React, { Component } from "react"

export class Item extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_role: this.props.org_role,
        }

        this.handlePermChange = this.handlePermChange.bind(this)
    }

    handlePermChange(e) {

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
            </tr>
        )
    }
}
