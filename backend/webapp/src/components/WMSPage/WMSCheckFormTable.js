import React, { Component } from "react"
import {service} from './service'

export default class WMSCheckFormTable extends Component {

    constructor(props) {

        super(props)
        this.state = {
            layer: props.layer,
            wmsId: props.wmsId,
            title: props.layer.title,
            titleDisabled: false,
        }
        this.titleSave = this.titleSave.bind(this)
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if(prevProps.layer !== this.props.layer)
        {   
            const layer = this.props.layer
            this.setState({layer, title:this.props.layer.title})
        }

    }

    titleSave(){
        if(this.state.titleDisabled)
        {
            const title = this.state.title
            const id = this.state.layer.id
            service.titleUpdate(title, id).then(({success}) => {
                if (success) 
                {
                    this.setState({titleDisabled: false})
                }
            })
        }
        else
        {
            this.setState({titleDisabled: true})
        }

    }

    handleChange(event) {
        this.setState({title: event.target.value});
    }


    render() {
        const {layer, wmsId, title, titleDisabled} = this.state
        return (
     
            <tr>
                <td >
                    {layer.name}
                </td>
                <td >
                    <input type="text" name={name} value={title}  onChange={this.handleChange} disabled = {(this.state.titleDisabled)? "" : "disabled"}/>
                </td>
                <td >
                    {titleDisabled ? 
                    <a href="#" onClick={() => this.titleSave()} data-toggle="tooltip" data-placement="top" title="Хадгалах">
                        <i className="fa fa-floppy-o" aria-hidden="true"></i>
                    </a>:
                    <a href="#" onClick={() => this.titleSave()} data-toggle="tooltip" data-placement="top" title="Засах">
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </a>
                    
                    }
                </td>
                <td >
                    <a href="#" onClick={event => this.props.handleMove(layer.id, 'up', wmsId)}>
                        <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={event => this.props.handleMove(layer.id, 'down', wmsId)}>
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>

        )
    }
}

