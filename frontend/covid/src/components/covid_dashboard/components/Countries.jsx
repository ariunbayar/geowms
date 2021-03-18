import MenuItem from "@utils/MenuItem"
import React, { Component } from "react"

export  class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aimag: 'Улаанбаатар',
            sum1: 'Баянгол',
            sum2: 'Баянзүрх',
            sum3: 'Хан-Уул'
        }
    }

    // render() {
    //     const { list_all, fid, tid, style_names, view_style_name, url, defualt_url, geom_type, is_loading, property_loading, cache_values} = this.state
    //     return (
    //         <div className="row">
    //             <div id="accordion1">
    //                 {list_all.map((theme, theme_idx) =>
    //                     <ul className="list-group" key={theme_idx}>
    //                         <li className="list-group-item collapsed"
    //                             id={`${theme_idx}`}
    //                             data-toggle="collapse"
    //                             data-target={`#collapse-theme${theme_idx}`}
    //                             aria-expanded="false"
    //                             aria-controls={`collapse-theme${theme_idx}`}
    //                             onClick={(e) => this.active_view(e.currentTarget)}>
    //                             <i className="icon expand-icon fa fa-plus" id={`${theme_idx}`}></i>
    //                             &nbsp;&nbsp;{theme.name}
    //                         </li>
    //                         <div id={`collapse-theme${theme_idx}`} className="collapse" data-parent="#accordion1">
    //                             <div id={`accordion10${theme_idx}`}>
    //                                 {theme.package.map((packages, pack_idx) =>
    //                                     <ul className="list-group" key={pack_idx}>
    //                                         <li className="list-group-item collapsed"
    //                                             id={`${theme_idx}-${pack_idx}`}
    //                                             data-toggle="collapse"
    //                                             data-target={`#collapse-packages${theme_idx}${pack_idx}`}
    //                                             aria-expanded="false"
    //                                             aria-controls={`collapse-packages${theme_idx}${pack_idx}`}
    //                                             onClick={(e) => this.active_view(e.currentTarget)}>
    //                                             <i className="icon expand-icon fa fa-plus ml-4" id={`${theme_idx}-${pack_idx}`}></i>
    //                                             &nbsp;&nbsp;{packages.name}
    //                                         </li>
    //                                         <div id={`collapse-packages${theme_idx}${pack_idx}`} className="collapse" data-parent={`#accordion10${theme_idx}`}>
    //                                             <div id={`accordion100${pack_idx}`}>
    //                                                 {packages.features.map((feature, idx) =>
    //                                                     <ul className="list-group" key={idx}>
    //                                                         <li className="list-group-item"
    //                                                             id={`${theme_idx}-${pack_idx}-${idx}`}
    //                                                             onClick={(e) => this.getProperties(feature.id, theme.id, feature.name, e.currentTarget)}>
    //                                                             <i style={{paddingLeft: "40px"}}></i> &nbsp;
    //                                                             <span className="p-0" id={`${theme_idx}-${pack_idx}-${idx}`}> {feature.name}</span>
    //                                                             {feature.view &&
    //                                                                 <ul style={{paddingLeft: "90px"}} id={`${theme_idx}-${pack_idx}-${idx}`}>
    //                                                                     <li id={`features-${theme_idx}${pack_idx}${idx}`}>{feature.view['view_name']}</li>
    //                                                                 </ul>
    //                                                             }
    //                                                         </li>
    //                                                     </ul>
    //                                                 )}
    //                                             </div>
    //                                         </div>
    //                                     </ul>
    //                                 )}
    //                             </div>
    //                         </div>
    //                     </ul>
    //                 )}
    //             </div>
    //             {/* <Loader is_loading={is_loading}/> */}
    //         </div>
    //     )
    // }
}
