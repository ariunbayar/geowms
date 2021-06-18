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
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр</th>
                                    <th scope="col"> Утга</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    values
                                    ?
                                        Object.keys(values).map((layer, idx) =>
                                            <tr className="col-md-12" style={{fontSize: '12px'}} key={idx}>
                                                <td><b>{idx+1}</b></td>
                                                <td><b>{layer}</b></td>
                                                <td className="font-weight-normal">
                                                    <b>{values[layer]}</b>
                                                </td>
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
