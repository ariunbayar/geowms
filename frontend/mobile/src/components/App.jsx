import React, {Component} from 'react'
import "./style.css";
import {service} from './DetailPage/service'

import {DetailPage} from './DetailPage'
import {HelpScreen} from './screens/helpScreen'
import {HomeScreen} from './screens/homeScreen'
import {MetaDataScreen} from './screens/metaDataScreen'
import {ServiceScreen} from './screens/serviceScreen'
import {StatisticsScreen} from './screens/statisticsScreen'
import { set } from 'ol/transform';
import {LoginDanScreen} from './screens/loginDanScreen'
//alert(JSON.stringify(this.props.bundles))
export class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            screen: "props.bundle,",
            homeScreenIsload: false,
            serviceScreenIsload: false,
            metaDataScreenIsload: true,
            helpScreenIsload: false,
            statisticsScreenIsload: false,
            wmsLayerScreenIsload: false,
            loginScreenIsload: false,
            bundleName: 'Геодезийн тулгуур сүлжээ',
            bundleId: 5,
            bundle: {"id":5,"name":"Геодезийн тулгуур сүлжээ","layers":[83,84,85,88,91,78,78,83,83,84,88,79,79,88,91,88,83,84],"wms_list":["Хил, зааг"]},
        }

        this.screenRouter = this.screenRouter.bind(this)
    }
    componentDidMount(){
    }
    screenRouter(screenName) {
        if(screenName == "homeScreen")
        {
            this.setState({homeScreenIsload: true , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "serviceScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: true, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "metaDataScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: true, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenName == "helpScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:true, statisticsScreenIsload:false})
        }
        else if(screenName == "statisticsScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:true})
        }
        else
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: true, helpScreenIsload:false, statisticsScreenIsload:false})
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
                    console.log(JSON.stringify(data))
                    this.setState({bundle: data[0].bundle_display, metaDataScreenIsload: false})
                    this.setState({metaDataScreenIsload: true})
            }
        })
    }
    

    componentDidUpdate(prevProps, prevState) {
        
    }
    render() {
        const bundles = this.props.bundle
        return (
            
            <view>
                {this.state.loginScreenIsload ? <div ><i onClick={() => this.loginScreen()}  class="fa fa-arrow-left backarrow" aria-hidden="true" ></i><LoginDanScreen></LoginDanScreen></div> :
                <div>
                    {this.state.metaDataScreenIsload ? 
                    <div class="header">
                        <div class="row center">
                            <div class="col-11">
                                <h1>{this.state.bundleName}</h1>
                            </div>
                            <div ><i onClick={() => this.loginScreen()} class="fa fa-user-circle" aria-hidden="true"></i></div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="input-group input-group-lg">
                                    <input type="text" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm-5"></input>
                                </div>


                            </div>
                        </div>
                    </div> :

                    <div class="header">
                        <div class="row center">
                            <div class="col-11">
                                <h1>Гео портал</h1>
                            </div>
                            <div ><i onClick={() => this.loginScreen()} class="fa fa-user-circle-o" aria-hidden="true"></i></div>
                        </div>
                    </div>
                    }




                    <div>
                        {this.state.homeScreenIsload ? <HomeScreen></HomeScreen> : null}
                        {this.state.serviceScreenIsload ? <ServiceScreen></ServiceScreen> : null}
                        {this.state.metaDataScreenIsload ? 
                            <div class="metaDataScreen">
                                <MetaDataScreen bundle={this.state.bundle}></MetaDataScreen>
                                <a class="wmsLayerButtonBack" onClick={() => this.wmsLayerName()}>
                                    <i class="fas fa-layer-group wmsLayerButton" aria-hidden="true"></i>
                                </a>
                            </div> :
                        null}
                        {this.state.helpScreenIsload ? <HelpScreen></HelpScreen> : null}
                        {this.state.statisticsScreenIsload ? <StatisticsScreen></StatisticsScreen> : null}
                        {this.state.wmsLayerScreenIsload ? 
                        <div class="wmsLayerScreen">
                            <div class="row ">
                            {bundles.map((bundle, i) => 
                                    <div class="col-4 text-center sub">
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
                    <div class="mnav">
                        <a  onClick={() => this.screenRouter("homeScreen")} class="mnav__item">
                            <i class="fa fa-home" aria-hidden="true"></i>
                            <p class="footerButton">Нүүр</p>
                        </a> 
                        <a  onClick={() => this.screenRouter("serviceScreen")} class="mnav__item nuxt-link-exact-active nuxt-link-active">
                            <i class="fa fa-map-marker" aria-hidden="true"></i>
                            <p class="footerButton" >Үзвэр</p>
                        </a> 
                        <a  onClick={() => this.screenRouter("metaDataScreen")} class="mnav__item">
                            <i class="fa fa-database" aria-hidden="true"></i>
                            <p class="footerButton" >Мета дата</p>
                        </a> 
                        <a  onClick={() => this.screenRouter("helpScreen")} class="mnav__item">
                            <i class="fa fa-info-circle" aria-hidden="true"></i>
                            <p class="footerButton" >Тусламж</p>
                        </a>
                        <a  onClick={() => this.screenRouter("statisticsScreen")} class="mnav__item">
                        <i class="fa fa-bar-chart"></i>
                            <p class="footerButton" >Статик</p>
                        </a>
                    </div>
                </div>
                }
            </view>
        )

    }

}
