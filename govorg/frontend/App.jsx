
import React, {Component} from 'react'
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import Employee from './Employee/EmployeeForm'
import Bundle from './Bundle/Bundle'
import ТээврийнСүлжээ from './TeevriinSuljee'
import ДэдБүтэц from './DedButets'
import БайрЗүйнЗураг from './BairZuinZurag'
import БарилгаСууринГазар from './BarilgaSuurinGazar'
import Bundles from './Map/index'
import OrgRequest from './OrgRequest'
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
            tseg_burtgel: {},
            map_list:[],
        }
        this.handleMapComponens = this.handleMapComponens.bind(this)
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
            .then(({ success, data }) => {
                if(success){
                    this.setState({barilga_suurin_gazar_table_list:data})
                }
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

        this.handleMapComponens()
    }
    handleMapComponens(){
        service.component
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
        const org_inspire = this.props.org.org_inspire

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
                        <MenuItem icon="gp-text-primary fa fa-key" url="/gov/bundle/" text="Эрх">
                            <ul className="sidebar-submenu">
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/bundle/" text="Байгууллага"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/employees/" text="Хэрэглэгч"></MenuItem>
                            </ul>
                        </MenuItem>


                        <MenuItem icon="gp-text-primary fa fa-assistive-listening-systems" url="/gov/system/" text="Систем"></MenuItem>

                        <MenuItem icon="gp-text-primary fa fa-inbox" url="#" text="Хүсэлт">
                            <ul className="sidebar-submenu">
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/received/" text="Илгээсэн хүсэлт"></MenuItem>
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/sent/" text="Шийдвэрлэх хүсэлт"></MenuItem>
                            </ul>
                        </MenuItem>

                        <MenuItem icon="gp-text-primary fa fa-database" url="/gov/org/map/" text="Дэд сан">
                            <ul className="sidebar-submenu">
                                {tuuhen_ov.perm_view &&
                                    <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/tuuhen-ov/" text="Түүхэн өв бүртгэл"></MenuItem>
                                }
                                {tseg_burtgel.perm_view &&
                                    <MenuItem
                                        icon="gp-text-primary fa fa-circle-o"
                                        url="/gov/froms/tseg-info/tsegpersonal/"
                                        text="Цэгийн мэдээлэл"
                                    >
                                        <ul className="sidebar-submenu">
                                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-personal/" text="Шинэ цэг"></MenuItem>
                                            <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/" text="Цэг устгах"></MenuItem>
                                        </ul>
                                    </MenuItem>
                                }
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/zip-code/" text="Зипкод"></MenuItem>
                                { org_inspire.length >0  ? org_inspire.map((theme, idx) =>
                                    <MenuItem
                                        key={ idx }
                                        icon="gp-text-primary icon-map"
                                        url={`/gov/org/map/${theme.id}`}
                                        text={theme.name}
                                    >
                                        <ul className="sidebar-submenu">
                                            {
                                                theme.packages.length > 0 ? theme.packages.map((pack, idy)=>
                                                <MenuItem
                                                    key={ idy }
                                                    icon="fa fa-folder-open gp-text-primary"
                                                    url={`/gov/org/map/${theme.id}/${pack.id}`}
                                                    text={pack.name}
                                                >
                                                <ul className="sidebar-submenu">
                                                    {
                                                        pack.features.length>0 ? pack.features.map((feat, idz)=>
                                                            <MenuItem
                                                                key={idz}
                                                                icon="fa fa-table gp-text-primary"
                                                                url={`/gov/org/map/${theme.id}/${pack.id}/${feat.id}/`}
                                                                text={feat.name}
                                                            >
                                                            </MenuItem>
                                                        ): null
                                                    }
                                                </ul>
                                                </MenuItem>
                                                ):null
                                            }
                                        </ul>
                                    </MenuItem>
                                ):null}
                                <MenuItem icon="gp-text-primary fa fa-circle-o" url="/gov/history/" text="Өөрчлөлтийн түүх"></MenuItem>
                            </ul>
                        </MenuItem>

                        <MenuItem icon="gp-text-primary fa fa-plug" url="/gov/org-request/" text="ХҮСЭЛТ"></MenuItem>
                        <MenuItem icon="gp-text-primary zmdi zmdi-pin-help" url="/gov/org/help/" text="Тусламж"></MenuItem>
                        {/* {teevriin_suljee.perm_view &&
                            <MenuItem
                                icon="gp-text-primary icon-map"
                                url="/gov/тээврийн-сүлжээ/"
                                text="Тээврийн сүлжээ"
                            >
                                <ul className="sidebar-submenu">
                                    { teevriin_suljee_table_list.map(({ oid, schema, table }, idx) =>
                                        <MenuItem
                                            key={ idx }
                                            icon="fa fa-table gp-text-primary"
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
                                            icon="fa fa-table gp-text-primary"
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
                                            icon="fa fa-table gp-text-primary"
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
                                { barilga_suurin_gazar_table_list.map(({packages}) =>
                                    packages.map((pack, idx)=>
                                        <MenuItem
                                        key={ idx }
                                        url={`/gov/барилга-суурин-газар/${pack.id}/`}
                                        text={pack.name}
                                        >
                                        <ul className="sidebar-submenu">
                                            {pack.features.map((feat,idf)=>
                                                <MenuItem
                                                key={ idf}
                                                icon="fa fa-table gp-text-primary"
                                                url={`/gov/барилга-суурин-газар/${pack.id}/${feat.id}/`}
                                                text={feat.name}
                                                />

                                                )}
                                        </ul>
                                        </MenuItem>)
                                )}
                            </ul>
                            </MenuItem>
                        } */}
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
                                <Route path="/gov/барилга-суурин-газар/:pid/:fid/" render={(routeProps) =>
                                    <БарилгаСууринГазар
                                        { ...routeProps }
                                        fields={
                                            barilga_suurin_gazar_table_list.reduce((acc, pack) => {
                                                return pack.id == routeProps.match.params.pid ? fields : acc
                                            }, [])
                                        }
                                    />
                                }/>
                            }
                            <Route path="/gov/org/map/:tid/:pid/:fid/" component={Bundles}/>
                            <Route path="/gov/zip-code/" component={ZipCode}/>
                            <Route path="/gov/org-request/" component={OrgRequest}/>
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
