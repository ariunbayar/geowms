import React, { Component } from "react"
import {service} from './service'
import {NavLink} from "react-router-dom"
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader"
import { GSPaginate } from "../geo_pagination"
import {StyleTableList} from "./style_table_list"

export class StyleList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            style_list: [],
            search_query: '',
            currentPage: 1,
            stylePerPage: 20,
            is_loading: false,
            currentStyles: [],

            modal_status: "closed",
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleStyleDelete = this.handleStyleDelete.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.paginate = this.paginate.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        this.setState({is_loading: true})
        service.getStyleList().then(({style_list}) => {
            this.setState({
                style_list,
                is_loading: false})
        })
    }

    handleSearch(e) {
        if (e.target.value.length != "" ) {
            this.setState({search_query: e.target.value})
        }
        else {
            this.setState({search_query: ''})
            this.handleListUpdated()
        }
    }

    paginate(currentStyles, currentPage, search_query) {
        this.setState({currentPage, currentStyles, search_query})
    }

    handleStyleDelete(name){
        service.removeStyle(name).then(({success, info}) =>{
            if (success) {
                this.modalChange(
                    'fa fa-check-circle',
                    null,
                    "success",
                    info,
                    ``,
                    false,
                    "",
                    "",
                    null,
                    null,
                )
            } else {
                this.modalChange(
                    'fa fa-times-circle',
                    null,
                    "danger",
                    info,
                    ``,
                    false,
                    "",
                    "",
                    null,
                    null,
                )
            }
            this.handleListUpdated()
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    render() {
        const {
            style_list, currentStyles, search_query,
            stylePerPage, currentPage, is_loading,
        } = this.state
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
                                    id="search_query small-input"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch(e)}
                                    value={search_query}
                                />
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="float-sm-right">
                                <NavLink
                                    className="btn gp-btn-primary waves-effect waves-light btn-sm"
                                    to="/back/gp-geoserver/style/add/"
                                >
                                    Нэмэх
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive table_wrapper ml-2">
                        <table className="table table_wrapper_table" >
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                { currentStyles.length ===0 ?
                                    <tr className="text-center"><th colSpan="4">geoserver дээр style бүртгэлгүй байна</th></tr>:

                                    currentStyles.map((value, idx) =>
                                        <StyleTableList
                                            key={idx}
                                            idx={(currentPage*stylePerPage)-stylePerPage+idx+1}
                                            value={value}
                                            handleRemove={
                                                () => this.modalChange(
                                                    'fa fa-exclamation-circle',
                                                    null,
                                                    "warning",
                                                    'Загвар устгах',
                                                    `Та "${value}" нэртэй загварыг устгахдаа итгэлтэй байна уу?`,
                                                    true,
                                                    "Үгүй",
                                                    "Тийм",
                                                    () => this.handleStyleDelete(value),
                                                    null,
                                                )
                                            }
                                        />
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <GSPaginate
                        paginate={ this.paginate }
                        item_list={ style_list }
                        total_items={style_list}
                        search_query={ search_query }
                        per_page={ stylePerPage }
                        page={ currentPage }
                    />
                </div>
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )
    }
}
