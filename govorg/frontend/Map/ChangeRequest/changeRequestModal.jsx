import React, {Component, Fragment} from "react"
import RequestMap from './Map'
import {service} from './service'
import Modal from '../../Components/helpers/Modal'


export default class ChangeRequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
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
        const form_json = this.props.form_json
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
                                        {form_json.form_values.map((prop, idx)=>
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
                                            )
                                        }
                                    </div>
                                    }
                                    <div className={form_json ? "col-md-6" : "col-md-12"}>
                                        <RequestMap geoJson ={this.props.geo_json}/>
                                    </div>
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