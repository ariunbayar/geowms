(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{1017:function(e,t,n){var r=n(62),a=n(1018);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var o={insert:"head",singleton:!1};r(a,o);e.exports=a.locals||{}},1018:function(e,t,n){(t=n(63)(!1)).push([e.i,'.switch-radio {\n    position: relative;\n    display: inline-block;\n    width: 50px;\n    height: 26px;\n}\n\n.slider-point {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #ccc;\n    -webkit-transition: .4s;\n    transition: .4s;\n}\n\n.slider-pointer {\n    position: absolute;\n    content: "";\n    height: 20px;\n    width: 20px;\n    left: 2px;\n    bottom: 3px;\n    background-color: white;\n    -webkit-transition: .4s;\n    transition: .4s;\n  }\n\n.slider-point.slider-point-round {\n    border-radius: 34px;\n  }\n\n.slider-point.slider-point-round:before {\n    border-radius: 50%;\n}\n\n.slider-pointer.slider-point-round {\n    border-radius: 34px;\n  }\n\n.slider-pointer.slider-point-round:before {\n    border-radius: 50%;\n}\n\n.role-card {\n  min-height: 100%;\n  margin-bottom: 25px;\n  background-color: rgb(247, 249, 250, 1);\n  border-radius: 1px rgb(235, 242, 245, 1);\n  border: none;\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-clip: border-box;\n  border: 1px solid rgba(0,0,0,.125);\n  border-radius: .25rem;\n}\n\n.role-card-body {\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n  min-height: 1px;\n  padding: 1.25rem;\n}\n\n.role-table-card {\n  min-height: 100%;\n  margin-bottom: 15px;\n  background-color: white;\n  border-radius: 1px rgb(235, 242, 245, 1);\n  border: none;\n  margin-top: -16px;\n  position: relative;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-clip: border-box;\n  border: 1px solid rgba(0,0,0,.125);\n  border-radius: .25rem;\n}\n\n.role-table-card-body {\n  -ms-flex: 1 1 auto;\n  flex: 1 1 auto;\n  min-height: 1px;\n  padding: 1.25rem;\n}\n\n.role-bg-white-card{\n  background-color: white;\n  padding: 20px 20px 20px 20px;\n  box-shadow: 0 2px 6px 0 rgba(218, 218, 253, 0.65), 0 2px 6px 0 rgba(206, 206, 238, 0.54);\n  margin-bottom: 25px;\n}\n\n.fixed-height{\n  overflow-y: scroll;\n  height: calc(70vh - 40px);\n  position: sticky,\n}\n\n.fixed-height::-webkit-scrollbar-thumb {\n  background: #eaeef3;\n}\n\n.fixed-height:hover::-webkit-scrollbar-thumb {\n  background: #9e9e9e;\n  border-radius: 10px;\n  transition: 0.4s;\n}\n',""]),e.exports=t},889:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return C})),n.d(t,"PermChecks",(function(){return N}));var r=n(0),a=n.n(r);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t,n){return t&&l(e.prototype,t),n&&l(e,n),e}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=u(e);if(t){var a=u(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function u(e){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var h=function(e){c(n,e);var t=d(n);function n(e){var r;return i(this,n),(r=t.call(this,e)).state={radio_switch_class_name:"switch-radio"},r.setStyle=r.setStyle.bind(_(r)),r}return s(n,[{key:"componentDidMount",value:function(){var e=this.props,t=e.total_length,n=e.index,r=e.now_length,a=document.getElementById(n);this.setStyle(a,t,r)}},{key:"setStyle",value:function(e,t,n){var r=this.state.radio_switch_class_name,a=0,o=document.getElementsByClassName("".concat(r))[0].offsetWidth;t===n?(e.style.backgroundColor="#006CB6",a=Math.ceil(o/2)):t>n&&0!=n?(e.style.backgroundColor="#FFD24A",a=Math.floor(o/3)):(e.style.backgroundColor="#ccc",a=0);var i=0,l=e.children[0],s=setInterval((function(){i==a?clearInterval(s):(i++,l.style.left=i+"px")}),10)}},{key:"render",value:function(){var e=this.props,t=e.name,n=(e.p_idx,e.index),r=(e.total_length,e.now_length,this.state.radio_switch_class_name);return a.a.createElement("div",{className:"col-2 pr-0 pl-0"},a.a.createElement("div",{className:"form-group text-center"},a.a.createElement("label",{className:"col-lg-12",htmlFor:n,style:{fontSize:"8px"}},t),a.a.createElement("div",{className:"".concat(r," col-lg-12")},a.a.createElement("span",{id:n,className:"slider-point slider-point-round"},a.a.createElement("div",{className:"slider-pointer slider-point-round"})))))}}]),n}(r.Component),f=function(e){c(n,e);var t=d(n);function n(e){var r;return i(this,n),(r=t.call(this,e)).state={perms:[{name:"ХАРАХ",eng_name:"PERM_VIEW",value:!1},{name:"НЭМЭХ",eng_name:"PERM_CREATE",value:!1},{name:"ХАСАХ",eng_name:"PERM_REMOVE",value:!1},{name:"ЗАСАХ",eng_name:"PERM_UPDATE",value:!1},{name:"ЦУЦЛАХ",eng_name:"PERM_REVOKE",value:!1},{name:"БАТЛАХ",eng_name:"PERM_APPROVE",value:!1}],r_name:""},r}return s(n,[{key:"render",value:function(){var e=this,t=this.state,n=t.perms,r=t.r_name,o=this.props,i=o.name,l=o.index,s=o.type,c=o.id,p=o.total_length,d=o.small,m=o.is_open,_=o.t_name,u=o.p_name,f=o.f_name,b=o.now_length;return a.a.createElement("div",{className:"role-card-body "+("feature"==s?"ml-5":"card-header"),id:"".concat(l,"-").concat(s)},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-3"},a.a.createElement("h5",{className:"mb-0 mt-4"},a.a.createElement("i",{className:"fa "+(m&&"theme"==s&&_==r||"package"==s&&u==r||"feature"==s&&f==r?"fa-angle-down":"fa-angle-right")+" gp-text-primary"})," ",a.a.createElement("span",{role:"button",className:"gp-text-primary "+(d||"text-uppercase")+" font-weight-bold text-break shadow-none collapsed","data-toggle":"collapse","data-target":"#acc-".concat(l,"-").concat(s),"aria-controls":"acc-".concat(l,"-").concat(s),"aria-expanded":"true",onClick:function(){e.setState({r_name:i}),e.props.sendId(c,s,i)}},i))),a.a.createElement("div",{className:"col-9"},a.a.createElement("div",{className:"row"},n.map((function(e,t){return a.a.createElement(h,{key:t,name:e.name,p_idx:t,index:"".concat(t,"-perm-").concat(i,"-").concat(l,"-").concat(s),total_length:p,now_length:b[e.name]})}))))))}}]),n}(r.Component);n(1017);function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function g(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function k(e,t,n){return t&&v(e.prototype,t),n&&v(e,n),e}function E(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&x(e,t)}function x(e,t){return(x=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function R(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=P(e);if(t){var a=P(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return O(this,n)}}function O(e,t){return!t||"object"!==b(t)&&"function"!=typeof t?w(e):t}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function P(e){return(P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){E(n,e);var t=R(n);function n(e){var r;return g(this,n),(r=t.call(this,e)).forThemeCount=0,r.sendPropertyInfo=[],r.state={tid:0,pid:0,fid:0,themes:[],package_features:[],org_roles:[],properties:[],perms:[{name:"харах",eng_name:"PERM_VIEW",insp_id:"view_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_view_id",is_role_check:"is_role_PERM_VIEW",is_employee_perm:"is_employee_perm_PERM_VIEW"},{name:"нэмэх",eng_name:"PERM_CREATE",insp_id:"create_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_create_id",is_role_check:"is_role_PERM_CREATE",is_employee_perm:"is_employee_perm_PERM_CREATE"},{name:"хасах",eng_name:"PERM_REMOVE",insp_id:"remove_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_remove_id",is_role_check:"is_role_PERM_REMOVE",is_employee_perm:"is_employee_perm_PERM_REMOVE"},{name:"засах",eng_name:"PERM_UPDATE",insp_id:"update_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_update_id",is_role_check:"is_role_PERM_UPDATE",is_employee_perm:"is_employee_perm_PERM_UPDATE"},{name:"цуцлах",eng_name:"PERM_REVOKE",insp_id:"revoke_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_revoke_id",is_role_check:"is_role_PERM_REVOKE",is_employee_perm:"is_employee_perm_PERM_REVOKE"},{name:"батлах",eng_name:"PERM_APPROVE",insp_id:"approve_id",all_check_value:!0,is_role_emp_id:"is_role_emp_id_approve_id",is_role_check:"is_role_PERM_APPROVE",is_employee_perm:"is_employee_perm_PERM_APPROVE"}],is_open:!1,t_name:"",p_name:"",f_name:"",roles:[],is_role_border:"border border-warning",is_emp_border:"border border-primary",border_left_right_none_bg:" border border-primary border-right-0 border-left-0 bg-light "},r.getId=r.getId.bind(w(r)),r.PermsOnChange=r.PermsOnChange.bind(w(r)),r.cancelOpen=r.cancelOpen.bind(w(r)),r.isRoleChecked=r.isRoleChecked.bind(w(r)),r.isRolePermChecked=r.isRolePermChecked.bind(w(r)),r.convertToOurInspire=r.convertToOurInspire.bind(w(r)),r.clearRolesFromObject=r.clearRolesFromObject.bind(w(r)),r.pushToState=r.pushToState.bind(w(r)),r.isRoleClearObjectItem=r.isRoleClearObjectItem.bind(w(r)),r.sendValueSelectedAll=r.sendValueSelectedAll.bind(w(r)),r.isRoleSendValue=r.isRoleSendValue.bind(w(r)),r}return k(n,[{key:"getId",value:function(e,t,n){var r=this.state,a=r.properties,o=r.perms;"theme"==t&&this.setState({tid:e,is_open:!0,t_name:n,pid:0,fid:0}),"package"==t&&this.setState({pid:e,p_name:n}),"feature"==t&&(a.map((function(t,n){t.parent_id==e&&o.map((function(e,n){Object.keys(t.roles).map((function(r,a){if(!r.includes("id")){var i=t.roles[e.is_role_check];i||(o[n].all_check_value=i)}}))}))})),this.setState({fid:e,f_name:n}))}},{key:"cancelOpen",value:function(){this.setState({is_open:!1})}},{key:"PermsOnChange",value:function(e,t,n,r,a){var o=this.state.perms,i=e.checked;o[n].all_check_value=i,this.setState({perms:o}),this.sendValueSelectedAll(i,t,r,a)}},{key:"sendValueSelectedAll",value:function(e,t,n,r){var a=this;this.sendPropertyInfo=[];var o=this.state,i=o.properties,l=o.fid;i.map((function(e,t){e.parent_id==l&&a.sendPropertyInfo.push(e)})),this.sendPropertyInfo.map((function(o,i){Object.keys(o.roles).map((function(s,c){t==s&&a.sendPropertyInfo[i].roles[s]&&a.props.sendAllValue(e,t,o.id,l,o.roles[n],"all",!0,o.roles[r])}))}))}},{key:"isRoleSendValue",value:function(e,t,n){var r=this;this.state.perms.map((function(a,o){Object.keys(e.roles).map((function(o,i){a.eng_name==o&&e.roles[o]&&r.props.getValue(t,a.eng_name,e.id,e.parent_id,e.roles[a.is_role_emp_id],n,e.roles[a.is_role_check],e.roles[a.insp_id],e.roles[a.is_employee_perm])}))}))}},{key:"isRolePermChecked",value:function(e,t,n,r,a){return Object.keys(e.roles).map((function(o,i){if(!o.includes("id")&&e.roles[o]==r){var l="".concat(a,"_").concat(o);void 0!==t[n].roles[l]&&delete t[n].roles[l],t[n].roles[l]=e.roles[o]}if(o.includes("id")&&null!=e.roles[o]){var s="is_role_emp_id_".concat(o);void 0!==t[n].roles[s]&&delete t[n].roles[s],t[n].roles[s]=e.roles[o]}})),r}},{key:"isRoleChecked",value:function(e,t,n,r,a,o){var i=this;return e.map((function(e,l){t.map((function(l,s){if(e.id==l.id)if(e.parent_id){if(e.parent_id==l.parent_id){if(o&&a&&(void 0!==a[o].features[s][n]&&delete a[o].features[s][n],a[o].features[s][n]=!0),e.roles)i.isRolePermChecked(e,t,s,!0,n)&&"viewable"!==i.props.action_type&&r&&i.isRoleSendValue(e,!0,r);void 0!==t[s][n]&&delete t[s][n],t[s][n]=!0}}else void 0!==t[s][n]&&delete t[s][n],t[s][n]=!0;e.features&&i.isRoleChecked(e.features,l.features,n,null,t,s)}))})),!0}},{key:"componentDidMount",value:function(){var e=this;if(this.props.org_roles){this.props.org_roles.themes.map((function(t,n){"is_role"in t&&e.clearRolesFromObject(e.props.org_roles,"is_role"),"is_employee_perm"in t&&e.clearRolesFromObject(e.props.org_roles,"is_employee_perm")})),this.convertToOurInspire(this.props.org_roles)}this.props.emp_perms&&this.clearRolesFromObject(this.props.emp_perms)}},{key:"isRoleClearObjectItem",value:function(e,t,n,r,a){var o=this;return e.map((function(i,l){a?"array"==a&&(i.includes("is_role")&&delete n[r].roles[i],i.includes("is_employee_perm")&&delete n[r].roles[i]):t in i&&(n&&r?delete n[r].features[l][t]:(delete e[l][t],i.roles&&o.isRoleClearObjectItem(Object.keys(i.roles),t,e,l,"array")),i.features&&o.isRoleClearObjectItem(i.features,t,e,l))})),!0}},{key:"clearRolesFromObject",value:function(e,t){var n=e.themes,r=e.package_features,a=e.property;this.isRoleClearObjectItem(n,t)&&(this.isRoleClearObjectItem(r,t)&&this.isRoleClearObjectItem(a,t));return!0}},{key:"convertToOurInspire",value:function(e){var t=e.themes,n=e.package_features,r=e.property;if("editable"==this.props.action_type&&this.props.role){var a=this.props.role,o="is_role";if(!this.props.is_inspire_role_null)if(this.isRoleChecked(a.themes,t,o,null))this.isRoleChecked(a.package_features,n,o,null)&&this.isRoleChecked(a.property,r,o,"role");if(this.props.emp_perms){var i=this.props.emp_perms,l="is_employee_perm";if(this.isRoleChecked(i.themes,t,l,null))this.isRoleChecked(i.package_features,n,l,null)&&this.isRoleChecked(i.property,r,l,"perms")}this.setState({themes:t,package_features:n,properties:r})}if("viewable"==this.props.action_type&&this.props.emp_perms){var s=this.props.emp_perms,c=s.themes,p=s.package_features,d=s.property;this.setState({themes:c,package_features:p,properties:d})}"editable"===this.props.action_type||this.props.role||"viewable"===this.props.action_type||this.props.emp_perms||this.setState({themes:t,package_features:n,properties:r})}},{key:"pushToState",value:function(e){var t=this;Object.keys(e).map((function(n){e[n].length>0&&e[n].map((function(e,r){"property"==n&&(n="properties"),t.state[n].push(e)}))}))}},{key:"componentDidUpdate",value:function(e,t){t.tid!==this.state.tid&&this.setState({prevTid:t.tid})}},{key:"render",value:function(){var e=this,t=this.state,n=t.themes,r=t.package_features,o=t.fid,i=(t.tid,t.pid,t.properties),l=t.perms,s=t.prevTid,c=t.t_name,p=t.is_open,d=t.p_name,m=t.f_name,_=t.is_role_border,u=t.is_emp_border,h=t.border_left_right_none_bg,b=this.props,g=b.action_type,v=b.is_employee,k=b.addable_is_check,E=b.editable_is_check;return a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-xl-6 col-sm-12 p-0 fixed-height"},a.a.createElement("div",{className:"col "},a.a.createElement("div",{className:"accordion my-0",id:"accordion"},n.length>0&&n.map((function(t,n){return a.a.createElement("div",{className:"role-bg-white-card"},a.a.createElement("div",{className:"mb-0 role-card "+(t.is_role?_:t.is_employee_perm?u:""),key:n},a.a.createElement(f,{type:"theme",id:t.id,name:t.name,index:n,total_length:t.all_child,now_length:t.perm_child_ids,is_open:p,t_name:c,sendId:e.getId})),a.a.createElement("div",{className:"accordion",id:"accordion-2"},s!==t.id&&r.length>0&&r.map((function(r,o){return r.parent_id==t.id&&a.a.createElement("div",{id:"acc-".concat(n,"-theme"),className:"collapse role-table-card mt-3 mb-0 "+(r.is_role?_:r.is_employee_perm?u:""),key:o},a.a.createElement(f,{key:o,type:"package",id:r.id,name:r.name,index:o,total_length:r.all_child,now_length:r.perm_child_ids,is_open:p,p_name:d,t_name:c,sendId:e.getId,cancelOpen:e.cancelOpen}),a.a.createElement("div",{id:"acc-".concat(o,"-package"),className:"collapse","aria-labelledby":"accordion-2","data-parent":"#accordion-2"},a.a.createElement("div",{className:""},a.a.createElement("div",{className:"accordion",id:"accordion-3"},r.features.map((function(t,n){return a.a.createElement("div",{className:t.is_role?_+h:t.is_employee_perm?u+h:"",key:n},t.parent_id==r.id&&a.a.createElement(f,{type:"feature",id:t.id,name:t.name,index:n,total_length:t.all_child,now_length:t.perm_child_ids,small:"text-lowercase",is_open:p,t_name:c,p_name:d,f_name:m,sendId:e.getId}))}))))))}))))}))))),a.a.createElement("div",{className:"col-xl-6 col-sm-12 fixed-height"},a.a.createElement("div",{className:"card-body"},a.a.createElement("div",{className:"fixed-height-right"},a.a.createElement("table",{className:"table table_wrapper_table_saaral table-bordered"},a.a.createElement("thead",{className:"thead-light"},a.a.createElement("tr",null,a.a.createElement("th",{className:"col"}),l.map((function(t,n){var r;return a.a.createElement("th",(y(r={className:"col"},"className","p-2 text-center"),y(r,"key",n),r),a.a.createElement("span",null,t.name),v?null:g&&o>0?a.a.createElement("div",{className:"custom-control custom-switch col-lg-12 ml-2"},a.a.createElement("input",{type:"checkbox",className:"custom-control-input",id:t.name,checked:t.all_check_value,onChange:function(r){return e.PermsOnChange(r.target,t.eng_name,n,t.insp_id,t.is_role_emp_id)}}),a.a.createElement("label",{className:"custom-control-label ",htmlFor:t.name})):null)})))),a.a.createElement("tbody",null,i.length>0&&i.map((function(t,n){return t.parent_id==o&&a.a.createElement("tr",{key:n},a.a.createElement("th",null,t.name),l.map((function(r,i){return Object.keys(t.roles).map((function(l,s){return l==r.eng_name&&a.a.createElement(N,{key:i,fid:o,all_check_value:r.all_check_value,id:t.id,index:n,idx:i,value:t.roles[l],insp_id:t.roles[r.insp_id],name:t.name,perm_name:r.eng_name,action_type:g,sendValue:e.props.getValue,is_role_check:t.roles[r.is_role_check],is_role_emp_id:t.roles[r.is_role_emp_id],is_emp_perm:t.roles[r.is_employee_perm],is_employee:v,addable_is_check:!!k&&k.filter((function(e){return e.gov_perm_inspire_id==t.roles[r.insp_id]})).length>0,editable_is_check:!!E&&E.filter((function(e){return e.gov_perm_ins_id==t.roles[r.insp_id]})).length>0})}))})))}))))))))}}]),n}(r.Component),N=function(e){E(n,e);var t=R(n);function n(e){var r;return g(this,n),(r=t.call(this,e)).state={addable:e.addable_is_check,editable:e.editable_is_check},r.handleOnChange=r.handleOnChange.bind(w(r)),r}return k(n,[{key:"handleOnChange",value:function(e,t){var n=this.props,r=(n.name,n.index,n.id),a=n.perm_name,o=n.action_type,i=(n.value,n.idx,n.fid),l=n.insp_id,s=n.is_role_check,c=n.is_role_emp_id,p=n.is_emp_perm;"viewable"!==o&&(this.setState(y({},e,t)),this.props.sendValue(t,a,r,i,l,null,s,c,p))}},{key:"componentDidMount",value:function(){this.props.is_role_emp_id&&this.setState({editable:!0})}},{key:"componentDidUpdate",value:function(e){e.all_check_value!==this.props.all_check_value&&this.setState(y({},this.props.action_type,this.props.all_check_value))}},{key:"render",value:function(){var e=this,t=this.props,n=t.name,r=t.index,o=(t.id,t.perm_name,t.action_type),i=t.value,l=t.idx,s=(t.insp_id,t.is_role_check),c=t.is_role_emp_id,p=t.is_employee,d=t.is_emp_perm,m=this.state,_=m.addable,u=m.editable;return a.a.createElement("td",{className:"icheck-"+(s&&d?"success":s&&!d?"warning":d&&!s?"info":"primary")},"addable"==o?i?a.a.createElement("input",{type:"checkbox",id:"".concat(n,"-").concat(r,"-").concat(l),name:"".concat(n,"-").concat(r,"-").concat(l),checked:_,onChange:function(t){return e.handleOnChange("addable",t.target.checked)}}):a.a.createElement("i",{className:"fa fa-minus","aria-hidden":"true"}):"editable"==o?i?a.a.createElement("input",{type:"checkbox",id:"".concat(n,"-").concat(r,"-").concat(l),name:"".concat(n,"-").concat(r,"-").concat(l),checked:u,disabled:p&&c&&!d||s&&d?"disabled":null,onChange:function(t){return e.handleOnChange("editable",t.target.checked)}}):a.a.createElement("i",{className:"fa fa-minus","aria-hidden":"true"}):a.a.createElement("input",{type:"checkbox",id:"".concat(n,"-").concat(r,"-").concat(l),name:"".concat(n,"-").concat(r,"-").concat(l),checked:this.props.value,onChange:function(t){return e.handleOnChange(t.target.checked)}}),a.a.createElement("label",{htmlFor:"".concat(n,"-").concat(r,"-").concat(l)}))}}]),n}(r.Component)}}]);