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
            model_type_icon: 'success'

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
        const id_list = this.state.id_list
        this.setState({save_is_load: true})
        service.setPropertyFields(fid, id_list).then(({success, info}) => {
            if(success){
                this.setState({save_is_load: false, modal_alert_check: 'open', title: info, model_type_icon: 'success'})
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
        this.setState({id_list})
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
        const {fields, fid} = this.props
        const {id_list, save_is_load} = this.state
        return (
            <div className={`card col-md-7`} style={{left:"10px"}}>
                <div className="card-body">
                    {fields.length > 0 ?
                    <div>
                        <h4 className="text-center">Feature id: {fid}</h4>
                        {fields.map((property, idx) =>
                            <div key={idx} className='form-group'>
                                <div class="icheck-primary">
                                    <input
                                        id={property['property_code']}
                                        type="checkbox"
                                        checked={id_list.indexOf(property['property_id']) > -1}
                                        onChange={this.handleInput}
                                        value={property['property_id']}
                                    />
                                    <label for={property['property_code']}>{property['property_code']}</label>
                                </div>
                            </div>
                        )}
                        {save_is_load ? 
                        <a className="btn btn-block gp-btn-primary text-white">Уншиж байна</a>:
                        <a onClick={this.handleSave} className="btn btn-block gp-btn-primary text-white">View үүсгэх</a>
                        }
                    </div>:
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