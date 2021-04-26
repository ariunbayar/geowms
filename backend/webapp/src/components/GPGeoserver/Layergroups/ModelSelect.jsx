import React, {Component, Fragment} from "react"
import { GSPaginate } from "../geo_pagination"

export default class ModelSelectLayer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status || "initial",
            layer_list: props.layer_list,
            search_query: '',
            current_page: 1,
            layerPerPage: 10,
            current_layers: [],
            search_name: ''
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleIsload = this.handleIsload.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.paginate = this.paginate.bind(this)
    }

    componentDidMount() {
        if (this.state.status == "initial") {
            this.handleOpen()
        }
    }

    handleIsload(status){
        this.setState({is_loading: status})
    }

    handleSearch(e) {
        if (e.target.value.length >= 1) {
            this.setState({search_query: e.target.value})
        }
        else {
            this.setState({search_query: '', layer_list: this.props.layer_list})
        }
    }

    paginate(current_layers, current_page, search_query) {
        this.setState({ current_layers, current_page, search_query })
    }

    componentDidUpdate(prevProps) {
        if (this.props.status != prevProps.status) {
            if (["initial", "open"].includes(cthis.props.status)) {
                this.handleOpen()
            }
            if (["closing", "closed"].includes(this.props.status)) {
                this.handleClose()
            }
        }
        if (this.props.layer_list != prevProps.layer_list) {
            this.setState({layer_list: this.props.layer_list})
        }
    }

    handleProceed(event, values, more_detail) {
        this.props.modalAction(values, more_detail)
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
        const { layer_list, current_layers, search_query, layerPerPage, current_page } = this.state
        return (
            <Fragment>
                <div className={className + " ml-3 pl-4 mt-4 pt-4 rounded text-wrap h-75 position-fixed w-75"}  tabIndex="-1"  role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{top: "15%"}}>
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
                                    <div className="col-3 col-md-3 col-xl-3">
                                        <div className="float-sm-left search-bar">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="small-input"
                                                    placeholder="Хайх"
                                                    onChange={(e) => this.handleSearch(e)}
                                                    value={search_query}
                                                />
                                                <a><i className="icon-magnifier"></i></a>
                                        </div>
                                    </div>
                                    <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc( 40vh - 35px - 7px)"}}>
                                        <table className="table table_wrapper_table">
                                            <thead>
                                                <tr>
                                                    <th scope="col"> № </th>
                                                    <th scope="col"> Нэр </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    current_layers.length > 0 ?
                                                    current_layers.map((value, idx) =>
                                                    <tr key={(current_page*layerPerPage)-layerPerPage+idx+1}>
                                                        <td>
                                                            {(current_page*layerPerPage)-layerPerPage+idx+1}
                                                        </td>
                                                        <td>
                                                            <a href="#" onClick={(e) => this.handleProceed(e, value, this.props.more_detail)}>{value.layer_name ? value.layer_name : value}</a>
                                                        </td>
                                                    </tr>
                                                    ): <tr><td>geoserver дээр давхарга бүртгэлгүй байна</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <GSPaginate
                                        paginate={this.paginate}
                                        item_list={layer_list}
                                        search_query={search_query}
                                        per_page={layerPerPage}
                                        page={current_page}
                                        filter_name={'layer_name'}
                                    />
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
