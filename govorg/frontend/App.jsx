
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
import { service } from "./service"


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
            barilga_suurin_gazar_table_list: [],
            bair_zuin_zurag_table_list: [],
            ded_butets_table_list: [],
            teevriin_suljee_table_list: [],
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

        service
            .tableListBarilgaSuurinGazar()
            .then(({ items }) => {
                this.setState({
                    barilga_suurin_gazar_table_list: items,
                })
            })

        service
            .tableListTeevriinSuljee()
            .then(({ items }) => {
                this.setState({
                    teevriin_suljee_table_list: items,
                })
            })

        service
            .tableListBairZuinZurag()
            .then(({ items }) => {
                this.setState({
                    bair_zuin_zurag_table_list: items,
                })
            })

        service
            .tableListDedButets()
            .then(({ items }) => {
                this.setState({
                    ded_butets_table_list: items,
                })
            })

    }

    render() {
        const {
            tuuhen_ov,
            tseg_burtgel,
            teevriin_suljee,
            teevriin_suljee_table_list,
            barilga_suurin_gazar,
            ded_butets_table_list,
            bair_zuin_zurag,
            bair_zuin_zurag_table_list,
            ded_butets,
            barilga_suurin_gazar_table_list,
        } = this.state
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
                        <MenuItem icon="gp-text-primary icon-user" url="/gov/employees/" text="ХЭРЭГЛЭГЧ"></MenuItem>
                        <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/system/" text="СИСТЕМ"></MenuItem>
                        {tuuhen_ov.perm_view &&
                            <MenuItem icon="gp-text-primary fa fa-history" url="/gov/tuuhen-ov/" text="ТҮҮХЭН ӨВ БҮРТГЭЛ"></MenuItem>
                        }
                        {tseg_burtgel.perm_view &&
                            <MenuItem
                                icon="gp-text-primary zmdi zmdi-photo-size-select-small"
                                url="/gov/froms/tseg-info/tsegpersonal/"
                                text="ХҮСЭЛТ"
                            >
                                <ul className="sidebar-submenu">
                                    <MenuItem
                                        icon="gp-text-primary fa fa-circle-o"
                                        url="/gov/froms/tseg-info/tsegpersonal/"
                                        text="ЦЭГИЙН МЭДЭЭЛЭЛ"
                                    >
                                        <ul className="sidebar-submenu">
                                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" text="ШИНЭ ЦЭГ"></MenuItem>
                                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" text="ЦЭГ УСТГАХ"></MenuItem>
                                        </ul>
                                    </MenuItem>
                                </ul>
                            </MenuItem>
                        }
                        <MenuItem icon="gp-text-primary zmdi zmdi-group-work" url="/gov/zip-code/" text="ЗИПКОД"></MenuItem>
                        <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/org/help/" text="ТУСЛАМЖ"></MenuItem>
                        {teevriin_suljee.perm_view &&
                            <MenuItem
                                icon="gp-text-primary icon-map"
                                url="/gov/тээврийн-сүлжээ/"
                                text="Тээврийн сүлжээ"
                            >
                                <ul className="sidebar-submenu">
                                    { teevriin_suljee_table_list.map(({ oid, schema, table }, idx) =>
                                        <MenuItem
                                            key={ idx }
                                            icon="fa fa-table"
                                            url={`/gov/тээврийн-сүлжээ/${oid}/`}
                                            text={schema + '.' + table}
                                        ></MenuItem>
                                    )}
                                </ul>
                            </MenuItem>
                        }
                        { ded_butets.perm_view &&
                            <MenuItem
                                icon="gp-text-primary icon-map"
                                url="/gov/дэд-бүтэц/"
                                text="Дэд бүтэц"
                            >
                                <ul className="sidebar-submenu">
                                    { ded_butets_table_list.map(({ oid, schema, table }, idx) =>
                                        <MenuItem
                                            key={ idx }
                                            icon="fa fa-table"
                                            url={`/gov/дэд-бүтэц/${oid}/`}
                                            text={schema + '.' + table}
                                        ></MenuItem>
                                    )}
                                </ul>
                            </MenuItem>
                        }
                        { bair_zuin_zurag.perm_view &&
                            <MenuItem
                                icon="gp-text-primary icon-map"
                                url="/gov/байр-зүйн-зураг/"
                                text="Байр зүйн зураг"
                            >
                                <ul className="sidebar-submenu">
                                    { bair_zuin_zurag_table_list.map(({ oid, schema, table }, idx) =>
                                        <MenuItem
                                            key={ idx }
                                            icon="fa fa-table"
                                            url={`/gov/байр-зүйн-зураг/${oid}/`}
                                            text={schema + '.' + table}
                                        ></MenuItem>
                                    )
                                    }
                                </ul>
                            </MenuItem>
                        }
                        { barilga_suurin_gazar.perm_view &&
                            <MenuItem
                                icon="gp-text-primary icon-map"
                                url="/gov/барилга-суурин-газар/"
                                text="Барилга суурин газар"
                            >
                                <ul className="sidebar-submenu">
                                    { barilga_suurin_gazar_table_list.map(({ oid, schema, table }, idx) =>
                                        <MenuItem
                                            key={ idx }
                                            icon="fa fa-table"
                                            url={`/gov/барилга-суурин-газар/${oid}/map/`}
                                            text={schema + '.' + table}
                                        ></MenuItem>
                                    )}
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
                            <Route path="/gov/system/" component={System} />
                            { teevriin_suljee.perm_view &&
                                <Route path="/gov/тээврийн-сүлжээ/:oid/" render={(routeProps) =>
                                    <ТээврийнСүлжээ
                                        { ...routeProps }
                                        fields={
                                            teevriin_suljee_table_list.reduce((acc, { oid, fields }) => {
                                                return oid == routeProps.match.params.oid ? fields : acc
                                            }, [])
                                        }
                                    />
                                }/>
                            }
                            { ded_butets.perm_view &&
                                <Route path="/gov/дэд-бүтэц/:oid/" render={(routeProps) =>
                                    <ДэдБүтэц
                                        { ...routeProps }
                                        fields={
                                            ded_butets_table_list.reduce((acc, { oid, fields }) => {
                                                return oid == routeProps.match.params.oid ? fields : acc
                                            }, [])
                                        }
                                    />
                                }/>
                            }
                            { bair_zuin_zurag.perm_view &&
                                <Route path="/gov/байр-зүйн-зураг/:oid/" render={(routeProps) =>
                                    <БайрЗүйнЗураг
                                        { ...routeProps }
                                        fields={
                                            bair_zuin_zurag_table_list.reduce((acc, { oid, fields }) => {
                                                return oid == routeProps.match.params.oid ? fields : acc
                                            }, [])
                                        }
                                    />
                                }/>
                            }

                            { barilga_suurin_gazar.perm_view &&
                                <Route path="/gov/барилга-суурин-газар/:oid/" render={(routeProps) =>
                                    <БарилгаСууринГазар
                                        { ...routeProps }
                                        fields={
                                            barilga_suurin_gazar_table_list.reduce((acc, { oid, fields }) => {
                                                return oid == routeProps.match.params.oid ? fields : acc
                                            }, [])
                                        }
                                    />
                                }/>
                            }
                            <Route path="/gov/zip-code/" component={ZipCode}/>
                            <Route exact path="/gov/employees/" component={ Employee }/>
                            <Route exact path="/gov/bundle/" component={Bundle}/>
                            <Route exact path="/gov/org/help/" component={Help}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}
