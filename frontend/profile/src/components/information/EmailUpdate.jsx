import React, { Component } from 'react'
import { service } from './service'
import Modal from "@utils/Modal/Modal"

export default class EmailUpdate extends Component {
    constructor(props){
        super(props)

        this.state = {
            email: '',
            error: '',
            modal_status: this.props.modal_status || 'closed',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }


    handleChange = (e) => {
        const { email } = this.state
        this.setState({email: e.target.value});
      }


    handleSubmit() {
        const { email } = this.state
        service
            .updateEmail(email)
            .then(({ success, errors }) => {
                if(success){
                    this.modalChange(
                        'fa fa-check-circle',
                        "success",
                        'Email хаягийг амжилттай шинэчиллээ!',
                         '',
                         false,
                         this.handleModalClose
                         )
                }
                else if(errors){
                    this.modalChange(
                        'fa fa-times-circle',
                        "danger",
                        `${errors}`,
                        '',
                        false,
                        this.handleModalClose
                        )
                }
            })

            this.setState({ email: '' })
        }


    modalChange(modal_icon, icon_color, title, text, has_button, modalClose) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            modalClose: modalClose
        })
        this.handleModalOpen()

    }


    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }


    handleModalClose(){
        window.location.href = "/profile"
    }


    render() {
        const { email } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-header">
                        <p className ="font-weight-bold">ШИНЭ И-МАЙЛ ХАЯГАА ОРУУЛНА УУ.</p>
                    </div>
                    <div className="form-group">
                        <input
                            error={this.state.error}
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Шинэ майл хаяг оруулна уу"
                            value ={email.value}
                            onChange={this.handleChange}>
                        </input>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit} >Хадгалах</button>
                </div>
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    has_button={this.state.has_button}
                    text={this.state.text}
                    modalClose={this.state.modalClose}
                />
            </div>
        )
    }
}
