(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{1117:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return O}));var a=n(0),o=n.n(a),i=n(31),r=n(977),l=n(76),s=n(1125),c=n(485),u=n(246);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function m(e,t,n){return t&&h(e.prototype,t),n&&h(e,n),e}function p(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=g(e);if(t){var o=g(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var k=function(e){p(n,e);var t=y(n);function n(e){var a;return f(this,n),(a=t.call(this,e)).state={},a}return m(n,[{key:"render",value:function(){var e=this,t=this.props.values;if("ШИЙДВЭРЛЭГДСЭН"==t.state)var n="d-none";return o.a.createElement("div",{className:"p-0"},("БУЦААГДСАН"==t.kind||"ЦУЦЛАСАН"==t.kind)&&o.a.createElement("div",{className:"p-0 d-flex justify-content-between btn-group"},o.a.createElement(i.c,{type:"button",to:"/media/"+t.file_path,target:"_blank",className:"btn animated bounceIn text-light bg-danger ".concat(n),style:{padding:4,backgroundColor:"#fd355е",borderColor:"#fd355е",borderRadius:".25rem"}},o.a.createElement("i",{className:"fa fa-download"},"   Татах")),o.a.createElement("button",{className:"btn border rounded animated bounceIn text-light ".concat(!n&&"mx-1"),style:{padding:4,backgroundColor:"#ff9700",borderColor:"#ff9700",borderRadius:".25rem"},onClick:function(){return e.props.infoModal(t)}},o.a.createElement("i",{className:"fa fa-info-circle"},"   Тайлбар"))))}}]),n}(a.Component),O=function(t){p(i,t);var n=y(i);function i(e){var t;return f(this,i),(t=n.call(this,e)).state={refresh:!1,"талбарууд":[{field:"client_org",title:"Захиалагч байгууллага"},{field:"state",title:"Төлөв",has_action:!0},{field:"kind",title:"Өөрчлөлт",has_action:!0},{field:"created_at",title:"Үүсгэсэн"},{field:"updated_at",title:"Шинэчилсэн"}],"жагсаалтын_холбоос":"/llc/backend/".concat(!0,"/llc-request-list/"),"хувьсах_талбарууд":[{field:"state",action:function(e){return Object(u.e)(e)},action_type:!0},{field:"kind",action:function(e){return Object(u.d)(e)},action_type:!0}],"нэмэлт_талбарууд":[{title:"дэлгэрэнгүй",text:"",icon:"fa fa-eye text-primary",action:function(e){return t.handleUpdateAction(e)}},{title:"Илгээх",component:s.a,props:{refreshData:function(){return t.refreshData()},modal_status:t.modal_status}},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(e){return t.handleRemoveAction(e)}},{title:"",component:k,props:{infoModal:function(e){return t.infoModal(e)}}}],state:"",kind:"",modal_status:"closed",request_form:!1,choices:[]},t.refreshData=t.refreshData.bind(_(t)),t.handleUpdateAction=t.handleUpdateAction.bind(_(t)),t.infoModal=t.infoModal.bind(_(t)),t.modalChange=t.modalChange.bind(_(t)),t.modalOpen=t.modalOpen.bind(_(t)),t.handleRemove=t.handleRemove.bind(_(t)),t.handleRemoveAction=t.handleRemoveAction.bind(_(t)),t}return m(i,[{key:"componentDidMount",value:function(){var e=this;c.a.getSearchItems().then((function(t){var n=t.success,a=t.search_field;n&&e.setState({choices:a})}))}},{key:"handleUpdateAction",value:function(e){this.props.history.push("/llc/llc-request/".concat(e.id,"/дэлгэрэнгүй/"))}},{key:"modalChange",value:function(e,t,n,a,o,i){this.setState({modal_icon:e,icon_color:t,title:n,text:a,has_button:o,description:i}),this.modalOpen()}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"refreshData",value:function(){this.setState({refresh:!this.state.refresh})}},{key:"handleSearch",value:function(e,t){var n=Object(),a=parseInt(e.target.value);"state"==t?(e.target.value?n.state=a:delete n.state,this.state.kind&&(n.kind=this.state.kind)):(a&&(n.kind=a),this.state.state&&(n.state=this.state.state)),this.setState(function(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}({custom_query:n},t,a))}},{key:"infoModal",value:function(e){this.modalChange("fa fa-info-circle","warning","Тайлбар",E,!1,e.description)}},{key:"handleRemoveAction",value:function(e){this.setState({values:e}),this.handleModalOpen(e)}},{key:"handleModalOpen",value:function(t){this.setState({values:t});var n="БУЦААГДСАН",a={modal_status:"open",title:"Устгах хүсэлт",icon_color:"warning",modal_icon:"fa fa-exclamation-circle"};if(n!=t.kind&&"ИЛГЭЭСЭН"!=t.state)a.text="Та хүсэлтийг устгахдаа итгэлтай байна уу ",a.has_button=!0,a.actionNameBack="Буцах",a.actionNameDelete="Устгах",a.modalAction=this.handleRemove;else{var o="ИЛГЭЭСЭН";t.kind==n&&(o=n),a.text="Энэхүү хүсэлт ".concat(o," байгаа тул устгах боломжгүй")}e.MODAL(a)}},{key:"handleRemove",value:function(){var t=this,n=this.state.values.id;c.a.removeRequest(n).then((function(n){var a=n.success,o=n.info;if(console.log(),a){var i={modal_status:"open",modal_icon:"fa fa-check-circle",icon_color:"success",title:o};e.MODAL(i),t.refreshData()}else{var r={modal_status:"open",modal_icon:"fa fa-times-circle",icon_color:"danger",title:o};e.MODAL(r)}}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.талбарууд,i=t.жагсаалтын_холбоос,s=t.хувьсах_талбарууд,c=t.нэмэлт_талбарууд,u=t.refresh,d=t.choices;return o.a.createElement(a.Fragment,null,o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"col-md-12 row mb-4"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Төлөв"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.handleSearch(t,"state")}},o.a.createElement("option",{value:""},"--- Төлөвөөр хайх ---"),null!=d&&d.state?d.state.map((function(e,t){return o.a.createElement("option",{key:t,name:"state",value:e[0]},e[1])})):null)),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Өөрчлөлт"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.handleSearch(t,"kind")}},o.a.createElement("option",{value:""},"--- Өөрчлөлтөөр хайх ---"),null!=d&&d.kind?d.kind.map((function(e,t){return o.a.createElement("option",{key:t,name:"kind",value:e[0]},e[1])})):null))),o.a.createElement("div",{className:"col-md-12"},o.a.createElement(r.a,{refresh:u,color:"primary","талбарууд":n,"жагсаалтын_холбоос":i,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":s,"нэмэлт_талбарууд":c,"нэмэх_товч":"/llc/llc-request/хүсэлт-нэмэх/",custom_query:this.state.custom_query,"хайлт":"closed",max_data:"closed"}))),o.a.createElement(l.a,{modal_status:this.state.modal_status,modal_icon:this.state.modal_icon,icon_color:this.state.icon_color,title:this.state.title,has_button:this.state.has_button,text:this.state.text,actionNameBack:this.state.actionNameBack,actionNameDelete:this.state.actionNameDelete,description:this.state.description})))}}]),i}(a.Component);function E(e){return o.a.createElement("span",{className:"text-center"},e.description)}}).call(this,n(49))},1125:function(e,t,n){"use strict";n.d(t,"a",(function(){return M}));var a=n(0),o=n.n(a),i=n(485),r=n(1006),l=n(119);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?h(e):t}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(s,e);var t,n,i,r=d(s);function s(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(t=r.call(this,e)).state={status:t.props.status||"initial",is_loading:!1},t.handleOpen=t.handleOpen.bind(h(t)),t.handleClose=t.handleClose.bind(h(t)),t.handleIsload=t.handleIsload.bind(h(t)),t.handleProceed=t.handleProceed.bind(h(t)),t}return t=s,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"handleIsload",value:function(e){this.setState({is_loading:e})}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(cthis.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleProceed",value:function(e,t){this.props.modalAction(e,t)}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),t.props.closeRequestMap()}),150)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),i="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(a.Fragment,null,o.a.createElement("div",{className:n+" ml-3 pl-4 mt-4 pt-4 rounded text-wrap position-fixed",tabIndex:"-1",role:"dialog","aria-labelledby":"exampleModalCenterTitle","aria-hidden":"true"},o.a.createElement("div",{className:"col-md-8 d-flex justify-content-center container align-center align-self-center"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"modal-content animated row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement(l.a,{is_loading:this.state.is_loading}),o.a.createElement("div",{className:"row mt-2",style:{background:"white"},onClick:function(){return e.handleClose()}},o.a.createElement("div",{className:"col-md-11"},o.a.createElement("h5",{className:"text-center text-justify"},"Хүсэлт илгээх")),o.a.createElement("div",{className:"col-md-1"},o.a.createElement("button",{type:"button",className:"close float-right","data-dismiss":"modal","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true"},"×")))),o.a.createElement("div",{className:"row"},this.props.body?o.a.createElement(this.props.body,{values:this.props,handleIsload:this.handleIsload,closeRequestMap:this.props.closeRequestMap}):null)))))),o.a.createElement("div",{className:i}))}}])&&c(t.prototype,n),i&&c(t,i),s}(a.Component),b=n(76);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(){return(v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function _(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function g(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function k(e,t,n){return t&&g(e.prototype,t),n&&g(e,n),e}function O(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&E(e,t)}function E(e,t){return(E=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=w(e);if(t){var o=w(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return C(this,n)}}function C(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?j(e):t}function j(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var N=function(e){O(n,e);var t=S(n);function n(e){var a;return _(this,n),(a=t.call(this,e)).state={url:"/llc/llc-request/",modal_status:"closed",is_loading:!1},a.handleSubmit=a.handleSubmit.bind(j(a)),a.modalClose=a.modalClose.bind(j(a)),a.modalOpen=a.modalOpen.bind(j(a)),a.handleModalOpen=a.handleModalOpen.bind(j(a)),a}return k(n,[{key:"handleModalOpen",value:function(){this.modalChange("fa fa-info-circle","warning","Хүсэлт илгээхдээ итгэлтэй байна уу?","",!0,"Үгүй","Тийм")}},{key:"handleSubmit",value:function(){var e=this,t=this.props.values.id,n=this.props.mergejilten;this.props.loader(!0),i.a.sendRequest(t,n).then((function(t){var n=t.success,a=t.info;n?(e.props.loader(!1),e.modalChange("fa fa-check-circle","success","Амжилттай",a,!1,"","",null)):e.modalChange("fa fa-times-circle","danger","Алдаа гарлаа",a,!1,"","",null)}))}},{key:"modalClose",value:function(){var e=this.props.values;this.setState({modal_status:"closed"}),e.closeRequestMap()}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"modalChange",value:function(e,t,n,a,o,i,r){var l=this;this.setState({modal_icon:e,icon_color:t,title:n,text:a,has_button:o,actionNameBack:i,actionNameDelete:r},(function(){l.modalOpen()}))}},{key:"render",value:function(){var e=this,t=this.props.values,n=this.state;n.url,n.is_loading;return o.a.createElement("div",{className:"row ml-2 my-4"},o.a.createElement("p",{className:"btn btn-secondary"},o.a.createElement("i",{className:"fa fa-angle-double-left",onClick:function(){return t.closeRequestMap()}},"Буцах")),"         ",o.a.createElement("p",{className:"btn btn-primary",onClick:function(){return e.handleModalOpen()}},o.a.createElement("i",{className:"fa"}," Хүсэлт илгээх")),o.a.createElement(b.a,{modal_status:this.state.modal_status,modal_icon:this.state.modal_icon,modal_bg:this.state.modal_bg,icon_color:this.state.icon_color,title:this.state.title,text:this.state.text,has_button:this.state.has_button,actionNameBack:this.state.actionNameBack,actionNameDelete:this.state.actionNameDelete,modalAction:this.handleSubmit,modalClose:this.modalClose}))}}]),n}(a.Component),R=function(e){O(n,e);var t=S(n);function n(e){var a;return _(this,n),(a=t.call(this,e)).state={files:[],project_name:"",object_type:"",object_count:"",hurungu_oruulalt:"",zahialagch:"",vector_datas:[],aimag_name:"",aimag_geom:[],selected_tools:[],mergejilten:"",is_loading:!1},a.handleOnChange=a.handleOnChange.bind(j(a)),a}return k(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.values.field.id;this.setState({is_loading:!0}),i.a.handleRequestData(t).then((function(t){var n=t.vector_datas,a=t.form_field,o=t.emp_fields,i=t.aimag_name,r=t.aimag_geom;a&&e.setState({files:a.file_path,zahialagch:a.client_org,project_name:a.project_name,object_type:a.object_type,object_count:a.object_quantum,hurungu_oruulalt:a.investment_status,selected_tools:a.selected_tools,vector_datas:n,aimag_name:i,aimag_geom:r,emp_fields:o,is_loading:!1}),e.props.handleIsload(!1)}))}},{key:"handleOnChange",value:function(e,t,n){this.setState({mergejilten:t.user_id})}},{key:"render",value:function(){var e=this.props.values.field.id;return function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(this.state),o.a.createElement("div",{className:"col-md-12"},o.a.createElement(l.a,{is_loading:this.state.is_loading}),o.a.createElement("div",{className:"row mt-2",style:{background:"white"}},o.a.createElement(r.a,v({id:e},this.state,{submitClass:N,closeRequestMap:this.props.closeRequestMap,info:this.props.values.info,handleOnChange:this.handleOnChange}))))}}]),n}(a.Component),M=function(e){O(n,e);var t=S(n);function n(e){var a;return _(this,n),(a=t.call(this,e)).state={values:e.values,icon:a.props.icon,modal_status:"closed",state:e.values.state,kind:e.values.kind,invis:!1},a.openRequestModal=a.openRequestModal.bind(j(a)),a.closeRequestMap=a.closeRequestMap.bind(j(a)),a}return k(n,[{key:"componentDidMount",value:function(){"ЦУЦЛАСАН"==this.state.kind&&this.setState({invis:!0})}},{key:"openRequestModal",value:function(){this.setState({modal_status:"open"})}},{key:"closeRequestMap",value:function(){this.setState({modal_status:"closed"}),this.props.refreshData()}},{key:"render",value:function(){var e=this.state,t=e.values,n=e.modal_status,a=(e.state,e.kind,e.invis);return o.a.createElement("div",{className:"col-md-12 "},a?null:"ИЛГЭЭСЭН"!=t.state||"ХҮЛЭЭГДЭЖ БУЙ"!=t.kind?o.a.createElement("a",{className:"fa fa-paper-plane-o text-primary mt-2 ml-2",onClick:this.openRequestModal}):o.a.createElement("a",{className:"fa fa-check text-success mt-2 ml-2"}),"open"==n&&o.a.createElement(p,{body:R,field:t,status:n,modal_dialog:!0,modal_bg:"white",info:!0,title:"Хүсэлт Илгээх",closeRequestMap:this.closeRequestMap}))}}]),n}(a.Component)},972:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return P}));var a=n(0),o=n.n(a),i=n(13),r=n(1117),l=n(1006),s=n(485),c=n(76),u=n(119);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(){return(f=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function b(e,t,n){return t&&p(e.prototype,t),n&&p(e,n),e}function y(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=O(e);if(t){var o=O(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return g(this,n)}}function g(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function O(e){return(O=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var E=function(e){y(n,e);var t=_(n);function n(e){var a;return m(this,n),(a=t.call(this,e)).state={url:"/llc/llc-request/",agreed_submit:!1,one_check:!0,show_save_btn:!0},a.handleSubmit=a.handleSubmit.bind(k(a)),a}return b(n,[{key:"componentDidUpdate",value:function(e,t){var n=this.props,a=n.valid_request,o=n.values,i=document.getElementsByClassName("form-control");a.length==i.length&&this.state.one_check&&this.setState({agreed_submit:!0,one_check:!1}),e.values.kind!==o.kind&&("БУЦААГДСАН"!=o.kind&&"ЦУЦЛАСАН"!=o.kind||this.setState({info_status:!0})),e.values.state!==o.state&&("ИЛГЭЭСЭН"!=o.kind&&"ХҮЛЭЭГДЭЖ БУЙ"!=o.kind&&"ШИЙДВЭРЛЭГДСЭН"!=o.state||this.setState({show_save_btn:!1}))}},{key:"handleSubmit",value:function(){var e=this,t=this.props.values,n=t.files,a=t.project_name,o=t.object_type,i=t.object_count,r=t.hurungu_oruulalt,l=t.zahialagch,c=t.selected_tools,u=t.id,d=t.file_state,f=[],h=n[0];if(u)if(d)f=h;else{var m=h;f=new Blob([JSON.stringify(m,null,2)],{type:"application/vnd.rar"})}else f=h;var p=new FormData;p.append("files",f,h.name),p.append("id",JSON.stringify({id:u})),p.append("project_name",a),p.append("object_type",o),p.append("object_count",i),p.append("hurungu_oruulalt",r),p.append("zahialagch",l),p.append("ulsiin_hemjeend",this.props.nationwide?this.props.nationwide:""),p.append("selected_tools",JSON.stringify({selected_tools:c})),this.props.values.enableLoader(!0),s.a.saveRequest(p).then((function(t){var n=t.success,a=t.info;e.props.values.handlePassValues(n,a)}))}},{key:"render",value:function(){var e=this,t=this.props.values,n=this.state,i=n.agreed_submit,r=n.show_save_btn;return o.a.createElement(a.Fragment,null,t.id?o.a.createElement("div",{className:"col-md-8 mt-2 "},o.a.createElement("button",{className:"btn btn-secondary btn-sm"},o.a.createElement("i",{className:"fa fa-angle-double-left",onClick:function(){return t.history.push(e.state.url)}},"Буцах")),"        ",r?o.a.createElement("button",{className:"btn btn-primary btn-sm",onClick:function(){return e.handleSubmit()},disabled:!t.files.length>0},o.a.createElement("i",{className:"fa"}," Хадгалах")):null):o.a.createElement("button",{type:"button",disabled:!i||!t.file_name||"",className:"btn btn-primary col-12 ".concat(t.id>0?"invisible":""),onClick:function(){return e.handleSubmit()}},o.a.createElement("i",{className:"fa fa-envelope-open-o"}," Хүсэлт үүсгэх")))}}]),n}(a.Component),S=function(e){y(n,e);var t=_(n);function n(e){var a;return m(this,n),(a=t.call(this,e)).list=[],a.state=h({files:[],project_name:"",object_type:"",object_count:"",hurungu_oruulalt:1,zahialagch:"",modal_status:"closed",vector_datas:[],tool_datas:[],selected_tools:[],file_name:"",state:"",file_state:!1,aimag_name:"",aimag_geom:[],kind:""},"state",""),a.handleOnChange=a.handleOnChange.bind(k(a)),a.handlePassValues=a.handlePassValues.bind(k(a)),a.modalChange=a.modalChange.bind(k(a)),a.getTools=a.getTools.bind(k(a)),a.handleSelectModel=a.handleSelectModel.bind(k(a)),a.handleModalClose=a.handleModalClose.bind(k(a)),a.modalClose=a.modalClose.bind(k(a)),a.handleModalOpen=a.handleModalOpen.bind(k(a)),a.enableLoader=a.enableLoader.bind(k(a)),a.getFile=a.getFile.bind(k(a)),a}return b(n,[{key:"componentDidMount",value:function(){var e=this,t=this.props.match.params.id;t&&(this.setState({is_loading:!0}),s.a.handleRequestData(t).then((function(t){var n=t.vector_datas,a=t.form_field,o=t.emp_fields,i=t.aimag_name,r=t.aimag_geom;a&&e.setState({vector_datas:n,aimag_name:i,aimag_geom:r,zahialagch:a.client_org,project_name:a.project_name,object_type:a.object_type,object_count:a.object_quantum,hurungu_oruulalt:a.investment_status,selected_tools:a.selected_tools,files:a.file_path,state:a.state,kind:a.kind,desc:a.desc,geo_id:a.geo_id,emp_fields:o,mergejilten:a.selected_user,is_loading:!1})}))),this.getTools()}},{key:"getTools",value:function(){var e=this;s.a.getToolDatas().then((function(t){var n=t.tool_datas;e.setState({tool_datas:n})}))}},{key:"handleSelectModel",value:function(e){this.setState({selected_tools:e})}},{key:"handleOnChange",value:function(e,t){var n="",a="";t?(n=e,a=t.id):(n=e.target.name,a=e.target.value),this.validationForm(),this.setState(h({},n,a))}},{key:"getFile",value:function(e){var t=this.props.match.params.id,n=this.state,a=n.file_name,o=n.file_state,i=e[0];e&&e.length>0&&(a=i.name),t&&(o=!0),this.setState({files:e,file_name:a,file_state:o})}},{key:"validationForm",value:function(){for(var e=document.getElementsByClassName("form-control"),t=0;t<e.length;t++){var n=e[t];""==n.value?n.classList.add("is-invalid"):(n.classList.remove("is-invalid"),n.classList.add("is-valid"))}}},{key:"handleModalClose",value:function(){this.props.history.push("/llc/llc-request/")}},{key:"modalClose",value:function(){this.setState({modal_status:"closed"})}},{key:"handleModalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"handlePassValues",value:function(e,t,n){this.enableLoader(!1),n?this.modalChange("","fa fa-info-circle","warning","Тайлбар",t,!1,"",this.setState({modal_status:"closed"})):e?this.modalChange("","fa fa-check-circle","success","Амжилттай",t,!1,"",this.handleModalClose):this.modalChange("","fa fa-times-circle","danger","Алдаа гарлаа",t,!1,"",this.modalClose)}},{key:"modalChange",value:function(e,t,n,a,o,i,r,l){this.setState({action_type:e,modal_icon:t,icon_color:n,title:a,text:o,has_button:i,action_name:r,modalClose:l}),this.handleModalOpen()}},{key:"enableLoader",value:function(e){this.setState({is_loading:e})}},{key:"render",value:function(){var e=this.props.match.params,t=e.id,n=e.info;return o.a.createElement("div",{className:"card"},o.a.createElement(u.a,{is_loading:this.state.is_loading}),o.a.createElement("div",{className:"card-body"},o.a.createElement(l.a,f({id:t},this.state,{handleOnChange:this.handleOnChange,submitClass:E,handlePassValues:this.handlePassValues,history:this.props.history,info:n,handleSelectModel:this.handleSelectModel,enableLoader:this.enableLoader,getFile:this.getFile}))),o.a.createElement(c.a,{modal_status:this.state.modal_status,modal_icon:this.state.modal_icon,modal_bg:this.state.modal_bg,icon_color:this.state.icon_color,title:this.state.title,text:this.state.text,has_button:this.state.has_button,actionNameBack:this.state.actionNameBack,actionNameDelete:this.state.actionNameDelete,modalAction:this.state.modalAction,modalClose:this.state.modalClose}))}}]),n}(a.Component);function C(e){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(){return(j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function w(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function R(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=x(e);if(t){var o=x(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return M(this,n)}}function M(e,t){return!t||"object"!==C(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var P=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&N(e,t)}(s,e);var t,n,a,l=R(s);function s(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),l.call(this,e)}return t=s,(n=[{key:"render",value:function(){var e=this;return o.a.createElement(i.d,null,o.a.createElement(i.b,{exact:!0,path:"/llc/llc-request/",component:r.a}),o.a.createElement(i.b,{path:"/llc/llc-request/хүсэлт-нэмэх/",render:function(e){return o.a.createElement(S,e)}}),o.a.createElement(i.b,{path:"/llc/llc-request/:id/дэлгэрэнгүй/",render:function(t){return o.a.createElement(S,j({},t,{values:e.props,info:!1}))}}))}}])&&w(t.prototype,n),a&&w(t,a),s}(a.Component)}}]);