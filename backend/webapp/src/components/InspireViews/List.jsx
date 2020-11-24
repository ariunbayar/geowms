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
            check: '',
            fid: null,
            tid: null,
            pid: null,
            id_list: [],
            view_name: '',
            fname: null,
        }
        this.getAll = this.getAll.bind(this)
        this.getProperties = this.getProperties.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        service.getall().then(({success, data }) => {
            if(success){
                this.setState({
                    list_all: data,
                })
            }
        })
    }

    getProperties(fid, tid, fname, pid) {
        this.setState({fid, tid, fname, pid})
        service.getPropertyFields(fid).then(({success ,fields, id_list, view_name}) => {
            if(success){
                this.setState({fields, id_list, view_name})
            }
        })
    }

    render() {
        const { list_all, fid, tid, pid } = this.state
        return (
            <div className="row m-0">
                <div className="col-md-6 bundle-view-scroll p-1 mb-1">
                    <div className="">
                        <div id="accordion1">
                            {list_all.map((theme, theme_idx) =>
                                <div className="card mb-2" key={theme_idx}>
                                    <div className="card-header pt-2 pb-2">
                                        <button className="btn btn-link  shadow-none collapsed pl-0"
                                                data-toggle="collapse"
                                                data-target={`#collapse-theme${theme_idx}`}
                                                aria-expanded="false"
                                                aria-controls={`collapse-theme${theme_idx}`}>
                                            <span> {theme.name} {theme.id == tid && <i class="fa fa-circle text-success" aria-hidden="true"></i>}</span>
                                        </button>
                                    </div>
                                    <div id={`collapse-theme${theme_idx}`} className="collapse" data-parent="#accordion1">
                                        <div className="card-body" style={{padding: "10px"}}>
                                            <div id={`accordion10${theme_idx}`}>
                                                {theme.package.map((packages, pack_idx) =>
                                                    <div className="mb-2" key={pack_idx}>
                                                        <div className="card-header pt-0 pb-0">
                                                            <button className="btn btn-link  shadow-none collapsed pl-0 pt-1 pb-1"
                                                                    data-toggle="collapse"
                                                                    data-target={`#collapse-packages${theme_idx}${pack_idx}`}
                                                                    aria-expanded="false"
                                                                    aria-controls={`collapse-packages${theme_idx}${pack_idx}`}>
                                                                <span> {packages.name} {packages.id == pid && <i class="fa fa-circle text-success" aria-hidden="true"></i>}</span>
                                                            </button>
                                                            <div id={`collapse-packages${theme_idx}${pack_idx}`} className="collapse" data-parent={`#accordion10${theme_idx}`}>
                                                                <div className="card-body" style={{padding: "10px"}}>
                                                                    <div id={`accordion100${pack_idx}`}>
                                                                        {packages.features.map((feature, idx) =>
                                                                            <div className={feature.id == fid ? "mb-2 border border-primary rounded" : "mb-2"} key={idx}>
                                                                                <li key={idx} className="pl-4">
                                                                                    <a onClick={() => this.getProperties(feature.id, theme.id, feature.name, packages.id)}>
                                                                                        <i className={feature.view ? "fa fa-table text-success": "fa fa-table text-muted"}></i> &nbsp;
                                                                                        <span role="button" className="hidden-xs gp-text-primary" > {feature.name}</span>
                                                                                        {feature.view &&
                                                                                            <ul>
                                                                                                <li>{feature.view['view_name']}</li>
                                                                                            </ul>
                                                                                        }
                                                                                    </a>
                                                                                </li>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <SideBar fields={this.state.fields} fid={this.state.fid} tid={this.state.tid} id_list={this.state.id_list} view_name={this.state.view_name} fname={this.state.fname}/>
            </div>
        )
    }
}