import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'



export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
            roles: [],
            all_role:[],
            role_id:'',
            roleId: null,
            check:false
        }
        this.handleOnClick=this.handleOnClick.bind(this)
        this.getRole=this.getRole.bind(this)
        this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }
    
    componentDidMount() {
        this.handleSaveSuccess()
    }
    handleSaveSuccess(){
        service
        .detail(this.props.match.params.id)
        .then(({user_detail,roles, all_role}) => {
            this.setState({user_detail, roles,all_role})
            roles.map(role => this.setState({roleId: role.id}))
        })
    }
    getRole(){
        const id =this.props.match.params.id
        const roleId =this.state.role_id
        const value={'roleId':roleId, 'id':id}
        service.roleCreate(value).then(({success, item}) => {
            if (success) 
            {
                this.handleSaveSuccess()
                this.setState({check:false})

            }
        })
    }

    handleOnClick(id){
       this.setState({
           role_id:id,
           check:true,
           roleId: id
       })
    }


    render() {
        const {id, first_name, email, is_active, is_sso, is_superuser, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const check=this.state.check
        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn btn-outline-primary" exact to={'/back/user/'}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <p><strong>Системийн ID</strong>: {id} </p>
                        <p><strong>Нэр</strong>: {last_name} {first_name} </p>
                        <p><strong>Хүйс</strong>: {gender} </p>
                        <p><strong>Цахим хаяг</strong>: {email} </p>
                        <p><strong>Хэрэглэгчийн нэр</strong>: {username} </p>
                        <p><strong>Админ эсэх</strong>: {is_superuser ? 'Админ' : '-'} </p>
                        <p><strong>Идэвхитэй эсэх</strong>: {is_active ? 'Идэвхитэй' : '-'} </p>
                        <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                        <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                    </div>
                    <div className="col-md-8 mb-4">
                        <h5>Хэрэглэгчийн одоогийн эрхийн түвшин </h5>
                          <ul>{this.state.roles.map(bla => <li key={bla.id} style={{listStyleType:"none"}}>{bla.name}</li>)}</ul>
                          <h4>Хэрэглэгчийн Эрхийн түвшинүүд </h4>
                          <table>
                              <tbody>
                                     {this.state.all_role.map(role => 
                                     <tr key={role.id}>
                                         <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={role.id === this.state.roleId} 
                                                    name="input" 
                                                    onChange={() => this.handleOnClick(role.id)}/>
                                                &nbsp; {role.name}
                                        </td>
                                     </tr>)
                                      }
                              </tbody>
                          </table>
                           
                          <br/> 
                            {check && <button type="button" className="btn btn-outline-primary" onClick={this.getRole}>Хадгалах</button>}
                    </div> 
                <div>

                </div>
                </div>
            </div>
        )
    }
}
