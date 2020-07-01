import React, { Component } from "react"

export default class WMSCheckFormTable extends Component {

    constructor(props) {

        super(props)
        this.state = {
            title: props.title,
        }
        this.titleSave = this.titleSave.bind(this)
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
       

    }

    titleSave(){
        alert(JSON.stringify(this.state.title))
    }


    render() {
        const {layer, wmsId} = this.state
        return (
     
            <tr key={layer.id}>
                <td >
                    {layer.name}
                </td>
                <td >
                    <input type="text" value={layer.title}  onChange={(title) => this.setState({title})}/>
                </td>
                                            <td >
                    <button onClick={() => this.titleSave()}>asdas</button>
                </td>
                <td >
                    <a href="#" onClick={() => this.props.handleMove(layer.id, 'up', wmsId)}>
                        <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </a>
                </td>
                <td>
                    <a href="#" onClick={() => this.props.handleMove(layer.id, 'down', wmsId)}>
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>

        )
    }
}

