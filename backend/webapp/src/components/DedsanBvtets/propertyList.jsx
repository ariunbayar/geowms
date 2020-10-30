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
        const { property_id, is_read_only, top_id } = this.props
        return (
            <div className="float-left">
                {
                    is_read_only
                    ?
                        <i
                            className="fa fa-eye fa-1x"
                            aria-hidden="true"
                            title="Зөвхөн харах"
                        ></i>
                    :
                        <i
                            className="fa fa-pencil fa-1x"
                            aria-hidden="true"
                            title="засаж болно"
                        ></i>
                }
                &nbsp;
                <span role="button" className="gp-text-primary"
                    onClick={() => this.props.handleFormLef('property', property_id, property_name, top_id)}
                >
                    {property_name}
                </span>
            </div>
        )
    }
}