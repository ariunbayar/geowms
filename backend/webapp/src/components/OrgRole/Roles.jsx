import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
import {service} from "./service"
import {TableHeadRole} from './TableHeadRole'
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
        this.handleCheckedTheme = this.handleCheckedTheme.bind(this)
        this.handleCheckedPackage = this.handleCheckedPackage.bind(this)
        this.handleCheckedFeature = this.handleCheckedFeature.bind(this)
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

    handleCheckedTheme(check, tid){


    }

    handleCheckedPackage(check, tid, pid){


    }

    handleCheckedFeature(check, tid, pid, fid){
        const {data} = this.state
        if(check){
            data.map((theme) => {
                theme.id == tid && ( () => {
                    console.log(theme.id)
                })

            })
        }
        else{

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
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="">
                                <table className="card table table-primary">
                                    <thead className="card-body">
                                        <tr className="row ">
                                            <th scope="col" className="col-6 vertical"><span>нэрс</span></th>
                                            <th scope="col" className="col-1 vertical"><span>харах</span></th>
                                            <th scope="col" className="col-1 vertical"><span>нэмэх</span></th>
                                            <th scope="col" className="col-1 vertical"><span>хасах</span></th>
                                            <th scope="col" className="col-1 vertical"><span>засах</span></th>
                                            <th scope="col" className="col-1 vertical"><span>цуцлах</span></th>
                                            <th scope="col" className="col-1 vertical"><span>батлах</span></th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className="fixed-height my-0">
                            {data.map((theme, theme_index) => (
                                (theme.packages.length > 0 &&
                                    <div id={`accordion${theme_index+1}`} className="" key={theme_index}>
                                        <div className="">
                                            <div className="">
                                                <div className="">
                                                    <TableHeadRole
                                                        name={theme.name}
                                                        index={theme_index+1}
                                                        tree={10}
                                                        root_1={theme.id}
                                                        inspire="theme"
                                                        perm_all={theme.perm_all}
                                                        perm_view={theme.perm_view}
                                                        perm_create={theme.perm_create}
                                                        perm_remove={theme.perm_remove}
                                                        perm_update={theme.perm_update}
                                                        perm_approve={theme.perm_approve}
                                                        perm_revoce={theme.perm_revoce}
                                                        handleCheckedTheme={this.handleCheckedTheme}
                                                        handleCheckedPackage={this.handleCheckedPackage}
                                                        handleCheckedFeature={this.handleCheckedFeature}
                                                    ></TableHeadRole>
                                                </div>
                                            </div>
                                            <div id={`collapse${theme_index+1}`} className="collapse show" data-parent={`#accordion${theme_index+1}`}>
                                                <div className="">
                                                    {theme.packages.map((package_data, package_index) => (
                                                        (package_data.features.length > 0 &&
                                                            <div id={`accordion-p-${package_index+1+package_data.id}`} key={package_index}>
                                                                <div className="">
                                                                    <div className="">
                                                                        <div className="">
                                                                        <TableHeadRole
                                                                            root_1={theme.id}
                                                                            root_2={package_data.id}
                                                                            name={package_data.name}
                                                                            index={`-p-${package_index+1+package_data.id}`}
                                                                            tree={40} inspire="package"
                                                                            perm_all={package_data.perm_all}
                                                                            perm_view={package_data.perm_view}
                                                                            perm_create={package_data.perm_create}
                                                                            perm_remove={package_data.perm_remove}
                                                                            perm_update={package_data.perm_update}
                                                                            perm_approve={package_data.perm_approve}
                                                                            perm_revoce={package_data.perm_revoce}
                                                                            handleCheckedTheme={this.handleCheckedTheme}
                                                                            handleCheckedPackage={this.handleCheckedPackage}
                                                                            handleCheckedFeature={this.handleCheckedFeature}
                                                                        ></TableHeadRole>
                                                                        </div>
                                                                    </div>
                                                                    <div id={`collapse-p-${package_index+1+package_data.id}`} className="collapse show" data-parent={`#accordion-p-${package_index+1+package_data.id}`}>
                                                                        <div className="">
                                                                        {package_data.features.map((feature_data, feature_index) => (
                                                                            (feature_data.properties.length > 0 &&
                                                                            <div key={feature_index}>
                                                                                <div className="">
                                                                                    <div className="collapsed">
                                                                                        <div className="text-primary collapsed" onClick={() =>this.handleFeature(theme.id, package_data.id, feature_data.id, feature_data.properties)}>
                                                                                            <TableHeadRole
                                                                                                root_1={theme.id}
                                                                                                root_2={package_data.id}
                                                                                                root_3={feature_data.id}
                                                                                                name={feature_data.name}
                                                                                                tree={70}
                                                                                                inspire="feature"
                                                                                                perm_all={feature_data.perm_all}
                                                                                                perm_view={feature_data.perm_view}
                                                                                                perm_create={feature_data.perm_create}
                                                                                                perm_remove={feature_data.perm_remove}
                                                                                                perm_update={feature_data.perm_update}
                                                                                                perm_approve={feature_data.perm_approve}
                                                                                                perm_revoce={feature_data.perm_revoce}
                                                                                                handleCheckedTheme={this.handleCheckedTheme}
                                                                                                handleCheckedPackage={this.handleCheckedPackage}
                                                                                                handleCheckedFeature={this.handleCheckedFeature}
                                                                                            ></TableHeadRole>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>)
                                                                        ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        <a className="btn gp-btn-primary btn-block waves-effect waves-light text-white" onClick={this.handleSubmit}>Хадгалах</a>

                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body fixed-height">
                        {properties.length > 0 &&
                        <div className="table-responsive table_wrapper-100">
                            <table className="table table_wrapper_table_saaral table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col" className="vertical">
                                            <span>харах</span>
                                        </th>
                                        <th scope="col" className="vertical">
                                            <span>нэмэх</span>
                                        </th>
                                        <th scope="col" className="vertical">
                                            <span>хасах</span>
                                        </th>
                                        <th scope="col" className="vertical">
                                            <span>засах</span>
                                        </th>
                                        <th scope="col" className="vertical">
                                            <span>цуцлах</span>
                                        </th>
                                        <th scope="col" className="vertical">
                                            <span>батлах</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Geom</td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_view" name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_view"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_create" name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_create"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_remove" name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_remove"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_revoke" name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_revoke"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_review" name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_review"></label></td>
                                        <td className="icheck-primary"><input type="checkbox" id="perm_approve" name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": null, "geom": true}, e)}/><label htmlFor="perm_approve"></label></td>
                                    </tr>
                                    {properties.map((property, index) =>
                                        <tr key={index}>
                                            <td>{property.name}</td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_view"+property.id} name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_view"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_create"+property.id} name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_create"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_remove"+property.id} name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_remove"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_revoke"+property.id} name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_revoke"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_review"+property.id} name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_review"+property.id}></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id={"perm_approve"+property.id} name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": property.id, "geom": false}, e)}/><label htmlFor={"perm_approve"+property.id}></label></td>
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
