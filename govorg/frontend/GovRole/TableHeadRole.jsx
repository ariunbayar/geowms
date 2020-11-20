import React, { Component } from "react"
export class TableHeadRole extends Component {

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
    }



    render() {
        const {fid, properties, name, index,
                tree, inspire, root_1, root_2,
                root_3, perm_all, perm_view, perm_create,
                perm_remove, perm_update, perm_approve, perm_revoce
        } = this.props
        console.log('themes');
        return (
            <div className="role-card">
                <div className="role-card-body">
                    <div className="row">
                        <div className="col-4 arrow-tree collapsed" style={{width:'100px'}}>
                            <a className="collapsed" data-toggle="collapse" aria-expanded="true" data-target={`#collapse${index}`} aria-controls={`collapse${index}`} scope="col text-wrap"> {name}</a>
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">харах</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_view_all"+name+tree}
                                            checked={perm_all == perm_view ? true : 0 < perm_view < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 1, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 1, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label " htmlFor={"perm_view_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_view}</small>
                                </div>
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">нэмэх</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_create_all"+name+tree}
                                            checked={perm_all == perm_create ? true : 0 < perm_create < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 2, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 2, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor={"perm_create_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_create}</small>
                                </div>
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">хасах</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_delete_all"+name+tree}
                                            checked={perm_all == perm_remove ? true : 0 < perm_remove < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 3, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 3, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor={"perm_delete_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_remove}</small>
                                </div>
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">цуцлах</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_update_all"+name+tree}
                                            checked={perm_all == perm_update ? true : 0 < perm_update < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 4, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 4, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor={"perm_update_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_approve}</small>
                                </div>
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">хянах</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_review_all"+name+tree}
                                            checked={perm_all == perm_approve ? true : 0 < perm_approve < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 5, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 5, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor={"perm_review_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_approve}</small>
                                </div>
                                <div className="col-2">
                                    <small className="ml-1 smaller text-center">батлах</small>
                                    <div className="custom-control custom-switch col-lg-12">
                                        <input
                                            type="checkbox" className="custom-control-input" id={"perm_approve_all"+name+tree}
                                            checked={perm_all == perm_revoce ? true : 0 < perm_revoce < perm_all ? console.log("tsentsu ym bna ho haha") : false}
                                            onChange={(e) =>
                                                inspire == 'theme' ?
                                                this.props.handleCheckedTheme(e.target.checked, 6, root_1):
                                                inspire == 'package' ?
                                                this.props.handleCheckedPackage(e.target.checked, 6, root_1, root_2):
                                                null
                                            }
                                        />
                                        <label className="custom-control-label" htmlFor={"perm_approve_all"+name+tree}></label>
                                    </div>
                                    <small className="ml-1 smaller text-center">{perm_all}-{perm_revoce}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}