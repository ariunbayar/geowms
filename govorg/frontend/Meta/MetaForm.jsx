import React, { Component } from "react"
import { Pagination } from "../components/pagination/pagination"
import ModalAlert from '../components/helpers/ModalAlert'
import { NavLink } from "react-router-dom"
import MetaTable from './MetaTable'


export class MetaForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            meta: [
                { idx: 1, title: 'Meta1', category: 'aaa', keywords: 'bbb', org_name: 'ccc', status: 'ddd' },
                { idx: 2, title: 'Meta2', category: 'aaa', keywords: 'bbb', org_name: 'ccc', status: 'ddd' }
            ],
            meta_list: null,
            currentPage: 1,
            PerPage: 20,
            searchQuery: '',
            msg: [],
            alert: false,
            perms: props.perms,
            modal_alert_status: "closed",
            timer: null,
        }
        // this.paginate = this.paginate.bind(this)
        // this.handleRemove = this.handleRemove.bind(this)
        // this.handleSearch = this.handleSearch.bind(this)
        // this.modalClose = this.modalClose.bind(this)
        // this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    paginate(page, query) {
        const perpage = this.state.perPage
        this.setState({ currentPage: page })
        // return service
        //     .list(page, perpage, query)
        //     .then(page => {
        //         this.setState({ meta: page.items, meta_list: page.items.length })
        //         return page
        //     })
    }

    handleSearch(field, e) {
        if (e.target.value.length >= 1) {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
        else {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({ modal_alert_status: "closed" })
        }, 3000);
        this.paginate(1, "")
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({ modal_alert_status: "closed" })
        this.paginate(1, "")
    }

    render() {
        const { currentPage, PerPage, meta, meta_list } = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control flaot-left col-md-4"
                        id="searchQuery"
                        placeholder="Хайх"
                    // onChange={(e) => this.handleSearch('searchQuery', e)}
                    // value={searchQuery}
                    />
                    <div className="table-responsive my-3">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    {/* <th><a onClick={() => this.handleSort('title', this.state.title)}>title</a></th> */}
                                    <th scope="col">title</th>
                                    <th scope="col">category</th>
                                    <th scope="col">keywords</th>
                                    <th scope="col">org_name</th>
                                    <th scope="col">status</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.meta.map((p, idx) =>
                                        <MetaTable
                                            key={idx}
                                            idx={(this.state.currentPage * 20) - 20 + idx + 1}
                                            values={p}
                                        />
                                    )}
                            </tbody>
                        </table>
                    </div>
                    {/* <Pagination
                        paginate = {this.paginate}
                        searchQuery = {this.state.searchQuery}
                    /> */}
                    <ModalAlert
                        modalAction={() => this.modalClose()}
                        status={this.state.modal_alert_status}
                        title="Амжилттай устгалаа"
                        model_type_icon="success"
                    />
                </div>
            </div>
        )
    }
}
