import { compose } from "ol/transform"
import React, {Component, Fragment} from "react"

export default class ModelSelectLayer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            is_loading: false
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleIsload = this.handleIsload.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
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
    handleProceed(event, values) {
        this.props.modalAction(values)
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
        const {layer_list } = this.props
        return (
            <Fragment>
                <div className={className + " ml-3 pl-4 mt-4 pt-4 rounded text-wrap h-75 position-absolute w-75"}  tabIndex="-1"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{top: "15%"}}>
                    <div className="col-md-12 modal-dialog modal-dialog-centered">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}} onClick={() => this.handleClose()} >
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">Шинэ давхарга сонгох</h5>
                                    </div>
                                    <div className="col-md-1">
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 overflow-auto text-justify" style={{height:"calc( 40vh - 35px - 7px)"}}>
                                        <table className="table table_wrapper_table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"> № </th>
                                                    <th scope="col"> Нэр </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    layer_list.length >0 ?
                                                    layer_list.map((value, idx) =>
                                                    <tr key={idx}>
                                                        <td>
                                                            {idx+1}
                                                        </td>
                                                        <td>
                                                            <a href="#" onClick={(e) => this.handleProceed(e, value)}>{value.layer_name}</a>
                                                        </td>
                                                    </tr>
                                                    ): null
                                                }
                                            </tbody>
                                        </table>
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
