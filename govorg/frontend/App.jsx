
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
                <li>
                    <NavLink  activeClassName="active" to={"/gov/bundle/"} className="waves-effect">
                        <i className="fa fa-database gp-text-primary"></i> <span>ДЭД САН</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink  activeClassName="active" to={"/gov/"} className="waves-effect">
                        <i className="icon-user gp-text-primary"></i> <span>ХЭРЭГЛЭГЧ</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink  activeClassName="active" to={"/gov/system/"} className="waves-effect">
                        <i className="fa fa-assistive-listening-systems gp-text-primary"></i> <span>СИСТЕМ</span>
                    </NavLink>
                </li>
                {tuuhen_ov.perm_view ?
                <li >
                    <NavLink  activeClassName="active" to={"/gov/tuuhen-ov/"} className="waves-effect">
                        <i className="fa fa-history gp-text-primary"></i> <span>ТҮҮХЭН ӨВ БҮРТГЭЛ</span>
                    </NavLink>
                </li>
                :
                null
                }
                {tseg_burtgel.perm_view ?
                <li>
                <a href="javaScript:void();" className="waves-effect">
                    <i className="zmdi zmdi-photo-size-select-small gp-text-primary"></i>  <span> ХҮСЭЛТ</span>
                    <i className="fa fa-angle-left pull-right"></i>
                </a>
                <ul className="sidebar-submenu">
                    <li>
                        <a href="javaScript:void();"><i className="fa fa-circle-o"></i>Цэгийн мэдээлэл<i className="fa fa-angle-left pull-right"></i></a>
                            <ul className="sidebar-submenu">
                                <li>
                                    <NavLink activeClassName="active" to={"/gov/froms/tseg-info/tsegpersonal/tseg-personal/"}><i className="fa fa-circle-o"></i>Шинэ цэг</NavLink>
                                </li>
                                <li>
                                    <NavLink activeClassName="active" to={"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/"}><i className="fa fa-circle-o"></i>Цэг устгах</NavLink>
                                </li>
                            </ul>
                    </li>
                </ul>
                </li>
                :
                null
                }
                <li>
                    <NavLink  activeClassName="active" to={"/gov/zip-code/"} className="waves-effect">
                        <i className="zmdi zmdi-group-work gp-text-primary"></i> <span>ЗИПКОД</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink  activeClassName="active" to={"/gov/org/help/"} className="waves-effect">
                        <i className="zmdi zmdi-pin-help gp-text-primary"></i> <span>ТУСЛАМЖ</span>
                    </NavLink>
                </li>
                {teevriin_suljee.perm_view &&
                <li>
                    <NavLink  activeClassName="active" to={"/gov/тээврийн-сүлжээ/"} className="waves-effect">
                        <i className="icon-map gp-text-primary"></i> <span>ТЭЭВРИЙН СҮЛЖЭЭ</span>
                    </NavLink>
                </li>
                }
                { ded_butets.perm_view &&
                <li>
                    <NavLink  activeClassName="active" to={"/gov/дэд-бүтэц/"} className="waves-effect">
                        <i className="icon-map gp-text-primary"></i> <span>ДЭД БҮТЭЦ</span>
                    </NavLink>
                </li>
                }
                <li>
                    <NavLink  activeClassName="active" to={"/gov/байр-зүйн-зураг/"} className="waves-effect">
                        <i className="icon-map"></i> <span>БАЙР ЗҮЙН ЗУРАГ</span>
                    </NavLink>
                </li>
                { barilga_suurin_gazar.perm_view &&
                <li>
                    <NavLink  activeClassName="active" to={"/gov/барилга-суурин-газар/"} className="waves-effect">
                        <i className="icon-map"></i> <span>БАРИЛГА СУУРИН ГАЗАР</span>
                    </NavLink>
                </li>
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
