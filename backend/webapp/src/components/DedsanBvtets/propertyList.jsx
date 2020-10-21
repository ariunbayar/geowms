import React, { Component } from 'react'
import { service } from './service'

export default class Propterties extends Component {

    constructor(props) {
        super(props)
        this.data_type_span = 0
        this.f_c_span = 0

        this.state = {
            disabled: true,
            property_name: this.props.property_name,
            toggleButton: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.textEdit = this.textEdit.bind(this)
        this.editText = this.editText.bind(this)
        this.saveText = this.saveText.bind(this)

    }

    handleChange(e){
        this.setState({ property_name: e.target.value })
    }

    textEdit(){
        this.setState({ disabled: false, toggleButton: true })
    }

    saveText(id){
        this.setState({ disabled: true, toggleButton: false })
        this.editText(id)
    }

    editText(id){
        const {property_name} = this.state
        service
            .editName(id, property_name)
            .then(rsp => {
                if(rsp.success){
                    this.props.addNotif('success', rsp.info, 'times')
                }
                else{
                    this.props.addNotif('danger', rsp.info, 'check')
                }
            })
    }


    render() {
        const {property_name, disabled, toggleButton} = this.state
        const {property_id} = this.props
        return (
            <div className="row">
                {
                    toggleButton
                    ?
                    <i
                        className="fa fa-floppy-o mt-2 text-success col-1"
                        role="button"
                        onClick={() => this.saveText(property_id)}
                        aria-hidden="true"
                        title="Хадгалах"
                    ></i>
                    :
                    <i
                        className="fa fa-pencil-square-o mt-2 col-1 text-info"
                        role="button"
                        onClick={() => this.textEdit()}
                        aria-hidden="true"
                        title="Засах"
                    ></i>
                }
                &nbsp;
                <input
                    value={property_name}
                    className={`col-10 form-control` +(disabled ? `-plaintext` : ``)}
                    onChange={(e) => this.handleChange(e)}
                    disabled={disabled ? 'disabled' : ''}
                />
            </div>
        )
    }
}