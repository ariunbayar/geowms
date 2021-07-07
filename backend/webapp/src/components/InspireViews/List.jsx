import { set } from 'ol/transform'
import React, { Component } from 'react'
import { service } from './service'
import SideBar from './Sidebar'
import './styles.css'
import Loader from "@utils/Loader"

export class List extends Component {

    constructor(props) {
        super(props)

        this.state = {
            list_all:[],
            fields: [],
            fid: null,
            tid: null,
            id_list: [],
            open_datas: [],
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
            property_loading: false,
            cache_values: [],
            property_length:null,
            check_list: false,
            has_view: false,
            check_open: false,
        }
        this.getAll = this.getAll.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.activeView= this.activeView.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        this.setState({ is_loading: true })
        service
            .getall()
            .then(({ success, data, style_names, defualt_url }) => {
                if(success){
                    this.setState({
                        list_all: data,
                        style_names,
                        defualt_url: defualt_url,
                        is_loading: false
                    })
                }
            })
    }

    getProperties(fid, tid, fname, event) {
        var check_list = this.state.check_list
        var check_open = this.state.check_open
        let property_length = 0
        if (event) this.activeView(event)
        this.setState({ fid, tid, fname, property_loading: true })
        service
            .getPropertyFields(tid, fid)
            .then(({ success, fields, id_list, view, url, style_name, geom_type, cache_values, open_datas, files }) => {
                if(success) {
                    fields.map((f_config, idx) =>
                        f_config.data_types.map((data_type, idx) =>
                            data_type.data_type_configs.map((data_type_config, idx) =>
                            {
                                if (data_type_config.property_id) { property_length += 1 }
                            })
                        )
                    )

                    if(property_length == id_list.length) { check_list = true }
                    if(property_length == open_datas.length) { check_open = true }
                    this.setState({
                        fields,
                        id_list,
                        view,
                        url,
                        check_list,
                        view_style_name: style_name,
                        geom_type,
                        open_datas,
                        check_open,
                        property_loading: false,
                        cache_values,
                        property_length: property_length,
                        has_view: success,
                        files
                    })
                }
                else this.setState({ property_loading: false, has_view: success, geom_type, view_style_name: '', files})
            })
    }

    componentDidUpdate(pP, pS){
        if(pS.geom_type !== this.state.geom_type){
            this.setState({ geom_type: this.state.geom_type })
        }
    }

    activeView(event){
        this.setState({ fields: [], id_list: [], view: '', files: [] })
        const id = event.id
        const prev_event = this.state.prev_event
        const prev_theme_event = this.state.prev_theme_event
        const prev_package_event = this.state.prev_package_event
        const check_package_event = this.state.check_package_event
        const id_array = id.split('-')
        const id_array_length = id_array.length
        event.className = "list-group-item collapsed active"
        if (id_array_length === 1) {
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
                        else {
                            event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        }
                    }
                    else {
                        event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        prev_event.className = "list-group-item collapsed"
                        prev_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                }
                else {
                    event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                    if (check_package_event !== null) {
                        prev_event.className = "list-group-item collapsed"
                        check_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                    this.setState({check_package_event: prev_package_event})
                }
            }
            else {
                event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
            }
            this.setState({prev_package_event:  event})
        }
        if (id_array_length === 3){
            prev_event.className = "list-group-item collapsed"
        }
        this.setState({ prev_event: event })
    }

    render() {
        const { list_all, fid, tid, style_names, view_style_name, url, defualt_url, geom_type, is_loading, property_loading, cache_values, check_list } = this.state
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
                                            role="button"
                                            id={`${theme_idx}`}
                                            data-toggle="collapse"
                                            data-target={`#collapse-theme${theme_idx}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-theme${theme_idx}`}
                                            onClick={(e) => this.activeView(e.currentTarget)}
                                        >
                                            <i className="icon expand-icon fa fa-plus" id={`${theme_idx}`}></i>
                                            &nbsp;&nbsp;{theme.name}
                                        </li>
                                        <div id={`collapse-theme${theme_idx}`} className="collapse" data-parent="#accordion1">
                                            <div id={`accordion10${theme_idx}`}>
                                                {theme.package.map((packages, pack_idx) =>
                                                    <ul className="list-group" key={pack_idx}>
                                                        <li className="list-group-item collapsed"
                                                            role="button"
                                                            id={`${theme_idx}-${pack_idx}`}
                                                            data-toggle="collapse"
                                                            data-target={`#collapse-packages${theme_idx}${pack_idx}`}
                                                            aria-expanded="false"
                                                            aria-controls={`collapse-packages${theme_idx}${pack_idx}`}
                                                            onClick={(e) => this.activeView(e.currentTarget)}
                                                        >
                                                            <i className="icon expand-icon fa fa-plus ml-4" id={`${theme_idx}-${pack_idx}`}></i>
                                                            &nbsp;&nbsp;{packages.name}
                                                        </li>
                                                        <div id={`collapse-packages${theme_idx}${pack_idx}`} className="collapse" data-parent={`#accordion10${theme_idx}`}>
                                                            <div id={`accordion100${pack_idx}`}>
                                                                {packages.features.map((feature, idx) =>
                                                                    <ul className="list-group" key={idx}>
                                                                        <li className="list-group-item"
                                                                            role="button"
                                                                            id={`${theme_idx}-${pack_idx}-${idx}`}
                                                                            onClick={(e) => this.getProperties(feature.id, theme.id, feature.name, e.currentTarget)}
                                                                        >
                                                                            <i
                                                                                className={feature.view.view_name ? "fa fa-table text-success": "fa fa-table text-muted"}
                                                                                style={{paddingLeft: "40px"}}
                                                                            >
                                                                            </i>
                                                                            &nbsp;
                                                                            <span className="p-0" id={`${theme_idx}-${pack_idx}-${idx}`}> {feature.name}</span>
                                                                            {
                                                                                feature.view.view_name
                                                                                &&
                                                                                    <ul style={{paddingLeft: "90px"}} id={`${theme_idx}-${pack_idx}-${idx}`}>
                                                                                        <li
                                                                                            id={`features-${theme_idx}${pack_idx}${idx}`}
                                                                                        >
                                                                                            {feature.view['view_name']}
                                                                                        </li>
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
                    <Loader is_loading={is_loading}/>
                </div>
                <SideBar
                    getAll={this.getAll}
                    getProperties={this.getProperties}
                    fields={this.state.fields}
                    fid={this.state.fid}
                    fname={this.state.fname}
                    tid={this.state.tid}
                    id_list={this.state.id_list}
                    open_datas={this.state.open_datas}
                    property_length={this.state.property_length}
                    check_list={check_list}
                    check_open={this.state.check_open}
                    view={this.state.view}
                    style_names={style_names}
                    url={url}
                    defualt_url={defualt_url}
                    view_style_name={view_style_name}
                    geom_type={geom_type}
                    property_loading={property_loading}
                    cache_values={cache_values}
                    has_view={this.state.has_view}
                    files={this.state.files}
                />
            </div>
        )
    }
}
