import React, { Component, Fragment } from "react"
import { service } from "./service"
import RequestDetail from './DirectModal'
import Modal from '@utils/Modal/Modal'
import ModelSendData from './send_request'



class ActionClass extends Component {
    constructor(props) {
            super(props)
            this.state = {
                url: "/llc/llc-request/",
                modal_status: 'closed'
            }
            this.handleSubmit = this.handleSubmit.bind(this)
            this.modalClose = this.modalClose.bind(this)
            this.modalOpen = this.modalOpen.bind(this)
        }

        handleSubmit(){
            const {id} =this.props.values
            service.SendRequest(id).then(({ success, info}) =>{
                if(success){
                    this.modalChange(
                        'fa fa-check-circle',
                        null,
                        'success',
                        info,
                        '',
                        false,
                        '',
                        '',
                        null,
                        this.modalClose()
                    )
                }
                else {
                    this.modalChange(
                        'fa fa-times-circle',
                        null,
                        'danger',
                        info,
                        '',
                        false,
                        '',
                        '',
                        null,
                        this.modalClose()
                    )
                }

            })
        }
        modalClose() {
            this.setState({ modal_status: 'closed' })
        }

        modalOpen(){
            this.setState({ modal_status: 'open' }, () => {
                this.setState({ modal_status: 'initial' })
            })
        }

        modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
            this.setState({
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose
            }, () => {
                this.modalOpen()
            })
        }
        render (){
            const {values} = this.props
            const {url} = this.state
            return (
                    <div>
                        <div className="col-md-8 mt-2  col-sm-8 col-xl-8">
                            <p className="btn btn-secondary">
                                <i
                                    className="fa fa-angle-double-left"
                                    onClick ={()=> values.closeRequestMap()}

                                >
                                    Буцах
                                </i>
                            </p>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            <p
                                className="btn btn-primary"
                                onClick ={()=> this.handleSubmit()}
                            >
                                <i className="fa"> Хүсэлт илгээх</i>
                            </p>
                        </div>
                        <Modal
                            modal_status={ this.state.modal_status }
                            modal_icon={ this.state.modal_icon }
                            modal_bg={ this.state.modal_bg }
                            icon_color={ this.state.icon_color }
                            title={ this.state.title }
                            text={ this.state.text }
                            has_button={ this.state.has_button }
                            actionNameBack={ this.state.actionNameBack }
                            actionNameDelete={ this.state.actionNameDelete }
                            modalAction={ this.state.modalAction }
                            modalClose={ this.state.modalClose, values.closeRequestMap }
                        />
                    </div>
            )
        }
    }
class SendModal extends Component{
    constructor(props) {
        super(props)
        this.state = {
            files:[],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            zahialagch: '',
            vector_datas: []
        }
    }
    componentDidMount(){
        const values = this.props.values
        const {id} = values.field
        service.handleRequestData(id).then(({ vector_datas, form_field}) =>{
            if (form_field){
                this.setState({
                    vector_datas,
                    files :form_field['file_path'],
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
                    selected_tools: form_field['selected_tools'],
                })
            }
        })
    }

    render (){
        const {id} = this.props.values.field
        const {
            files, project_name,
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            vector_datas, selected_tools
        } = this.state
        return (
            <div className="col-md-12">
                <div className="row mt-2" style={{background:"white"}}>
                    <RequestDetail
                        id={id}
                        project_name={project_name}
                        object_type={object_type}
                        object_count={object_count}
                        hurungu_oruulalt={hurungu_oruulalt}
                        zahialagch={zahialagch}
                        files={files}
                        vector_datas={vector_datas}
                        submitClass={ActionClass}
                        selected_tools={selected_tools}
                        closeRequestMap={this.props.closeRequestMap}
                        info={this.props.values.info}
                    />
                    </div>
                </div>
        )
    }
}

export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: props.values,
            icon : this.props.icon,
            modal_status:'closed',
            state: props.values.state
        }
        this.openRequestModal = this.openRequestModal.bind(this)
        this.closeRequestMap = this.closeRequestMap.bind(this)
    }

    openRequestModal(){
        this.setState({modal_status:'open'})
    }

    closeRequestMap() {
        this.setState({ modal_status: 'closed' })
    }

    render() {
        const {values, modal_status, state} = this.state
        return (
            <div className="col-md-12">
                {
                state == 'ШИНЭ'
                        ?
                            <a className="fa fa-paper-plane-o text-primary mt-2 ml-2" onClick={this.openRequestModal}></a>
                        :
                             <a className="fa fa-check text-success mt-2 ml-2" ></a>
                }
                {
                    modal_status == 'open'
                    &&
                    <ModelSendData
                        body={SendModal}
                        field ={values}
                        status={modal_status}
                        modal_dialog={true}
                        modal_bg= 'white'
                        info={true}
                        title='Хүсэлт Илгээх'
                        closeRequestMap={this.closeRequestMap}
                    />
                }
                </div>
        )
    }
}


