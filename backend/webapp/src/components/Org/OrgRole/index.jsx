import React, { Component } from "react"
import {service} from '../service'
import {NavLink} from "react-router-dom"

import {Item} from './Item'
import ModalAlert from "../../ModalAlert"


export class OrgRole extends Component {

    constructor(props) {
        super(props)

       this.state = {
        user_count: 0,
    };

        this.state = {
            org_roles: [],
            list:[],
            changedName:'',
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
        }
        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        const {level, id} = this.props.match.params
        service.roles(level, id).then(({org_roles}) => {
            this.setState({org_roles})
        })
    }

    handleOnChange(e,id){
        const listArray=this.state.list

        this.setState({
            [e.target.name]: e.target.checked,
            bundleId:id,
            changedName:e.target.name
        })
    }

    handleSave(){
        this.setState({handleSaveIsLoad:true})
        const {level, id} = this.props.match.params
        service.rolesSave(level, id, this.state.org_roles).then(({success}) => {
            if (success) {
                setTimeout(() => {
                    this.setState({modal_alert_status: "open"})
                    this.modalCloseTime()
                }, 1000)

            }
        })
    }

    handleChange(idx, org_role_updated) {
        this.setState({
            org_roles: this.state.org_roles.map((org_role, _idx) =>
                idx == _idx ? org_role_updated : org_role
            ),
        })
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: 'closed'})
            this.setState({handleSaveIsLoad:false})
            this.handleListUpdated()
        }, 2000)
    }

    modalClose(){
        this.setState({modal_alert_status: 'closed'})
        clearTimeout(this.state.timer)
        this.setState({handleSaveIsLoad:false})
        this.handleListUpdated()
    }

    render() {
        const org_level = this.props.match.params.level

        return (
            <div className="my-4">
                <div className="row">
                    <div className="col-md-12 pt-2 pr-0">
                        <div className="text"></div>
                        <div className="mb-3 mt-3">
                            <div className="table-responsive">
                                <table className="table table-bordered w-auto">
                                    <thead>
                                        <tr>
                                            <th scope="col">Оронзайн суурь өгөгдлийн сан</th>
                                            <th scope="col" className="vertical"><span>харах</span></th>
                                            <th scope="col" className="vertical"><span>нэмэх</span></th>
                                            <th scope="col" className="vertical"><span>хасах</span></th>
                                            <th scope="col" className="vertical"><span>цуцлах</span></th>
                                            <th scope="col" className="vertical"><span>хянах</span></th>
                                            <th scope="col" className="vertical"><span>батлах</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.org_roles.map((org_role, idx) =>
                                            <Item key={idx} org_role={org_role} handleChange={org_role => this.handleChange(idx, org_role)}/>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {this.state.handleSaveIsLoad ?
                                <>
                                    <button className="btn gp-btn-primary my-3">
                                        <div className="spinner-border text-light" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <a className="text-light"> Шалгаж байна.</a>
                                    </button>
                                </>
                                :
                                <button className="btn gp-btn-primary my-3" onClick={() => this.handleSave()} >
                                    Хадгалах
                                </button>
                            }
                            <ModalAlert
                                modalAction={() => this.modalClose()}
                                status={this.state.modal_alert_status}
                                title="Амжилттай хадгаллаа"
                                model_type_icon = "success"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
