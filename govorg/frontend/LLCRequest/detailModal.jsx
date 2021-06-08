import React, { Component } from "react"


export default class DetailModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render () {
        const { values } = this.props
        return (
                <div className="row">
                    <div className="col-md-12 overflow-auto text-justify my-2" style={{height:"calc(40vh - 35px - 7px)"}}>
                        <table className="table table_wrapper_table">
                            <tbody>
                                {
                                    values
                                    ?
                                        Object.keys(values).map((layer, idx) =>
                                            <tr className="p-0" style={{fontSize: '16px'}} key={idx}>
                                            <th className="font-weight-normal">
                                                {layer}: {values[layer]}
                                            </th>
                                        </tr>
                                        )
                                    :
                                        <tr><th>Хоосон байна.</th></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
        )
    }
}
