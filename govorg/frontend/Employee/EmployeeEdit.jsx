import React, { Component } from "react"
import { NavLink } from "react-router-dom"
// import ModalAlert from "../ModalAlert";


export class EmployeeEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            last_name: '',
            first_name: '',
            user_name: '',
            email: '',
            register: '',
            sex: '',
            position: '',
            created_on: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleSave() {
        this.setState({ handleSaveIsLoad: true })
        const last_name = this.props.match.last_name
        const user_name = this.props.match.user_name
        const email = this.state.email
        const first_name = this.state.first_name
        const register = this.props.match.register
        const sex = this.props.match.sex
        const position = this.props.match.position
        const created_on = this.state.created_on
        const values = {
            "last_name": last_name, "user_name": user_name, 'first_name': first_name, "email": email, "register": register,
            'sex': sex, "position": position, "created_on": created_on
        }
    }

    modalClose() {
        const org_level = this.props.match.params.level
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(`/gov/role/employees/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(`/gov/role/employees/`)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    render() {
        const { last_name, first_name, user_name, email, register, sex, position, created_on } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-left">
                                <NavLink to={`/gov/role/employees/`}>
                                    <p className="btn gp-outline-primary">
                                        <i className="fa fa-angle-double-left"></i> Буцах
                                    </p>
                                </NavLink>
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="id_name" >Овог:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    onChange={(e) => this.handleUserSearch('last_name', e)}
                                    value={last_name}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Нэр:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    onChange={(e) => this.handleUserSearch('first_name', e)}
                                    value={first_name}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Хэрэглэгчийн нэр:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="user_name"
                                    onChange={(e) => this.handleUserSearch('user_name', e)}
                                    value={user_name}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Имэйл:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    onChange={(e) => this.handleUserSearch('email', e)}
                                    value={email}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Регистр:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="register"
                                    onChange={(e) => this.handleUserSearch('register', e)}
                                    value={register}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Хүйс:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sex"
                                    onChange={(e) => this.handleUserSearch('sex', e)}
                                    value={sex}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Албан тушаал:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="position"
                                    onChange={(e) => this.handleUserSearch('position', e)}
                                    value={position}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="id_name" >Үүсгэсэн огноо:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="created_on"
                                    onChange={(e) => this.handleUserSearch('created_on', e)}
                                    value={created_on}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group">
                                {this.state.handleSaveIsLoad ?
                                    <>
                                        <button className="btn btn-block gp-btn-primary">
                                            <a className="spinner-border text-light" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </a>
                                            <span> Шалгаж байна. </span>
                                        </button>
                                        <ModalAlert
                                            modalAction={() => this.modalClose()}
                                            status={this.state.modal_alert_status}
                                            title="Амжилттай хадгаллаа"
                                            model_type_icon="success"
                                        />
                                    </>
                                    :
                                    <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                        Хадгалах
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
