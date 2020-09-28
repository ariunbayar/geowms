
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
            <div className="container-fluid mt-0">
                <div className="row d-flex flex-wrap">
                <nav id="sidebarMenu" className="col-lg-2 d-md-block bg-light sidebar collapse shadow pt-5 mt-0 pl-5 h-100 position-fixed" >
                    <h5 className="text-primary mb-4">{this.props.org.org_name}</h5>
                    <div className="sidebar-sticky ">
                       
                        <ul className="nav flex-column ml-3">
                            <li className="nav-item m-1 pb-1">
                                <NavLink  exact to={'/gov/bundle/'} activeClassName="active">
                                <i className="fa fa-database text-primary"></i>&nbsp;ДЭД САН
                                </NavLink>
                            </li>
                            <li className="nav-item m-1 pb-1">
                                <NavLink  to={'/gov/'} activeClassName="active">
                                <i className="fa fa-users text-primary" ></i>&nbsp;ХЭРЭГЛЭГЧ
                                </NavLink>
                            </li>
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/system/'} activeClassName="active">
                                <i className='fa fa-university text-primary'></i>&nbsp;СИСТЕМ
                                </NavLink>
                            </li>
                            {tuuhen_ov.perm_view ?
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/tuuhen-ov/'} activeClassName="active">
                                    <i className='fa fa-history text-primary'></i>&nbsp;Түүхэн өв бүртгэл
                                </NavLink>
                            </li>
                            :
                            null
                            }
                            {tseg_burtgel.perm_view ?
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/froms/'} activeClassName="active">
                                    <i className='fa fa-file-archive-o text-primary'></i>&nbsp;Хүсэлт
                                </NavLink>
                            </li>
                            :
                            null
                            }
                            <li className="nav-item m-1">
                                <NavLink  to={'/gov/zip-code/'} activeClassName="active">
                                    <i className='fa fa-address-card text-primary'></i> Зипкод
                                </NavLink>
                            </li>
                            { teevriin_suljee.perm_view && 
                                <li className="nav-item m-1">
                                    <NavLink  to={'/gov/тээврийн-сүлжээ/'} activeClassName="active">
                                        <i className='fa fa-address-card text-primary'></i> Тээврийн Сүлжээ
                                    </NavLink>
                                </li>
                            }
                            { ded_butets.perm_view &&
                                <li className="nav-item m-1">
                                    <NavLink  to={'/gov/дэд-бүтэц/'} activeClassName="active">
                                        <i className='fa fa-address-card text-primary'></i> Дэд Бүтэц
                                    </NavLink>
                                </li>
                            }
                            { bair_zuin_zurag.perm_view &&
                                <li className="nav-item m-1">
                                    <NavLink  to={'/gov/байр-зүйн-зураг/'} activeClassName="active">
                                        <i className='fa fa-address-card text-primary'></i> Байр Зүйн Зураг
                                    </NavLink>
                                </li>
                            }
                            { barilga_suurin_gazar.perm_view &&
                                <li className="nav-item m-1">
                                    <NavLink  to={'/gov/барилга-суурин-газар/'} activeClassName="active">
                                        <i className='fa fa-address-card text-primary'></i> Барилга Суурин Газар
                                    </NavLink>
                                </li>
                            }

                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
                <div className="col-md-10">
                        <Switch>
                            {tseg_burtgel.perm_view ?
                                <Route path={"/gov/froms/"} component={()=><Forms perms={this.state.tseg_burtgel}/>}/> : null
                            }
                            {tuuhen_ov.perm_view ?
                                <Route path="/gov/tuuhen-ov/" component={()=><TuuhenOv perms={this.state.tuuhen_ov}/>}/> : null
                            }
                            <Route path="/gov/тээврийн-сүлжээ/" component={ТээврийнСүлжээ}/>
                            <Route path="/gov/дэд-бүтэц/" component={ДэдБүтэц}/>
                            <Route path="/gov/байр-зүйн-зураг/" component={БайрЗүйнЗураг}/>
                            <Route path="/gov/барилга-суурин-газар/" component={БарилгаСууринГазар}/>
                            <Route path="/gov/zip-code/" component={ZipCode}/>
                            <Route exact path="/gov/" component={Employee}/>
                            <Route exact path="/gov/bundle/" component={Bundle}/>
                        </Switch>
                    </div>
                </main>
                </div>

            </div>
        </BrowserRouter>
        )
    }
}