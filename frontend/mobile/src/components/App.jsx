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

        this.screenRouter = this.screenRouter.bind(this)
    }

    screenRouter(screenName) {
        if(screenName == "homeScreen")
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: true , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "serviceScreen")
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: false , serviceScreenIsload: true, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "metaDataScreen")
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: true, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "helpScreen")
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:true, statisticsScreenIsload:false})
        }
        else if(screenName == "statisticsScreen")
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:true})
        }
        else
        {
            this.setState({wmsLayerScreenIsload: false, homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: true, helpScreenIsload:false, statisticsScreenIsload:false})
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
                {this.state.loginScreenIsload ? <div ><i onClick={() => this.loginScreen()}  className="fa fa-arrow-left backarrow loginBack" aria-hidden="true" ></i><LoginDanScreen></LoginDanScreen></div> :
                <div>
                    {this.state.metaDataScreenIsload ? 
                    <div className="header">
                        <div className="row center">
                            <div className="col-2">
                                <img src={"/static/assets/image/logo/logo-2.png"} className="geoIconNoText"/> 
                            </div>
                            <div className="col-8">
                                <h1>{this.state.bundleName}</h1>
                            </div>
                            <div className="col-2"><i onClick={() => this.loginScreen()} className="fa fa-user-circle" aria-hidden="true"></i></div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="input-group input-group-lg">
                                    <input type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm-5"></input>
                                </div>
                            </div>
                        </div>
                    </div> :

                    <div className="header">
                        <div className="row center">
                            <div className="col-7">
                                <img src={"/static/assets/image/logo/logo.png"}className="geoIcon"/> 
                            </div>
                            <div className="col-3">
                            </div>
                            <div className="col-2"><i onClick={() => this.loginScreen()} className="fa fa-user-circle" aria-hidden="true"></i></div>
                        </div>
                    </div>
                    }
                    <div>
                        {this.state.homeScreenIsload ? <HomeScreen></HomeScreen> : null}
                        {this.state.serviceScreenIsload ? <ServiceScreen></ServiceScreen> : null}
                        {this.state.metaDataScreenIsload ? 
                            <div className="metaDataScreen">
                                <MetaDataScreen bundle={this.state.bundle}></MetaDataScreen>
                                <a className="wmsLayerButtonBack" onClick={() => this.wmsLayerName()}>
                                    <i className="fas fa-layer-group wmsLayerButton" aria-hidden="true"></i>
                                </a>
                            </div> :
                        null}
                        {this.state.helpScreenIsload ? <HelpScreen></HelpScreen> : null}
                        {this.state.statisticsScreenIsload ? <StatisticsScreen></StatisticsScreen> : null}
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
                    <div className="mnav">
                        <a  onClick={() => this.screenRouter("serviceScreen")} className="mnav__item nuxt-link-exact-active nuxt-link-active">
                            <i className="fa fa-tasks" aria-hidden="true"></i>
                            <p className="footerButton" >Үйлчилгээ</p>
                        </a>
                        <a  onClick={() => this.screenRouter("metaDataScreen")} className="mnav__item">
                            <i className="fa fa-map" aria-hidden="true"></i>
                            <p className="footerButton" >Газрын зураг</p>
                        </a> 
                        <a  onClick={() => this.screenRouter("helpScreen")} className="mnav__item">
                            <i className="fa fa-info-circle" aria-hidden="true"></i>
                            <p className="footerButton" >Тусламж</p>
                        </a>
                        <a  onClick={() => this.screenRouter("statisticsScreen")} className="mnav__item">
                        <i className="fa fa-bar-chart"></i>
                            <p className="footerButton" >Статистик</p>
                        </a>
                    </div>
                </div>
                }
            </div>
        )

    }

}
