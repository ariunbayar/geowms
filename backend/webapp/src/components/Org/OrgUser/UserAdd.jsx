import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { service } from "../service"
import { set } from "ol/transform"

export class UserAdd extends Component {

    constructor(props) {

        super(props)

        this.state = {
            id: 0,
            username: '',
            usernameError: false,
            first_name: '',
            last_name: '',
            email: '',
            emailError: false,
            gender: 'Эрэгтэй',
            register:'',
            password:'',
            re_password:'',
            position: '',
        }

        this.handleSave = this.handleSave.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeReg = this.handleChangeReg.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
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
                this.setState({id:employee.id , username: employee.username, first_name: employee.first_name, last_name: employee.last_name, email: employee.email, gender: employee.gender, register:employee.register, password:employee.password, re_password:employee.re_password, position: employee.position })
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
                    this.props.history.push( `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`)

                }
            })
        }
        else{
            if(this.state.re_password === this.state.password)
            {
                if(!this.state.username && !this.state.email)
                {
                    if(!this.state.username)
                    {
                        this.setState({usernameError: true})
                    }
                    if(!this.state.email)
                    {
                        this.setState({emailError: true})
                    }
                }
                else{
                    service.employee_add(org_level, org_id, paylaod).then(({ success, user_name }) => {
                        if (user_name) {
                            alert("Ийм нэр аль хэдийн үүссэн байна.")
                        }
                        if (success) {
                            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`)
                        }
                    })
                }
            }
            else
            {
                alert("Нууц код адилхан биш байна.")
            }
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


    render() {
        var genders = ['Эрэгтэй', 'Эмэгтэй']
        for (var i = 1; i <= 2; i = +(i + 1).toFixed(1)) {
            genders.push(<option key = {i} value = {i}>{i}</option>);
        }
        const org_emp = this.props.match.params.emp
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="container my-4">
                <div className="row">
                <div className="text-left">
                                <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/хэрэглэгч/`}>
                                    Буцах
                                </NavLink>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-4"
                            >
                                {!org_emp &&

                                <div className="form-group">
                                    <label htmlFor="id_name">Нэвтрэх нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('username', e)}
                                        value={this.state.username}
                                    />
                                    {this.state.usernameError && <a className="text-danger">Хоосон байна.</a>}
                                </div>
                                }

                                <div className="form-group">
                                    <label htmlFor="first_name">Овог:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="first_name"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('first_name', e)}
                                        value={this.state.first_name}
                                    />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="last_name">Нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="last_name"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('last_name', e)}
                                        value={this.state.last_name}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="position">Албан тушаал:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="position"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('position', e)}
                                        value={this.state.position}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">E-Mail</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('email', e)}
                                        value={this.state.email}
                                    />
                                    {this.state.emailError && <a className="text-danger">Хоосон байна.</a>}

                                </div>


                                <div className="form-group">
                                    <label htmlFor="gender">Хүис</label>
                                    <select className="form-control" id="gender" value={this.state.gender} onChange={(e) => this.handleChange('gender', e)}>
                                        <option>Эрэгтэй</option>
                                        <option>Эмэгтэй</option>
                                    </select>
                                </div>


                                <div className="form-group">
                                    <label htmlFor="register">Регистер:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="register"
                                        placeholder=" "
                                        onChange={(e) => this.handleChangeReg('register', e)}
                                        value={this.state.register}
                                    />
                                </div>


                                {!org_emp &&
                                <div className="form-group">
                                    <label htmlFor="password">password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="password"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('password', e)}
                                        value={this.state.password}
                                    />
                                </div>
                                }

                                {!org_emp &&
                                <div className="form-group">
                                    <label htmlFor="re_password">re_password</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="re_password"
                                        placeholder=" "
                                        onChange={(e) => this.handleChange('re_password', e)}
                                        value={this.state.re_password}
                                    />
                                </div>
                                }

                                <div className="form-group">
                                    <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                                        Хадгал
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
