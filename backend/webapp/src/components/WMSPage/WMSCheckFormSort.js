import React, { Component } from "react"
import {service} from './service'
import WMSCheckFormTable from './WMSCheckFormTable'
export default class WMSCheckFormSort extends Component {

    constructor(props) {

        super(props)
        this.state = {
            wmslayers: props.wmslayers,
            wmsId: props.wmsId,
        }
        this.handleMove = this.handleMove.bind(this)
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


    render() {
        const {wmslayers, wmsId} = this.state
        return (
            <div >
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Код</th>
                            <th scope="col">Нэршил</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>

                        </tr>
                    </thead>
                    <tbody>
                        {wmslayers.map((layer) =>
                            <WMSCheckFormTable  key={layer.id} layer={layer} wmsId={wmsId} handleMove={this.handleMove}></WMSCheckFormTable>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

