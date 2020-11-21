import React, { Component } from "react"
import ModalAlert from '../components/helpers/ModalAlert'
import { NavLink } from "react-router-dom"
import Rows from './Rows'

export class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            meta: [
                { idx: 1, title: 'Role1' },
                { idx: 2, title: 'Role2' }
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
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="text-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light m-1" to={`/gov/role/role/add/`}>
                                    Нэмэх
                                </NavLink>
                            </div> 
                            <div className="table-responsive">
                                <table className="table ">
                                    <thead>
                                        <tr>
                                            <th scope="col">№</th>
                                            <th scope="col">title</th>
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
                </div>
            </div>
        );
    }
}
