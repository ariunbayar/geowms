import React, {Component, Fragment} from "react"
import RequestMap from './Map/Map'

import {service} from './service'
import Modal from "@utils/Modal/Modal"

export const FormJson = ({form_json}) => {
    return (
        <div className="col-md-4 overflow-auto text-justify" style={{height:"calc( 90vh - 85px - 15px)"}}>
            {
                form_json
                ?
                    form_json.map((prop, idx) =>
                        <div key={idx} className="row my-3">
                            <div className="col-md-5">
                                <label className="col-form-label">{prop.property_code}</label>
                            </div>
                            <div className="col-md-7">
                                <input
                                    className='form-control'
                                    disabled={true}
                                    value={prop.data || ''}
                                    type={prop.value_type}
                                />
                            <div  className="col-form-label " >{prop.property_definition}</div>
                            </div>
                        </div>
                    )
                :
                    null
            }
        </div>
    )
}


export default class RequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",
            is_modal_approve_open: false,
            is_modal_reject_open: false,
            is_loading: this.props.is_loading,

            modal_status: "closed",
            action_type: '',
            text: '',
            title: '',
            model_type_icon: '',
            action_name: '',
        }

        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
    }

    handleModalClose(){
        this.setState({ modal_status: "closed" })
    }

    handleModalOpen(action_type, text, title, model_type_icon, action_name){

        this.setState({
            modal_status: "open",
            action_type,
            text,
            title,
            model_type_icon,
            action_name
        })
    }

    handleModalAction(){
        const { values } = this.props
        let modal_info
        let modal_type
        let ids = []
        let feature_id
        values.map((value, idx) => {
            if (idx == 0) feature_id = value.feature_id
            ids.push(value.id);
        })
        if(this.state.action_type == 'reject')
        {
            service
                .requestReject(ids, feature_id)
                .then(({ success, info }) => {
                    this.setState({ status: "closing" })
                    if(success)
                    {
                        setTimeout(() => {
                            this.setState({ status: "closed" })
                            modal_type = 'success'
                            this.props.getAll()
                        }, 150)
                    }
                    else {
                        setTimeout(() => {
                            this.setState({ status: "closed" })
                            modal_type = 'warning'
                        }, 150)
                    }
                    modal_info = info
                    this.props.modalClose()

                })
                .catch((error) => {
                    if(error == 'Bad Request')
                    {
                        setTimeout(() => {
                            this.setState({ status: "closed" })
                            this.props.modalClose()
                            modal_type = 'danger'
                            modal_info = 'Алдаа гарлаа. Обьект олдсонгүй'
                        }, 150)
                    }
                })
            this.props.modalAlertOpen(modal_info, modal_type)
        }
        if(this.state.action_type == 'approve')
        {
            this.setState({
                is_loading: true
            })
            this.props.modalAction(ids, feature_id)
        }
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()
    }

    componentDidUpdate(prevProps) {
        if (this.props.status != prevProps.status) {
            if (["initial", "open"].includes(this.props.status)) {
                this.handleOpen()
            }
            if (["closing", "closed"].includes(this.props.status)) {
                this.handleClose()
            }
        }
    }

    handleOpen() {
        this.setState({ status: "open" })
    }

    handleClose() {
        this.setState({status: "closed"})
        this.props.modalClose()
    }

    selectedFeature(e) {
        const feature = e.selected[0]
        if (feature) {
            const { values } = this.props
            const id = feature.getProperties()['id']
            values.map((value, idx) => {
                if (value.id == id) {
                    this.setState({ show_form: true, form_json: value.form_json })
                }
            })
        }
    }

    render () {

        const selected_form_json = this.state.form_json
        const { values } = this.props
        const { is_loading,  modal_status, text, title, model_type_icon, action_name, status } = this.state

        const className =
            "modal fade" +
            (status == "initial" ? " d-block" : "") +
            (status == "open" ? " show d-block" : "") +
            (status == "closing" ? " d-block" : "") +
            (status == "closed" ? " d-none" : "")

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == "open" ? " show" : "") +
            (status == "closed" ? " d-none" : "")

        return (
            <Fragment>
                <div className={className + " ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap"} style={{height:"calc( 103vh - 85px - 15px)"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}} onClick={() => this.handleClose()} >
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">Хүсэлт шийдвэрлэx</h5>
                                    </div>
                                    <div className="col-md-1">
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                {
                                    values.length > 0
                                    ?
                                        values.map((value, idx) => {
                                            const { form_json } = value
                                            if (idx == values.length - 1) {
                                                return (
                                                    <div key={idx} className="row">
                                                        {
                                                            values.length == 1
                                                            ?
                                                                form_json && <FormJson form_json={form_json} />
                                                            :
                                                                selected_form_json && <FormJson form_json={selected_form_json} />
                                                        }
                                                        <div className={selected_form_json || (values.length == 1 && form_json) ? "col-md-8" : "col-md-12"}>
                                                            <RequestMap values={values} selectedFeature={this.selectedFeature}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    :
                                        null
                                }
                                <div className="row my-2 mr-1 float-right">
                                    <button
                                        type="button mr-2 ml-2"
                                        onClick={() => this.handleModalOpen(
                                            'reject',
                                            `Та ${
                                                values.length == 1
                                                    ?
                                                        values[0].kind == 'ҮҮССЭН' ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                                        : values[0].kind == 'ЗАССАН' ? 'засагдсан геометр өгөгдлийг'
                                                        : values[0].kind == 'УСТГАСАН' ? 'геометр өгөгдлийг устгахыг'
                                                        : null
                                                    :
                                                values.length > 1
                                                    ?
                                                        `сонгосон ${values.length} геометр өгөгдлөө`
                                                    :
                                                    null
                                            }
                                            татгалзахдаа итгэлтэй байна уу ?`,
                                            "Тохиргоог татгалзах",
                                            "success",
                                            " татгалзах"
                                        )}
                                        className="btn gp-btn-primary waves-effect waves-light"
                                    >
                                        <i className="fa fa-check-square-o">Татгалзах</i>
                                    </button>
                                    <button
                                        type="button mr-2 ml-2"
                                        onClick={() => this.handleModalOpen(
                                            'approve',
                                            `Та ${
                                                values.length == 1
                                                    ?
                                                        values[0].kind == 'ҮҮССЭН' ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                                        : values[0].kind == 'ЗАССАН' ? 'засагдсан геометр өгөгдлийг'
                                                        : values[0].kind == 'УСТГАСАН' ? 'геометр өгөгдлийг устгахыг'
                                                        : null
                                                    :
                                                values.length > 1
                                                    ?
                                                        `сонгосон ${values.length} геометр өгөгдлөө`
                                                    :
                                                    null
                                            }
                                            зөвшөөрөхдөө итгэлтэй байна уу ?`,
                                            "Тохиргоог зөвшөөрөх",
                                            "warning",
                                            "зөвшөөрөх"
                                        )}
                                        className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                                    >
                                        <i className="fa fa-check">Зөвшөөрөх</i>
                                    </button>
                                </div>
                             {is_loading && <span className="text-center modal fade show d-block text-sp" style={{position:"fixed", top:"50%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Хүсэлтийг шалгаж байна түр хүлээнэ үү... </span>}
                            </div>
                        </div>
                    </div>
                    <Modal
                        modalAction={() => this.handleModalAction()}
                        modalClose={() => this.handleModalClose()}
                        text={text}
                        title={title}
                        status={modal_status}
                        model_type_icon={model_type_icon}
                        actionNameDelete={action_name}
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
