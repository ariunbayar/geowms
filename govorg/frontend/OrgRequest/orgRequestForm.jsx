
import React, { Component } from "react"
import {service} from './service'
import {OrgRequestTable} from './orgRequestTable'


export default class OrgRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state={
            org_request:[],
            search_state: '',
            search_kind: '',
            search_geom: '',
            search_theme: '',
            search_package: '',
            search_feature: '',
            is_loading: false,
        }
        this.getAll = this.getAll.bind(this)
    }

    componentDidMount(){
        this.getAll()
    }

    getAll(){
        this.setState({ is_loading: true })
        service
        .getAll()
        .then(({ success ,org_request, choices, modules }) => {
            console.log(modules);
           if(success){
                this.themes = []
                this.packages = []
                this.features = []
                modules.map((module, idx) => {
                    this.themes.push(module)
                    module.packages.map((mods, idx) => {
                        this.packages.push(mods)
                        mods.features.map((mod, idx) => {
                            this.features.push(mod)
                        })
                    })
                })
               this.setState({org_request, is_loading: false, choices, modules, themes: this.themes, packages: this.packages, features: this.features})
            }
        })
    }

    handleSearch() {
        const {search_state, search_kind, search_theme, search_package, search_feature} = this.state
        this.setState({ is_loading: true })
        service
            .requestSearch(search_state, search_kind, search_theme, search_package, search_feature)
            .then(({ success ,org_request, info }) => {
                if(success){
                    this.setState({ org_request, is_loading: false })
                } else {
                    console.log(info);
                }
            })
    }

    onChangeOronZai(value, type) {
        const { modules } = this.state
        this.themes = []
        this.packages = []
        this.features = []
        modules.map((module, idx) => {
            if (type == 'theme' && module.id == value){
                this.setState({ search_theme: value })
                this.themes.push(module)
            } else {
                this.themes.push(module)
            }
        })
        this.themes.packages.map((mods, idx) => {
            if (type == 'package', mods.id == value) {
                this.setState({ search_package: value })
                this.packages.push(mods)
            } else {
                this.packages.push(mods)
            }
        })
        this.packages.features.map((mod, idx) => {
            if (type == 'feature', mod.id == value) {
                this.setState({ search_feature: value })
                this.features.push(mod)
            } else {
                this.features.push(mod)
            }
        })
        this.setState({packages: this.packages, features: this.features, })
    }

    render() {
        const org_request = this.state.org_request
        const {search_state, search_kind, is_loading, choices, modules, packages, features, themes} = this.state
        console.log(packages);
        return (
            <div className="row">
                <div className="col-md-12 row">
                    <div className="col-md-6">
                        <label htmlFor="">Төлөв</label>
                        <select className="form-control form-control-sm"
                            onChange={(e) => this.setState({ search_state: e.target.value })}>
                            <option value="">--- Төлөвөөр хайх ---</option>
                            {
                                choices && choices.length > 0
                                ?
                                choices[0].map((choice, idx) =>
                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                )
                                :
                                null
                            }
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="">Өөрчлөлт</label>
                        <select className="form-control form-control-sm"
                            onChange={(e) => this.setState({ search_kind: e.target.value })}
                        >
                            <option value="">--- Өөрчлөлтөөр хайх ---</option>
                            {
                                choices && choices.length > 0
                                ?
                                choices[1].map((choice, idx) =>
                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                )
                                :
                                null
                            }
                        </select>
                    </div>
                    <div className="col-md-12">
                    <br/>
                    <label htmlFor="">Орон зайн өгөгдөл</label>
                        <div className="row">
                            <div className="col-md-3">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.onChangeOronZai(e.target.value, 'theme')}
                                >
                                <option value="">--- Дэд сангаар хайх ---</option>
                                {
                                    themes && themes.length > 0
                                    ?
                                        themes.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.onChangeOronZai(e.target.value, 'package')}
                                >
                                <option value="">--- Багцаас хайх ---</option>
                                {
                                    packages && packages.length > 0
                                    ?
                                        packages.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select className="form-control form-control-sm"
                                    onChange={(e) => this.onChangeOronZai(e.target.value, 'feature')}
                                >
                                <option value="">--- Давхаргаас хайх ---</option>
                                {
                                    features && features.length > 0
                                    ?
                                        features.map((module, idx) =>
                                            <option key={idx} value={module.id}>{module.name}</option>
                                        )
                                    :
                                    null
                                }
                                </select>
                            </div>
                        </div>
                    </div>
                    <button className="btn gp-btn-primary d-flex justify-content-center m-3 float-right" onClick={() => this.handleSearch()}>Хайх</button>
                </div>
                <div className="col-md-12">
                {
                    is_loading
                    ?
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border gp-text-primary" role="status"></div>
                        </div>
                    :
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Орон зайн өгөгдөл</th>
                                        <th scope="col">Байгууллага / мэргэжилтэн</th>
                                        <th scope="col">Огноо</th >
                                        <th>Төлөв</th>
                                        <th>Өөрчлөлт</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        org_request.length > 0 ? org_request.map((req, idx) =>
                                            <OrgRequestTable
                                                key={idx}
                                                idx={idx}
                                                values = {req}
                                                getAll = {this.getAll}
                                            />
                                        )
                                        :<tr>
                                        <td className="text-justify">Өөрчлөлт байхгүй байна</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                }
                </div>
            </div>
        )
    }
}
