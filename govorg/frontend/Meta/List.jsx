import React, { Component } from "react"

import { service } from "./service"
import Rows from './Rows'
import ModalAlert from "@utils/Modal/ModalAlert"


export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            meta_data_list: [],
            alert: false,
            perms: props.perms,
            modal_alert_status: "closed",
            timer: null,
        }

        this.getAll = this.getAll.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        this.getAll()
    }

    getAll() {
        service
            .getAll()
            .then(({success, meta_data_list}) => {
                if (success) {
                    this.setState({ meta_data_list })
                }
            })
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({ modal_alert_status: "closed" })
    }

    handleRemove(id) {
        service
            .metaDelete(id)
            .then(({success}) => {
                if (success) {
                    this.getAll()
                }
            })
    }

    render() {
        const { currentPage, perPage, meta, meta_data_list } = this.state
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
                                    meta_data_list && meta_data_list.map((p, idx) =>
                                        <Rows key={idx}
                                            idx={idx + 1}
                                            values={p}
                                            handleRemove={() => this.handleRemove(p.id)}
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
