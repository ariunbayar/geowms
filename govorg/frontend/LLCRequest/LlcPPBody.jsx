import React, { Component, Fragment } from "react"

export class LlcPPBody extends Component {

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
                                <thead>
                                    <tr>
                                        <th scope="col">id</th>
                                        <th scope="col">нэр</th>
                                        <th scope="col">code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        datas && Object.keys(datas).length >0
                                        ?
                                            Object.keys(datas).map((data, idx) =>
                                            <tr className="col-md-12" style={{fontSize: '12px'}} key={idx}>
                                                <td>{datas[data].property_id}</td>
                                                <td>{datas[data].property_name}</td>
                                                <td>{datas[data].property_code}</td>
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
