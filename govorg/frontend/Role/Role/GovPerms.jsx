import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {service} from "./service"
import {PermAcc} from './PermAccordion'
import "./ins.css"

export default class InsPerms extends Component {

    constructor(props) {
        super(props)
        this.forThemeCount=0
        this.sendPropertyInfo=[]
        this.state = {
            tid: 0,
            pid: 0,
            fid: 0,
            themes: [],
            package_features: [],
            properties: [],
            perms: [
                {'name': 'харах', 'eng_name': 'PERM_VIEW', 'insp_id': 'view_gov_perm_inspire_id','all_check_value': true, 'count': 0},
                {'name': 'нэмэх', 'eng_name': 'PERM_CREATE', 'insp_id': 'create_gov_perm_inspire_id','all_check_value': true, 'count': 0},
                {'name': 'хасах', 'eng_name': 'PERM_REMOVE', 'insp_id': 'remove_gov_perm_inspire_id','all_check_value': true, 'count': 0},
                {'name': 'цуцлах', 'eng_name': 'PERM_REVOKE', 'insp_id': 'revoke_gov_perm_inspire_id','all_check_value': true, 'count': 0},
                {'name': 'хянах', 'eng_name': 'PERM_UPDATE', 'insp_id': 'update_gov_perm_inspire_id','all_check_value': true, 'count': 0},
                {'name': 'батлах', 'eng_name': 'PERM_APPROVE', 'insp_id': 'approve_gov_perm_inspire_id','all_check_value': true, 'count': 0},
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
    }

    getId(id, type, name) {
        const { properties, perms } = this.state
        if(type == 'theme') {
           this.setState({ tid: id, is_open: true, t_name: name, pid: 0, fid: 0 })
       }
       if(type == 'package') {
            this.setState({ pid: id, p_name: name })
        }
       if(type == 'feature') {
            properties.map((property, p_idx) => {
                property.parent_id == id &&
                perms.map((perm, pe_idx) => {
                    Object.keys(property.roles).map((key, k_idx) => {
                        const is_true = property.roles[perm.eng_name]
                        console.log(is_true);
                        if(!is_true){
                            perms[pe_idx]['all_check_value'] = is_true
                        }
                    })
                })
            })
           this.setState({ fid: id, f_name: name })
       }
    }

    cancelOpen() {
        this.setState({ is_open: false })
    }

    PermsOnChange(target, name, index, insp_id) {
        const { perms } = this.state
        const checked = target.checked
        perms[index]['all_check_value'] = checked
        this.setState({ perms })
        this.sendValueSelectedAll(checked, name, insp_id)
    }

    sendValueSelectedAll(checked, perm_kind, insp_id) {
        this.sendPropertyInfo = []
        const { properties, fid } = this.state
        properties.map((property, p_idx) => {
            property.parent_id == fid &&
            this.sendPropertyInfo.push(property)
        })
        this.sendPropertyInfo.map((property, idx) => {
            Object.keys(property.roles).map((key, k_idx) => {
                if (perm_kind == key && this.sendPropertyInfo[idx].roles[key]){
                    this.props.getValue(checked, perm_kind, property.id, fid, property.roles[insp_id])
                }
            })
        })
    }

    componentDidMount() {
        if (this.props.org_roles) {
            const { themes, package_features, property } = this.props.org_roles
            this.setState({ themes, package_features, properties: property })
        }
    }

    componentDidUpdate(pP, pS) {
        if(pS.tid !== this.state.tid) {
            this.setState({ prevTid: pS.tid })
        }
    }

    render() {
        const {themes, package_features, fid, tid, pid, properties, perms, prevTid, t_name, is_open, p_name, f_name } = this.state
        const { action_type } = this.props
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
                                                    total_length={theme.all_child}
                                                    now_length={theme.perm_child_ids.length}
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
                                                total_length={pack.all_child}
                                                now_length={pack.features.length}
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
                                                                total_length={feature.all_child}
                                                                now_length={feature.perm_child_ids.length}
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
                                                    {
                                                        action_type && fid > 0 ?
                                                        <div className="custom-control custom-switch col-lg-12 ml-2">
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                id={perm.name}
                                                                checked={perm.all_check_value}
                                                                onChange={(e) => this.PermsOnChange(e.target, perm.eng_name, perm_idx, perm.insp_id)}
                                                            />
                                                            <label className="custom-control-label " htmlFor={perm.name}></label>
                                                        </div>
                                                        : null
                                                    }
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
                                                        all_check_value={perm.all_check_value}
                                                        id={property.id}
                                                        index={pro_idx}
                                                        idx={perm_idx}
                                                        value={property.roles[key]}
                                                        insp_id={property.roles[perm.insp_id]}
                                                        name={property.name}
                                                        perm_name={perm.eng_name}
                                                        action_type={action_type}
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
            addable: false,
            editable: this.props.value,
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange (field, checked) {
        console.log(checked);
        const { name, index, id, perm_name, action_type, value, idx, fid, insp_id } = this.props
        this.setState({ [field]: checked })
        this.props.sendValue(checked, perm_name, id, fid, insp_id)
    }

    componentDidMount() {
        this.setState({ editable: this.props.value })
    }

    componentDidUpdate(pP) {
        if(pP.all_check_value !== this.props.all_check_value) {
            console.log("did update");
            this.setState({ [this.props.action_type]: this.props.all_check_value })
        }
    }

    render () {
        const { name, index, id, perm_name, action_type, value, idx, insp_id } = this.props
        const { addable, editable } = this.state
        return (
            <td className="icheck-primary">
                {
                    action_type == 'addable' ?
                        value ?
                        <input
                            type="checkbox"
                            id={`${name}-${index}-${idx}`}
                            name={`${name}-${index}-${idx}`}
                            checked={addable}
                            onChange={(e) => this.handleOnChange('addable', e.target.checked)}
                        />
                        :
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    : action_type == 'editable' ?
                        value ?
                        <input
                            type="checkbox"
                            id={`${name}-${index}-${idx}`}
                            name={`${name}-${index}-${idx}`}
                            checked={editable}
                            onChange={(e) => this.handleOnChange('editable', e.target.checked)}
                        />
                        :
                        <i className="fa fa-minus" aria-hidden="true"></i>
                    :
                        <input
                            type="checkbox"
                            id={`${name}-${index}-${idx}`}
                            name={`${name}-${index}-${idx}`}
                            checked={this.props.value}
                            onChange={(e) => this.handleOnChange(e.target.checked)}
                        />
                }
                {
                action_type && value ?
                    <label htmlFor={`${name}-${index}-${idx}`}></label>
                    :
                    <label htmlFor={`${name}-${index}-${idx}`}></label>
                }
            </td>
        )
    }
}