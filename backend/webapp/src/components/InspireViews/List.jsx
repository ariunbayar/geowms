import { set } from 'ol/transform'
import React, { Component } from 'react'
import { service } from './service'
import SideBar from './Sidebar'
import './styles.css'

export class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            list_all:[],
            fields: [],
            fid: null,
            tid: null,
            id_list: [],
            view_name: '',
            fname: null,
            prev_event: null,
            prev_theme_event: null,
            prev_package_event: null,
            check_package_event: null,
            style_names: [],
            url: '',
            defualt_url: '',
            view_style_name: '',
            geom_type: '',
            is_loading: false,
            property_loading: false
        }
        this.getAll = this.getAll.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.active_view= this.active_view.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        this.setState({is_loading:true})
        service.getall().then(({success, data, style_names, defualt_url}) => {
            if(success){
                this.setState({
                    list_all: data,
                    style_names,
                    defualt_url:defualt_url,
                    is_loading: false
                })
            }
        })
    }

    getProperties(fid, tid, fname, event) {
        this.active_view(event)
        this.setState({fid, tid, fname, property_loading: true})
        service.getPropertyFields(fid).then(({success ,fields, id_list, view_name, url, style_name, geom_type}) => {
            if(success){
                this.setState({fields, id_list, view_name, url, view_style_name: style_name, geom_type, property_loading:false})
            }
            else this.setState({property_loading: false})
        })
    }

    componentDidUpdate(pP, pS){

        if(pS.geom_type !== this.state.geom_type){
            this.setState({geom_type: this.state.geom_type})
        }
    }
    active_view(event){
        this.setState({fields: [], id_list: [], view_name: ''})
        const id = event.id
        const prev_event = this.state.prev_event
        const prev_theme_event = this.state.prev_theme_event
        const prev_package_event = this.state.prev_package_event
        const check_package_event = this.state.check_package_event
        const id_array = id.split('-')
        const id_array_length = id_array.length
        event.className = "list-group-item collapsed active"
        if (id_array_length === 1){
            event.querySelector('i').className = "icon expand-icon fa fa-minus"
            if (prev_theme_event !== null){
                prev_event.className = "list-group-item collapsed"
                prev_theme_event.querySelector('i').className = "icon expand-icon fa fa-plus"
            }
            this.setState({prev_theme_event:  event})
        }
        if (id_array_length === 2){
            prev_theme_event.className = "list-group-item collapsed"
            if (prev_package_event !== null){
                if (prev_package_event.id.split('-')[0] === id.split('-')[0]){
                    if (prev_package_event.id === id){
                        if (event.querySelector('i').className === "icon expand-icon fa fa-minus ml-4"){
                            prev_event.className = "list-group-item collapsed"
                            event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                        }
                        else{
                            event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        }
                    }
                    else{
                        event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        prev_event.className = "list-group-item collapsed"
                        prev_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                }
                else{
                    event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                    if (check_package_event !== null){
                        prev_event.className = "list-group-item collapsed"
                        check_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                    this.setState({check_package_event: prev_package_event})
                }
            }
            else{
                event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
            }
            this.setState({prev_package_event:  event})
        }
        if (id_array_length === 3){
            prev_event.className = "list-group-item collapsed"
        }
        this.setState({prev_event: event})
    }

    render() {
        const { list_all, fid, tid, style_names, view_style_name, url, defualt_url, geom_type, is_loading, property_loading} = this.state
        return (
            <div className="row m-0">
                <div className="col-md-6">
                    <div className="card bundle-view-scroll mb-0">
                        <div className="card-header text-uppercase">Theme</div>
                        <div className="card-body">
                            <div id="accordion1">
                                {list_all.map((theme, theme_idx) =>
                                    <ul className="list-group" key={theme_idx}>
                                        <li className="list-group-item collapsed"
                                            id={`${theme_idx}`}
                                            data-toggle="collapse"
                                            data-target={`#collapse-theme${theme_idx}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-theme${theme_idx}`}
                                            onClick={(e) => this.active_view(e.currentTarget)}>
                                            <i className="icon expand-icon fa fa-plus" id={`${theme_idx}`}></i>
                                            &nbsp;&nbsp;{theme.name}
                                        </li>
                                        <div id={`collapse-theme${theme_idx}`} className="collapse" data-parent="#accordion1">
                                            <div id={`accordion10${theme_idx}`}>
                                                {theme.package.map((packages, pack_idx) =>
                                                    <ul className="list-group" key={pack_idx}>
                                                        <li className="list-group-item collapsed"
                                                            id={`${theme_idx}-${pack_idx}`}
                                                            data-toggle="collapse"
                                                            data-target={`#collapse-packages${theme_idx}${pack_idx}`}
                                                            aria-expanded="false"
                                                            aria-controls={`collapse-packages${theme_idx}${pack_idx}`}
                                                            onClick={(e) => this.active_view(e.currentTarget)}>
                                                            <i className="icon expand-icon fa fa-plus ml-4" id={`${theme_idx}-${pack_idx}`}></i>
                                                            &nbsp;&nbsp;{packages.name}
                                                        </li>
                                                        <div id={`collapse-packages${theme_idx}${pack_idx}`} className="collapse" data-parent={`#accordion10${theme_idx}`}>
                                                            <div id={`accordion100${pack_idx}`}>
                                                                {packages.features.map((feature, idx) =>
                                                                    <ul className="list-group" key={idx}>
                                                                        <li className="list-group-item"
                                                                            id={`${theme_idx}-${pack_idx}-${idx}`}
                                                                            onClick={(e) => this.getProperties(feature.id, theme.id, feature.name, e.currentTarget)}>
                                                                            <i className={feature.view ? "fa fa-table text-success": "fa fa-table text-muted"} style={{paddingLeft: "40px"}}></i> &nbsp;
                                                                            <span className="p-0" id={`${theme_idx}-${pack_idx}-${idx}`}> {feature.name}</span>
                                                                            {feature.view &&
                                                                                <ul style={{paddingLeft: "90px"}} id={`${theme_idx}-${pack_idx}-${idx}`}>
                                                                                    <li id={`features-${theme_idx}${pack_idx}${idx}`}>{feature.view['view_name']}</li>
                                                                                </ul>
                                                                            }
                                                                        </li>
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <SideBar
                    getAll={this.getAll}
                    fields={this.state.fields}
                    fid={this.state.fid}
                    fname={this.state.fname}
                    tid={this.state.tid}
                    id_list={this.state.id_list}
                    view_name={this.state.view_name}
                    style_names={style_names}
                    url={url}
                    defualt_url={defualt_url}
                    view_style_name={view_style_name}
                    geom_type={geom_type}
                    property_loading={property_loading}
                />
                {is_loading ? <span className="text-center d-block text-sp" style={{position:"fixed", top:"50%", left:"35%"}}> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </span> :null}
            </div>
        )
    }
}
