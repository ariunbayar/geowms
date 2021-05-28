import React, { Component, Fragment } from "react"

export class LLCPP extends Component {

    constructor(props) {

        super(props)
        this.state = {
            datas: props.datas
        }
    }

    componentDidUpdate(pP, pS) {
        const { datas } = this.props
        if (pP.datas !== datas) {
            if (datas) this.setState({datas})
        }
    }

    render() {
        const { datas } = this.state
        return (
                <div>
                    {
                        <div className="ol-popup-contet  overflow-auto" style={{height: '30vh'}}>
                            <hr className="m-1 border border-secondary rounded"/>
                            <table className="table borderless no-padding">
                                <tbody>
                                    {
                                        datas
                                        ?
                                            Object.keys(datas).map((layer, idx) =>
                                                <tr className="p-0" style={{fontSize: '12px'}} key={idx}>
                                                <th className="font-weight-normal">
                                                    <b>{layer}</b>
                                                </th>
                                            </tr>
                                            )
                                        :
                                        <tr><th>Хоосон байна.</th></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            )
    }
}
