import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {service} from "./service"
import {PermAcc} from './PermAccordion'
import "./ins.css"

export default class InsPerms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tid: 0,
            pid: 0,
            fid: 0,
            themes: [],
            package_features: [],
            properties: [],
            perms: [
                {'name': 'харах', 'eng_name': 'PERM_VIEW', 'value': false},
                {'name': 'нэмэх', 'eng_name': 'PERM_CREATE', 'value': false},
                {'name': 'хасах', 'eng_name': 'PERM_REMOVE', 'value': false},
                {'name': 'цуцлах', 'eng_name': 'PERM_REVOKE', 'value': false},
                {'name': 'хянах', 'eng_name': 'PERM_UPDATE', 'value': false},
                {'name': 'батлах', 'eng_name': 'PERM_APPROVE', 'value': false},
            ],
            is_open: false,
            t_name: '',
            p_name: '',
            f_name: '',
            roles: [],
        }

        this.getId = this.getId.bind(this)
        this.PermsOnChange = this.PermsOnChange.bind(this)
        this.cancelOpen = this.cancelOpen.bind(this)
        this.getOrgRole = this.getOrgRole.bind(this)
    }

    getId(id, type, name) {
       if(type == 'theme') this.setState({ tid: id, is_open: true, t_name: name })
       if(type == 'package') this.setState({ pid: id, p_name: name })
       if(type == 'feature') this.setState({ fid: id, f_name: name })
    }

    cancelOpen() {
        this.setState({ is_open: false })
    }

    PermsOnChange(target, name, index) {
        const { perms } = this.state
        const checked = target.checked
        perms[index]['value'] = checked
        this.setState({ perms })
    }

    componentDidMount() {
        if(this.props.dontDid){
            const { themes, package_features, properties } = this.props.org_roles
            console.log(themes, package_features, properties);
            this.setState({ themes, package_features, properties })
        } else {
            this.getOrgRole()
        }
    }

    getOrgRole() {
        service
            .getPerms()
            .then(({success, themes, package_features, property}) => {
                if(success) {
                    console.log(themes, package_features, property);
                    this.setState({ properties: property, themes, package_features })
                }
            })
    }

    componentDidUpdate(pP, pS) {
        if(pS.tid !== this.state.tid) {
            this.setState({ prevTid: pS.tid })
        }
    }

    render() {
        const {themes, package_features, fid, tid, pid, properties, perms, prevTid, t_name, is_open, p_name, f_name } = this.state
        const { type } = this.props
        return (
            <div className="row">
                <div className="col-md-6 p-0">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="accordion" id="accordion">
                                        {themes.length > 0 && themes.map((theme, t_idx) =>
                                            <div className="card" key={t_idx}>
                                                <PermAcc
                                                    id={theme.id}
                                                    name={theme.name}
                                                    index={t_idx}
                                                    type="theme"
                                                    sendId={this.getId}
                                                    count={theme.all_child}
                                                    is_open={is_open}
                                                    t_name={t_name}
                                                />
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="accordion" id="accordion-2">
                                    {
                                    prevTid !== tid && package_features.length > 0 ?
                                    package_features.map((pack, p_idx) =>
                                        pack.parent_id == tid &&
                                        <div className="card border border-dark" key={p_idx}>
                                            <PermAcc key={p_idx}
                                                id={pack.id}
                                                name={pack.name}
                                                index={p_idx}
                                                type="package"
                                                sendId={this.getId}
                                                is_open={is_open}
                                                count={pack.all_child}
                                                p_name={p_name}
                                                t_name={t_name}
                                                cancelOpen={this.cancelOpen}
                                            />
                                            <div id={`acc-${p_idx}-package`} className="collapse" aria-labelledby='accordion-2' data-parent="#accordion-2">
                                                <div className="card-body">
                                                    <div className="accordion" id="accordion-3">
                                                        {pack.features.map((feature, f_idx) =>
                                                        feature.parent_id == pid &&
                                                            <PermAcc key={f_idx}
                                                                id={feature.id}
                                                                name={feature.name}
                                                                index={f_idx}
                                                                type="feature"
                                                                sendId={this.getId}
                                                                count={feature.all_child}
                                                                small={'text-lowercase'}
                                                                is_open={is_open}
                                                                t_name={t_name}
                                                                p_name={p_name}
                                                                f_name={f_name}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :
                                    <h5>Сонгоогүй байна</h5>
                                   }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body fixed-height-right">
                            <div className="table-responsive table_wrapper-100">
                                <table className="table table_wrapper_table_saaral table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="col"></th>
                                            {perms.map((perm, perm_idx) =>
                                                <th className="col" className="p-2 text-center" key={perm_idx}>
                                                    <span>{perm.name}</span>
                                                    <div className="custom-control custom-switch col-lg-12 ml-2">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id={perm.name}
                                                            onChange={(e) => this.PermsOnChange(e.target, perm.name, perm_idx)}
                                                        />
                                                        <label className="custom-control-label " htmlFor={perm.name}></label>
                                                    </div>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties.length > 0 && properties.map((property, pro_idx) =>
                                            property.parent_id == fid &&
                                            <tr key={pro_idx}>
                                                <th>
                                                    {property.name}
                                                </th>
                                                {perms.map((perm, perm_idx) =>
                                                Object.keys(property.roles).map((key, k_idx) =>
                                                    key == perm.eng_name &&
                                                    <PermChecks key={perm_idx}
                                                        fid={fid}
                                                        id={property.id}
                                                        index={pro_idx}
                                                        idx={perm_idx}
                                                        value={property.roles[key]}
                                                        name={property.name}
                                                        perm_name={perm.eng_name}
                                                        type={type}
                                                        sendValue={this.props.getValue}
                                                    />
                                                ))}
                                            </tr>
                                        )}
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

export class PermChecks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked_state: this.props.value
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange (checked) {
        const { name, index, id, perm_name, type, value, idx, fid } = this.props
        if(type) {
            this.setState({ checked_state: checked })
            this.props.sendValue(checked, name, index, idx, perm_name, id, fid)
        }
    }

    render () {
        const { name, index, id, perm_name, type, value, idx } = this.props
        const { checked_state } = this.state
        return (
            <td className="icheck-primary">
                {
                    type ?
                        value ?
                        <input
                            type="checkbox"
                            id={`${name}-${index}-${idx}`}
                            name={`${name}-${index}-${idx}`}
                            onChange={(e) => this.handleOnChange(e.target.checked)}
                        />
                        :
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    :
                        <input
                            type="checkbox"
                            id={`${name}-${index}-${idx}`}
                            name={`${name}-${index}-${idx}`}
                            checked={checked_state}
                            onChange={(e) => this.handleOnChange(e.target.checked)}
                        />
                }
                {
                   type && value ?
                    <label htmlFor={`${name}-${index}-${idx}`}></label>
                    :
                    <label htmlFor={`${name}-${index}-${idx}`}></label>
                }
            </td>
        )
    }
}