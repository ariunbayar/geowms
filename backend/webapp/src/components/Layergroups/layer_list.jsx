import React, { Component } from "react"
import {service} from './service'
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import ModalAlert from "../ModalAlert"
import Loader from "@utils/Loader"


export class List extends Component {

    constructor(props) {

        super(props)
        this.state = {
            group_list: [],
            modal_alert_status: "closed",
            modal_status: 'closed',
            timer: null,
            model_alert_text: '',
            model_type_icon: 'success',
            searchQuery: '',
            list_length:null,
            currentPage:1,
            groupPerPage:20,
            is_loading: false
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleGroupDelete = this.handleGroupDelete.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        this.setState({is_loading: true})
        service.getgrouplist().then(({group_list}) => {
            this.setState({group_list, list_length: group_list.length, is_loading: false})
        })

    }

    handleModalDeleteOpen() {
        this.setState({modal_status: 'open'})
    }

    handleModalDeleteClose() {
        this.setState({modal_status: 'closed'})
    }

    modalClose(){
        this.setState({modal_status: 'closed'})
    }

    handleSearch(e) {
        const { group_list } = this.state
        if (e.target.value.length != "" ) {
            const filter = group_list.filter(layer => {
                return layer.toLowerCase().includes(e.target.value.toLowerCase())
            })
            this.setState({searchQuery: e.target.value, group_list: filter, list_length: filter.length})
        }
        else {

            this.setState({searchQuery: ''})
            this.handleListUpdated()
        }
    }

    handleGroupDelete(name){
        service.remove_layer_group(name).then(({success, info}) =>{
            if (success) {
                this.setState({ model_alert_text: info, model_type_icon: 'success'})
                this.setState({ modal_alert_status: 'open'})
                this.handleListUpdated()
            }else{
                this.setState({ model_alert_text: info, model_type_icon: 'danger' })
                this.setState({ modal_alert_status: 'open'})
            }

            this.modalCloseTime()
        })
    }

    nextPage(){
        if(this.state.currentPage<Math.ceil(this.state.list_length/this.state.groupPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }

    prevPage(){
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
        }
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const {group_list, searchQuery, groupPerPage,currentPage, list_length, is_loading} = this.state
        const lastIndex=currentPage*groupPerPage
        const firtsIndex=lastIndex-groupPerPage
        const currentGroups= group_list.slice(firtsIndex,lastIndex)
        const totalPages=Math.ceil( list_length/groupPerPage)
        return (
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="row">
                        <Loader is_loading={is_loading}/>
                        <div className="col-md-6">
                            <div className="float-sm-left search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery small-input"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch(e)}
                                    value={searchQuery}
                                />
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="float-sm-right">
                                <NavLink
                                    className="btn gp-btn-primary waves-effect waves-light btn-sm"
                                    to="/back/layer-groups/нэмэх/">
                                    Нэмэх
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive table_wrapper ml-2">
                        <table className="table table_wrapper_table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">TileCaching</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                { group_list ===0 ?
                                        <tr><td>Group list бүртгэлгүй байна</td></tr>:

                                        currentGroups.map((value, idx) =>
                                            <tr key={idx}>
                                            <td>
                                                {idx+1}
                                            </td>
                                            <td>
                                                {value}
                                            </td>
                                            <td>
                                                <NavLink to={`/back/layer-groups/${value}/tile-caching/`} exact>
                                                    <i className="fa fa-shopping-basket text-primary" aria-hidden="true"></i>
                                                </NavLink>
                                            </td>
                                            <td>
                                                <NavLink to={`/back/layer-groups/${value}/засах/`} exact>
                                                    <i className="fa fa-pencil-square-o text-success" aria-hidden="true"></i>
                                                </NavLink>
                                            </td>
                                            <td>
                                                <a href="#" onClick={this.handleModalDeleteOpen}>
                                                    <i className="fa fa-trash-o text-danger" aria-hidden="true"></i>
                                                </a>
                                                <Modal
                                                    modalAction={() => this.handleGroupDelete(value)}
                                                    text={`Та "${value}"-г устгахдаа итгэлтэй байна уу?`}
                                                    title="Group-Layer устгах"
                                                    model_type_icon = "danger"
                                                    status={this.state.modal_status}
                                                    modalClose={() => this.handleModalDeleteClose()}
                                                />
                                            </td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="float-left">
                                <strong>Хуудас {currentPage}-{totalPages}</strong>
                            </div>
                            <div className="float-right">
                                <button
                                    type=" button"
                                    className="btn btn-outline-primary"
                                    onClick={this.prevPage}
                                > &laquo; өмнөх
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary "
                                    onClick={this.nextPage}
                                >
                                    дараах &raquo;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title="Амжилттай устгалаа"
                    model_type_icon="success"
                />
        </div>
        )
    }
}
