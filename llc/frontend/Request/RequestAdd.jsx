import React, { Component } from "react"
import filesize from 'filesize'
import RequestDetail from './DirectModal'
import { service } from "./service"
import Modal from '@utils/Modal/Modal'

class SubmitClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(){
        const {
            files, project_name,
            object_type, object_count,
            hurungu_oruulalt, zahialagch
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
        return (
            <div className="col-md-12 mt-2">
                <button
                    type="button"
                    className="btn btn-primary col-12"
                    onClick ={()=> this.handleSubmit()}
                >
                    <i className="fa fa-envelope-open-o"> Хүсэлт үүсгэх</i>
                </button>
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
    }

    componentDidMount() {
        const {id} = this.props.match.params
        service.handleRequestData(id).then(({ vector_datas }) =>{
            this.setState({vector_datas})
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
        this.props.history.push('/llc/llc-request/')
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

        render (){
            const {
                files, project_name,
                object_type, object_count,
                hurungu_oruulalt, zahialagch,
                vector_datas
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

