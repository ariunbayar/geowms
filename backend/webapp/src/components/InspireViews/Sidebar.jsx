import React, { Component } from 'react'
import {Switch, Route, NavLink} from "react-router-dom"
import { service } from './service'
import ModalAlert from '../ModalAlert'
import './styles.css'
import {Property} from "./property"
import {ViewStyle} from "./Viewstyle"
export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            id_list: [],
            save_is_load: false,
            modal_alert_check: 'closed',
            title: '',
            model_type_icon: 'success',
            view_name: '',
            style_item: {
                style_name: '',
                style_title: '',
                style_color: '#ffffff',
                style_size: 1,
                style_kind: '',
            }

        }
        this.handleSave = this.handleSave.bind(this)
        this.handleStyleSave = this.handleSave.bind(this)

    }

    handleStyleSave(values){
    }


    handleSave(){
        const fid = this.props.fid
        const tid = this.props.tid
        const id_list = this.state.id_list
        this.setState({save_is_load: true})
        service.setPropertyFields(fid, id_list, tid).then(({success, info}) => {
            if(success){
                this.setState({save_is_load: false, modal_alert_check: 'open', title: info, model_type_icon: 'success'})
                this.props.getAll()
                this.modalCloseTime()
            }
            else{
                this.setState({save_is_load: false, modal_alert_check: 'open', title: info, model_type_icon: 'danger'})
                this.modalCloseTime()
            }
        })
    }

    componentDidMount(){
        const id_list = this.props.id_list
        const view_name = this.props.view_name
        this.setState({id_list, view_name})
    }

    componentDidUpdate(pP){
        if(pP.fields !== this.props.fields){
            const fields = this.props.fields
            this.setState({fields})
        }
        if(pP.id_list !== this.props.id_list){
            const id_list = this.props.id_list
            this.setState({id_list})
        }
        if(pP.view_name !== this.props.view_name){
            const view_name = this.props.view_name
            this.setState({view_name})
        }
    }

    handleModalAlert(){
        this.setState({modal_alert_check: 'closed'})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_check: 'closed'})
        }, 2000)
    }
    render() {
        const {fields, fid, fname} = this.props
        const {id_list, save_is_load, view_name} = this.state
        return (
            <div className={`card col-md-6 mb-1 bundle-view-right-scroll`} style={{left:"10px"}}>
                <div className="card-body">
                    {fid ?
                        <div>
                            <div>
                                <ul className="nav nav-tabs nav-tabs-dark-gray nav-justified">
                                    <li className="nav-item">
                                        <NavLink exact to={"/back/inspire-views/property/"}   activeClassName="active" className="nav-link"  data-toggle="tab">
                                        <span className="hidden-xs">Property</span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item gp-text-primary">
                                        <NavLink to={"/back/inspire-views/styles/"} activeClassName="active"  className="nav-link"  data-toggle="tab">
                                            <span className="hidden-xs">Style</span>
                                        </NavLink>
                                    </li>
                                </ul>

                                <div className="tab-content">
                                    <Switch>
                                        <Route path={"/back/inspire-views/property/"} component={() => <Property
                                            fields={fields}
                                            fname={fname}
                                            id_list={id_list}
                                            view_name={view_name}
                                            />
                                        }
                                        />
                                        <Route path={"/back/inspire-views/styles/"}  component={() => <ViewStyle
                                            fname={fname}
                                            view_name={view_name}
                                            handleStyleSave={() => this.handleStyleSave}
                                        />} />
                                    </Switch>
                                </div>
                            </div>
                            {save_is_load ?
                                <button type="submit"  className="btn btn-block gp-btn-primary text-white">Уншиж байна</button>:
                                <button type="submit" onClick={this.handleSave} className="btn btn-block gp-btn-primary text-white">View үүсгэх</button>
                            }
                        </div>
                        :
                        <div>
                            <h4 className="text-center">Property Хоосон байна</h4>
                        </div>
                    }
                    <ModalAlert
                        title={this.state.title}
                        model_type_icon ={this.state.model_type_icon}
                        status={this.state.modal_alert_check}
                        modalAction={() => this.handleModalAlert()}
                    />
                </div>
            </div>
        )
    }
}
