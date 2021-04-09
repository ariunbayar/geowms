import React, { Component } from "react"

import { service } from "./service"
import Rows from './Rows'
import Modal from "@utils/Modal/Modal"


export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            meta_data_list: [],
            alert: false,
            perms: props.perms,
            modal_status: "closed",
        }

        this.getAll = this.getAll.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
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

    handleRemove(id) {
        service
        .metaDelete(id)
        .then(({success}) => {
            if (success) {
                this.getAll()
                this.handleModalOpen()
            }
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
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
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon='fa fa-check-circle'
                        icon_color='success'
                        title='Амжилттай устгалаа'
                        text=''
                        has_button={false}
                        modalAction={null}
                    />
                </div>
            </div>
        )
    }
}
