import React, { Component } from 'react'
import { service } from './service'
import ModalAlert from '../ModalAlert'

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
            view_name: ''

        }
        this.handleInput = this.handleInput.bind(this)
        this.handleSave = this.handleSave.bind(this)

    }
    handleInput(e){
        let id_list = this.state.id_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }
        this.setState({id_list})
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
            <div className={`card col-md-7`} style={{left:"10px"}}>
                <div className="card-body">
                    {fid ?
                        <div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colspan={4} className="text-center">
                                            <h4 className="text-center">{fname}</h4>
                                            {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="text-center" style={{width: "15%"}}>
                                            Data <br/>type
                                        </th>
                                        <th className="text-center" style={{width: "15%"}}>
                                            View
                                        </th>
                                        <th className="text-center" style={{width: "70%"}}>
                                            Property
                                        </th>
                                    </tr>
                                    {fields.map((f_config, idx) =>
                                        <>
                                            {f_config.data_types.map((data_type, idx) =>
                                                <>
                                                    <tr>
                                                        <th rowSpan={data_type.data_type_configs.length +1}
                                                            className="vertical align-middle text-center"
                                                        >
                                                            <span className="text-center text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                                            <span className="text-center align-middle">({data_type.data_type_name_eng})</span>
                                                            <span className="text-center align-middle">{data_type.data_type_name}</span>
                                                        </th>
                                                    </tr>
                                                    {data_type.data_type_configs.map((data_type_config, idx) =>
                                                        <>
                                                            <tr>
                                                                <th>
                                                                    <div className="icheck-primary">
                                                                        <input
                                                                            id={data_type_config.property_name}
                                                                            type="checkbox"
                                                                            checked={id_list.indexOf(data_type_config.property_id) > -1}
                                                                            onChange={this.handleInput}
                                                                            value={data_type_config.property_id}
                                                                        />
                                                                        <label for={data_type_config.property_name}></label>
                                                                    </div>
                                                                </th>
                                                                <th>
                                                                    <label
                                                                        for={data_type_config.property_name}
                                                                        data-toggle="tooltip" data-placement="right" title={data_type_config.property_definition}
                                                                    >
                                                                    {data_type_config.property_name}<br/>
                                                                    (
                                                                    {data_type_config.value_types.map((value_type, idx) =>
                                                                        <span>{value_type.value_type_name}</span>
                                                                    )}
                                                                    )
                                                                    </label>
                                                                </th>
                                                            </tr>
                                                        </>
                                                    )}
                                                </>

                                            )}
                                        </>
                                    )}
                                </thead>
                            </table>
                            {save_is_load ?
                                <a className="btn btn-block gp-btn-primary text-white">Уншиж байна</a>:
                                <a onClick={this.handleSave} className="btn btn-block gp-btn-primary text-white">View үүсгэх</a>
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