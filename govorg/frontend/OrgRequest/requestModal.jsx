import React, {Component, Fragment} from "react"
import RequestMap from './Map'
import {service} from './service'
import Modal from '.././Components/helpers/Modal'


export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            is_modal_approve_open:false,
            is_modal_reject_open:false
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
        this.handleModalRejectClose=this.handleModalRejectClose.bind(this)
        this.handleModalRejectOpen=this.handleModalRejectOpen.bind(this)
        this.handleModalApproveOpen=this.handleModalApproveOpen.bind(this)
        this.handleModalApproveClose=this.handleModalApproveClose.bind(this)
    }
    handleModalRejectClose(){
        this.setState({
            is_modal_reject_open:false
        })
    }

    handleModalRejectOpen(){
        this.setState({
            is_modal_reject_open:true
        })
    }

    handleModalApproveOpen(){
        this.setState({
            is_modal_approve_open:true
        })
    }

    handleModalApproveClose(){
        this.setState({
            is_modal_approve_open:false
        })
    }

    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
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

    handleClose(id,callback) {
        if(id){
            service.requestDelete(id).then(({success}) =>{
                this.setState({status: "closing"})
                setTimeout(() => {
                    this.setState({status: "closed"})
                    this.props.modalClose()
                    this.props.getAll()
                }, 150)
            })
        }
        else{
            this.setState({status: "closing"})
            setTimeout(() => {
                this.setState({status: "closed"})
                this.props.modalClose()
            }, 150)
        }
    }

    handleProceed() {
        this.props.modalAction()
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
        const form_json = this.props.form_json
        const id = this.props.id
        const kind = this.props.kind
        const {is_modal_approve_open, is_modal_reject_open} = this.state
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
                                        form_json ? form_json.form_values.map((prop, idx)=>
                                            <div key={idx} className="row my-3">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">{prop.property_code}</label>
                                                </div>
                                                <div className="col-md-2"></div>
                                                <div  className="col-md-6 mr-1">
                                                    <input
                                                        className='form-control'
                                                        disabled={true}
                                                        placeholder={prop.property_name}
                                                        value={prop.property_name}
                                                        type="text"
                                                    />
                                                <div  className="col-form-label " >{prop.property_definition}</div>
                                                </div>
                                            </div>
                                            ):null
                                        }
                                    </div>
                                    }
                                    <div className= {form_json ? "col-md-6" : "col-md-12"}>
                                        <RequestMap geoJson ={this.props.geo_json}/>
                                    </div>
                                </div>
                                <div className="row my-2 mr-1 float-right">
                                    <button type="button mr-2 ml-2" onClick={() => this.handleModalRejectOpen()} className="btn gp-btn-primary waves-effect waves-light">
                                        <i className="fa fa-check-square-o">Татгалзах</i>
                                    </button>
                                    { 
                                     is_modal_reject_open &&
                                        <Modal
                                            modalAction={() => this.handleClose(id)}
                                            modalClose = {() => this.handleModalRejectClose()}
                                            text={`Та ${kind == 1 ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                            : kind == 2 ? 'засагдсан геометр өгөгдлийг':
                                            kind == 3 ? 'геометр өгөгдлийг устгахыг' :null }
                                            татгалзахдаа итгэлтэй байна уу ?`}
                                            title="Тохиргоог татгалзах"
                                            status={this.state.status}
                                            model_type_icon = "success"
                                            actionNameDelete="татгалзах"
                                        />
                                    }
                                    <button type="button mr-2 ml-2" onClick={() => this.handleModalApproveOpen()} className="btn gp-btn-outline-primary waves-effect waves-light ml-2">
                                        <i className="fa fa-check">Зөвшөөрөх</i>
                                    </button>
                                    {
                                     is_modal_approve_open &&
                                        <Modal
                                            modalAction={() => this.handleProceed()}
                                            modalClose = {() => this.handleModalApproveClose()}
                                            text={`Та ${kind == 1 ? 'шинэ геометр өгөгдөл үүсгэхийг'
                                            : kind == 2 ? 'засагдсан геометр өгөгдлийг':
                                            kind == 3 ? 'геометр өгөгдлийг устгахыг' :null }
                                            зөвшөөрөхдөө итгэлтэй байна уу ?`}
                                            title="Тохиргоог зөвшөөрөх"
                                            status={this.state.status}
                                            model_type_icon = "success"
                                            actionNameDelete="зөвшөөрөх"
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}