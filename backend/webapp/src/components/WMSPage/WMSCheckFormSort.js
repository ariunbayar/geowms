import React, { Component } from "react"
import {service} from './service'

export default class WMSCheckFormSort extends Component {

    constructor(props) {

        super(props)
        this.state = {
            wmslayers: props.wmslayers,
            wmsId: props.wmsId,
        }
        this.handleMove = this.handleMove.bind(this)
        this.titleSave = this.titleSave.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if(prevProps.wmslayers !== this.props.wmslayers)
        {   
            const wmslayers = this.props.wmslayers
            this.setState({wmslayers})
        }

    }
    handleMove(id, event, wmsId) {
        service.move(id, event, wmsId).then(({success}) => {
            if (success) 
            {
                this.props.handleWmsLayerRefresh(this.state.wmsId)
            }
        })
    }
    titleSave(title){
        alert(title)
    }


    render() {
        const {wmslayers, wmsId} = this.state
        return (
            <div >
                <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Code</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">save</th>
                                    <th scope="col">down</th>
                                    <th scope="col">up</th>
                                    
                                </tr>
                            </thead>
                                <tbody>
                                    {wmslayers.map((layer) =>
                                    <tr key={layer.id}>
                                        <td >
                                            {layer.name}
                                        </td>
                                        <td >
                                            <input className="form-control" type="text" value={layer.title + "A"} />
                                        </td>
                                         <td >
                                            <button onClick={() => this.titleSave(layer.title)}>asdas</button>
                                        </td>
                                        <td >
                                            <a href="#" onClick={() => this.handleMove(layer.id, 'up', wmsId)}>
                                                <i className="fa fa-chevron-up" aria-hidden="true"></i>
                                            </a>
                                        </td>
                                        <td >
                                            <a href="#" onClick={() => this.handleMove(layer.id, 'down', wmsId)}>
                                                <i className="fa fa-chevron-down" aria-hidden="true"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                        </table>

            </div>
        )
    }
}

