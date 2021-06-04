import React, { Component, Fragment } from "react"
import RequestDetail from './DirectModal'
import { service } from "./service"
import Modal from '@utils/Modal/Modal'
import { cmpPos } from "codemirror"

class SubmitClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: "/llc/llc-request/",
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(){
        const {
            files, project_name,
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            selected_tools,id, file_state
        } = this.props.values
        var blob = []
        if (id) {
            if (!file_state) {
                const obj = files
                blob = new Blob([JSON.stringify(obj, null, 2)], {type : 'application/vnd.rar'})
            }
            else blob = files
        }
        else blob = files
        const form_datas = new FormData()
        form_datas.append('files', blob, files.name)
        form_datas.append('id', JSON.stringify({id}))
        form_datas.append('project_name', project_name)
        form_datas.append('object_type', object_type)
        form_datas.append('object_count', object_count)
        form_datas.append('hurungu_oruulalt', hurungu_oruulalt)
        form_datas.append('zahialagch', zahialagch)
        form_datas.append('selected_tools', JSON.stringify({selected_tools}))

        service.SaveRequest(form_datas).then(({success, info}) => {
            this.props.values.handlePassValues(success, info)
        })
    }

    render (){
        const {values} = this.props
        return (
            <Fragment>
                <div>
                    {   !values.id
                        ?
                            <button
                                type="button"
                                className={`btn btn-primary col-12 ${values.id > 0 ? "invisible" : "" }`}
                                onClick ={()=> this.handleSubmit()}
                            >
                                <i className="fa fa-envelope-open-o"> Хүсэлт үүсгэх</i>
                            </button>
                        :
                        <div className="col-md-8 mt-2  col-sm-8 col-xl-8">
                        <p className="btn btn-secondary">
                            <i
                                className="fa fa-angle-double-left"
                                onClick ={()=> values.history.push(this.state.url)}

                            >
                                Буцах
                            </i>
                        </p>
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                            {
                                values.state != 2

                                ?
                                    <p
                                    className="btn btn-primary"
                                    onClick ={()=> this.handleSubmit()}
                                    >
                                        <i className="fa"> Хадгалах</i>
                                    </p>
                                    :
                                        null
                            }
                    </div>
                }
                </div>
                </Fragment>
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
            vector_datas: [],
            tool_datas: [],
            selected_tools: [],
            file_name:'',
            state: '',
            regis_number: props.regis_number,
            file_state: false,
            aimag_name: '',
            aimag_geom: []
        }

        this.handleOnChange = this.handleOnChange.bind(this)
        this.handlePassValues = this.handlePassValues.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.getTools = this.getTools.bind(this)
        this.handleSelectModel = this.handleSelectModel.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    handleSelectModel(selected_tools) {
        this.setState({selected_tools})
    }

    componentDidMount() {
        const {id} = this.props.match.params
        if (id) {
            service.handleRequestData(id).then(({ vector_datas, form_field, aimag_name, aimag_geom}) =>{
                if (form_field){
                    this.setState({
                        vector_datas,
                        zahialagch: form_field['client_org'],
                        project_name: form_field['project_name'],
                        object_type: form_field['object_type'],
                        object_count: form_field['object_quantum'],
                        hurungu_oruulalt: form_field['investment_status'],
                        selected_tools: form_field['selected_tools'],
                        file_name: form_field['file_name'],
                        aimag_name,
                        aimag_geom
                    })
                }
            })
        }
        this.getTools()
    }

    getTools() {
        const {regis_number} = this.state
        service.getToolDatas(regis_number).then(({tool_datas})=>{
            this.setState({tool_datas})
        })
    }

    handleOnChange(e) {
        var name = e.target.name
        var {file_name, file_state} = this.state
        const {id} = this.props.match.params
        var value = ''
        if (name == 'files') {
            if (id) {
                file_state = true
            }

            value = e.target.files[0]
            file_name = value.name
        }
        else {
            value = e.target.value
        }
        this.setState({[name]: value, file_name, file_state})
    }

    handleModalClose() {
        this.props.history.push(`/llc/llc-request/`)
    }

    ModalClose() {
        this.setState({ modal_status: 'closed' })
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handlePassValues(success, info) {
        if(success){
            this.modalChange(
                '',
                'fa fa-check-circle',
                'success',
                info,
                '',
                false,
                "",
                this.handleModalClose
            )
        }
        else {
            this.modalChange(
                '',
                'fa fa-times-circle',
                'danger',
                info,
                '',
                false,
                "",
                this.ModalClose
            )
        }
    }

    modalChange(action_type, modal_icon, icon_color, title, text, has_button, action_name, modalClose) {
        this.setState({
            action_type,
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
            action_name,
            modalClose
        })
        this.handleModalOpen()
    }

    render (){
        const {id, info} = this.props.match.params
        return (
            <div className="card">
                <div className="card-body">
                    <RequestDetail
                        id={id}
                        {...this.state}
                        handleOnChange={this.handleOnChange}
                        submitClass={SubmitClass}
                        handlePassValues={this.handlePassValues}
                        history={this.props.history}
                        info={info}
                        handleSelectModel={this.handleSelectModel}
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
    )}
}
