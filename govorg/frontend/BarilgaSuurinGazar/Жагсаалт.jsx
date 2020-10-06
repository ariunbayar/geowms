import React, { Component } from "react"

import { service } from "./service"
import ЖагсаалтItem from "./ЖагсаалтItem"


export default class Жагсаалт extends Component {

    constructor(props) {

        super(props)

        this.state = {

            is_loading: true,

            oid: this.props.match.params.oid,
            is_modal_delete_open: false,
            data: {
                fields: [],
                rows: [],
            },

        }

        this.loadData = this.loadData.bind(this)

    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        service
            .rows(this.state.oid)
            .then(({ data }) => {
                this.setState({
                    data,
                    is_loading: false,
                })
            })
    }

    render() {

        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        const { fields, rows } = this.state.data

        return (
            <table className="table-responsive table-bordered table-sm">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        { fields.map((field, idx) =>
                            <th key={ idx }>
                                { field.name }
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    { rows.map((row, idx) =>
                        <ЖагсаалтItem
                            key={ idx }
                            oid={ this.state.oid }
                            item={ row }
                            fields={ fields }
                            handleUpdate={ this.loadData }
                        />
                    )}
                </tbody>
            </table>
        )
    }
}
