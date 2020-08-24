import React, {Component} from 'react'
import "./style.css";
import {service} from './DetailPage/service'

import {DetailPage} from './DetailPage'
import {HelpScreen} from './screens/helpScreen'
import {HomeScreen} from './screens/homeScreen'
import {MetaDataScreen} from './screens/metaDataScreen'
import {ServiceScreen} from './screens/serviceScreen'
import {StatisticsScreen} from './screens/statisticsScreen'
import {LoginDanScreen} from './screens/loginDanScreen'
export class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            homeScreenIsload: false,
            serviceScreenIsload: false,
            metaDataScreenIsload: true,
            helpScreenIsload: false,
            statisticsScreenIsload: false,
            wmsLayerScreenIsload: false,
            loginScreenIsload: false,
            bundleName: 'Гэо дата',
            bundleId: null,
            bundle: [],
        }

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
    loginScreen(){
        if(this.state.loginScreenIsload)
        {
            this.setState({loginScreenIsload:false})
        }else
        {
            this.setState({loginScreenIsload:true})
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

    componentDidUpdate(prevProps, prevState) {

    }
    render() {
        const bundles = this.props.bundle
        return (
            <div>
                <div>
                    <div>
                        {this.state.metaDataScreenIsload ?
                            <div className="metaDataScreen">
                                <MetaDataScreen bundle={this.state.bundle}></MetaDataScreen>
                                <a className="wmsLayerButtonBack" onClick={() => this.wmsLayerName()}>
                                    <i className="fas fa-layer-group wmsLayerButton" aria-hidden="true"></i>
                                </a>
                            </div> :
                        null}
                        {this.state.wmsLayerScreenIsload ?
                        <div className="wmsLayerScreen">
                            <div className="row ">
                                <div className="col-10">
                                    <a>ДЭД САН</a>
                                    <hr/>
                                </div>
                                <div className="col-2 xButton">
                                    <a onClick={() => this.wmsLayerName()}>X</a>
                                </div>
                            </div>
                            <div className="row ">
                                {bundles.map((bundle, i) =>
                                        <div className="col-4 text-center sub" key={i}>
                                            <a onClick={() => this.wmsLayerId(bundle.id, bundle.name)}>
                                                <img src={bundle.icon} />
                                                <p>{ bundle.name }</p>
                                            </a>
                                        </div>
                                )}
                            </div>
                        </div> : null
                        }
                    </div>

                </div>
            </div>
        )

    }

}
