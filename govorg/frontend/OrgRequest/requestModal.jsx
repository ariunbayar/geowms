import React, {Component, Fragment} from "react"
import RequestMap from './Map'
import {service} from './service'

export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
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
        return (
            <Fragment>
                <div className={className + " ml-5 mr-5 mb-5 mt-5 pl-3 pr-3 pb-3 pt-3 rounded text-wrap"} style={{height:"calc( 100vh - 85px - 15px)"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12 card-body">
                                <div className="row" style={{background:"white"}}>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                    </button>
                                </div>
                                <div className="row">
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
                                    <div className="col-md-6">
                                        <RequestMap geoJson ={this.props.geo_json}/>
                                    </div>
                                </div>
                                <div className="row my-2 mr-2 mx-2 float-right">
                                    <label className="ol-form-label text-center">Хүсэлт шийдвэрлэх</label>
                                    <button type="button" onClick={() => this.handleClose(id)} className="btn btn-primary waves-effect waves-light">
                                        <i className="fa fa-times">Татгалзах</i>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => this.handleProceed()}
                                        className="btn btn-outline-primary waves-effect waves-light"
                                    >
                                        <i className="fa fa-check-square-o">Зөвшөөрөх</i>
                                    </button>
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