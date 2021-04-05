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
            firt_item: {},
            firt_item_idx: null,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.handleSwap = this.handleSwap.bind(this)
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

    modalClose(){
        const org_level = this.props.match.params.level
        this.setState({handleSaveIsLoad:false})
        this.props.history.push( `/back/дэд-сан/`)
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/дэд-сан/`)
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    onDrag(event, item, idx){
        event.preventDefault();
        this.setState({
            firt_item: item,
            firt_item_idx: idx
        });
    }

    onDragOver(event, todo, idx){
        event.preventDefault();
    }

    onDrop(event, item, idx){
        event.preventDefault();
        const {bundle_list, firt_item, firt_item_idx} = this.state
        let array = bundle_list
        array[idx] = firt_item
        array[firt_item_idx] = item
        this.handleSwap(firt_item.id, item.id)
        this.setState({bundle_list: array})
    }

    handleSwap(swap_one, swap_two) {
        service.swap(swap_one, swap_two)
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="table-responsive table_wrapper">
                            <table className="table table_wrapper_table">
                                <thead>
                                    <tr>
                                        <th scope="col"> # </th>
                                        <th scope="col"> Сангийн нэр </th>
                                        <th scope="col"> WMS сервис </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.bundle_list.map((values, idx) =>
                                        <Bundle
                                            key={values.id}
                                            idx={idx}
                                            values={values}
                                            handleRemove={() => this.handleRemove(values.id)}
                                            onDrag={this.onDrag}
                                            onDragOver={this.onDragOver}
                                            onDrop={this.onDrop}
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
