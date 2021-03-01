import React, { Component } from "react"
import {service} from './service'
import {NavLink} from "react-router-dom"
import Modal from "../Modal"
import ModalAlert from "../ModalAlert"

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
            searchQuery: ''
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleModalDeleteOpen = this.handleModalDeleteOpen.bind(this)
        this.handleModalDeleteClose = this.handleModalDeleteClose.bind(this)
        this.handleGroupDelete = this.handleGroupDelete.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleSearch = this.handleSearch.bind(this)

    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getgrouplist().then(({group_list}) => {
            this.setState({group_list})
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

    handleSearch() {
        console.log("back-ruu hvselt ywuulanda ")
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

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const { group_list, searchQuery} = this.state
        return (
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="float-sm-left search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchQuery small-input"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
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
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    group_list.length >0 ?
                                    group_list.map((value, idx) =>
                                    <tr key={idx}>
                                        <td>
                                            {idx+1}
                                        </td>
                                        <td>
                                            {value}
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
                                    ): null
                                }
                            </tbody>
                        </table>
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
