import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {service} from "./service"
export class Roles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            tid: 0,
            pid: 0,
            fid: 0,
            properties: [],
            properties_perms: []
        }
        this.handleRoles = this.handleRoles.bind(this)
        this.handleFeature = this.handleFeature.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChecked = this.handleChecked.bind(this)
        this.handleCheckedFeatrue = this.handleCheckedFeatrue.bind(this)
    }

    componentDidMount(){
        this.handleRoles()
    }

    handleRoles(){
        const id = this.props.match.params.id
        service.getInspireRoles(id).then(({success, data, roles}) => {
            if(success) this.setState({data, properties_perms: roles})
        })
    }

    handleFeature(tid, pid, fid, properties){
        console.log(tid, pid, fid, properties)
        this.setState({tid, pid, fid, properties})
    }

    handleChecked(json, e){
        const {properties_perms} = this.state
        if(e.target.checked){
            properties_perms.push(json)
            this.setState({properties_perms})
        }
        else{
            var array = properties_perms.filter((item) => {
                if(item.perm_kind == json.perm_kind && item.feature_id == json.feature_id && item.property_id == json.property_id && item.geom == json.geom){}
                else return item
            })
            this.setState({properties_perms: array})
        }
    }

    handleCheckedFeatrue(check, fid, perm, properties){
        if(check){
            const {properties_perms} = this.state
            properties.map((property, property_index) => {
                properties_perms.push({"perm_kind": perm, "feature_id":fid, "property_id": property.id, "geom": false})
            })
            this.setState({properties_perms})
        }
        else{
            properties.map((property, property_index) => {
                var array = this.state.properties_perms.filter((item, idx) => {
                    console.log(idx)

                    if(item.perm_kind == perm && item.feature_id == fid && item.property_id == property.id && item.geom == false){}
                    else return item
                })
                this.setState({properties_perms: array})
            })
        }
    }

    handleSubmit(){
        const id = this.props.match.params.id

        const {properties_perms} = this.state
        service.saveInspireRoles(id, properties_perms).then(({success}) =>{
            if(success) alert(success)

        })
    }

    render() {
        const {data, tid, pid, fid, properties, properties_perms} = this.state
        return (
            <div className="row">
                <div className="col-md-5">
                    <div className="card">
                        <a className="btn gp-btn-primary btn-block waves-effect waves-light text-white" onClick={this.handleSubmit}>Хадгалах</a>
                        <div className="card-body fixed-height">
                        {data.map((theme, theme_index) => (
                            <div id={`accordion${theme_index+1}`} className="" key={theme_index}>
                                <div className="">
                                    <div className="arrow-tree">
                                        <a className="" data-toggle="collapse" data-target={`#collapse${theme_index+1}`} aria-expanded="true" aria-controls={`collapse-${theme_index+1}`}>
                                            {theme.name}
                                        </a>
                                    </div>
                                    <div id={`collapse${theme_index+1}`} className="collapse show" data-parent={`#accordion${theme_index+1}`}>
                                        <div className="">


                                            {theme.packages.map((package_data, package_index) => (
                                                <div id={`accordion-p-${package_index+1+package_data.id}`} key={package_index}>
                                                    <div className="">
                                                        <div className="arrow-tree ml-2">
                                                            <a className="" data-toggle="collapse" data-target={`#collapse-p-${package_index+1+package_data.id}`} aria-expanded="true" aria-controls="collapse-2">
                                                            {package_data.name}
                                                            </a>
                                                        </div>
                                                        <div id={`collapse-p-${package_index+1+package_data.id}`} className="collapse show" data-parent={`#accordion-p-${package_index+1+package_data.id}`}>
                                                            <div className="">


                                                            {package_data.features.map((feature_data, feature_index) => (
                                                                <div key={feature_index}>
                                                                    <div className="">
                                                                        <div className="arrow-tree ml-5 collapsed">
                                                                            <a className="text-primary collapsed" onClick={() =>this.handleFeature(theme.id, package_data.id, feature_data.id, feature_data.properties)}>
                                                                                {feature_data.name}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="col-md-7">
                <div className="card">
                    <div className="card-body fixed-height">
                        {properties.length > 0 &&
                        <div className="table-responsive table_wrapper-100">
                            <table className="table table_wrapper_table_saaral">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Оронзайн суурь өгөгдлийн сан</th>
                                        <th scope="col">
                                            <a>харах</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="perm_view_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 1, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="perm_view_all"></label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <a>нэмэх</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="pperm_create_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 2, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="pperm_create_all"></label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <a>хасах</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="perm_remove_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 3, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="perm_remove_all"></label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <a>засах</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="perm_revoke_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 4, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="perm_revoke_all"></label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <a>цуцлах</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="perm_review_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 5, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="perm_review_all"></label>
                                            </div>
                                        </th>
                                        <th scope="col">
                                            <a>батлах</a>
                                            <div className="custom-control custom-switch">
                                                <input
                                                    type="checkbox" className="custom-control-input" id="perm_approve_all"
                                                    onChange={(e) => this.handleCheckedFeatrue(e.target.checked, fid, 6, properties)}
                                                />
                                                <label className="custom-control-label" htmlFor="perm_approve_all"></label>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Geom</td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_view" name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_view"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_create" name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_create"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_remove" name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_remove"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_revoke" name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_revoke"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_review" name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_review"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_approve" name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label for="perm_approve"></label></td>
                                    </tr>
                                    {properties.map((property, index) =>
                                        <tr key={index}>
                                            <td>{property.name}</td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_view"+property.id} name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_view"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_create"+property.id} name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_create"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_remove"+property.id} name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_remove"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_revoke"+property.id} name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_revoke"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_review"+property.id} name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_review"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_approve"+property.id} name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label for={"perm_approve"+property.id}></label></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        }
                    </div>
                </div>
            </div>
            <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.goBack}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
           </div>
        )

    }

}
