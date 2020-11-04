import React, { Component } from "react"
import {service} from './service'
import Bundle from './Bundle'
import {NavLink} from "react-router-dom"
import ModalAlert from "../ModalAlert"

export class BundleList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            bundle_list: [],
            modal_alert_status: "closed",
            timer: null,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleMove = this.handleMove.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({bundle_list}) => {
            this.setState({bundle_list})
        })

    }

    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success){
                this.handleListUpdated()
                this.setState({modal_alert_status: "open"})
            }
        })
        this.modalCloseTime()
    }

    handleMove(event, id, direction) {
        event.preventDefault()
        service.move(id, direction).then(({bundle_list, success}) => {
            if (success) this.setState({bundle_list})
        })
    }

    modalClose(){
        const org_level = this.props.match.params.level
        this.setState({handleSaveIsLoad:false})
        this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12">
                            <div className="text-right">
                                <NavLink className="btn gp-btn-primary waves-effect waves-light m-1" to={`/back/үүсгэх/`}>
                                    Нэмэх
                                </NavLink>
                            </div>

                            <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"> # </th>
                                        <th scope="col"> Сангийн нэр </th>
                                        <th scope="col"> WMS сервис </th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bundle_list.map((values, idx) =>
                                        <Bundle
                                            key={values.id}
                                            idx={idx}
                                            values={values}
                                            handleRemove={() => this.handleRemove(values.id)}
                                            handleMove={this.handleMove}
                                        />
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                    <ModalAlert
                        modalAction={() => this.modalClose()}
                        status={this.state.modal_alert_status}
                        title="Амжилттай хадгаллаа"
                        model_type_icon = "success"
                    />
                </div>
            </div>
        )
    }
}
