import React, { Component } from "react"
import {service} from './service'



export class ConfigForm extends Component {

    constructor(props) {

        super(props)
        this.state = {
            id: props.config.id,
            name: props.config.name,
            value: props.config.value,
            formIsload: false,
            nameIsNull: false,
            valueIsNull: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleForm = this.handleForm.bind(this);


    }

    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        if (this.props.config.id !== prevProps.config.id) {
            const {id, name, value} = this.props.values
            this.setState({id, name, value})

        }

    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({nameIsNull: false, valueIsNull: false})
        if(value.length < 255){
            this.setState({
                [name]: value
            });
        }
    }
    handleForm(){
        if(!this.state.name || !this.state.value)
        {
            if(!this.state.name)
            {
                this.setState({nameIsNull: true})
            }
            if(!this.state.value)
            {
                this.setState({valueIsNull: true})
            }
        }
        else
        {
            const value = this.state
            const id = this.state.id
            this.setState({formIsload: true})
            if(id){
                service.update(value).then(({success}) => {
                    if(success){
                        this.props.handleCancel()
                        this.props.handleUpdated()
                    }
                })
            }else{
                service.create(value).then(({success}) => {
                    if(success){
                        this.props.handleCancel()
                        this.props.handleUpdated()
                    }
                })
            }
        }
    }
    render() {
        const {id, name, value, formIsload, nameIsNull, valueIsNull} = this.state
        return (
            <div className="col-md-12">
                <div className="row">
                    <div className="text-left">
                        <button className="btn btn-outline-primary" onClick={this.props.handleCancel}>
                            Буцах
                        </button> 
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 form-group">
                        <label>Гарчиг:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            onChange={this.handleChange}
                            value={name}
                        />
                        {nameIsNull &&
                        <label className="text-danger">Хоосон байна. Утга оруулна уу ?</label>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 form-group">
                        <label>Товч агуулга:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="value"
                            onChange={this.handleChange}
                            value={value}
                        />
                        {valueIsNull &&
                        <label className="text-danger">Хоосон байна. Утга оруулна уу ?</label>
                        }
                    </div>
                </div>    
                <div></div>
                <div className="row">
                    <div className="span3">
                    {formIsload ?
                        <button className="btn gp-bg-primary" onClick={this.handleForm}>
                            <a>Угшиж байна </a> 
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">  Loading...</span>
                            </div>
                        </button> :
                        <button className="btn gp-bg-primary" onClick={this.handleForm}>
                            Хадгалах
                        </button> 
                    }
                    </div>
                </div>                     
            </div>
        )
    }
}
