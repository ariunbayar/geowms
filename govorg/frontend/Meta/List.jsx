import React, { Component } from "react"
import { Pagination } from "../components/pagination/pagination"
import ModalAlert from '../components/helpers/ModalAlert'
import { NavLink } from "react-router-dom"
import Rows from './Rows'


export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            meta: [
                { idx: 1, title: 'Meta1', category: 'aaa', keywords: 'bbb', org_name: 'ccc', status: 'ddd' },
                { idx: 2, title: 'Meta2', category: 'aaa', keywords: 'bbb', org_name: 'ccc', status: 'ddd' }
            ],
            alert: false,
            perms: props.perms,
            modal_alert_status: "closed",
            timer: null,
        }
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
                                        <Rows
                                            key={idx}
                                            idx={(this.state.currentPage * 20) - 20 + idx + 1}
                                            values={p}
                                        />
                                    )}
                            </tbody>
                        </table>
                    </div>
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
