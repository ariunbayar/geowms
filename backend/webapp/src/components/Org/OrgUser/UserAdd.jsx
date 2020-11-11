import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { service } from "../service"
import { set } from "ol/transform"
import ModalAlert from "../../ModalAlert"

export class UserAdd extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: 0,
            username: '',
            usernameError: false,
            usernameErrorMessege: '',

            first_name: '',
            first_nameError: false,

            last_name: '',
            last_nameError: false,

            email: '',
            emailErrorMessege: '',
            emailError: false,

            gender: 'Эрэгтэй',

            register:'',
            registerError:false,
            registerErrorMessege:'',

            password:'',
            passwordError:false,
            passwordErrorMessege:'',

            re_password:'',
            re_passwordError:'',
            position: '',
            positionError: false,

            handleSaveIsLoad:false,
            modal_alert_status: "closed",
            timer: null,

            is_admin: false,
        }

        this.handleSave = this.handleSave.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeReg = this.handleChangeReg.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.handleFormCheck = this.handleFormCheck.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }


    componentDidMount() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp
        if(org_emp){
            this.handleGetAll(org_level, org_id, org_emp)
        }
    }

    componentDidUpdate(prevState) {

    }
    handleGetAll(org_level, org_id, org_emp){
        service.employeeMore(org_level, org_id, org_emp).then(({ employee }) => {
            if (employee) {
                {employee.map((employee) =>
                    this.setState({
                        id:employee.id,
                        username: employee.username,
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        email: employee.email,
                        gender: employee.gender,
                        register:employee.register,
                        password:employee.password,
                        re_password:employee.re_password,
                        position: employee.position,
                        is_admin: employee.is_admin
                    })
                )}

            }
        })
    }


    handleSave() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const org_emp = this.props.match.params.emp
        const paylaod = this.state
        if(org_emp){
            service.employee_update(org_level, org_id, paylaod).then(({ success }) => {
                if (success) {
                    this.setState({modal_alert_status: "open"})
                    this.modalCloseTime()
                }
            })
        }
        else{
            service.employee_add(org_level, org_id, paylaod).then(({ success, user_name }) => {
                if (user_name) {
                    this.setState({usernameError: true, usernameErrorMessege: "Ийм нэр аль хэдийн үүссэн байна.", handleSaveIsLoad: false})
                }
                if (success) {
                    this.setState({modal_alert_status: "open"})
                    this.modalCloseTime()
                }
            })
        }


    }
    handleFormCheck() {
        this.setState({handleSaveIsLoad: true})
        const org_emp = this.props.match.params.emp
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const { username, first_name, last_name,  email,  register,  password,  re_password , position} = this.state
        var fromState = true
        this.setState({ usernameError: false, first_nameError:false,last_nameError:false, usernameErrorMessege: '', emailErrorMessege: '',
                    emailError:false, registerError:false, passwordError:false,registerError:false, positionError:false, passwordErrorMessege: ''})

        if(!org_emp)
        {
            if(!username){
                this.setState({usernameError: true, usernameErrorMessege: "Хоосон байна."})
                fromState = false
            }
            if(!password) {
                fromState = false
                this.setState({passwordError: true})
            }

            if(!re_password) {
                fromState = false
                this.setState({re_passwordError: true})
            }
            if(password !== re_password){
                fromState = false
                this.setState({passwordErrorMessege: "Нууц үг хоорондоо ижил байх ёстой."})

            }
        }
        if(!position){
            this.setState({positionError: true})
            fromState = false
        }

        if(!first_name){
            this.setState({first_nameError: true})
            fromState = false
        }
        if(!last_name) {
            this.setState({last_nameError: true})

        }
        if(!email) {
            this.setState({emailError: true} )
            fromState = false
        }
        if(re.test(email))
        {
            this.setState({emailErrorMessege:''})
        }
        else{
            fromState = false
            this.setState({emailErrorMessege:"Имэйл хаяг буруу байна."})
        }

        if(!register) {
            fromState = false
            this.setState({registerError: true})
        }


        if(fromState)
        {
            this.handleSave()
        }
        else{
            this.setState({handleSaveIsLoad: false})
        }

    }

    handleChange(field, e) {
        if(e.target.value.length < 255)
        {
            this.setState({ [field]: e.target.value })
            this.setState({[field + 'Error']: false})

        }
    }
    handleChangeReg(field, e) {
        if(e.target.value.length < 11)
        {
            this.setState({ [field]: e.target.value })

        }
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`)
        }, 2000)
    }

    modalClose(){
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
        this.setState({handleSaveIsLoad:false})
        this.props.history.push( `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`)
    }


    render() {
        const org_emp = this.props.match.params.emp
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="col-6 my-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-12">
                                {!org_emp &&
                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="id_name">Нэвтрэх нэр:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Нэвтрэх нэр"
                                            onChange={(e) => this.handleChange('username', e)}
                                            value={this.state.username}
                                        />
                                        {this.state.usernameErrorMessege && <a className="text-danger">{this.state.usernameErrorMessege}</a>}
                                    </div>
                                </div>
                                }
                                <div className="form-row">

                                    <div className="form-group col-md-4">
                                        <label htmlFor="last_name">Овог:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="last_name"
                                            placeholder="Овог"
                                            onChange={(e) => this.handleChange('last_name', e)}
                                            value={this.state.last_name}
                                        />
                                        {this.state.last_nameError && <a className="text-danger">Хоосон байна.</a>}

                                    </div>
                                    <div className="form-group col-md-4">
                                        <label htmlFor="first_name">Нэр:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="first_name"
                                            placeholder="Нэр"
                                            onChange={(e) => this.handleChange('first_name', e)}
                                            value={this.state.first_name}
                                        />
                                        {this.state.first_nameError && <a className="text-danger">Хоосон байна.</a>}

                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="position">Албан тушаал:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="position"
                                            placeholder="Албан тушаал"
                                            onChange={(e) => this.handleChange('position', e)}
                                            value={this.state.position}
                                        />
                                        {this.state.positionError && <a className="text-danger">Хоосон байна.</a>}

                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-check">
                                        <input type="checkbox" class="form-check-input" id="is_admin" checked={this.state.is_admin} onChange={(e) => this.setState({is_admin: e.target.checked})}/>
                                        <label className="form-check-label" for="is_admin">Байгууллагын админ</label>
                                    </div>
                                </div>
                                <div className="form-row">

                                    <div className="form-group col-md-8">
                                        <label htmlFor="email">E-Mail</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            placeholder="E-Mail"
                                            onChange={(e) => this.handleChange('email', e)}
                                            value={this.state.email}
                                        />
                                        {this.state.emailError && <li><a className="text-danger">Хоосон байна.</a></li>}
                                        {this.state.emailErrorMessege && <li><a className="text-danger">{this.state.emailErrorMessege}</a></li>}

                                    </div>
                                </div>

                                <div className="form-row">

                                    <div className="form-group col-md-8">
                                        <label htmlFor="gender">Хүйс:</label>
                                        <select className="form-control" id="gender" value={this.state.gender} onChange={(e) => this.handleChange('gender', e)}>
                                            <option>Эрэгтэй</option>
                                            <option>Эмэгтэй</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-8">
                                        <label htmlFor="register">Регистер:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="register"
                                            placeholder="Регистер"
                                            onChange={(e) => this.handleChangeReg('register', e)}
                                            value={this.state.register}
                                        />
                                        {this.state.registerError && <a className="text-danger">Хоосон байна.</a>}

                                    </div>
                                </div>

                                <div className="form-row">
                                    {!org_emp &&
                                    <div className="form-group col-md-4">
                                        <label htmlFor="password">Нууц үг:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Нууц үг"
                                            onChange={(e) => this.handleChange('password', e)}
                                            value={this.state.password}
                                        />
                                        {this.state.passwordError && <a className="text-danger">Хоосон байна.</a>}

                                    </div>
                                    }

                                    {!org_emp &&
                                    <div className="form-group col-md-4">
                                        <label htmlFor="re_password">Нууц үг дахин оруулах:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="re_password"
                                            placeholder="Нууц үг дахин оруулах"
                                            onChange={(e) => this.handleChange('re_password', e)}
                                            value={this.state.re_password}
                                        />
                                        <ul>
                                        {this.state.re_passwordError && <li><a className="text-danger">Хоосон байна.</a></li>}
                                        {this.state.passwordErrorMessege && <li><a className="text-danger">{this.state.passwordErrorMessege}</a></li>}
                                        </ul>
                                    </div>
                                    }

                                </div>
                                <div className="form-group">
                                    {this.state.handleSaveIsLoad ?
                                        <>
                                            <button className="btn gp-btn-primary">
                                                <a className="spinner-border text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </a>
                                                <span> Шалгаж байна. </span>
                                            </button>
                                            <ModalAlert
                                                modalAction={() => this.modalClose()}
                                                status={this.state.modal_alert_status}
                                                title="Амжилттай хадгаллаа"
                                                model_type_icon = "success"
                                            />
                                        </>
                                        :
                                        <button className="btn gp-btn-primary" onClick={this.handleFormCheck} >
                                            Хадгалах
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
