import React, { Component } from "react"
import {service} from './service'
import ModalLimit from "./ModalLimit"
import BackButton from "@utils/Button/BackButton"


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
            is_superuser:false,
            is_active: false,
            is_modal_limit_open:false,
        }

        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        this.handleIsActiveTrue=this.handleIsActiveTrue.bind(this)
        this.handleIsActiveFalse=this.handleIsActiveFalse.bind(this)
        this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }

    componentDidMount() {
        this.handleSaveSuccess()
    }

    handleSaveSuccess(){
        service
        .detail(this.props.match.params.id)
        .then(({ user_detail }) => {
            this.setState({ user_detail, is_active: user_detail.is_active, is_superuser:user_detail.is_superuser })
        })
    }
    handleModalLimitOpen() {
       this.setState({is_modal_limit_open: !this.state.is_modal_limit_open})
    }
    handleModalLimitClose() {
        this.setState({is_modal_delete_open: false})

    }

    handleIsActiveFalse(){
        service.userDetailChange(this.props.match.params.id, false)
        .then(({success}) => {
            if(success) {
                this.setState({ is_active: false, is_modal_limit_open: false })
                const modal = {
                    modal_status: "open",
                    modal_icon: 'fa fa-check-circle',
                    modal_bg: '',
                    icon_color: 'success',
                    title: 'Амжилттай хязгаарлалаа',
                    text:'',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: null
                }
                global.MODAL(modal)
            }
        })
    }

    handleIsActiveTrue(){
        service.userDetailChange(this.props.match.params.id, true)
        .then(({success}) => {
            if(success){
                this.setState({ is_active: true })
                const modal = {
                    modal_status: "open",
                    modal_icon: 'fa fa-check-circle',
                    modal_bg: '',
                    icon_color: 'success',
                    title: 'Амжилттай идэвхжилээ',
                    text:'',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: null
                }
                global.MODAL(modal)
            }
        })
    }

    render() {
        const {id, first_name, email,is_sso, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const { is_modal_limit_open, is_active }=this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <p><strong>Системийн ID</strong>: {id} </p>
                            <p><strong>Нэр</strong>: {last_name} {first_name} </p>
                            <p><strong>Хүйс</strong>: {gender} </p>
                            <p><strong>Цахим хаяг</strong>: {email} </p>
                            <p><strong>Хэрэглэгчийн нэр</strong>: {is_sso ? <a>{first_name}</a> : <a> {username}</a>} </p>
                            <p><strong>Идэвхитэй эсэх</strong>: {is_active ?  'Идэвхтэй': '-'}
                            &nbsp; {is_active ?
                                    <button  className="btn btn-outline-danger" onClick={this.handleModalLimitOpen} >Хязгаарлах</button>
                                    :
                                    <button  className="btn gp-outline-primary"  onClick={this.handleIsActiveTrue}>Идэвхжүүлэх</button>}
                        </p>
                            <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                            <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                            <div>
                            {is_modal_limit_open &&
                            <ModalLimit
                                modalClose={this.handleModalLimitClose}
                                modalAction={this.handleIsActiveFalse}
                                text={"Та хэрэглэгчийн системд нэвтрэх эрхийг хязгаарлах гэж байна. Хязгаарлагдсан хэрэглэгч систем нэвтрэх эрхгүй болохыг анхаарна уу!"}
                                title="Тохиргоог хязгаарлах"
                            />
                            }
                            </div>
                        </div>
                    </div>
                </div>
                <BackButton {...this.props} name={'Буцах'}></BackButton>
            </div>
        )
    }
}
