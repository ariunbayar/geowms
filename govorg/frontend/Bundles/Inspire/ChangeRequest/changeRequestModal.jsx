import React, {Component, Fragment} from "react"
import RequestMap from './Map'

import Маягт from "./Маягт"


export default class ChangeRequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            is_loading: false
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleIsload = this.handleIsload.bind(this)
    }

    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
    }

    handleIsload(status){
        this.setState({is_loading: status})
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

    handleClose(callback) {

        this.setState({status: "closing"})
        setTimeout(() => {
            this.setState({status: "closed"})
            this.props.modalClose()
            this.props.getAll()
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
        const {form_json, state, feature_id, theme_id, old_geo_id, change_request_id} = this.props
        return (
            <Fragment>
                <div className={className + " ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap"} style={{height:"calc( 103vh - 85px - 15px)"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}} onClick={() => this.handleClose()} >
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">Илгээсэн хүсэлт</h5>
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
                                        {form_json.map((prop, idx)=>
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
                                                        value={prop.data}
                                                        type={prop.value_type}
                                                    />
                                                <div  className="col-form-label " >{prop.property_definition}</div>
                                                </div>
                                            </div>
                                            )
                                        }
                                    </div>
                                    }
                                    {state == 4 &&
                                        <div className="col-md-6 overflow-auto text-justify" style={{height:"calc( 90vh - 85px - 15px)"}}>
                                            <Маягт handleIsload={this.handleIsload} handleClose={this.handleClose} tid={theme_id} fid={feature_id} gid={old_geo_id} change_request_id={change_request_id}></Маягт>
                                        </div>
                                    }
                                    <div className={form_json || state == 4 ? "col-md-6" : "col-md-12"}>
                                        <RequestMap geoJson ={this.props.geo_json}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.is_loading &&
                    <div className="text-center d-block text-sp" style={{position:"fixed", top:"30%", left:"45%", backgroundColor: 'rgba(255, 255, 255, 0.4)'}}>
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Хүсэлтийг шалгаж байна түр хүлээнэ үү...
                    </div>
                    }
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}
