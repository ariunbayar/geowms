import React, {Component, Fragment} from "react"


export default class RequestModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            geo_json:[],
            form_json:[]
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
        this.ConvertStrToJson = this.ConvertStrToJson.bind(this)
    }


    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
        this.ConvertStrToJson()
    }

    ConvertStrToJson(){
        const geo_json = this.props.geo_json
        const form_json = this.props.form_json

        var obj = form_json.replace(/'/g, '"')
        obj = JSON.parse(obj)
        
        var obj2 = geo_json.replace(/'/g, '"')
        obj2 = JSON.parse(obj2)
        this.setState({
            form_json:obj,
            geo_json:obj2,
        })

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
            if (callback) {
                callback()
            } else {
                this.props.modalClose()
            }
        }, 150)
    }

    handleProceed() {
        this.handleClose(this.props.modalAction)
    }

    render () {
        const {status} = this.state
        console.log(this.state.geo_json)
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
                <div className={className}>
                    <div className="col-md-12">
                        <div className="modal-content animated jackInTheBox" style={{border: "none", borderRadius: "7px", background: "#ebebeb"}}>
                            <div className="col-xs-4  float-right my-1">
                                <button type="button" className="close mt-2 mr-2" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                </button>
                            </div>
                            <div className="d-flex justify-content-center">
                                <h5 >{this.props.title}</h5>

                                <div>
                                        <ul>
                                            {this.state.geo_json.length >0 ? this.state.geo_json.map((property, idx)=>
                                            <li key={idx}>
                                                <label> {property.property_name}</label>
                                                <input
                                                    className = "form-control" 
                                                    type={value_type_id}
                                                    value={property.data}
                                                />
                                                <label>{property.property_definition}</label>
                                            </li>
                                            ):null}
                                        </ul>
                                </div>
                                <div id="map"></div>
                            </div>
                            <div className="modal-body ">
                                <div className="bg-primary d-inline"></div>
                                <div className="bg-secondary d-inline "></div>
                            </div>
                            <div className="modal-footer" style={{border: "none"}}>
                                <button type="button" onClick={() => this.handleClose()} className="btn btn-primary waves-effect waves-light">
                                    <i className="fa fa-times"></i>
                                    {this.props.actionNameBack ? this.props.actionNameBack : "  БУЦАХ"}
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleProceed}
                                    className="btn btn-outline-primary waves-effect waves-light"
                                >
                                    <i className="fa fa-check-square-o"></i>
                                    {this.props.actionNameDelete ? this.props.actionNameDelete : "  УСТГАХ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}