import React, {Component} from 'react'
import "./style.css";
import {service} from './DetailPage/service'

import {DetailPage} from './DetailPage'

export class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            metaDataScreenIsload: true,
            wmsLayerScreenIsload: false,
            loginScreenIsload: false,
            bundleName: 'Гэо дата',
            bundleId: null,
            bundle: [],
        }
        this.wmsLayerName = this.wmsLayerName.bind(this)
    }

    wmsLayerName(){
        if(this.state.wmsLayerScreenIsload)
        {
            this.setState({wmsLayerScreenIsload:false})
        }else
        {
            this.setState({wmsLayerScreenIsload:true})
        }
    }

    wmsLayerId(id, name){
        this.setState({bundleId:id, bundleName: name})
        Promise.all([
            service.wmsLayerOneDatas(id)]).then((data) => {
                if(data){
                    this.setState({bundle: data[0].bundle_display, metaDataScreenIsload: false})
                    this.setState({metaDataScreenIsload: true})
            }
        })
    }
    componentDidMount(){
        const {id, name } = this.props.bundle[0]
        this.wmsLayerId(id, name)
    }

    render() {
        const bundles = this.props.bundle
        return (
            <div>
                <div>
                    <div>
                        {this.state.metaDataScreenIsload &&
                            <div className="metaDataScreen">
                                <DetailPage
                                    bundle={this.state.bundle}
                                    wmsLayerName={this.wmsLayerName}
                                    wmsLayerScreenIsload={this.state.wmsLayerScreenIsload}
                                ></DetailPage>
                                <a className="wmsLayerButtonBack" onClick={() => this.wmsLayerName()}>
                                    <i className="fas fa-layer-group wmsLayerButton" aria-hidden="true"></i>
                                </a>
                            </div>}
                        <div className={this.state.wmsLayerScreenIsload ? "wmsLayerScreen" : "wmsLayerScreen wmsLayerScreen-hide"}>
                            <div className="row">
                                <div className="col-10">
                                    <a>ДЭД САН</a>
                                </div>
                                <div className="col-2 xButton">
                                    <a onClick={() => this.wmsLayerName()}><i className="fa fa-times" aria-hidden="true"></i></a>
                                </div>
                            </div>
                            <hr/>

                            <div className="row ">
                                {bundles.map((bundle, i) =>
                                    <div className="col-4 text-center sub" key={i}>
                                        <a onClick={() => this.wmsLayerId(bundle.id, bundle.name)}>
                                            <img src={bundle.icon} />
                                            {this.state.bundleId == bundle.id ?
                                            <p className="text-primary">{ bundle.name }</p>:
                                            <p>{ bundle.name }</p>
                                            }
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )

    }

}
