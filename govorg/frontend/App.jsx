
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
                    <MenuItem icon="gp-text-primary fa fa-database" url="/gov/bundle/" text="ДЭД САН"></MenuItem>
                    <MenuItem icon="gp-text-primary icon-user" url="/gov/" text="ХЭРЭГЛЭГЧ"></MenuItem>
                    <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/system/" text="СИСТЕМ"></MenuItem>
                    {tuuhen_ov.perm_view &&
                        <MenuItem icon="gp-text-primary fa fa-history" url="/gov/tuuhen-ov/" text="ТҮҮХЭН ӨВ БҮРТГЭЛ"></MenuItem>
                    }
                    {tseg_burtgel.perm_view &&
                        <li>
                            <a className="waves-effect">
                                <i className="gp-text-primary zmdi zmdi-photo-size-select-small"></i>  <span> ХҮСЭЛТ</span>
                                <i className="fa fa-angle-left pull-right"></i>
                            </a>
                            <ul className="sidebar-submenu">
                                <li>
                                    <a className="waves-effect"><i className="gp-text-primary fa fa-circle-o"></i>ЦЭГИЙН МЭДЭЭЛЭЛ<i className="fa fa-angle-left pull-right"></i></a>
                                    <ul className="sidebar-submenu">
                                        <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" text="ШИНЭ ЦЭГ"></MenuItem>
                                        <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" text="ЦЭГ УСТГАХ"></MenuItem>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    }
                    <MenuItem icon="gp-text-primary zmdi zmdi-group-work" url="/gov/zip-code/" text="ЗИПКОД"></MenuItem>
                    <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/org/help/" text="ТУСЛАМЖ"></MenuItem>
                    {teevriin_suljee.perm_view &&
                        <MenuItem icon="gp-text-primary icon-map" url="/gov/тээврийн-сүлжээ/" text="ТЭЭВРИЙН СҮЛЖЭЭ"></MenuItem>
                    }
                    { ded_butets.perm_view &&
                        <MenuItem icon="gp-text-primary icon-map" url="/gov/дэд-бүтэц/" text="ДЭД БҮТЭЦ"></MenuItem>
                    }
                    { bair_zuin_zurag.perm_view &&
                        <MenuItem icon="gp-text-primary icon-map" url="/gov/байр-зүйн-зураг/" text="БАЙР ЗҮЙН ЗУРАГ"></MenuItem>
                    }
                    { barilga_suurin_gazar.perm_view &&
                        <MenuItem icon="gp-text-primary icon-map" url="/gov/барилга-суурин-газар/" text="БАРИЛГА СУУРИН ГАЗАР">
                            <ul>
                                <MenuItem icon="gp-text-primary icon-map" url="/gov/барилга-суурин-газар/:oid/" text="sldkjflskdjf"></MenuItem>
                            </ul>
                        </MenuItem>
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
