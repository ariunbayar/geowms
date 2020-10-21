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
                console.log(rsp)
            })
    }


    render() {
        const {property_name, disabled, toggleButton} = this.state
        const {property_id} = this.props
        return (
            <div className="row">
                properties : &nbsp;
                <input
                    value={property_name}
                    className={`col-10 form-control ` +(disabled ? `-plaintext` : ``)}
                    onChange={(e) => this.handleChange(e)}
                    disabled={disabled ? 'disabled' : ''}
                />
                &nbsp;
                {
                    toggleButton
                    ?
                    <i
                        className="fa fa-floppy-o text-success col-2"
                        role="button"
                        onClick={() => this.saveText(property_id)}
                        aria-hidden="true"
                        title="Хадгалах"
                    ></i>
                    :
                    <i
                        className="fa fa-pencil-square-o text-warning"
                        role="button"
                        onClick={() => this.textEdit()}
                        aria-hidden="true"
                        title="Засах"
                    ></i>
                }
            </div>
        )
    }
}