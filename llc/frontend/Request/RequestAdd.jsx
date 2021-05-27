import React, { Component } from "react"
import filesize from 'filesize'
import RequestDetail from './DirectModal'
import { service } from "./service"
import Modal from '@utils/Modal/Modal'

class SubmitClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
            current_path:''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(){
        const {
            files, project_name,
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
        } = this.props.values
        const form_datas = new FormData()
        form_datas.append('files', files, files.name)
        form_datas.append('project_name', project_name)
        form_datas.append('object_type', object_type)
        form_datas.append('object_count', object_count)
        form_datas.append('hurungu_oruulalt', hurungu_oruulalt)
        form_datas.append('zahialagch', zahialagch)

        service.SaveRequest(form_datas).then(({success, info}) => {
            this.props.values.handlePassValues(success, info)
        })
    }

    render (){
        const {values} = this.props
        return (
                <div>
                    { values.current_path == 'Хүсэлт-илгээх'
                        ?
                            <div className="col-md-8 mt-2 ">
                                        <p className="btn btn-secondary">
                                            <i
                                                className="fa fa-angle-double-left"
                                                onClick ={()=>this.props.values.BackToList()}

                                            >
                                                     Буцах
                                            </i>
                                        </p>
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        <p className="btn btn-primary"><i className="fa"> Хүсэлт илгээх</i></p>
                            </div>
                        :
                            <button
                                type="button"
                                className={`btn btn-primary col-12 ${values.id > 0 ? "invisible" : "" }`}
                                onClick ={()=> this.handleSubmit()}
                            >
                                <i className="fa fa-envelope-open-o"> Хүсэлт үүсгэх</i>
                            </button>
                    }
                </div>
        )
    }
}


export class RequestAdd extends Component {

    constructor(props) {
        super(props)
        this.list = []
        this.state = {
            files:[],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            zahialagch: '',
            modal_status:'closed',
            vector_datas: []

        }
        this.handleOnChange = this.handleOnChange.bind(this)
        this.handlePassValues = this.handlePassValues.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.modalOpen = this.modalOpen.bind(this)
        this.BackToList = this.BackToList.bind(this)
    }

    componentDidMount() {
        const {id} = this.props.match.params
        var pathname = this.props.location.pathname
        pathname = pathname.split('/')

        if ( id > 0 ) {
            this.setState({current_path: pathname[4]})
        }
        else { this.setState({current_path: pathname[3]})}

        service.handleRequestData(id).then(({ vector_datas }) =>{
            this.setState({vector_datas})
        })
        service.handleRequestForm(id).then(({ form_field }) =>{
            if (form_field){
                this.setState({
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
                })
            }
        })

    }

    handleOnChange(e) {
        var name = e.target.name
        var value = ''
        if (name == 'files') {
            value = e.target.files[0]
        }
        else {
            value = e.target.value
        }
        this.setState({[name]: value})
    }

    modalClose() {
        this.props.history.push(`/llc/llc-request/`)
    }

    modalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handlePassValues(success, info) {
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

    BackToList(){
        this.props.history.push("/llc/llc-request/")
    }

        render (){
            const {
                files, project_name,
                object_type, object_count,
                hurungu_oruulalt, zahialagch,
                vector_datas, current_path
            } = this.state
            const {id} = this.props.match.params
            return (
                <div className="card">
                    <div className="card-body">
                        <RequestDetail
                            id={id}
                            project_name={project_name}
                            object_type={object_type}
                            object_count={object_count}
                            hurungu_oruulalt={hurungu_oruulalt}
                            zahialagch={zahialagch}
                            files={files}
                            vector_datas={vector_datas}
                            handleOnChange={this.handleOnChange}
                            submitClass={SubmitClass}
                            handlePassValues={this.handlePassValues}
                            current_path={current_path}
                            BackToList={this.BackToList}
                        />
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
                        modalClose={ this.state.modalClose }
                    />
                </div>
            )
        }
    }

