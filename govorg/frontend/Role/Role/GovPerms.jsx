import React, { Component } from "react"
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
            org_roles: [],
            properties: [],
            perms: [
                {'name': 'харах', 'eng_name': 'PERM_VIEW', 'insp_id': 'view_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_view_id', 'is_role_check': 'is_role_PERM_VIEW', 'is_employee_perm': 'is_employee_perm_PERM_VIEW'},
                {'name': 'нэмэх', 'eng_name': 'PERM_CREATE', 'insp_id': 'create_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_create_id', 'is_role_check': 'is_role_PERM_CREATE', 'is_employee_perm': 'is_employee_perm_PERM_CREATE'},
                {'name': 'хасах', 'eng_name': 'PERM_REMOVE', 'insp_id': 'remove_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_remove_id', 'is_role_check': 'is_role_PERM_REMOVE', 'is_employee_perm': 'is_employee_perm_PERM_REMOVE'},
                {'name': 'засах', 'eng_name': 'PERM_UPDATE', 'insp_id': 'update_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_update_id', 'is_role_check': 'is_role_PERM_UPDATE', 'is_employee_perm': 'is_employee_perm_PERM_UPDATE'},
                {'name': 'цуцлах', 'eng_name': 'PERM_REVOKE', 'insp_id': 'revoke_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_revoke_id', 'is_role_check': 'is_role_PERM_REVOKE', 'is_employee_perm': 'is_employee_perm_PERM_REVOKE'},
                {'name': 'батлах', 'eng_name': 'PERM_APPROVE', 'insp_id': 'approve_id', 'all_check_value': true, 'is_role_emp_id': 'is_role_emp_id_approve_id', 'is_role_check': 'is_role_PERM_APPROVE','is_employee_perm': 'is_employee_perm_PERM_APPROVE'},
            ],
            is_open: false,
            t_name: '',
            p_name: '',
            f_name: '',
            roles: [],
            is_role_border: 'border border-warning',
            is_emp_border: 'border border-primary',
            border_left_right_none_bg_bg: ' border-right-0 border-left-0 bg-light'
        }

        this.getId = this.getId.bind(this)
        this.PermsOnChange = this.PermsOnChange.bind(this)
        this.cancelOpen = this.cancelOpen.bind(this)
        this.isRoleChecked = this.isRoleChecked.bind(this)
        this.isRolePermChecked = this.isRolePermChecked.bind(this)
        this.convertToOurInspire = this.convertToOurInspire.bind(this)
        this.clearRolesFromObject = this.clearRolesFromObject.bind(this)
        this.pushToState = this.pushToState.bind(this)
        this.isRoleClearObjectItem = this.isRoleClearObjectItem.bind(this)
        this.sendValueSelectedAll = this.sendValueSelectedAll.bind(this)
        this.isRoleSendValue = this.isRoleSendValue.bind(this)
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
                        if(!key.includes('id')) {
                            const is_true = property.roles[perm.is_role_check]
                            if(!is_true){
                                perms[pe_idx]['all_check_value'] = is_true
                            }
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

    PermsOnChange(target, name, index, insp_id, emp_role_id) {
        const { perms } = this.state
        const checked = target.checked
        perms[index]['all_check_value'] = checked
        this.setState({ perms })
        this.sendValueSelectedAll(checked, name, insp_id, emp_role_id)
    }

    sendValueSelectedAll(checked, perm_kind, insp_id, emp_role_id) {
        this.sendPropertyInfo = []
        const { properties, fid } = this.state
        properties.map((property, p_idx) => {
            property.parent_id == fid &&
            this.sendPropertyInfo.push(property)
        })
        this.sendPropertyInfo.map((property, idx) => {
            Object.keys(property.roles).map((key, k_idx) => {
                if (perm_kind == key && this.sendPropertyInfo[idx].roles[key]){
                    this.props.sendAllValue(
                        checked,
                        perm_kind,
                        property.id,
                        fid,
                        property.roles[insp_id],
                        'all',
                        true,
                        property.roles[emp_role_id]
                    )
                }
            })
        })
    }

    isRoleSendValue(property, checked, type_name) {
        this.state.perms.map((perm, pe_idx) => {
            Object.keys(property.roles).map((key, k_idx) => {
                if (perm.eng_name == key) {
                    if(property.roles[key]) {
                        this.props.getValue(
                            checked,
                            perm.eng_name,
                            property.id,
                            property.parent_id,
                            property.roles[perm.insp_id],
                            type_name,
                        )
                    }
                }
            })
        })
    }

    isRolePermChecked(property, main_property, index, checked, key) {
        Object.keys(property.roles).map((perm, pe_idx) => {
            if(!perm.includes('id') && property.roles[perm] == checked) {
                const is_role_object_key = `${key}_${perm}`
                if(main_property[index].roles[is_role_object_key] !== undefined) {
                    delete main_property[index].roles[is_role_object_key]
                }
                main_property[index].roles[is_role_object_key] = property.roles[perm]
            }
            if(perm.includes('id') && property.roles[perm] != null) {
                const emp_role_ins_id = `is_role_emp_id_${perm}`
                if(main_property[index].roles[emp_role_ins_id] !== undefined) {
                    delete main_property[index].roles[emp_role_ins_id]
                }
                main_property[index].roles[emp_role_ins_id] = property.roles[perm]
            }
        })
        return checked
    }

    isRoleChecked(array, main_array, key, is_send_type, parent_array, index) {
        const checked = true
        array.map((item, idx) => {
            main_array.map((main_item, mp_idx) => {
                if (item.id == main_item.id ) {
                    if(item.parent_id) {
                        if (item.parent_id == main_item.parent_id) {
                            if(index && parent_array) {
                                if(parent_array[index].features[mp_idx][key] !== undefined) {
                                    delete parent_array[index].features[mp_idx][key]
                                }
                                parent_array[index].features[mp_idx][key] = checked
                            }
                            if(item.roles) {
                                const perm_checked = this.isRolePermChecked(item, main_array, mp_idx, checked, key)
                                if(perm_checked) {
                                    if(this.props.action_type !== 'viewable') {
                                        if(is_send_type) {
                                            this.isRoleSendValue(item, checked, is_send_type)
                                        }
                                    }
                                }
                            }
                            if(main_array[mp_idx][key] !== undefined) {
                                delete main_array[mp_idx][key]
                            }
                            main_array[mp_idx][key] = checked
                        }
                    }
                    else {
                        if(main_array[mp_idx][key] !== undefined) {
                            delete main_array[mp_idx][key]
                        }
                        main_array[mp_idx][key] = checked
                    }
                }
                if(item.features) {
                    this.isRoleChecked(item.features, main_item.features, key, null, main_array, mp_idx)
                }
            })
        })
        return checked
    }

    componentDidMount() {
        if (this.props.org_roles) {
            const key = 'is_role'
            const emp_key = "is_employee_perm"
            this.props.org_roles.themes.map((theme, idx) => {
                if(key in theme) {
                    this.clearRolesFromObject(this.props.org_roles, key)
                }
                if(emp_key in theme) {
                    this.clearRolesFromObject(this.props.org_roles, emp_key)
                }
            })
            this.convertToOurInspire(this.props.org_roles)
        }
        if(this.props.emp_perms) {
            this.clearRolesFromObject(this.props.emp_perms)
        }
    }

    isRoleClearObjectItem(array, key, main_array, index, type) {
        var checked = true
        array.map((item, idx) => {
            if(!type){
                if(key in item) {
                    if(main_array && index) {
                        delete main_array[index].features[idx][key]
                    }
                    else {
                        delete array[idx][key]
                        if(item.roles) {
                            this.isRoleClearObjectItem(Object.keys(item.roles), key, array, idx, 'array')
                        }
                    }
                    if(item.features) {
                        this.isRoleClearObjectItem(item.features, key, array, idx)
                    }
                }
            }
            else if (type == 'array') {
                if(item.includes("is_role")) {
                    delete main_array[index].roles[item]
                }
                if(item.includes('is_employee_perm')){
                    delete main_array[index].roles[item]
                }
            }
        })
        return checked
    }

    clearRolesFromObject(org_roles, key) {
        var checked = true
        const { themes, package_features, property } = org_roles
        const is_true_theme = this.isRoleClearObjectItem(themes, key)
        if(is_true_theme) {
            const is_true_pack_fea = this.isRoleClearObjectItem(package_features, key)
            if(is_true_pack_fea) {
                this.isRoleClearObjectItem(property, key)
            }
        }
        return checked
    }

    convertToOurInspire(org_roles) {
        const { themes, package_features, property } = org_roles
        if(this.props.action_type == 'editable' && this.props.role) {
            const is_send_type = 'role'
            const { role } = this.props
            const key = 'is_role'
            const t_checked = this.isRoleChecked(role.themes, themes, key, null)
            if(t_checked){
                const p_checked = this.isRoleChecked(role.package_features, package_features, key, null)
                if(p_checked) {
                    this.isRoleChecked(role.property, property, key, is_send_type)
                }
            }
            if(this.props.emp_perms) {
                const is_send_type = 'perms'
                const { emp_perms } = this.props
                const key = 'is_employee_perm'
                const t_checked = this.isRoleChecked(emp_perms.themes, themes, key, null)
                if(t_checked){
                    const p_checked = this.isRoleChecked(emp_perms.package_features, package_features, key, null)
                    if(p_checked) {
                        this.isRoleChecked(emp_perms.property, property, key, is_send_type)
                    }
                }
            }
            this.setState({ themes, package_features, properties: property })
        }
        if(this.props.action_type == 'viewable' && this.props.emp_perms) {
            const { themes, package_features, property } = this.props.emp_perms
            this.setState({ themes, package_features, properties: property })
        }
        if(this.props.action_type !== 'editable' && !this.props.role && this.props.action_type !== 'viewable' && !this.props.emp_perms) {
            this.setState({ themes, package_features, properties: property })
        }
    }

    pushToState(obj) {
        Object.keys(obj).map((key) => {
            if(obj[key].length > 0) {
                obj[key].map((item, t_idx) => {
                    if(key == 'property') {
                        key = 'properties'
                    }
                    this.state[key].push(item)
                })
            }
        })
    }

    componentDidUpdate(pP, pS) {
        if(pS.tid !== this.state.tid) {
            this.setState({ prevTid: pS.tid })
        }
    }

    render() {
        const {themes, package_features, fid, tid, pid, properties, perms, prevTid, t_name, is_open, p_name, f_name, is_role_border, is_emp_border, border_left_right_none_bg } = this.state
        const { action_type, is_employee, addable_is_check, editable_is_check } = this.props
        return (
            <div className="row">
                <div className="col-md-6 p-0">
                    <div className="col fixed-height">
                        <div className="accordion my-0" id="accordion">
                                {themes.length > 0 && themes.map((theme, t_idx) =>
                                    <div className="role-bg-white-card">
                                        <div className={'mb-0 role-card ' + (theme.is_role ? is_role_border : theme.is_employee_perm ? is_emp_border : '')} key={t_idx}>
                                            <PermAcc
                                                type="theme"
                                                id={theme.id}
                                                name={theme.name}
                                                index={t_idx}
                                                total_length={theme.all_child}
                                                now_length={theme.perm_child_ids}
                                                is_open={is_open}
                                                t_name={t_name}
                                                sendId={this.getId}
                                            />
                                        </div>
                                        <div className="accordion" id="accordion-2">
                                        {
                                        prevTid !== theme.id && package_features.length > 0 &&
                                        package_features.map((pack, p_idx) =>
                                            pack.parent_id == theme.id &&
                                            <div id={`acc-${t_idx}-theme`} className={(p_idx == 0 ? `collapse role-table-card mt-3 mb-0 ` : `collapse role-table-card mt-3 mb-0 `) + (pack.is_role ? is_role_border : pack.is_employee_perm ? is_emp_border : '')} key={p_idx}>
                                                <PermAcc key={p_idx}
                                                    type="package"
                                                    id={pack.id}
                                                    name={pack.name}
                                                    index={p_idx}
                                                    total_length={pack.all_child}
                                                    now_length={pack.perm_child_ids}
                                                    is_open={is_open}
                                                    p_name={p_name}
                                                    t_name={t_name}
                                                    sendId={this.getId}
                                                    cancelOpen={this.cancelOpen}
                                                />
                                                <div id={`acc-${p_idx}-package`} className="collapse" aria-labelledby='accordion-2' data-parent="#accordion-2">
                                                    <div className="">
                                                        <div className="accordion" id="accordion-3">
                                                            {pack.features.map((feature, f_idx) =>
                                                            <div className={(feature.is_role ? is_role_border + border_left_right_none_bg : feature.is_employee_perm ? is_emp_border + border_left_right_none_bg : '')} key={f_idx}>
                                                                {feature.parent_id == pack.id &&
                                                                    <PermAcc
                                                                        type="feature"
                                                                        id={feature.id}
                                                                        name={feature.name}
                                                                        index={f_idx}
                                                                        total_length={feature.all_child}
                                                                        now_length={feature.perm_child_ids}
                                                                        small={'text-lowercase'}
                                                                        is_open={is_open}
                                                                        t_name={t_name}
                                                                        p_name={p_name}
                                                                        f_name={f_name}
                                                                        sendId={this.getId}
                                                                    />
                                                                }
                                                            </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }
                                        </div>
                                    </div>
                                )}
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
                                                        !is_employee ?
                                                        action_type && fid > 0 ?
                                                        <div className="custom-control custom-switch col-lg-12 ml-2">
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                id={perm.name}
                                                                checked={perm.all_check_value}
                                                                onChange={(e) => this.PermsOnChange(e.target, perm.eng_name, perm_idx, perm.insp_id, perm.is_role_emp_id)}
                                                            />
                                                            <label className="custom-control-label " htmlFor={perm.name}></label>
                                                        </div>
                                                        : null : null
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
                                                        is_role_check={property.roles[perm.is_role_check]}
                                                        is_role_emp_id={property.roles[perm.is_role_emp_id]}
                                                        is_emp_perm={property.roles[perm.is_employee_perm]}
                                                        is_employee={is_employee}
                                                        addable_is_check={
                                                            addable_is_check ?
                                                            addable_is_check.filter((item) => item.gov_perm_inspire_id == property.roles[perm.insp_id]).length > 0
                                                            :
                                                            false
                                                        }
                                                        editable_is_check={
                                                            editable_is_check
                                                            ?
                                                            editable_is_check.filter((item) => item.gov_perm_ins_id == property.roles[perm.insp_id]).length > 0
                                                            :
                                                            false
                                                        }
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
            addable: props.addable_is_check,
            editable: props.editable_is_check,
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange (field, checked) {
        const { name, index, id, perm_name, action_type, value, idx, fid, insp_id, is_role_check, is_role_emp_id, is_emp_perm } = this.props
        if(action_type !== 'viewable') {
            this.setState({ [field]: checked })
            this.props.sendValue(checked, perm_name, id, fid, insp_id, null, is_role_check, is_role_emp_id, is_emp_perm)
        }
    }

    componentDidMount() {
        if(this.props.is_role_emp_id) {
            this.setState({ editable: true })
        }
    }

    componentDidUpdate(pP) {
        if(pP.all_check_value !== this.props.all_check_value) {
            this.setState({ [this.props.action_type]: this.props.all_check_value })
        }
    }

    render () {
        const { name, index, id, perm_name, action_type, value, idx, insp_id, is_role_check, is_role_emp_id, is_employee, is_emp_perm } = this.props
        const { addable, editable } = this.state
        return (
            <td className={`icheck-`+ (is_role_check && is_emp_perm ? 'success' : is_role_check && !is_emp_perm ? 'warning' : is_emp_perm && !is_role_check ? "info" : 'primary')}>
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
                            disabled={is_employee && is_role_emp_id && !is_emp_perm ? 'disabled' : is_role_check && is_emp_perm ? 'disabled' : null}
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
