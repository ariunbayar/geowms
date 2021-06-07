import React, {Component, Fragment} from "react"

export default class DetailModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            // datas: props.datas,
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
    }

    componentDidUpdate(pP) {
        // const { datas } = this.props
        // if (pP.datas !== datas) {
        //     if (datas) this.setState({datas})
        // }
    }

    handleOpen() {
        this.setState({status: "initial"})
        setTimeout(() => {
            this.setState({status: "open"})
        }, 0)
    }

    handleClose() {
        // var id = this.props.id
        this.setState({status: "closed"})
        // this.props.history.push(`/gov/llc-request/${id}/Дэлгэрэнгүй/`)
    }

    render () {
        const { status } = this.state
        // const { datas } = this.state
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
            console.log(this.props);
        return (
            <Fragment>
                <div className={className + " ml-3 pl-4 mt-4 pt-4 rounded text-wrap h-75 position-fixed w-75"}  tabIndex="-1"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{top: "15%"}}>
                    <div className="col-md-12 modal-dialog modal-dialog-centered">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}} onClick={() => this.handleClose()} >
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">Мэдээлэл</h5>
                                    </div>
                                    <div className="col-md-1">
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc( 40vh - 35px - 7px)"}}>
                                        <table className="table table_wrapper_table">
                                            <tbody>
                                                {/* {
                                                    datas
                                                    ?
                                                        Object.keys(datas).map((layer, idx) =>
                                                            <tr className="p-0" style={{fontSize: '12px'}} key={idx}>
                                                            <th className="font-weight-normal">
                                                                <b>{layer}</b>
                                                            </th>
                                                        </tr>
                                                        )
                                                    :
                                                    <tr><th>Хоосон байна.</th></tr>
                                                } */}
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
