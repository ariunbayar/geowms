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
            bundleName: 'Хил зааг',
            bundleId: 2,
            bundle: {"id":2,"name":"Хил зааг","layers":[128,129,130,131,132,125,126,127],"wms_list":["Хил, зааг"]},
        }

        this.screenRouter = this.screenRouter.bind(this)
    }
    componentDidMount(){
    }
    screenRouter(screenNAme) {
        if(screenNAme == "homeScreen")
        {
            this.setState({homeScreenIsload: true , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenNAme == "serviceScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: true, metaDataScreenIsload: false, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenNAme == "metaDataScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: true, helpScreenIsload:false, statisticsScreenIsload:false})
        }
        else if(screenNAme == "helpScreen")
        {
            this.setState({homeScreenIsload: false , serviceScreenIsload: false, metaDataScreenIsload: false, helpScreenIsload:true, statisticsScreenIsload:false})
        }
        else if(screenNAme == "statisticsScreen")
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
            this.setState({bundle: data[0].bundle_display})
        })
    
            
        
    }
    render() {
        const bundles = this.props.bundle
        return (
            
            <view>
                {this.state.loginScreenIsload ? <div ><h1>asdas</h1><i onClick={() => this.loginScreen()}  class="fa fa-arrow-left" aria-hidden="true" ></i><LoginDanScreen></LoginDanScreen></div> :
                <div>
                    <div class="header">
                        <div class="row center">
                            <div class="col-11">
                                <h1>{this.state.bundleName}</h1>
                            </div>
                            <div ><i onClick={() => this.loginScreen()} class="fa fa-user" aria-hidden="true"></i></div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="input-group input-group-lg">
                                    <input type="text" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm-5"></input>
                                </div>


                            </div>
                        </div>
                    </div>
                    <div>
                        {this.state.homeScreenIsload ? <HomeScreen></HomeScreen> : null}
                        {this.state.serviceScreenIsload ? <ServiceScreen></ServiceScreen> : null}
                        {this.state.metaDataScreenIsload ? 
                            <div class="metaDataScreen">
                                <MetaDataScreen bundle={this.state.bundle}></MetaDataScreen> 
                                {this.state.wmsLayerScreenIsload ? 
                                <i onClick={() => this.wmsLayerName()} class="fas fa-layer-group wmsLayerButton" aria-hidden="true" style={{color:"blue"}}></i>:
                                <i onClick={() => this.wmsLayerName()} class="fas fa-layer-group wmsLayerButton" aria-hidden="true" style={{color:"black"}}></i>
                                }
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
