(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{579:function(e,t,r){"use strict";r.d(t,"a",(function(){return m}));var n=r(0),o=r.n(n),a=r(31);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=f(e);if(t){var o=f(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return p(this,r)}}function p(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var m=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(p,e);var t,r,n,l=u(p);function p(){return i(this,p),l.apply(this,arguments)}return t=p,(r=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("i",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("i",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("i",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&c(t.prototype,r),n&&c(t,n),p}(n.Component)},957:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return se}));var n=r(0),o=r.n(n),a=r(13),l=r(53);function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var u={createRole:function(e,t,r,n){var o=c(c({},Object(l.b)()),{},{body:JSON.stringify({gov_perm_id:e,role_name:t,role_description:r,roles:n})});return fetch("".concat(p,"/create/"),o).then(l.c)},updateRole:function(e,t,r,n,o,a){var i=c(c({},Object(l.b)()),{},{body:JSON.stringify({gov_perm_id:t,role_name:r,role_description:n,remove_roles:o,add_roles:a})});return fetch("".concat(p,"/").concat(e,"/update/"),i).then(l.c)},deleteRole:function(e){var t=c({},Object(l.a)());return fetch("".concat(p,"/").concat(e,"/delete/"),t).then(l.c)},detailRole:function(e){var t=c({},Object(l.a)());return fetch("".concat(p,"/").concat(e,"/detail/"),t).then(l.c)},getRoleList:function(){var e=c({},Object(l.a)());return fetch("".concat(p,"/"),e).then(l.c)}},p="/gov/api/role";var f=r(977),m=r(76);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=g(e);if(t){var o=g(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return b(this,r)}}function b(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(l,e);var t,r,n,a=v(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={perms:e.perms,refresh:!1,"жагсаалтын_холбоос":"/gov/api/role/role-list/","нэмэх_товч":"/gov/perm/role/add/",custom_query:{},"талбарууд":[{field:"name",title:"Нэр",has_action:!0}],"хувьсах_талбарууд":[{field:"name",action:function(e){return t.detai_go_link(e)}}],"нэмэлт_талбарууд":[{title:"Засах",text:"",icon:"fa fa-pencil-square-o text-success",action:function(e){return t.go_link(e)},width:"100px"},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(e){return t.handleRemoveAction(e)},width:"100px"}],values:{},icon:"",modal_status:"closed"},t.handleRemove=t.handleRemove.bind(_(t)),t.handleRemoveAction=t.handleRemoveAction.bind(_(t)),t.handleModalOpen=t.handleModalOpen.bind(_(t)),t.modalChange=t.modalChange.bind(_(t)),t.modalOpen=t.modalOpen.bind(_(t)),t}return t=l,(r=[{key:"handleRemoveAction",value:function(e){this.setState({values:e}),this.handleModalOpen(e)}},{key:"handleModalOpen",value:function(e){this.modalChange("fa fa-exclamation-circle","warning","Тохиргоог устгах",'Та "'.concat(e.name,'" нэртэй тохиргоог устгахдаа итгэлтэй байна уу?'),!0)}},{key:"modalChange",value:function(e,t,r,n,o){this.setState({modal_icon:e,icon_color:t,title:r,text:n,has_button:o}),this.modalOpen()}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"detai_go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/detail/"))}},{key:"go_link",value:function(e){this.props.history.push("/gov/perm/role/".concat(e.id,"/edit/"))}},{key:"handleRemove",value:function(){var e=this,t=this.state.values.id;u.deleteRole(t).then((function(t){t.success?(e.setState({refresh:!e.state.refresh}),e.modalChange("fa fa-check-circle","success","Амжилттай устгалаа","",!1)):e.modalChange("fa fa-times-circle","danger","Усгахад алдаа гарлаа","",!1)}))}},{key:"render",value:function(){var e=this.state,t=e.refresh,r=e.талбарууд,n=e.жагсаалтын_холбоос,a=e.хувьсах_талбарууд,l=e.нэмэх_товч,i=e.нэмэлт_талбарууд,c=(e.values,this.props.employee.is_admin);return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(f.a,{"талбарууд":r,"жагсаалтын_холбоос":n,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":a,"нэмэх_товч":c?l:null,"нэмэлт_талбарууд":c?i:null,color:"primary",refresh:t})),o.a.createElement(m.a,{modal_status:this.state.modal_status,modal_icon:this.state.modal_icon,icon_color:this.state.icon_color,title:this.state.title,has_button:this.state.has_button,text:this.state.text,modalAction:this.handleRemove,actionNameDelete:"Устгах"}))}}])&&h(t.prototype,r),n&&h(t,n),l}(n.Component),E=r(22),S=r(36),R=r(929),k=r(579);function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(){return(j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function N(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=A(e);if(t){var o=A(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return C(this,r)}}function C(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?V(e):t}function V(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function A(e){return(A=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var I=S.c().shape({role_name:S.d().required("Нэр оруулна уу !")}),F=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(l,e);var t,r,n,a=x(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).perms=[],t.remove_perms=[],t.role=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_status:"closed",is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(V(t)),t.getAllValue=t.getAllValue.bind(V(t)),t.getValue=t.getValue.bind(V(t)),t.getRoleDetail=t.getRoleDetail.bind(V(t)),t.removeItemFromRemoveRoles=t.removeItemFromRemoveRoles.bind(V(t)),t.handleModalOpen=t.handleModalOpen.bind(V(t)),t}return t=l,(r=[{key:"handleSave",value:function(e,t){var r=this,n=t.setStatus,o=t.setSubmitting,a=t.setErrors,l=this.state.gov_perm_id,i=this.props.match.params.id;this.setState({handleSaveIsLoad:!0}),u.updateRole(i,l,e.role_name,e.role_description,this.remove_perms,this.perms).then((function(e){var t=e.success,l=e.errors;t?(r.setState({handleSaveIsLoad:!1}),r.handleModalOpen(),n("saved"),o(!1)):(a(l),o(!1))}))}},{key:"removeItemFromArray",value:function(e,t,r,n,o,a){var l=this;e.map((function(i,c){i.feature_id==t&&i.property_id==r&&i.perm_kind==n&&(a?l.remove_perms.push(o):e.splice(c,1))}))}},{key:"getAllValue",value:function(e,t,r,n,o,a,l,i){if(e&&"all"==a&&i&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(i),!e&&"all"==a&&i&&this.role.length>0&&this.removeItemFromArray(this.role,n,r,t,i,l),e&&"all"==a&&!i){var c={feature_id:n,property_id:r,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(c)}!e&&"all"==a&&!i&&this.perms.length>0&&this.removeItemFromArray(this.perms,n,r,t)}},{key:"getValue",value:function(e,t,r,n,o,a,l,i){if(!e&&l&&this.role.length>0&&null==a&&this.removeItemFromArray(this.role,n,r,t,i,l),!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,n,r,t),e&&!a&&!l||e&&"role"==a){var c={feature_id:n,property_id:r,perm_kind:t,gov_perm_inspire_id:o};"role"==a?this.role.push(c):this.perms.push(c)}l&&e&&null==a&&this.remove_perms.length>0&&this.removeItemFromRemoveRoles(i)}},{key:"removeItemFromRemoveRoles",value:function(e){var t=this;this.remove_perms.map((function(r,n){r==e&&t.remove_perms.splice(n,1)}))}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var r=t.success,n=t.role_id,o=t.role_name,a=t.role_description,l=t.roles;r&&e.setState({role_id:n,roles:l,is_continue:!0,initial_values:{role_name:o,role_description:a}})}))}},{key:"handleModalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"render",value:function(){var e=this,t=this.state,r=t.is_continue,n=t.initial_values,a=t.roles,l=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(k.a,j({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(E.e,{initialValues:n,enableReinitialize:!0,validationSchema:I,onSubmit:this.handleSave},(function(t){var n=t.errors,i=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(E.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Эрхийн нэр:"),o.a.createElement(E.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Эрхийн тайлбар:"),o.a.createElement(E.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,r&&o.a.createElement(R.default,{action_type:"editable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:l,role:a,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:i||Object.keys(n).length>0},i&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),i&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!i&&"Хадгалах")))}))),o.a.createElement(m.a,{modal_status:this.state.modal_status,modal_icon:"fa fa-check-circle",icon_color:"success",title:"Амжилттай хадгаллаа",text:"",has_button:!1,modalAction:null,modalClose:function(){return e.props.history.push("/gov/perm/role/")}}))}}])&&N(t.prototype,r),n&&N(t,n),l}(n.Component);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function B(){return(B=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function T(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function M(e,t){return(M=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function L(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=z(e);if(t){var o=z(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return q(this,r)}}function q(e,t){return!t||"object"!==D(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var U=S.c().shape({role_name:S.d().required("Нэр оруулна уу !")}),G=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&M(e,t)}(l,e);var t,r,n,a=L(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).perms=[],t.state={initial_values:{role_name:"",role_description:""},edit:!1,handleSaveIsLoad:!1,modal_status:"closed",is_continue:!1,gov_perm_id:t.props.org_roles.gov_perm_id},t.handleSave=t.handleSave.bind(J(t)),t.getValue=t.getValue.bind(J(t)),t.getAllValue=t.getAllValue.bind(J(t)),t.removeItemFromArray=t.removeItemFromArray.bind(J(t)),t.handleModalOpen=t.handleModalOpen.bind(J(t)),t}return t=l,(r=[{key:"handleSave",value:function(e,t){var r=this,n=t.setStatus,o=t.setSubmitting,a=t.setErrors,l=this.state.gov_perm_id;u.createRole(l,e.role_name,e.role_description,this.perms).then((function(e){var t=e.success,l=e.errors;t?(r.setState({handleSaveIsLoad:!1}),r.handleModalOpen(),n("saved"),o(!1)):(a(l),o(!1))}))}},{key:"handleModalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"handleUserSearch",value:function(e,t){var r,n,o;this.setState((r={},n=e,o=t.target.value,n in r?Object.defineProperty(r,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):r[n]=o,r))}},{key:"removeItemFromArray",value:function(e,t,r,n,o,a){e.map((function(o,a){o.feature_id==t&&o.property_id==r&&o.perm_kind==n&&e.splice(a,1)}))}},{key:"getAllValue",value:function(e,t,r,n,o,a,l,i){if(e&&"all"==a&&!i){var c={feature_id:n,property_id:r,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(c)}!e&&"all"==a&&!i&&this.perms.length>0&&this.removeItemFromArray(this.perms,n,r,t)}},{key:"getValue",value:function(e,t,r,n,o){if(!e&&this.perms.length>0&&this.removeItemFromArray(this.perms,n,r,t),e){var a={feature_id:n,property_id:r,perm_kind:t,gov_perm_inspire_id:o};this.perms.push(a)}}},{key:"render",value:function(){var e=this,t=this.state.initial_values,r=this.props.org_roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(k.a,B({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement(E.e,{initialValues:t,enableReinitialize:!0,validationSchema:U,onSubmit:this.handleSave},(function(t){var n=t.errors,a=(t.status,t.touched,t.isSubmitting);return t.setFieldValue,t.setStatus,t.setValues,t.handleBlur,t.values,t.isValid,t.dirty,o.a.createElement(E.d,null,o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_name"},"Role нэр:"),o.a.createElement(E.b,{name:"role_name",id:"id_role_name",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_name",component:"span"})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement(E.b,{name:"role_description",id:"id_role_description",type:"text",className:"form-control"}),o.a.createElement(E.a,{className:"text-danger",name:"role_description",component:"span"}))))),o.a.createElement("br",null),o.a.createElement("div",null,o.a.createElement(R.default,{action_type:"addable",getValue:e.getValue,sendAllValue:e.getAllValue,dontDid:!0,org_roles:r,addable_is_check:e.perms})),o.a.createElement("br",null),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{type:"submit",className:"btn gp-btn-primary",disabled:a||Object.keys(n).length>0},a&&o.a.createElement("i",{className:"fa fa-spinner fa-spin"}),a&&o.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!a&&"Хадгалах")))}))),o.a.createElement(m.a,{modal_status:this.state.modal_status,modal_icon:"fa fa-check-circle",icon_color:"success",title:"Амжилттай хадгаллаа",text:"",has_button:!1,modalAction:null,modalClose:function(){return e.props.history.push("/gov/perm/role/")}}))}}])&&T(t.prototype,r),n&&T(t,n),l}(n.Component);function H(e){return(H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function K(){return(K=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function Q(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function W(e,t){return(W=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function X(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=$(e);if(t){var o=$(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return Y(this,r)}}function Y(e,t){return!t||"object"!==H(t)&&"function"!=typeof t?Z(e):t}function Z(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function $(e){return($=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ee=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&W(e,t)}(l,e);var t,r,n,a=X(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={role_name:"",role_description:"",edit:!1,handleSaveIsLoad:!1,modal_alert_status:"closed",timer:null,is_continue:!0},t.handleSave=t.handleSave.bind(Z(t)),t.modalClose=t.modalClose.bind(Z(t)),t.getRoleDetail=t.getRoleDetail.bind(Z(t)),t}return t=l,(r=[{key:"handleSave",value:function(){this.setState({handleSaveIsLoad:!0}),this.props.match.role_name}},{key:"modalClose",value:function(){this.props.match.params.level,this.setState({handleSaveIsLoad:!1}),this.props.history.push("/gov/perm/role/"),this.setState({modal_alert_status:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;this.props.match.params.level,this.state.timer=setTimeout((function(){e.setState({handleSaveIsLoad:!1}),e.props.history.push("/gov/perm/role/"),e.setState({modal_alert_status:"closed"})}),2e3)}},{key:"componentDidMount",value:function(){this.getRoleDetail()}},{key:"getRoleDetail",value:function(){var e=this;this.setState({is_continue:!1}),u.detailRole(this.props.match.params.id).then((function(t){var r=t.success,n=t.role_name,o=t.role_description,a=t.roles;r&&e.setState({role_name:n,role_description:o,roles:a,is_continue:!0})})).catch((function(){e.props.history.goBack()}))}},{key:"render",value:function(){var e=this,t=this.state,r=t.role_name,n=t.is_continue,a=t.role_description,l=t.roles;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(k.a,K({},this.props,{name:"Буцах",navlink_url:"/gov/perm/role"})),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_id"},"Role нэр:"),o.a.createElement("input",{type:"text",className:"form-control",id:"role_id",disabled:"disabled",onChange:function(t){return e.setState({role_name:t.target.value})},value:r})),o.a.createElement("div",{className:"form-group col-md-6"},o.a.createElement("label",{htmlFor:"role_description"},"Role тайлбар:"),o.a.createElement("textarea",{type:"text",className:"form-control",disabled:"disabled",id:"role_description",onChange:function(t){return e.setState({role_description:t.target.value})},value:a}))))),o.a.createElement("br",null),o.a.createElement("div",null,n&&o.a.createElement(R.default,{dontDid:!0,org_roles:l,role_perm:l}))))}}])&&Q(t.prototype,r),n&&Q(t,n),l}(n.Component);function te(e){return(te="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function re(){return(re=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function ne(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function oe(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function ae(e,t){return(ae=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function le(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=ce(e);if(t){var o=ce(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return ie(this,r)}}function ie(e,t){return!t||"object"!==te(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ce(e){return(ce=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var se=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ae(e,t)}(i,e);var t,r,n,l=le(i);function i(){return ne(this,i),l.apply(this,arguments)}return t=i,(r=[{key:"render",value:function(){var e=this.props,t=e.org_roles,r=e.employee,n=this.props.employee,l=n.is_admin;return n.username,o.a.createElement(a.d,null,o.a.createElement(a.b,{exact:!0,path:"/gov/perm/role/",component:function(e){return o.a.createElement(O,re({},e,{employee:r}))}}),l&&o.a.createElement(a.b,{exact:!0,path:"/gov/perm/role/:id/edit/",component:function(e){return o.a.createElement(F,re({},e,{org_roles:t,employee:r}))}}),l&&o.a.createElement(a.b,{exact:!0,path:"/gov/perm/role/add/",component:function(e){return o.a.createElement(G,re({},e,{org_roles:t,employee:r}))}}),o.a.createElement(a.b,{exact:!0,path:"/gov/perm/role/:id/detail/",component:function(e){return o.a.createElement(ee,re({},e,{org_roles:t,employee:r}))}}))}}])&&oe(t.prototype,r),n&&oe(t,n),i}(n.Component)}}]);