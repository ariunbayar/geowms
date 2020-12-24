import React, { Component, Fragment } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../../components/helpers/ModalAlert';
import { service } from './service'
import InsPerms from '../Role/GovPerms'

export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.role=[]
        this.remove_perms=[]
        this.emp_perms=[]
        this.state = {
            username: '',
            first_name: '',
            last_name: '',
            position: '',
            email: '',
            gender: 'Эрэгтэй',
            register: '',
            role_id: '',
            is_admin: '',
            role_list: [],

            errors: {
                username: '',
                first_name: '',
                last_name: '',
                position: '',
                email: '',
                register: '',
                role_id: '',
            },

            roles: {},
            perms: {},
            is_inspire_role: false,
            prefix: '/gov/perm/employee/',
            id: this.props.match.params.id,
            isSubmitting: false,
            modal_alert_status: "closed",
            timer: null,
            model_type_icon: '',
            title: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.validate = this.validate.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getRolesForOption = this.getRolesForOption.bind(this)
        this.getDetail = this.getDetail.bind(this)
        this.getRole = this.getRole.bind(this)
        this.getValue = this.getValue.bind(this)
        this.removeItemFromArray = this.removeItemFromArray.bind(this)
        this.removeItemFromRemoveRoles = this.removeItemFromRemoveRoles.bind(this)
        this.checkRoleAndPerm = this.checkRoleAndPerm.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidMount() {
        this.perms = []
        this.role = []
        this.remove_perms = []
        this.emp_perms=[]

        this.getDetail()
    }

    getDetail() {
        const { id } = this.state
        service
            .getDetailEmployee(id)
            .then(({ success, employee_detail, role_id, perms }) => {
                if (success) {
                    Object.keys(employee_detail).map((key) => {
                        this.setState({[key]: employee_detail[key]})
                    })
                    this.setState({role_id, perms})
                    this.getRolesForOption()
                }
            })
    }

    getRolesForOption() {
        service
            .getRoleList()
            .then(({ success, roles }) => {
                if (success) {
                    this.setState({ role_list: roles })
                    this.getRole(this.state.role_id)
                }
            })
    }

    getRole(role_id) {
        this.perms=[]
        this.setState({role_id, is_inspire_role: false })
        if(role_id) {
            service
                .getRole(role_id)
                .then(({ success, roles }) => {
                    if (success) {
                        this.role = []
                        this.setState({ roles, is_inspire_role: true })
                    }
                })
        }
    }

    handleChange(name, value) {
        this.setState({[name]: value})
    }

    validate() {
        let username = '';
        let first_name = '';
        let last_name = '';
        let position = '';
        let email = '';
        let register = '';

        if (!this.state.username) {
            username = "Хоосон байна. Утга оруулна уу!";
        }
        if (!this.state.first_name) {
            first_name = "Хоосон байна. Утга оруулна уу!";
        }
        if (!this.state.last_name) {
            last_name = "Хоосон байна. Утга оруулна уу!";
        }
        if (!this.state.position) {
            position = "Хоосон байна. Утга оруулна уу!";
        }

        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.email)) {
            email = "Зөв e-mail хаяг оруулна уу."
        }

        var pattern = new RegExp(/[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОөӨпПрРсСтТуУүҮфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]{2}[0-9]{8}/)
        if (!pattern.test(this.state.register)) {
            register = "Регистер дугаараа зөв оруулна уу."
        }

        if (username || first_name || last_name || position || email || register) {
            this.setState({ errors:{username, first_name, last_name, position, email, register} });
            return false;
        }

        return true
    }

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id, type, is_true_type, is_role_emp_id, is_emp_perm) {
        if(!checked && this.role.length > 0 && type == null) {
            this.removeItemFromArray(
                this.role,
                feature_id,
                property_id,
                perm_kind,
                is_role_emp_id,
                is_emp_perm
            )
        }
        if(!checked && this.perms.length > 0) {
            this.removeItemFromArray(
                this.perms,
                feature_id,
                property_id,
                perm_kind,
            )
        }
        if((checked && !type && !is_emp_perm) ||
            (checked && (type == 'role' || type == "perms"))
        ) {
            const add_role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
                'emp_role_ins_id': is_role_emp_id ? is_role_emp_id : null,
            }
            if (type == 'role') this.role.push(add_role)
            if (type == 'perms') this.emp_perms.push(add_role)
            else this.perms.push(add_role)
        }
        if (is_emp_perm && checked && type == null && this.remove_perms.length > 0) {
            this.removeItemFromRemoveRoles(is_role_emp_id)
        }
    }

    removeItemFromArray (array, feature_id, property_id, perm_kind, perm_inspire_id, is_emp_perm) {
        array.map((perm, idx) => {
            if(perm.feature_id == feature_id &&
                perm.property_id == property_id &&
                perm.perm_kind == perm_kind)
            {
                if(is_emp_perm) this.remove_perms.push(perm_inspire_id)
                else array.splice(idx, 1)
            }
        })
    }

    removeItemFromRemoveRoles(is_role_emp_id) {
        this.remove_perms.map((id, idx) => {
            if (id == is_role_emp_id) {
                this.remove_perms.splice(idx, 1)
            }
        })
    }


    handleSubmit(event) {
        event.preventDefault();
        this.setState({isSubmitting: true})
        const isValid = this.validate();
        if (isValid) {
            this.setState({errors: {
                username: '',
                first_name: '',
                last_name: '',
                position: '',
                email: '',
                register: '',
            }});
            const {username, first_name, last_name, position, email, gender, register, is_admin, role_id, id} = this.state
            this.setState({ handleSaveIsLoad: true })
            this.checkRoleAndPerm()
            service
                .updateEmployee(username, first_name, last_name, position, email, gender, register, is_admin, role_id, id, this.perms, this.remove_perms)
                .then(({ success, info }) => {
                    if(success) {
                        this.setState({isSubmitting: false})
                        this.setState({model_type_icon: 'success'})
                    } else {
                        this.setState({isSubmitting: false})
                        this.setState({model_type_icon: 'danger'})
                    }
                    this.setState({ modal_alert_status: 'open', title: info})
                    this.modalCloseTime()
                })
        } else {
            this.setState({isSubmitting: false})
        }
    }

    checkRoleAndPerm() {
        this.role.map((role, idx) => {
            this.emp_perms.map((perm, p_idx) => {
                if(role.property_id == perm.property_id && role.feature_id == perm.feature_id && role.perm_kind == perm.perm_kind) {
                    const found = this.remove_perms.find(element => element == perm.gov_perm_ins_id);
                    if(!found) {
                        this.remove_perms.push(perm.gov_perm_ins_id)
                    }
                }
            })
        })
    }

    modalClose() {
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(this.state.prefix)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(this.state.prefix)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    render() {
        const { org_roles } = this.props
        const {username, first_name, last_name, position, email, gender, register, is_admin, role_list, role_id, errors, roles, is_inspire_role, prefix, isSubmitting, perms} = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <NavLink to={`${prefix}`}>
                        <p className="btn gp-outline-primary">
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </p>
                    </NavLink>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <div className="position-relative has-icon-right">
                                    <label htmlFor="username" >Нэвтрэх нэр:</label>
                                    <input
                                        className={'form-control ' + (errors.username ? 'is-invalid' : '')}
                                        name='username'
                                        id="id_username"
                                        type="text"
                                        placeholder="Нэвтрэх нэр"
                                        value={username}
                                        onChange={(e) => this.handleChange('username', e.target.value)}
                                    />
                                    <div className="text-danger">
                                        {errors.username}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="position-relative has-icon-right">
                                    <label htmlFor="first_name">Овог:</label>
                                    <input
                                        className={'form-control ' + (errors.first_name ? 'is-invalid' : '')}
                                        name='first_name'
                                        id="id_first_name"
                                        type="text"
                                        placeholder="Овог"
                                        value={first_name}
                                        onChange={(e) => this.handleChange('first_name', e.target.value)}
                                    />
                                    <div className="text-danger">
                                        {errors.first_name}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <div className="position-relative has-icon-right">
                                    <label htmlFor="last_name">Нэр:</label>
                                    <input
                                        className={'form-control ' + (errors.last_name ? 'is-invalid' : '')}
                                        name='last_name'
                                        id="id_last_name"
                                        type="text"
                                        placeholder="Нэр"
                                        value={last_name}
                                        onChange={(e) => this.handleChange('last_name', e.target.value)}
                                    />
                                    <div className="text-danger">
                                        {errors.last_name}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="position-relative has-icon-right">
                                    <label htmlFor="position">Албан тушаал:</label>
                                    <input
                                        className={'form-control ' + (errors.position ? 'is-invalid' : '')}
                                        name='position'
                                        id="id_position"
                                        type="text"
                                        placeholder="Албан тушаал"
                                        value={position}
                                        onChange={(e) => this.handleChange('position', e.target.value)}
                                    />
                                    <div className="text-danger">
                                        {errors.position}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="email">Цахим хаяг</label>
                                <input
                                    className={'form-control ' + (errors.email ? 'is-invalid' : '')}
                                    name='email'
                                    id="id_email"
                                    type="text"
                                    placeholder="Цахим хаяг"
                                    value={email}
                                    onChange={(e) => this.handleChange('email', e.target.value)}
                                />
                                <div className="text-danger">
                                    {errors.email}
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="gender">Хүйс:</label>
                                    <select name="gender" as="select" value={gender} className={'form-control'} onChange={(e) => this.handleChange('gender', e.target.value)}>
                                        <option value='Эрэгтэй'>Эрэгтэй</option>
                                        <option value='Эмэгтэй'>Эмэгтэй</option>
                                    </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="register">Регистер:</label>
                                <input
                                    className={'form-control ' + (errors.register ? 'is-invalid' : '')}
                                    name='register'
                                    id="id_register"
                                    type="text"
                                    placeholder="Регистер"
                                    value={register}
                                    onChange={(e) => this.handleChange('register', e.target.value)}
                                />
                                <div className="text-danger">
                                    {errors.register}
                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="choose_role">Role: </label>
                                <select
                                    className={'form-control ' + (errors.role_id ? 'is-invalid' : '')}
                                    id="role_id"
                                    name='role_id'
                                    value={role_id}
                                    onChange={(e) => this.getRole(e.target.value)}
                                >
                                    <option value={null}>--- Role сонгоно уу ---</option>
                                    {role_list.length > 0 && role_list.map((role, idx) =>
                                        <option key={idx} value={role.role_id}>{role.role_name}</option>
                                    )}
                                </select>
                                <div className="text-danger">
                                    {errors.role}
                                </div>
                            </div>
                        </div>
                        <div className='form-row'>
                            <div className="form-group col-md-6">
                                <label htmlFor='is_admin'>Байгууллагын админ</label>
                                <input
                                    className="ml-2"
                                    name='is_admin'
                                    id="id_is_admin"
                                    type="checkbox"
                                    value={is_admin}
                                    checked={is_admin}
                                    onChange={(e) => this.handleChange('is_admin', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            {
                                roles !== {} && is_inspire_role
                                ?
                                    <InsPerms
                                        action_type="editable"
                                        is_employee={true}
                                        getValue={this.getValue}
                                        dontDid={true}
                                        org_roles={org_roles}
                                        role={roles}
                                        emp_perms={perms}
                                    />
                                : null
                            }
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block waves-effect waves-light m-1" disabled={isSubmitting}>
                                {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                {!isSubmitting && 'Хадгалах' }
                            </button>
                        </div>
                    </form>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status = {this.state.modal_alert_status}
                    title = {this.state.title}
                    model_type_icon = {this.state.model_type_icon}
                />
            </div>
        )
    }
}
