import React, { Component } from "react"
import {service} from './service'
import GeoData from "./GeoData"

export default class WMSCheckFormTable extends Component {

    constructor(props) {

        super(props)
        this.state = {
            layer: props.layer,
            wmsId: props.wmsId,
            title: props.layer.title || '',
            titleDisabled: false,
            toggleButton: false,
        }
        this.titleSave = this.titleSave.bind(this)
        this.handleChange = this.handleChange.bind(this);
        this.openGeoData = this.openGeoData.bind(this)
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

    openGeoData(){
        this.setState({ toggleButton: !this.state.toggleButton })
    }

    render() {
        const { layer, wmsId, title, titleDisabled, toggleButton } = this.state
        return (

            <tr>
                <td >
                    {layer.name}
                </td>
                <td >
                    <input type="text" name={name} value={title}  onChange={this.handleChange} disabled = {(this.state.titleDisabled)? "" : "disabled"}/>
                </td>
                <td>
                    <a role="button" onClick={() => this.openGeoData()} data-toggle="tooltip" data-placement="top" title="geo">
                        {
                            toggleButton
                            ?
                            <i className="fa fa-window-close-o gp-text-primary" aria-hidden="true"></i>
                            :
                            <i className="fa fa-cog gp-text-primary" aria-hidden="true"></i>
                        }
                    </a>
                        {
                            toggleButton
                            ?
                                <GeoData
                                    wmsId = {wmsId}
                                    handleClose = {this.openGeoData}
                                    handleChange = {() => this.handleChange()}
                                    code = {layer.code}
                                >
                                </GeoData>
                            :
                            null
                        }
                </td>
                <td >
                    {titleDisabled ?
                    <a role="button" onClick={() => this.titleSave()} data-toggle="tooltip" data-placement="top" title="Хадгалах">
                        <i className="fa fa-floppy-o gp-text-primary" aria-hidden="true"></i>
                    </a>:
                    <a role="button" onClick={() => this.titleSave()} data-toggle="tooltip" data-placement="top" title="Засах">
                        <i className="fa fa-pencil-square-o gp-text-primary" aria-hidden="true"></i>
                    </a>
                    }
                </td>
                <td >
                    <a role="button" onClick={event => this.props.handleMove(layer.id, 'up', wmsId)}>
                        <i className="fa fa-chevron-up gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a role="button" onClick={event => this.props.handleMove(layer.id, 'down', wmsId)}>
                        <i className="fa fa-chevron-down gp-text-primary" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>

        )
    }
}

