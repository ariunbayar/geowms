
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Employee from './Employee/EmployeeForm'
import Bundle from './Bundle/Bundle'
import ТээврийнСүлжээ from './TeevriinSuljee'
import ДэдБүтэц from './DedButets'
import БайрЗүйнЗураг from './BairZuinZurag'
import БарилгаСууринГазар from './BarilgaSuurinGazar'
import { TuuhenOv } from './TuuhenOv'
import { Forms } from './Form'
import { ZipCode } from './Zipcode'
import {Help} from './help/Help'
import { System } from "./System";
import MenuItem from "../../src/components/MenuItem"

export class App extends Component {

    constructor(props) {
        super(props)
        this.state={
            perms: props.org.perms,
            org_level: props.org.org_level,
            name: props.org.name,
            tuuhen_ov: {},
            ded_butets: {},
            bair_zuin_zurag: {},
            barilga_suurin_gazar: {},
            teevriin_suljee: {},
            tseg_burtgel: {}
        }
    }

    componentDidMount(){
        const { perms } = this.state
        perms.map((perm) => {
            if(perm.module_id == 1){
                this.setState({tuuhen_ov: perm})
            }
            else if(perm.module_id == 2){
                this.setState({tseg_burtgel: perm})
            }
            else if(perm.module_id == 3){
                this.setState({teevriin_suljee: perm})
            }
            else if(perm.module_id == 4){
                this.setState({ded_butets: perm})
            }
            else if(perm.module_id == 5){
                this.setState({bair_zuin_zurag: perm})
            }
            else if(perm.module_id == 6){
                this.setState({barilga_suurin_gazar: perm})
            }
        })

    }

    render() {
        const { tuuhen_ov, tseg_burtgel, teevriin_suljee, barilga_suurin_gazar, bair_zuin_zurag, ded_butets } = this.state
        return (
        <BrowserRouter>
            <div id="sidebar-wrapper" data-simplebar="" data-simplebar-auto-hide="true">
            <div className="brand-logo">
                <a href="/">
                    <img src="/static/assets/image/logo/logo-2.png" className="logo-icon" alt="logo icon"></img>
                    <h5 className="logo-text">ГЕОПОРТАЛ</h5>
                </a>
            </div>
            <ul className="sidebar-menu do-nicescrol">
                <li className="sidebar-header">УДИРДАГЧИЙН ХЭСЭГ</li>
                <MenuItem icon="fa fa-database gp-text-primary" url="/gov/bundle/">ДЭД САН</MenuItem>
                <MenuItem icon="icon-user gp-text-primary" url="/gov/">ХЭРЭГЛЭГЧ</MenuItem>
                <MenuItem icon="fa fa-assistive-listening-systems gp-text-primary" url="/gov/system/">СИСТЕМ</MenuItem>
                {tuuhen_ov.perm_view ?
                    <MenuItem icon="fa fa-history gp-text-primary" url="/gov/tuuhen-ov/">ТҮҮХЭН ӨВ БҮРТГЭЛ</MenuItem>
                    :
                    null
                }
                {tseg_burtgel.perm_view ?
                <li>
                <a className="waves-effect">
                    <i className="zmdi zmdi-photo-size-select-small gp-text-primary"></i>  <span> ХҮСЭЛТ</span>
                    <i className="fa fa-angle-left pull-right"></i>
                </a>
                <ul className="sidebar-submenu">
                    <li>
                        <a className="waves-effect"><i className="fa fa-circle-o"></i>ЦЭГИЙН МЭДЭЭЛЭЛ<i className="fa fa-angle-left pull-right"></i></a>
                            <ul className="sidebar-submenu">
                                <MenuItem icon="fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-personal/">ШИНЭ ЦЭГ</MenuItem>
                                <MenuItem icon="fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/">ЦЭГ УСТГАХ</MenuItem>
                            </ul>
                    </li>
                </ul>
                </li>
                :
                null
                }
                <MenuItem icon="zmdi zmdi-group-work gp-text-primary" url="/gov/zip-code/">ЗИПКОД</MenuItem>
                <MenuItem icon="zmdi zmdi-pin-help gp-text-primary" url="/gov/org/help/">ТУСЛАМЖ</MenuItem>
                {teevriin_suljee.perm_view &&
                    <MenuItem icon="icon-map gp-text-primary" url="/gov/тээврийн-сүлжээ/">ТЭЭВРИЙН СҮЛЖЭЭ</MenuItem>
                }
                { ded_butets.perm_view &&
                    <MenuItem icon="icon-map gp-text-primary" url="/gov/дэд-бүтэц/">ДЭД БҮТЭЦ</MenuItem>
                }
                { bair_zuin_zurag.perm_view &&
                <li>
                    <MenuItem icon="icon-map" url="/gov/байр-зүйн-зураг/">БАЙР ЗҮЙН ЗУРАГ</MenuItem>
                </li>
                }
                { barilga_suurin_gazar.perm_view &&
                    <MenuItem icon="icon-map" url="/gov/барилга-суурин-газар/">БАРИЛГА СУУРИН ГАЗАР</MenuItem>
                }
            </ul>
            </div>

            <div className="clearfix">
                <div className="content-wrapper">
                    <Switch>
                        {tseg_burtgel.perm_view ?
                            <Route path={"/gov/froms/"} component={()=><Forms perms={this.state.tseg_burtgel}/>}/> : null
                        }
                        {tuuhen_ov.perm_view ?
                            <Route path="/gov/tuuhen-ov/" component={()=><TuuhenOv perms={this.state.tuuhen_ov}/>}/> : null
                        }
                        <Route path="/gov/тээврийн-сүлжээ/" component={ТээврийнСүлжээ}/>
                        <Route path="/gov/system/" component={System} />
                        <Route path="/gov/дэд-бүтэц/" component={ДэдБүтэц}/>
                        <Route path="/gov/байр-зүйн-зураг/" component={БайрЗүйнЗураг}/>
                        <Route path="/gov/барилга-суурин-газар/" component={БарилгаСууринГазар}/>
                        <Route path="/gov/zip-code/" component={ZipCode}/>
                        <Route exact path="/gov/" component={Employee}/>
                        <Route exact path="/gov/bundle/" component={Bundle}/>
                        <Route exact path="/gov/org/help/" component={Help}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
        )
    }
}
