import React, { Component, Fragment } from "react"
import RequestDetail from './DirectModal'
import { service } from "./service"
import Modal from '@utils/Modal/Modal'
import Loader from "@utils/Loader"

class SubmitClass extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: "/llc/llc-request/",
            agreed_submit: false,
            one_check: true,
            show_save_btn: true,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidUpdate(pP, pS) {
        const { valid_request, values } = this.props
        var forms = document.getElementsByClassName('form-control')
        if (valid_request.length == forms.length ) {
            if(this.state.one_check)
                this.setState({ agreed_submit: true, one_check: false })
        }
        if(pP.values.kind !== values.kind) {
            if(values.kind == "БУЦААГДСАН" || values.kind == "ЦУЦЛАСАН")
                this.setState({ info_status: true })
        }
        if(pP.values.state !== values.state) {
            if(values.kind == "ИЛГЭЭСЭН" || values.kind == "ХҮЛЭЭГДЭЖ БУЙ" || values.state == 'ШИЙДВЭРЛЭГДСЭН')
                this.setState({ show_save_btn: false })
        }
    }

    handleSubmit() {
        const {
            project_name, id,
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            file_state, selected_tools
        } = this.props

        const { files } = this.props
        var blob = []

        const file = files[0]

        if (id) {
            if (!file_state) {
                const obj = file
                blob = new Blob([JSON.stringify(obj, null, 2)], { type : 'application/vnd.rar' })
            }
            else blob = file
        }
        else blob = file
        const form_datas = new FormData()
        form_datas.append('files', blob, file.name)
        form_datas.append('id', JSON.stringify({ id }))
        form_datas.append('project_name', project_name)
        form_datas.append('object_type', object_type)
        form_datas.append('object_count', object_count)
        form_datas.append('hurungu_oruulalt', hurungu_oruulalt)
        form_datas.append('zahialagch', zahialagch)
        form_datas.append('ulsiin_hemjeend', this.props.nationwide ? this.props.nationwide: '' )
        form_datas.append('selected_tools', JSON.stringify({ selected_tools }))
        this.props.enableLoader(true)
        service.saveRequest(form_datas).then(({ success, info }) => {
            this.props.values.handlePassValues(success, info)
        })
    }

    render() {
        var { values, file_name } = this.props
        const { agreed_submit, show_save_btn } = this.state
        return (
            <Fragment>
                {
                    !values.id
                    ?
                        <button
                            type="button"
                            disabled={!agreed_submit || !file_name ? true : ''}
                            className={`btn btn-primary col-12 ${values.id > 0 ? "invisible" : "" }`}
                            onClick={()=> this.handleSubmit()}
                        >
                            <i className="fa fa-envelope-open-o"> Хүсэлт үүсгэх</i>
                        </button>
                    :
                        <div className="col-md-8 mt-2 ">
                            <button className="btn btn-secondary btn-sm">
                                <i
                                    className="fa fa-angle-double-left"
                                    onClick={()=> values.history.push(this.state.url)}
                                >
                                    Буцах
                                </i>
                            </button> &nbsp; &nbsp; &nbsp; &nbsp;
                            {
                                show_save_btn
                                ?
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={()=> this.handleSubmit()}
                                        disabled={!values.files.length > 0}
                                    >
                                            <i className="fa"> Хадгалах</i>
                                    </button>
                                :
                                    null
                            }
                        </div>
                }
            </Fragment>
        )
    }
}

export class RequestAdd extends Component {

    constructor(props) {
        super(props)
        this.list = []
        this.state = {
            files: [],
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: 1,
            zahialagch: '',
            modal_status: 'closed',
            vector_datas: [],
            tool_datas: [],
            selected_tools: [],
            state: '',
            file_state: false,
            aimag_name: '',
            aimag_geom: [],
            kind: '',
            state: '',
        }

        this.handlePassValues = this.handlePassValues.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.getTools = this.getTools.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.enableLoader = this.enableLoader.bind(this)
    }

    componentDidMount() {
        const { id } = this.props.match.params
        if (id) {
            this.setState({ is_loading: true })
            service.handleRequestData(id).then(({ vector_datas, form_field, emp_fields, aimag_name, aimag_geom }) => {
                if (form_field) {
                    this.setState({
                        vector_datas,
                        aimag_name,
                        aimag_geom,
                        zahialagch: form_field['client_org'],
                        project_name: form_field['project_name'],
                        object_type: form_field['object_type'],
                        object_count: form_field['object_quantum'],
                        hurungu_oruulalt: form_field['investment_status'],
                        selected_tools: form_field['selected_tools'],
                        files: form_field['file_path'],
                        state: form_field['state'],
                        kind: form_field['kind'],
                        desc: form_field['desc'],
                        geo_id: form_field['geo_id'],
                        emp_fields,
                        mergejilten: form_field['selected_user'],
                        is_loading: false,
                    })
                }
            })
        }
        this.getTools()
    }

    getTools() {
        service
            .getToolDatas()
            .then(({ tool_datas }) => {
                this.setState({ tool_datas })
            })
    }

    handleModalClose() {
        this.props.history.push(`/llc/llc-request/`)
    }

    modalClose() {
        this.setState({ modal_status: 'closed' })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    handlePassValues(success, info, is_description) {
        this.enableLoader(false)
        if(is_description) {
            this.modalChange(
                '',
                'fa fa-info-circle',
                'warning',
                'Тайлбар',
                info,
                false,
                "",
                this.setState({modal_status:'closed'}),
            )
        }
        else {
            if(success) {
                this.modalChange(
                    '',
                    'fa fa-check-circle',
                    'success',
                    'Амжилттай',
                    info,
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
                    'Алдаа гарлаа',
                    info,
                    false,
                    "",
                    this.modalClose
                )
            }
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

    enableLoader(state) {
        this.setState({ is_loading: state })
    }

    render (){
        const { id, info } = this.props.match.params
        return (
            <div className="card">
                <Loader is_loading={this.state.is_loading}/>
                <div className="card-body">
                    <RequestDetail
                        id={id}
                        {...this.state}
                        submitClass={SubmitClass}
                        handlePassValues={this.handlePassValues}
                        history={this.props.history}
                        info={info}
                        enableLoader={this.enableLoader}
                    />
                </div>
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    modal_bg={this.state.modal_bg}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    text={this.state.text}
                    has_button={this.state.has_button}
                    actionNameBack={this.state.actionNameBack}
                    actionNameDelete={this.state.actionNameDelete}
                    modalAction={this.state.modalAction}
                    modalClose={this.state.modalClose}
                />
        </div>
    )}
}
