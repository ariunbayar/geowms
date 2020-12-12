import React, { Component } from "react"
import {service} from "./service"
import ModalAlert from "../../ModalAlert"
import {TableHeadRole} from './TableHeadRole'
export class Roles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            tid: 0,
            tid_index: 0,
            pid: 0,
            pid_index: 0,
            fid: 0,
            fid_index: 0,
            properties: [],
            properties_perms: [],
            handle_save_is_laod: false,
            modal_alert_status: "closed",
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
        this.handleStateSole = this.handleStateSole.bind(this)
    }

    componentDidMount(){
        this.handleRoles()
    }

    handleRoles(){
        const {level, id} = this.props.match.params
        service.getGovRoles(level, id).then(({success, data, roles}) => {
            if(success) this.setState({data, properties_perms: roles})
        })
    }

    handleFeature(tid, tid_index, pid, pid_index, fid, fid_index, properties){
        this.setState({tid,tid_index, pid, pid_index, fid, fid_index, properties})
    }

    getPermName(perm){
        if(perm == 1) return 'perm_view'
        if(perm == 2) return 'perm_create'
        if(perm == 3) return 'perm_remove'
        if(perm == 4) return 'perm_update'
        if(perm == 5) return 'perm_approve'
        if(perm == 6) return 'perm_revoke'
    }

    handleStateAll(data, check, tid_index, packages, pid_index, features, fid_index, perm){
        var perm_name = this.getPermName(perm)
        if(check){
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] > 0 && data[tid_index][packages][pid_index][features][fid_index][perm_name] < data[tid_index][packages][pid_index][features][fid_index].perm_all)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] + 0.5

                if(data[tid_index][packages][pid_index][perm_name] == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] - 0.5 == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
            }
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] == 0)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] + 1

                if(data[tid_index][packages][pid_index][perm_name] == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] - 1 == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
            }
            data[tid_index][packages][pid_index][features][fid_index][perm_name] = data[tid_index][packages][pid_index][features][fid_index]['perm_all']
        }
        else{
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] > 0 && data[tid_index][packages][pid_index][features][fid_index][perm_name] < data[tid_index][packages][pid_index][features][fid_index].perm_all)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] - 0.5

                if(data[tid_index][packages][pid_index][perm_name] == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] + 0.5 == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
            }
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] == data[tid_index][packages][pid_index][features][fid_index].perm_all)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] - 1
                if(data[tid_index][packages][pid_index][perm_name] == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] + 1 == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
            }
            data[tid_index][packages][pid_index][features][fid_index][perm_name] = 0
        }
        return data
    }

    handleStateSole(data, check, tid_index, packages, pid_index, features, fid_index, perm){
        var perm_name = this.getPermName(perm)
        if(check){
            data[tid_index][packages][pid_index][features][fid_index][perm_name] = data[tid_index][packages][pid_index][features][fid_index][perm_name] + 1
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] == data[tid_index][packages][pid_index][features][fid_index].perm_all)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] + 0.5
                if(data[tid_index][packages][pid_index][perm_name] == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] - 0.5 == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
            }
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] - 1 == 0)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] + 0.5
                if(data[tid_index][packages][pid_index][perm_name] == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] - 0.5 == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] + 0.5
                }
            }
        }
        else{
            data[tid_index][packages][pid_index][features][fid_index][perm_name] = data[tid_index][packages][pid_index][features][fid_index][perm_name] - 1
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] == 0)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] - 0.5


                if(data[tid_index][packages][pid_index][perm_name] == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] + 0.5 == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
            }
            if(data[tid_index][packages][pid_index][features][fid_index][perm_name] + 1 == data[tid_index][packages][pid_index][features][fid_index].perm_all)
            {
                data[tid_index][packages][pid_index][perm_name] = data[tid_index][packages][pid_index][perm_name] - 0.5
                if(data[tid_index][packages][pid_index][perm_name] == 0)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
                if(data[tid_index][packages][pid_index][perm_name] + 0.5 == data[tid_index][packages][pid_index].perm_all)
                {
                    data[tid_index][perm_name] = data[tid_index][perm_name] - 0.5
                }
            }
        }
        return data
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
    }

    handleCheckedFeature(check, perm, tid, tid_index, pid, pid_index, fid, fid_index){
        const {data} = this.state
        var datas = data
        var data_types = data[tid_index]['packages'][pid_index]['features'][fid_index]['data_types']

        if(check){
            data_types.map((data_type) => {
                data_type.properties.map((property) => {
                this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "data_type_id":data_type.id, "property_id": property.id, "geom": false, "disable": false}, true)
                })
            })
            this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "data_type_id":null, "property_id":null, "geom": true, "disable": false}, true)

        }
        else{
            data_types.map((data_type) => {
                data_type.properties.map((property) => {
                this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "data_type_id":data_type.id, "property_id": property.id, "geom": false, "disable": false}, false)
                })
            })
            this.handleCheckedPerm({"perm_kind": perm, "feature_id":fid, "data_type_id":null, "property_id": null, "geom": true, "disable": false}, false)

        }

        datas = this.handleStateAll(datas, check, tid_index, 'packages', pid_index, 'features', fid_index, perm)
        this.setState({data: datas})
    }

    handleCheckedPerm(json, check){
        const properties_perms = this.state.properties_perms
        if(check){
            var check_perm = properties_perms.filter((item) => {
                return item.perm_kind == json.perm_kind && item.feature_id == json.feature_id && item.data_type_id == json.data_type_id && item.property_id == json.property_id && item.geom == json.geom
            })
            if(check_perm.length == 0){
                properties_perms.push(json)
            }
            this.setState({properties_perms})
        }
        else{
            for(var i = 0; i < properties_perms.length; i++) {
                if(properties_perms[i].perm_kind == json.perm_kind && properties_perms[i].feature_id == json.feature_id && properties_perms[i].data_type_id == json.data_type_id && properties_perms[i].property_id == json.property_id && properties_perms[i].geom == json.geom && properties_perms[i].disable == false) {
                    properties_perms.splice(i, 1);
                }
            }
            this.setState({properties_perms})
        }
    }

    handleChecked(json, check, perm){
        const { tid_index, pid_index, fid_index, data} = this.state
        var datas = data
        const properties_perms = this.state.properties_perms
        if(check){
            var check_perm = properties_perms.filter((item) => {
                return item.perm_kind == json.perm_kind && item.feature_id == json.feature_id && item.data_type_id == json.data_type_id && item.property_id == json.property_id && item.geom == json.geom
            })
            if(check_perm.length == 0){
                properties_perms.push(json)
            }
            this.setState({properties_perms})
        }
        else{
            for(var i = 0; i < properties_perms.length; i++) {
                if(properties_perms[i].perm_kind == json.perm_kind && properties_perms[i].feature_id == json.feature_id && properties_perms[i].data_type_id == json.data_type_id && properties_perms[i].property_id == json.property_id && properties_perms[i].geom == json.geom && properties_perms[i].disable == false) {
                    properties_perms.splice(i, 1);
                }
            }
            this.setState({properties_perms})
        }
        datas = this.handleStateSole(datas, check, tid_index, 'packages', pid_index, 'features', fid_index, perm)
        this.setState({data: datas})
    }

    handleSubmit(){
        this.setState({handle_save_is_laod: true})
        const {level, id} = this.props.match.params

        const {properties_perms} = this.state
        service.saveGovRoles(level, id, properties_perms).then(({success}) =>{
            if(success){
                this.handleRoles()
                setTimeout(() => {
                    this.setState({modal_alert_status: 'open'})
                    this.setState({handle_save_is_laod: false})
                }, 1000);
            }

        })
    }

    modalClose(){
        this.setState({modal_alert_status: 'closed'})
        this.setState({handleSaveIsLoad:false})
        this.handleRoles()
    }

    render() {
        const {data, tid, pid, fid, properties, properties_perms} = this.state
        return (
            <div className="row">
                <div className="col-md-6">
                    {this.state.handle_save_is_laod ?
                        <a className="btn gp-btn-primary btn-block waves-effect waves-light text-white">
                            <div className="spinner-border text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <a className="text-light"> Шалгаж байна.</a>
                        </a>
                        :
                        <a className="btn gp-btn-primary btn-block waves-effect waves-light text-white" onClick={this.handleSubmit}>Хадгалах</a>
                    }
                    <div className="fixed-height-b">
                    {data.map((theme, theme_index) => (
                        (theme.packages.length > 0 && theme.perm_all > 0 &&
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
                                                        perm_revoke={theme.perm_revoke}
                                                        handleCheckedTheme={this.handleCheckedTheme}
                                                        handleCheckedPackage={this.handleCheckedPackage}
                                                        handleCheckedFeature={this.handleCheckedFeature}
                                                    ></TableHeadRole>
                                                </div>
                                            </div>
                                            <div id={`collapse${theme_index+1}`} className="collapse" data-parent={`#accordion${theme_index+1}`}>
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
                                                                            perm_revoke={package_data.perm_revoke}
                                                                            handleCheckedTheme={this.handleCheckedTheme}
                                                                            handleCheckedPackage={this.handleCheckedPackage}
                                                                            handleCheckedFeature={this.handleCheckedFeature}
                                                                        ></TableHeadRole>
                                                                        </div>
                                                                    </div>
                                                                    <div id={`collapse-p-${package_index+1+package_data.id}`} className="collapse" data-parent={`#accordion-p-${package_index+1+package_data.id}`}>
                                                                        <div className="">
                                                                        {package_data.features.map((feature_data, feature_index) => (
                                                                            <div key={feature_index}>
                                                                                <div className="">
                                                                                    <div className="collapsed">
                                                                                        <div className="text-primary collapsed">
                                                                                            <TableHeadRole
                                                                                                handleFeature={() =>this.handleFeature(theme.id, theme_index, package_data.id, package_index, feature_data.id, feature_index, feature_data.data_types)}
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
                                                                                                perm_revoke={feature_data.perm_revoke}
                                                                                                handleCheckedTheme={this.handleCheckedTheme}
                                                                                                handleCheckedPackage={this.handleCheckedPackage}
                                                                                                handleCheckedFeature={this.handleCheckedFeature}
                                                                                            ></TableHeadRole>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
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
                    {properties.length > 0 &&
                    <div className="fixed-height-body">
                        <div className=" bc-white">
                            <div className="table-responsive table_wrapper-80">
                                <table className="table table_wrapper_table_saaral table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">Data<br/>type</th>
                                            <th scope="col">property нэр</th>
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
                                            <td></td>
                                            <td>Geom</td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_view" name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 1)}/><label htmlFor="perm_view"></label></td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_create" name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 2)}/><label htmlFor="perm_create"></label></td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_remove" name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 3)}/><label htmlFor="perm_remove"></label></td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_revoke" name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 4)}/><label htmlFor="perm_revoke"></label></td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_review" name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 6)}/><label htmlFor="perm_review"></label></td>
                                            <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.data_type_id == null && item.geom == true && item.disable == true).length > 0}  type="checkbox" id="perm_approve" name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.geom == true).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "data_type_id": null, "property_id": null, "geom": true, "disable": false}, e.target.checked, 5)}/><label htmlFor="perm_approve"></label></td>
                                        </tr>
                                        {properties.map((data_type, index) =>
                                            <>
                                            <tr>
                                                <th rowSpan={data_type.properties.length + 1} className="vertical text-center align-middle text-wrap">
                                                    <span className="text-center vertical align-middle">{data_type.name}</span>
                                                    <span className="text-center vertical align-middle">({data_type.code})</span>
                                                </th>
                                            </tr>
                                            {data_type.properties.map((property, index) =>
                                                <tr key={index}>
                                                    <td>{property.name}</td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_view"+property.id} name="perm_view" checked={properties_perms.filter((item) => item.perm_kind == 1 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 1, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 1)}/><label htmlFor={"perm_view"+property.id}></label></td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_create"+property.id} name="perm_create" checked={properties_perms.filter((item) => item.perm_kind == 2 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 2, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 2)}/><label htmlFor={"perm_create"+property.id}></label></td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_remove"+property.id} name="perm_remove" checked={properties_perms.filter((item) => item.perm_kind == 3 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 3, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 3)}/><label htmlFor={"perm_remove"+property.id}></label></td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_revoke"+property.id} name="perm_revoke" checked={properties_perms.filter((item) => item.perm_kind == 4 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 4, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 4)}/><label htmlFor={"perm_revoke"+property.id}></label></td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_review"+property.id} name="perm_review" checked={properties_perms.filter((item) => item.perm_kind == 6 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 6, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 6)}/><label htmlFor={"perm_review"+property.id}></label></td>
                                                    <td className="icheck-primary"><input disabled={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.data_type_id == data_type.id && item.property_id == property.id && item.geom == false && item.disable == true).length > 0} type="checkbox" id={"perm_approve"+property.id} name="perm_approve"checked={properties_perms.filter((item) => item.perm_kind == 5 && item.feature_id == fid && item.property_id == property.id && item.geom == false).length > 0} onChange={(e) => this.handleChecked({"perm_kind": 5, "feature_id":fid, "data_type_id": data_type.id, "property_id": property.id, "geom": false, "disable": false}, e.target.checked, 5)}/><label htmlFor={"perm_approve"+property.id}></label></td>
                                                </tr>
                                            )}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    }
                </div>
                </div>
            <a className="geo-back-btn" id='geo-back-btn' onClick={this.props.history.goBack}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
            <ModalAlert
                modalAction={() => this.modalClose()}
                status={this.state.modal_alert_status}
                title="Амжилттай хадгаллаа"
                model_type_icon = "success"
            />
           </div>
        )

    }

}
