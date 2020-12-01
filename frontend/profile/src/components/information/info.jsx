import React, {Component} from "react";
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";

export  class Info extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_detail: [],
      roles: [],
      all_role:[],
      role_id:'',
      roleId: null,
      check:false,
      is_superuser:false,
      is_active: false,
      is_modal_limit_open:false,
      role_name:'',
      modal_alert_check: "closed",
      title_name: ""
    }
        this.getRole=this.getRole.bind(this)
        this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }

    componentDidMount() {
      this.handleSaveSuccess()
  }

  handleSaveSuccess(){
      service
      .detail(this.props.match.params.id)
      .then(({user_detail,roles,all_role}) => {
          this.setState({user_detail, roles, all_role,is_active: user_detail.is_active, is_superuser:user_detail.is_superuser})
          roles.map(role=>this.setState({roleId:role.id, role_name:role.name}))
      })
  }

  getRole(){
      const id =this.props.match.params.id
      const roleId =this.state.role_id
      const value={'roleId':roleId, 'id':id}
      service.roleCreate(value).then(({success, item}) => {
          if (success) {
              this.handleSaveSuccess()
              this.setState({check:false})

          }
      })
  }


  render() {
    const {id, first_name, email,is_sso, last_name, gender, username, last_login, date_joined} = this.state.user_detail

    return (
        <div className="card-body">
            <div className="row">
                <div className="col-md-4 mb-4">
                    <p><strong>Системийн ID</strong>: {id} </p>
                    <p><strong>Овог</strong>: {last_name} </p>
                    <p><strong>Нэр</strong>: {first_name} </p>
                    <p><strong>Хүйс</strong>: {gender} </p>
                    <p><strong>Цахим хаяг</strong>: {email} </p>
                    <p><strong>Хэрэглэгчийн нэр</strong>: {is_sso ? <a>{first_name}</a> : <a> {username}</a>} </p>
                    <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                    <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                    <Link to="/gov/profile"> 
                    <button className="btn gp-btn-primary">Нууц үг солих</button></Link>
                </div>
            </div>
        </div>
      )
  }
}
