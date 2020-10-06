import React, { Component } from "react"
import Modal from "../../../src/components/Modal/DeleteModal"
import { service } from "./service"

export default class DataTable extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.oid,
            is_modal_delete_open: false,
            data: {
                fields: [],
                rows: [],
            },
        }

    }

    componentDidMount() {

        service
            .rows(this.state.id)
            .then(({ data }) => {
                this.setState({ data })
        })

    }

    render() {
        const { fields } = this.state.data
        return (
            <div>
                <form>
                    { fields.map((field, idx) =>
                        <div className="form-group" key={ idx }>
                            <label className="">{ field }</label>
                            <input className="form-control" placeholder={ field } />
                        </div>
                    )}
                    <button className="btn gp-btn-primary">Хадгалах</button>
                </form>
            </div>
        )
    }
}
