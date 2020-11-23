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
                perm_remove, perm_update, perm_approve, perm_revoce, mtop,
                root_1_index, root_2_index, root_3_index
        } = this.props
        return (
            <div className={(inspire == "theme" ? "role-card" : "role-table-card") + (mtop ? ' mt-3' : '')}>
                <div className={inspire == "theme" ? "role-card-body" : "role-table-card-body"}>
                    <div className="row">
                        <div className="col-4 arrow-tree collapsed" style={{width:'100px', paddingLeft:tree}}>
                            {inspire == 'feature' ?
                            <a className="collapsed"
                                data-toggle="collapse"
                                aria-expanded="true"
                                data-target={`#collapse${index}`}
                                aria-controls={`collapse${index}`}
                                onClick={this.props.handleFeature}
                                scope="col text-wrap"
                            >
                                {name}
                            </a>
                            :
                            <a className="collapsed"
                                data-toggle="collapse"
                                aria-expanded="true"
                                data-target={`#collapse${index}`}
                                aria-controls={`collapse${index}`}
                                scope="col text-wrap"
                            >
                                {name}
                            </a>
                            }
                        </div>
                        <div className="col-8">
                            <div className="row">
                                <div className="col-2">
                                    <small className="smaller text-center ml-2">харах</small>
                                    <div className="switch-tree-state col-lg-12"
                                        onClick={(e) =>
                                            perm_view >= perm_all ?
                                            (inspire == 'theme' ?
                                            this.props.handleCheckedTheme(false, 1, root_1, root_1_index):
                                            inspire == 'package' ?
                                            this.props.handleCheckedPackage(false, 1, root_1, root_1_index, root_2, root_2_index):
                                            inspire == 'feature' ?
                                            this.props.handleCheckedFeature(false, 1, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                            null)
                                            :
                                            (inspire == 'theme' ?
                                            this.props.handleCheckedTheme(true, 1, root_1, root_1_index):
                                            inspire == 'package' ?
                                            this.props.handleCheckedPackage(true, 1, root_1, root_1_index, root_2, root_2_index):
                                            inspire == 'feature' ?
                                            this.props.handleCheckedFeature(true, 1, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                            null)
                                        }
                                    >
                                        <div className={perm_view >= perm_all ? 'switch-all switch-one' : 'switch-all'} 
                                        ></div>
                                        <div className={0 < perm_view && perm_view < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_view <= 0 ? 'switch-all switch-tree' : 'switch-all'} 
                                        ></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_view}</small> */}
                                </div>
                                <div className="col-2">
                                    <small className="smaller text-center ml-2">нэмэх</small>
                                    <div className="switch-tree-state col-lg-12"
                                    onClick={(e) =>
                                        perm_create >= perm_all ?
                                        (inspire == 'theme' ?
                                        this.props.handleCheckedTheme(false, 2, root_1, root_1_index):
                                        inspire == 'package' ?
                                        this.props.handleCheckedPackage(false, 2, root_1, root_1_index, root_2, root_2_index):
                                        inspire == 'feature' ?
                                        this.props.handleCheckedFeature(false, 2, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                        null)
                                        :
                                        (inspire == 'theme' ?
                                        this.props.handleCheckedTheme(true, 2, root_1, root_1_index):
                                        inspire == 'package' ?
                                        this.props.handleCheckedPackage(true, 2, root_1, root_1_index, root_2, root_2_index):
                                        inspire == 'feature' ?
                                        this.props.handleCheckedFeature(true, 2, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                        null)
                                    }>
                                        <div className={perm_create == perm_all ? 'switch-all switch-one' : 'switch-all'} 
                                        ></div>
                                        <div className={0 < perm_create && perm_create < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_create == 0 ? 'switch-all switch-tree' : 'switch-all'} ></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_create}</small> */}
                                </div>
                                <div className="col-2"
                                onClick={(e) =>
                                    perm_remove >= perm_all ?
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(false, 3, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(false, 3, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(false, 3, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                    :
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(true, 3, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(true, 3, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(true, 3, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                }>
                                    <small className="smaller text-center ml-2">хасах</small>
                                    <div className="switch-tree-state col-lg-12">
                                        <div className={perm_remove == perm_all ? 'switch-all switch-one' : 'switch-all'}></div>
                                        <div className={0 < perm_remove && perm_remove < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_remove == 0 ? 'switch-all switch-tree' : 'switch-all'}></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_remove}</small> */}
                                </div>
                                <div className="col-2"
                                onClick={(e) =>
                                    perm_update >= perm_all ?
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(false, 4, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(false, 4, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(false, 4, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                    :
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(true, 4, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(true, 4, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(true, 4, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                }>
                                    <small className="smaller text-center ml-2">цуцлах</small>
                                    <div className="switch-tree-state col-lg-12">
                                        <div className={perm_update == perm_all ? 'switch-all switch-one' : 'switch-all'}></div>
                                        <div className={0 < perm_update && perm_update < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_update == 0 ? 'switch-all switch-tree' : 'switch-all'}></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_update}</small> */}
                                </div>
                                <div className="col-2"
                                onClick={(e) =>
                                    perm_approve >= perm_all ?
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(false, 5, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(false, 5, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(false, 5, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                    :
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(true, 5, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(true, 5, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(true, 5, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                }>
                                    <small className="smaller text-center ml-2">хянах</small>
                                    <div className="switch-tree-state col-lg-12">
                                        <div className={perm_approve == perm_all ? 'switch-all switch-one' : 'switch-all'}></div>
                                        <div className={0 < perm_approve && perm_approve < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_approve == 0 ? 'switch-all switch-tree' : 'switch-all'}></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_approve}</small> */}
                                </div>
                                <div className="col-2"
                                onClick={(e) =>
                                    perm_revoce >= perm_all ?
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(false, 6, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(false, 6, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(false, 6, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                    :
                                    (inspire == 'theme' ?
                                    this.props.handleCheckedTheme(true, 6, root_1, root_1_index):
                                    inspire == 'package' ?
                                    this.props.handleCheckedPackage(true, 6, root_1, root_1_index, root_2, root_2_index):
                                    inspire == 'feature' ?
                                    this.props.handleCheckedFeature(true, 6, root_1, root_1_index, root_2, root_2_index, root_3, root_3_index):
                                    null)
                                }>
                                    <small className="smaller text-center ml-2">батлах</small>
                                    <div className="switch-tree-state col-lg-12">
                                        <div className={perm_revoce == perm_all ? 'switch-all switch-one' : 'switch-all'}></div>
                                        <div className={0 < perm_revoce && perm_revoce < perm_all ? 'switch-all switch-two' : 'switch-all'}></div>
                                        <div className={perm_revoce == 0 ? 'switch-all switch-tree' : 'switch-all'}></div>
                                    </div>
                                    {/* <small className="smaller text-center">{perm_all}-{perm_revoce}</small> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}
