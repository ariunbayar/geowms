(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{160:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var r=n(0),o=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(m,e);var t,n,a,c=s(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=c.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t}return t=m,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose(null,0))}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e,t){var n=this;t=void 0===t?150:t,this.setState({status:"closing"}),setTimeout((function(){n.setState({status:"closed"}),e&&e()}),t)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n,onClick:function(){return e.handleProceed()}},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},o.a.createElement("div",{className:"d-flex justify-content-center"},"danger"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"primary"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn gp-text-primary","aria-hidden":"true"}):"warning"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):o.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center my-1"},o.a.createElement("h6",{className:"text-dark"},this.props.title)),o.a.createElement("div",{className:"modal-body text-wrap ml-2 mr-2 my-3 text-justify"},o.a.createElement("a",{className:"text-dark"},this.props.text))))),o.a.createElement("div",{className:a}))}}])&&i(t.prototype,n),a&&i(t,a),m}(r.Component)},237:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var r=n(0),o=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return c(this,n)}}function c(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(m,e);var t,n,a,c=s(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=c.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t}return t=m,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),e?e():(t.setState({status:"closed"}),t.props.modalClose&&t.props.modalClose())}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},o.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},o.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true",onClick:function(){return e.handleClose()}},"×"))),o.a.createElement("div",{className:"d-flex justify-content-center"},"success"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"warning"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):o.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center"},o.a.createElement("h5",null,this.props.title)),o.a.createElement("div",{className:"modal-body text-center text-wrap ml-2 mr-2 text-justify"},this.props.text),o.a.createElement("div",{className:"modal-footer",style:{border:"none"}},o.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn btn-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-times"}),this.props.actionNameBack?this.props.actionNameBack:"  БУЦАХ"),o.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-check-square-o"}),this.props.actionNameDelete?this.props.actionNameDelete:"  УСТГАХ"))))),o.a.createElement("div",{className:a}))}}])&&i(t.prototype,n),a&&i(t,a),m}(r.Component)},889:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var r=n(0),o=n.n(r),a=n(30);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=f(e);if(t){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,n,r,i=u(m);function m(){return l(this,m),i.apply(this,arguments)}return t=m,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&s(t.prototype,n),r&&s(t,r),m}(r.Component)},955:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return ue}));var r=n(0),o=n.n(r),a=n(48),i=n(53);function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={createRole:function(e,t,n,r){var o=s(s({},Object(i.b)()),{},{body:JSON.stringify({gov_perm_id:e,role_name:t,role_description:n,roles:r})});return fetch("".concat(m,"/create/"),o).then(i.c)},updateRole:function(e,t,n,r,o,a){var l=s(s({},Object(i.b)()),{},{body:JSON.stringify({gov_perm_id:t,role_name:n,role_description:r,remove_roles:o,add_roles:a})});return fetch("".concat(m,"/").concat(e,"/update/"),l).then(i.c)},deleteRole:function(e){var t=s({},Object(i.a)());return fetch("".concat(m,"/").concat(e,"/delete/"),t).then(i.c)},detailRole:function(e){var t=s({},Object(i.a)());return fetch("".concat(m,"/").concat(e,"/detail/"),t).then(i.c)},getRoleList:function(){var e=s({},Object(i.a)());return fetch("".concat(m,"/"),e).then(i.c)}},m="/gov/api/role";var f=n(160),p=n(890),d=n(237);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=E(e);if(t){var o=E(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return _(this,n)}}function _(e,t){return!t||"object"!==h(t)&&"function"!=typeof t?g(e):t}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(i,e);var t,n,r,a=b(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).state={perms:e.perms,modal_status:"closed",alert_modal_status:"closed",refresh:!1,"жагсаалтын_холбоос":"/gov/api/role/role-list/","нэмэх_товч":"/gov/perm/role/add/",custom_query:{},"талбарууд":[{field:"name",title:"Нэр",has_action:!0}],"хувьсах_талбарууд":[{field:"name",action:function(e){return t.detai_go_link(e)}}],"нэмэлт_талбарууд":[{title:"Засах",text:"",icon:"fa fa-pencil-square-o text-success",action:function(e){return t.go_link(e)},width:"100px"},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(e){return t.handleRemoveAction(e)},width:"100px"}],values:{},title:"",icon:""},t.handleRemove=t.handleRemove.bind(g(t)),t.handleRemoveAction=t.handleRemoveAction.bind(g(t)),t.handleModalOpen=t.handleModalOpen.bind(g(t)),t.handleModalClose=t.handleModalClose.bind(g(t)),t.modalClose=t.modalClose.bind(g(t)),t.modalOpen=t.modalOpen.bind(g(t)),t}return t=i,(n=[{key:"modalClose",value:function(){this.setState({alert_modal_status:"closed"})}},{key:"modalOpen",value:function(e,t){this.setState({alert_modal_status:"open",title:e,icon:t})}},{key:"handleRemoveAction",value:function(e){this.setState({values:e}),this.handleModalOpen()}},{key:"handleModalOpen",value:function(){this.setState({modal_status:"open"})}},{key:"handleModalClose",value:function(){this.setState({modal_status:"closed"})}},{key:"detai_go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/detail/"))}},{key:"go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/edit/"))}},{key:"handleRemove",value:function(){var e=this,t=this.state.values.id;u.deleteRole(t).then((function(t){t.success?(e.setState({refresh:!e.state.refresh}),e.modalOpen("Амжилттай устлаа","success")):e.modalOpen("Алдаа гарлаа","danger")}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.refresh,r=t.талбарууд,a=t.жагсаалтын_холбоос,i=t.хувьсах_талбарууд,l=t.нэмэх_товч,s=t.нэмэлт_талбарууд,c=t.modal_status,u=t.values,m=t.alert_modal_status,h=t.title,y=t.icon;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(p.a,{"талбарууд":r,"жагсаалтын_холбоос":a,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":i,"нэмэх_товч":l,"нэмэлт_талбарууд":s,color:"primary",refresh:n})),o.a.createElement(d.a,{text:'Та "'.concat(u.name,'" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?'),title:"Тохиргоог устгах",model_type_icon:"success",status:c,modalClose:this.handleModalClose,modalAction:this.handleRemove}),o.a.createElement(f.a,{modalAction:function(){return e.modalClose()},status:m,title:h,model_type_icon:y}))}}])&&y(t.prototype,n),r&&y(t,r),i}(r.Component),S=n(19),k=n(34),w=n(895),R=n(889);function j(e){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function N(){return(N=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function x(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=T(e);if(t){var o=T(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return D(this,n)}}function D(e,t){return!t||"object"!==j(t)&&"function"!=typeof t?I(e):t}function I(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var A=k.c().shape({role_name:k.d().required("Нэр оруулна уу !")}),V=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(i,e);var t,n,r,a=C(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).perms=[],t.remove_perms=[],t.role=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_alert_status:"closed",timer:null,is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(I(t)),t.modalClose=t.modalClose.bind(I(t)),t.getAllValue=t.getAllValue.bind(I(t)),t.getValue=t.getValue.bind(I(t)),t.getRoleDetail=t.getRoleDetail.bind(I(t)),t.removeItemFromRemoveRoles=t.removeItemFromRemoveRoles.bind(I(t)),t}return t=i,(n=[{key:"handleSave",value:function(e,t){var n=this,r=t.setStatus,o=t.setSubmitting,a=t.setErrors,i=this.state.gov_perm_id,l=this.props.match.params.id;this.setState({handleSaveIsLoad:!0}),u.updateRole(l,i,e.role_name,e.role_description,this.remove_perms,this.perms).then((function(e){var t=e.success,i=e.errors;t?(n.setState({modal_alert_status:"open"}),r("saved"),o(!1),n.modalCloseTime()):(a(i),o(!1))}))}},{key:"modalClose",value:function(){this.setState({handleSaveIsLoad:!1}),this.props.history.push("/gov/perm/role/"),this.setState({modal_alert_status:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;this.state.timer=setTimeout((function(){e.setState({handleSaveIsLoad:!1}),e.props.history.push("/gov/perm/role/"),e.setState({modal_alert_status:"closed"})}),2e3)}},{key:"removeItemFromArray",value:function(e,t,n,r,o,a){var i=this;e.map((function(l,s){l.feature_id==t&&l.property_id==n&&l.perm_kind==r&&(a?i.remove_perms.push(o):e.splice(s,1))}))}},{key:"getAllValue",value:function(e,t,n,r,o,a,i,l){if(e&&"all"==a&&l&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(l),!e&&"all"==a&&l&&this.role.length>0&&this.removeItemFromArray(this.role,r,n,t,l,i),e&&"all"==a&&!l){var s={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(s)}!e&&"all"==a&&!l&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t)}},{key:"getValue",value:function(e,t,n,r,o,a,i,l){if(!e&&i&&this.role.length>0&&null==a&&this.removeItemFromArray(this.role,r,n,t,l,i),!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t),e&&!a&&!i||e&&"role"==a){var s={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};"role"==a?this.role.push(s):this.perms.push(s)}i&&e&&null==a&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(l)}},{key:"removeItemFromRemoveRoles",value:function(e){var t=this;this.remove_perms.map((function(n,r){n==e&&t.remove_perms.splice(r,1)}))}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var n=t.success,r=t.role_id,o=t.role_name,a=t.role_description,i=t.roles;n&&e.setState({role_id:r,roles:i,is_continue:!0,initial_values:{role_name:o,role_description:a}})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.is_continue,r=t.initial_values,a=t.roles,i=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(R.a,N({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(S.e,{initialValues:r,enableReinitialize:!0,validationSchema:A,onSubmit:this.handleSave},(function(t){var r=t.errors,l=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(S.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Эрхийн нэр:"),o.a.createElement(S.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(S.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Эрхийн тайлбар:"),o.a.createElement(S.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(S.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,n&&o.a.createElement(w.default,{action_type:"editable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:i,role:a,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:l||Object.keys(r).length>0},l&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),l&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!l&&"Хадгалах")))}))),o.a.createElement(f.a,{modalAction:function(){return e.modalClose()},status:this.state.modal_alert_status,title:"Амжилттай хадгаллаа",model_type_icon:"success"}))}}])&&x(t.prototype,n),r&&x(t,r),i}(r.Component);function F(e){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function L(){return(L=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function M(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function q(e,t){return(q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function B(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=z(e);if(t){var o=z(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return J(this,n)}}function J(e,t){return!t||"object"!==F(t)&&"function"!=typeof t?U(e):t}function U(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var G=k.c().shape({role_name:k.d().required("Нэр оруулна уу !")}),H=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&q(e,t)}(i,e);var t,n,r,a=B(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).perms=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_alert_status:"closed",timer:null,is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(U(t)),t.modalClose=t.modalClose.bind(U(t)),t.modalCloseTime=t.modalCloseTime.bind(U(t)),t.getValue=t.getValue.bind(U(t)),t.getAllValue=t.getAllValue.bind(U(t)),t.removeItemFromArray=t.removeItemFromArray.bind(U(t)),t}return t=i,(n=[{key:"handleSave",value:function(e,t){var n=this,r=t.setStatus,o=t.setSubmitting,a=t.setErrors,i=this.state.gov_perm_id;u.createRole(i,e.role_name,e.role_description,this.perms).then((function(e){var t=e.success,i=e.errors;t?(n.setState({modal_alert_status:"open"}),r("saved"),o(!1),n.modalCloseTime()):(a(i),o(!1))}))}},{key:"modalClose",value:function(){this.setState({handleSaveIsLoad:!1}),this.props.history.push("/gov/perm/role/"),this.setState({modal_alert_status:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;setTimeout((function(){e.setState({handleSaveIsLoad:!1}),e.props.history.push("/gov/perm/role/"),e.setState({modal_alert_status:"closed"})}),2e3)}},{key:"handleUserSearch",value:function(e,t){var n,r,o;this.setState((n={},r=e,o=t.target.value,r in n?Object.defineProperty(n,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[r]=o,n))}},{key:"removeItemFromArray",value:function(e,t,n,r,o,a){e.map((function(o,a){o.feature_id==t&&o.property_id==n&&o.perm_kind==r&&e.splice(a,1)}))}},{key:"getAllValue",value:function(e,t,n,r,o,a,i,l){if(e&&"all"==a&&!l){var s={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(s)}!e&&"all"==a&&!l&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t)}},{key:"getValue",value:function(e,t,n,r,o){if(!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,r,n,t),e){var a={feature_id:r,property_id:n,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(a)}}},{key:"render",value:function(){var e=this,t=this.state.initial_values,n=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(R.a,L({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(S.e,{initialValues:t,enableReinitialize:!0,validationSchema:G,onSubmit:this.handleSave},(function(t){var r=t.errors,a=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(S.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Role нэр:"),o.a.createElement(S.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(S.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement(S.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(S.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,o.a.createElement(w.default,{action_type:"addable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:n,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:a||Object.keys(r).length>0},a&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),a&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!a&&"Хадгалах")))}))),o.a.createElement(f.a,{modalAction:function(){return e.modalClose()},status:this.state.modal_alert_status,title:"Амжилттай хадгаллаа",model_type_icon:"success"}))}}])&&M(t.prototype,n),r&&M(t,r),i}(r.Component);function K(e){return(K="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Q(){return(Q=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function W(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function X(e,t){return(X=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ee(e);if(t){var o=ee(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Z(this,n)}}function Z(e,t){return!t||"object"!==K(t)&&"function"!=typeof t?$(e):t}function $(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ee(e){return(ee=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var te=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&X(e,t)}(i,e);var t,n,r,a=Y(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).state={role_name:"",role_description:"",edit:!1,handleSaveIsLoad:!1,modal_alert_status:"closed",timer:null,is_continue:!0},t.handleSave=t.handleSave.bind($(t)),t.modalClose=t.modalClose.bind($(t)),t.getRoleDetail=t.getRoleDetail.bind($(t)),t}return t=i,(n=[{key:"handleSave",value:function(){this.setState({handleSaveIsLoad:!0}),this.props.match.role_name}},{key:"modalClose",value:function(){this.props.match.params.level,this.setState({handleSaveIsLoad:!1}),this.props.history.push("/gov/perm/role/"),this.setState({modal_alert_status:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;this.props.match.params.level,this.state.timer=setTimeout((function(){e.setState({handleSaveIsLoad:!1}),e.props.history.push("/gov/perm/role/"),e.setState({modal_alert_status:"closed"})}),2e3)}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var n=t.success,r=t.role_name,o=t.role_description,a=t.roles;n&&e.setState({role_name:r,role_description:o,roles:a,is_continue:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.role_name,r=t.is_continue,a=t.role_description,i=t.roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(R.a,Q({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_id"},"Role нэр:"),o.a.createElement("input",{type:"text",className:"form-control",id:"role_id",disabled:"disabled",onChange:function(t){return e.setState({role_name:t.target.value})},value:n})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement("textarea",{type:"text",className:"form-control",disabled:"disabled",id:"role_description",onChange:function(t){return e.setState({role_description:t.target.value})},value:a}))))),o.a.createElement("br",null),o.a.createElement("div",null,r&&o.a.createElement(w.default,{dontDid:!0,org_roles:i}))))}}])&&W(t.prototype,n),r&&W(t,r),i}(r.Component);function ne(e){return(ne="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function re(){return(re=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function oe(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ae(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ie(e,t){return(ie=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function le(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ce(e);if(t){var o=ce(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return se(this,n)}}function se(e,t){return!t||"object"!==ne(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ce(e){return(ce=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ue=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ie(e,t)}(l,e);var t,n,r,i=le(l);function l(){return oe(this,l),i.apply(this,arguments)}return t=l,(n=[{key:"render",value:function(){var e=this.props,t=e.org_roles,n=e.employee,r=this.props.employee,i=r.is_admin;return r.username,o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/",component:function(e){return o.a.createElement(O,re({},e,{employee:n}))}}),i&&o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/:id/edit/",component:function(e){return o.a.createElement(V,re({},e,{org_roles:t,employee:n}))}}),i&&o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/add/",component:function(e){return o.a.createElement(H,re({},e,{org_roles:t,employee:n}))}}),o.a.createElement(a.a,{exact:!0,path:"/gov/perm/role/:id/detail/",component:function(e){return o.a.createElement(te,re({},e,{org_roles:t,employee:n}))}}))}}])&&ae(t.prototype,n),r&&ae(t,r),l}(r.Component)}}]);