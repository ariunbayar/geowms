(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{118:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var r=n(0),o=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var m=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(p,e);var t,n,a,s=c(p);function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=s.call(this,e)).state={modal_status:t.props.modal_status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t}return t=p,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.modal_status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.modal_status!=e.modal_status&&(["initial","open"].includes(this.props.modal_status)&&this.handleOpen(),["closing","closed"].includes(this.props.modal_status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({modal_status:"initial"}),setTimeout((function(){e.setState({modal_status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({modal_status:"closing"}),setTimeout((function(){t.setState({modal_status:"closed"}),e?e():(t.setState({modal_status:"closed"}),t.props.modalClose&&t.props.modalClose())}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.modal_status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content border-0 rounded-lg ".concat(this.props.modal_bg?this.props.modal_bg:"bg-light")},o.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},o.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true",onClick:function(){return e.handleClose()}},"×"))),o.a.createElement("div",{className:"d-flex justify-content-center"},this.props.modal_icon&&o.a.createElement("i",{className:"".concat(this.props.modal_icon," fa-3x my-3 animated bounceIn text-").concat(this.props.icon_color),"aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center"},o.a.createElement("h5",null,this.props.title&&this.props.title)),o.a.createElement("div",{className:"modal-body text-wrap text-center ml-2 mr-2 "},this.props.text&&("string"==typeof this.props.text?o.a.createElement("small",{className:""},this.props.text):o.a.createElement(this.props.text,this.props))),this.props.has_button?o.a.createElement("div",{className:"modal-footer border-0"},o.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn btn-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-times pr-1"}),this.props.actionNameBack?this.props.actionNameBack:"БУЦАХ"),o.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-check-square-o pr-1"}),this.props.actionNameDelete?this.props.actionNameDelete:"УСТГАХ")):o.a.createElement("div",{className:"modal-body mt-3"})))),o.a.createElement("div",{className:a}))}}])&&l(t.prototype,n),a&&l(t,a),p}(r.Component)},536:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var r=n(0),o=n.n(r),a=n(29);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(p,e);var t,n,r,l=u(p);function p(){return i(this,p),l.apply(this,arguments)}return t=p,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&c(t.prototype,n),r&&c(t,r),p}(r.Component)},979:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return se}));var r=n(0),o=n.n(r),a=n(44),l=n(50);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={createRole:function(e,t,n,r){var o=c(c({},Object(l.b)()),{},{body:JSON.stringify({gov_perm_id:e,role_name:t,role_description:n,roles:r})});return fetch("".concat(p,"/create/"),o).then(l.c)},updateRole:function(e,t,n,r,o,a){var i=c(c({},Object(l.b)()),{},{body:JSON.stringify({gov_perm_id:t,role_name:n,role_description:r,remove_roles:o,add_roles:a})});return fetch("".concat(p,"/").concat(e,"/update/"),i).then(l.c)},deleteRole:function(e){var t=c({},Object(l.a)());return fetch("".concat(p,"/").concat(e,"/delete/"),t).then(l.c)},detailRole:function(e){var t=c({},Object(l.a)());return fetch("".concat(p,"/").concat(e,"/detail/"),t).then(l.c)},getRoleList:function(){var e=c({},Object(l.a)());return fetch("".concat(p,"/"),e).then(l.c)}},p="/gov/api/role";var m=n(890),f=n(118);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=g(e);if(t){var o=g(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return b(this,n)}}function b(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(l,e);var t,n,r,a=v(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={perms:e.perms,refresh:!1,"жагсаалтын_холбоос":"/gov/api/role/role-list/","нэмэх_товч":"/gov/perm/role/add/",custom_query:{},"талбарууд":[{field:"name",title:"Нэр",has_action:!0}],"хувьсах_талбарууд":[{field:"name",action:function(e){return t.detai_go_link(e)}}],"нэмэлт_талбарууд":[{title:"Засах",text:"",icon:"fa fa-pencil-square-o text-success",action:function(e){return t.go_link(e)},width:"100px"},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(e){return t.handleRemoveAction(e)},width:"100px"}],values:{},icon:"",modal_status:"closed"},t.handleRemove=t.handleRemove.bind(_(t)),t.handleRemoveAction=t.handleRemoveAction.bind(_(t)),t.handleModalOpen=t.handleModalOpen.bind(_(t)),t.modalChange=t.modalChange.bind(_(t)),t.modalOpen=t.modalOpen.bind(_(t)),t}return t=l,(n=[{key:"handleRemoveAction",value:function(e){this.setState({values:e}),this.handleModalOpen(e)}},{key:"handleModalOpen",value:function(e){this.modalChange("fa fa-exclamation-circle","warning","Тохиргоог устгах",'Та "'.concat(e.name,'" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?'),!0)}},{key:"modalChange",value:function(e,t,n,r,o){this.setState({modal_icon:e,icon_color:t,title:n,text:r,has_button:o}),this.modalOpen()}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"detai_go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/detail/"))}},{key:"go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/edit/"))}},{key:"handleRemove",value:function(){var e=this,t=this.state.values.id;u.deleteRole(t).then((function(t){t.success?(e.setState({refresh:!e.state.refresh}),e.modalChange("fa fa-check-circle","success","Амжилттай устгалаа","",!1)):e.modalChange("fa fa-times-circle","danger","Усгахад алдаа гарлаа","",!1)}))}},{key:"render",value:function(){var e=this.state,t=e.refresh,n=e.талбарууд,r=e.жагсаалтын_холбоос,a=e.хувьсах_талбарууд,l=e.нэмэх_товч,i=e.нэмэлт_талбарууд,c=(e.values,this.props.employee.is_admin);return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(m.a,{"талбарууд":n,"жагсаалтын_холбоос":r,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":a,"нэмэх_товч":c?l:null,"нэмэлт_талбарууд":c?i:null,color:"primary",refresh:t})),o.a.createElement(f.a,{modal_status:this.state.modal_status,modal_icon:this.state.modal_icon,icon_color:this.state.icon_color,title:this.state.title,has_button:this.state.has_button,text:this.state.text,modalAction:this.handleRemove,actionNameDelete:"Устгах"}))}}])&&h(t.prototype,n),r&&h(t,r),l}(r.Component),E=n(20),S=n(34),k=n(896),w=n(536);function R(e){return(R="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(){return(j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function N(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=A(e);if(t){var o=A(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return C(this,n)}}function C(e,t){return!t||"object"!==R(t)&&"function"!=typeof t?D(e):t}function D(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function A(e){return(A=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var V=S.c().shape({role_name:S.d().required("Нэр оруулна уу !")}),I=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(l,e);var t,n,r,a=x(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).perms=[],t.remove_perms=[],t.role=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_status:"closed",is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(D(t)),t.getAllValue=t.getAllValue.bind(D(t)),t.getValue=t.getValue.bind(D(t)),t.getRoleDetail=t.getRoleDetail.bind(D(t)),t.removeItemFromRemoveRoles=t.removeItemFromRemoveRoles.bind(D(t)),t.handleModalOpen=t.handleModalOpen.bind(D(t)),t}return t=l,(n=[{key:"handleSave",value:function(e,t){var n=this,r=t.setStatus,o=t.setSubmitting,a=t.setErrors,l=this.state.gov_perm_id,i=this.props.match.params.id;this.setState({handleSaveIsLoad:!0}),u.updateRole(i,l,e.role_name,e.role_description,this.remove_perms,this.perms).then((function(e){var t=e.success,l=e.errors;t?(n.setState({handleSaveIsLoad:!1}),n.handleModalOpen(),r("saved"),o(!1)):(a(l),o(!1))}))}},{key:"removeItemFromArray",value:function(e,t,n,r,o,a){var l=this;e.map((function(i,c){i.feature_id==t&&i.property_id==n&&i.perm_kind==r&&(a?l.remove_perms.push(o):e.splice(c,1))}))}},{key:"getAllValue",value:function(e,t,n,r,o,a,l,i){if(e&&"all"==a&&i&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(i),!e&&"all"==a&&i&&this.role.length>0&&this.removeItemFromArray(this.role,r,n,t,i,l),e&&"all"==a&&!i){var c={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(c)}!e&&"all"==a&&!i&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t)}},{key:"getValue",value:function(e,t,n,r,o,a,l,i){if(!e&&l&&this.role.length>0&&null==a&&this.removeItemFromArray(this.role,r,n,t,i,l),!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t),e&&!a&&!l||e&&"role"==a){var c={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};"role"==a?this.role.push(c):this.perms.push(c)}l&&e&&null==a&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(i)}},{key:"removeItemFromRemoveRoles",value:function(e){var t=this;this.remove_perms.map((function(n,r){n==e&&t.remove_perms.splice(r,1)}))}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var n=t.success,r=t.role_id,o=t.role_name,a=t.role_description,l=t.roles;n&&e.setState({role_id:r,roles:l,is_continue:!0,initial_values:{role_name:o,role_description:a}})}))}},{key:"handleModalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.is_continue,r=t.initial_values,a=t.roles,l=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(w.a,j({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(E.e,{initialValues:r,enableReinitialize:!0,validationSchema:V,onSubmit:this.handleSave},(function(t){var r=t.errors,i=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(E.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Эрхийн нэр:"),o.a.createElement(E.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Эрхийн тайлбар:"),o.a.createElement(E.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,n&&o.a.createElement(k.default,{action_type:"editable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:l,role:a,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:i||Object.keys(r).length>0},i&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),i&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!i&&"Хадгалах")))}))),o.a.createElement(f.a,{modal_status:this.state.modal_status,modal_icon:"fa fa-check-circle",icon_color:"success",title:"Амжилттай хадгаллаа",text:"",has_button:!1,modalAction:null,modalClose:function(){return e.props.history.push("/gov/perm/role/")}}))}}])&&N(t.prototype,n),r&&N(t,r),l}(r.Component);function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function T(){return(T=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function M(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function L(e,t){return(L=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function q(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=z(e);if(t){var o=z(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return B(this,n)}}function B(e,t){return!t||"object"!==F(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var U=S.c().shape({role_name:S.d().required("Нэр оруулна уу !")}),G=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&L(e,t)}(l,e);var t,n,r,a=q(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).perms=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_status:"closed",is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(J(t)),t.getValue=t.getValue.bind(J(t)),t.getAllValue=t.getAllValue.bind(J(t)),t.removeItemFromArray=t.removeItemFromArray.bind(J(t)),t.handleModalOpen=t.handleModalOpen.bind(J(t)),t}return t=l,(n=[{key:"handleSave",value:function(e,t){var n=this,r=t.setStatus,o=t.setSubmitting,a=t.setErrors,l=this.state.gov_perm_id;u.createRole(l,e.role_name,e.role_description,this.perms).then((function(e){var t=e.success,l=e.errors;t?(n.setState({handleSaveIsLoad:!1}),n.handleModalOpen(),r("saved"),o(!1)):(a(l),o(!1))}))}},{key:"handleModalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"handleUserSearch",value:function(e,t){var n,r,o;this.setState((n={},r=e,o=t.target.value,r in n?Object.defineProperty(n,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[r]=o,n))}},{key:"removeItemFromArray",value:function(e,t,n,r,o,a){e.map((function(o,a){o.feature_id==t&&o.property_id==n&&o.perm_kind==r&&e.splice(a,1)}))}},{key:"getAllValue",value:function(e,t,n,r,o,a,l,i){if(e&&"all"==a&&!i){var c={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(c)}!e&&"all"==a&&!i&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t)}},{key:"getValue",value:function(e,t,n,r,o){if(!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t),e){var a={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(a)}}},{key:"render",value:function(){var e=this,t=this.state.initial_values,n=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(w.a,T({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(E.e,{initialValues:t,enableReinitialize:!0,validationSchema:U,onSubmit:this.handleSave},(function(t){var r=t.errors,a=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(E.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Role нэр:"),o.a.createElement(E.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement(E.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,o.a.createElement(k.default,{action_type:"addable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:n,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:a||Object.keys(r).length>0},a&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),a&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!a&&"Хадгалах")))}))),o.a.createElement(f.a,{modal_status:this.state.modal_status,modal_icon:"fa fa-check-circle",icon_color:"success",title:"Амжилттай хадгаллаа",text:"",has_button:!1,modalAction:null,modalClose:function(){return e.props.history.push("/gov/perm/role/")}}))}}])&&M(t.prototype,n),r&&M(t,r),l}(r.Component);function H(e){return(H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function K(){return(K=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function Q(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function W(e,t){return(W=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function X(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=$(e);if(t){var o=$(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Y(this,n)}}function Y(e,t){return!t||"object"!==H(t)&&"function"!=typeof t?Z(e):t}function Z(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function $(e){return($=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ee=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&W(e,t)}(l,e);var t,n,r,a=X(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={role_name:"",role_description:"",edit:!1,handleSaveIsLoad:!1,modal_alert_status:"closed",timer:null,is_continue:!0},t.handleSave=t.handleSave.bind(Z(t)),t.modalClose=t.modalClose.bind(Z(t)),t.getRoleDetail=t.getRoleDetail.bind(Z(t)),t}return t=l,(n=[{key:"handleSave",value:function(){this.setState({handleSaveIsLoad:!0}),this.props.match.role_name}},{key:"modalClose",value:function(){this.props.match.params.level,this.setState({handleSaveIsLoad:!1}),this.props.history.push("/gov/perm/role/"),this.setState({modal_alert_status:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;this.props.match.params.level,this.state.timer=setTimeout((function(){e.setState({handleSaveIsLoad:!1}),e.props.history.push("/gov/perm/role/"),e.setState({modal_alert_status:"closed"})}),2e3)}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var n=t.success,r=t.role_name,o=t.role_description,a=t.roles;n&&e.setState({role_name:r,role_description:o,roles:a,is_continue:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.role_name,r=t.is_continue,a=t.role_description,l=t.roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(w.a,K({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_id"},"Role нэр:"),o.a.createElement("input",{type:"text",className:"form-control",id:"role_id",disabled:"disabled",onChange:function(t){return e.setState({role_name:t.target.value})},value:n})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement("textarea",{type:"text",className:"form-control",disabled:"disabled",id:"role_description",onChange:function(t){return e.setState({role_description:t.target.value})},value:a}))))),o.a.createElement("br",null),o.a.createElement("div",null,r&&o.a.createElement(k.default,{dontDid:!0,org_roles:l}))))}}])&&Q(t.prototype,n),r&&Q(t,r),l}(r.Component);function te(e){return(te="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ne(){return(ne=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function re(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function oe(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ae(e,t){return(ae=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function le(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ce(e);if(t){var o=ce(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return ie(this,n)}}function ie(e,t){return!t||"object"!==te(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ce(e){return(ce=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var se=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ae(e,t)}(i,e);var t,n,r,l=le(i);function i(){return re(this,i),l.apply(this,arguments)}return t=i,(n=[{key:"render",value:function(){var e=this.props,t=e.org_roles,n=e.employee,r=this.props.employee,l=r.is_admin;return r.username,o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/",component:function(e){return o.a.createElement(O,ne({},e,{employee:n}))}}),l&&o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/:id/edit/",component:function(e){return o.a.createElement(I,ne({},e,{org_roles:t,employee:n}))}}),l&&o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/add/",component:function(e){return o.a.createElement(G,ne({},e,{org_roles:t,employee:n}))}}),o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/:id/detail/",component:function(e){return o.a.createElement(ee,ne({},e,{org_roles:t,employee:n}))}}))}}])&&oe(t.prototype,n),r&&oe(t,r),i}(r.Component)}}]);