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
        this.handleCheckedPerm = this.handleCheckedPerm.bind(this)
        this.handleStateAll = this.handleStateAll.bind(this)
        this.handleStateOne = this.handleStateOne.bind(this)
        this.handleStateTwo = this.handleStateTwo.bind(this)
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

    handleStateAll(check, json, perm){
        if(check){
            if(perm == 1) json.perm_view = json.perm_all
            if(perm == 2) json.perm_create = json.perm_all
            if(perm == 3) json.perm_remove = json.perm_all
            if(perm == 4) json.perm_update = json.perm_all
            if(perm == 5) json.perm_approve = json.perm_all
            if(perm == 6) json.perm_revoce = json.perm_all
        }
        else{
            if(perm == 1) json.perm_view = 0
            if(perm == 2) json.perm_create = 0
            if(perm == 3) json.perm_remove = 0
            if(perm == 4) json.perm_update = 0
            if(perm == 5) json.perm_approve = 0
            if(perm == 6) json.perm_revoce = 0
        }
        return json
    }

    handleStateOne(check, json, perm, child, name){
        if(check){
            if(perm == 1 && json[name][child].perm_view != json[name][child].perm_all) json.perm_view = json.perm_view + 1
            if(perm == 2 && json[name][child].perm_create != json[name][child].perm_all) json.perm_create = json.perm_create + 1
            if(perm == 3 && json[name][child].perm_remove != json[name][child].perm_all) json.perm_remove = json.perm_remove + 1
            if(perm == 4 && json[name][child].perm_update != json[name][child].perm_all) json.perm_update = json.perm_update + 1
            if(perm == 5 && json[name][child].perm_approve != json[name][child].perm_all) json.perm_approve = json.perm_approve + 1
            if(perm == 6 && json[name][child].perm_revoce != json[name][child].perm_all) json.perm_revoce = json.perm_revoce + 1
        }
        else{
            if(perm == 1 && json[name][child].perm_view !=0 ) json.perm_view = json.perm_view - 1
            if(perm == 2 && json[name][child].perm_create !=0 ) json.perm_create = json.perm_create - 1
            if(perm == 3 && json[name][child].perm_remove !=0 ) json.perm_remove = json.perm_remove - 1
            if(perm == 4 && json[name][child].perm_update !=0 ) json.perm_update = json.perm_update - 1
            if(perm == 5 && json[name][child].perm_approve !=0 ) json.perm_approve = json.perm_approve - 1
            if(perm == 6 && json[name][child].perm_revoce !=0 ) json.perm_revoce = json.perm_revoce - 1
        }
        return json
    }



    handleStateTwo(check, json, perm, child, name){
        if(check){
            if(perm == 1 && json[name][child].perm_view + 1 == json[name][child].perm_all) json.perm_view = json.perm_view + 1
            if(perm == 2 && json[name][child].perm_create + 1 == json[name][child].perm_all) json.perm_create = json.perm_create + 1
            if(perm == 3 && json[name][child].perm_remove + 1 == json[name][child].perm_all) json.perm_remove = json.perm_remove + 1
            if(perm == 4 && json[name][child].perm_update + 1 == json[name][child].perm_all) json.perm_update = json.perm_update + 1
            if(perm == 5 && json[name][child].perm_approve + 1 == json[name][child].perm_all) json.perm_approve = json.perm_approve + 1
            if(perm == 6 && json[name][child].perm_revoce + 1 == json[name][child].perm_all) json.perm_revoce = json.perm_revoce + 1
        }
        else{
            if(perm == 1 && json[name][child].perm_view - 1 ==0 ) json.perm_view = json.perm_view - 1
            if(perm == 2 && json[name][child].perm_create - 1 ==0 ) json.perm_create = json.perm_create - 1
            if(perm == 3 && json[name][child].perm_remove - 1 ==0 ) json.perm_remove = json.perm_remove - 1
            if(perm == 4 && json[name][child].perm_update - 1 ==0 ) json.perm_update = json.perm_update - 1
            if(perm == 5 && json[name][child].perm_approve - 1 ==0 ) json.perm_approve = json.perm_approve - 1
            if(perm == 6 && json[name][child].perm_revoce - 1 ==0 ) json.perm_revoce = json.perm_revoce - 1
        }
        return json
    }

    handleCheckedTheme(check, perm, tid, tid_index){
        const {data} = this.state
        var packages = data[tid_index]['packages']
        if(check){
            packages.map((pack, package_index) => {
                this.handleCheckedPackage(check, perm, tid, tid_index, pack.id, package_index)
            })
        }
        else{
            packages.map((pack, package_index) => {
                this.handleCheckedPackage(check, perm, tid, tid_index, pack.id, package_index)
            })
        }
        // data[tid_index] = this.handleStateAll(check, data[tid_index], perm)
        // this.setState({data})
    }

    handleCheckedPackage(check, perm, tid, tid_index, pid, pid_index){
        const {data} = this.state
        var features = data[tid_index]['packages'][pid_index]['features']
        if(check){
            features.map((feature, feature_index) => {
                this.handleCheckedFeature(check, perm, tid, tid_index, pid, pid_index, feature.id, feature_index)
            })
        }
        else{
            features.map((feature, feature_index) => {
                this.handleCheckedFeature(check, perm, tid, tid_index, pid, pid_index, feature.id, feature_index)
            })
        }
        // data[tid_index]['packages'][pid_index] = this.handleStateAll(check, data[tid_index]['packages'][pid_index], perm)
        // this.setState({data})

    }

    handleCheckedFeature(check, perm, tid, tid_index, pid, pid_index, fid, fid_index){
        const {data} = this.state
        var properties = data[tid_index]['packages'][pid_index]['features'][fid_index]['properties']
        if(check){
            properties.map((property) => {
                this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "property_id": property.id, "geom": false}, true)
                
            })
            this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "property_id":null, "geom": true}, true)

        }
        else{
            properties.map((property) => {
                this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "property_id": property.id, "geom": false}, false)
            })
            this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "property_id": null, "geom": true}, false)

        }

        data[tid_index] = this.handleStateTwo(check, data[tid_index], perm, pid_index, 'packages')
        data[tid_index]['packages'][pid_index] = this.handleStateOne(check, data[tid_index]['packages'][pid_index], perm, fid_index, 'features')
        data[tid_index]['packages'][pid_index]['features'][fid_index] = this.handleStateAll(check, data[tid_index]['packages'][pid_index]['features'][fid_index], perm)
        this.setState({data})
    }

    handleCheckedPerm(json, check){
        const properties_perms = this.state.properties_perms
        if(check){
            var check_perm = properties_perms.filter((item) => {
                return item.perm_kind == json.perm_kind && item.feature_id == json.feature_id && item.property_id == json.property_id && item.geom == json.geom
            })
            if(check_perm.length == 0){
                properties_perms.push(json)
            }
            this.setState({properties_perms})
        }
        else{
            for(var i = 0; i < properties_perms.length; i++) {
                if(properties_perms[i].perm_kind == json.perm_kind && properties_perms[i].feature_id == json.feature_id && properties_perms[i].property_id == json.property_id && properties_perms[i].geom == json.geom) {
                    properties_perms.splice(i, 1);
                }
            }
            this.setState({properties_perms})
        }
    }

    handleChecked(json, check){
        const properties_perms = this.state.properties_perms
        if(check){
            var check_perm = properties_perms.filter((item) => {
                return item.perm_kind == json.perm_kind && item.feature_id == json.feature_id && item.property_id == json.property_id && item.geom == json.geom
            })
            if(check_perm.length == 0){
                properties_perms.push(json)
            }
            this.setState({properties_perms})
        }
        else{
            for(var i = 0; i < properties_perms.length; i++) {
                if(properties_perms[i].perm_kind == json.perm_kind && properties_perms[i].feature_id == json.feature_id && properties_perms[i].property_id == json.property_id && properties_perms[i].geom == json.geom) {
                    properties_perms.splice(i, 1);
                }
            }
            this.setState({properties_perms})
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
                <a className="btn gp-btn-primary btn-block waves-effect waves-light text-white" onClick={this.handleSubmit}>Хадгалах</a>
                <div className="col-md-6">
                    <div className="fixed-height">
                    {data.map((theme, theme_index) => (
                        (theme.packages.length > 0 &&
                        <div className="bc-white" key={theme_index}>
                            
                            <div className="">
                                <div className="my-0">
                            
                                    <div id={`accordion${theme_index+1}`} className="" key={theme_index}>
                                        <div className="">
                                            <div className="">
                                                <div className="">
                                                    <TableHeadRole
                                                        name={theme.name}
                                                        index={theme_index+1}
                                                        tree={10}
                                                        mtop={false}
                                                        root_1={theme.id}
                                                        root_1_index={theme_index}
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
                                                                            root_1_index={theme_index}
                                                                            mtop={true}
                                                                            root_2={package_data.id}
                                                                            root_2_index={package_index}
                                                                            name={package_data.name}
                                                                            index={`-p-${package_index+1+package_data.id}`}
                                                                            tree={10} inspire="package"
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
                                                                                        <div className="text-primary collapsed">
                                                                                            <TableHeadRole
                                                                                                handleFeature={() =>this.handleFeature(theme.id, package_data.id, feature_data.id, feature_data.properties)}
                                                                                                root_1={theme.id}
                                                                                                root_1_index={theme_index}
                                                                                                root_2={package_data.id}
                                                                                                root_2_index={package_index}
                                                                                                root_3={feature_data.id}
                                                                                                root_3_index={feature_index}
                                                                                                name={feature_data.name}
                                                                                                tree={60}
                                                                                                mtop={false}
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
                            </div>
                        </div>
                    </div>
                    
                )))}
                </div>
                </div>
            <div className="col-md-6">
                <div className="">
                    <div className="fixed-height-body">
                        <div className="fixed-height bc-white">
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
                                            <td className="icheck-primary"><input type="checkbox" id="perm_view" name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_view"></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id="perm_create" name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_create"></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id="perm_remove" name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_remove"></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id="perm_revoke" name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_revoke"></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id="perm_review" name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_review"></label></td>
                                            <td className="icheck-primary"><input type="checkbox" id="perm_approve" name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": null, "geom": true}, e.target.checked)}/><label htmlFor="perm_approve"></label></td>
                                        </tr>
                                        {properties.map((property, index) =>
                                            <tr key={index}>
                                                <td>{property.name}</td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_view"+property.id} name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_view"+property.id}></label></td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_create"+property.id} name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_create"+property.id}></label></td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_remove"+property.id} name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_remove"+property.id}></label></td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_revoke"+property.id} name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_revoke"+property.id}></label></td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_review"+property.id} name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_review"+property.id}></label></td>
                                                <td className="icheck-primary"><input type="checkbox" id={"perm_approve"+property.id} name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "property_id": property.id, "geom": false}, e.target.checked)}/><label htmlFor={"perm_approve"+property.id}></label></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            }
                        </div>
                    </div>
                </div>
                </div>
            <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.goBack}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
           </div>
        )

    }

}
