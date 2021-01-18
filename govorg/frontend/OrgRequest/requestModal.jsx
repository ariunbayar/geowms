import React, {Component, Fragment} from "react"
import RequestMap from './Map'
import {service} from './service'
import Modal from '../components/helpers/Modal'


export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
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
        const { id } = this.props
        if(this.state.action_type == 'approve' && id)
        {
            service.requestDelete(id).then(({ success, info }) =>{
                if(success)
                {
                    this.setState({status: "closing"})
                    setTimeout(() => {
                        this.setState({status: "closed"})
                        this.props.modalClose()
                        this.props.modalAlertOpen(info, "success")
                        this.props.getAll()
                    }, 150)
                }
                else
                {
                    this.setState({status: "closing"})
                    setTimeout(() => {
                        this.setState({status: "closed"})
                        this.props.modalClose()
                        this.props.modalAlertOpen(info, "warning")
                    }, 150)
                }

            }).catch((error) => {
                if(error == 'Bad Request')
                {
                    this.setState({status: "closing"})
                    setTimeout(() => {
                        this.setState({status: "closed"})
                        this.props.modalClose()
                        this.props.modalAlertOpen("Алдаа гарлаа. Обьект олдсонгүй.", "danger")
                    }, 150)
                }
            })
        }
        if(this.state.action_type == 'reject')
        {
            this.setState({
                is_loading: true
            })
            this.props.modalAction()
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
        this.setState({status: "initial"})
        setTimeout(() => {
            this.setState({status: "open"})
        }, 0)
    }

    handleClose() {
        this.setState({status: "closing"})
        setTimeout(() => {
            this.setState({status: "closed"})
            this.props.modalClose()
        }, 150)
    }

    render () {
        const {status} = this.state
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
        const { form_json, id, kind, geo_json } = this.props
        const { is_loading,  modal_status, text, title, model_type_icon, action_name } = this.state
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

                                <div className="row">
                                    {form_json &&
                                    <div className="col-md-6 overflow-auto text-justify" style={{height:"calc( 90vh - 85px - 15px)"}}>
                                        {
                                        form_json ? form_json.map((prop, idx)=>
                                            <div key={idx} className="row my-3">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">{prop.property_code}</label>
                                                </div>
                                                <div className="col-md-2"></div>
                                                <div  className="col-md-6 mr-1">
                                                    <input
                                                        className='form-control'
                                                        disabled={true}
                                                        value={prop.data}
                                                        type={prop.value_type}
                                                    />
                                                <div  className="col-form-label " >{prop.property_definition}</div>
                                                </div>
                                            </div>
                                            ):null
                                        }
                                    </div>
                                    }
                                    <div className= {form_json ? "col-md-6" : "col-md-12"}>
                                        {
                                            <RequestMap geoJson ={geo_json}/>
                                        }

                                    </div>
                                </div>
                                <div className="row my-2 mr-1 float-right">
                                    <button
                                        type="button mr-2 ml-2"
                                        onClick={() => this.handleModalOpen(
                                            'approve',
                                            `Та ${kind == 1 ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                            : kind == 2 ? 'засагдсан геометр өгөгдлийг':
                                            kind == 3 ? 'геометр өгөгдлийг устгахыг' :null }
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
                                            'reject',
                                            `Та ${kind == 1 ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                            : kind == 2 ? 'засагдсан геометр өгөгдлийг':
                                            kind == 3 ? 'геометр өгөгдлийг устгахыг' :null }
                                            зөвшөөрөхдөө итгэлтэй байна уу ?`,
                                            "Тохиргоог зөвшөөрөх",
                                            "warning",
                                            " зөвшөөрөх"
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
                        modalAction = {() => this.handleModalAction()}
                        modalClose = {() => this.handleModalClose()}
                        text = {text}
                        title = {title}
                        status = {modal_status}
                        model_type_icon = {model_type_icon}
                        actionNameDelete = {action_name}
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}
