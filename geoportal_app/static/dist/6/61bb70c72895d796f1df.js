(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{71:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var a=n(0),o=n.n(a);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,n,r,s=i(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=s.call(this,e)).state={modal_status:t.props.modal_status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t}return t=m,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.modal_status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.modal_status!=e.modal_status&&(["initial","open"].includes(this.props.modal_status)&&this.handleOpen(),["closing","closed"].includes(this.props.modal_status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({modal_status:"initial"}),setTimeout((function(){e.setState({modal_status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({modal_status:"closing"}),setTimeout((function(){t.setState({modal_status:"closed"}),e?e():(t.setState({modal_status:"closed"}),t.props.modalClose&&t.props.modalClose())}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.modal_status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),r="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(a.Fragment,null,o.a.createElement("div",{className:n},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content border-0 rounded-lg ".concat(this.props.modal_bg?this.props.modal_bg:"bg-light")},o.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},o.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true",onClick:function(){return e.handleClose()}},"×"))),o.a.createElement("div",{className:"d-flex justify-content-center"},this.props.modal_icon&&o.a.createElement("i",{className:"".concat(this.props.modal_icon," fa-3x my-3 animated bounceIn text-").concat(this.props.icon_color),"aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center"},o.a.createElement("h5",null,this.props.title&&this.props.title)),o.a.createElement("div",{className:"modal-body text-wrap text-center ml-2 mr-2 "},this.props.text&&("string"==typeof this.props.text?o.a.createElement("small",{className:""},this.props.text):o.a.createElement(this.props.text,this.props))),this.props.has_button?o.a.createElement("div",{className:"modal-footer border-0"},o.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn btn-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-times pr-1"}),this.props.actionNameBack?this.props.actionNameBack:"БУЦАХ"),o.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-check-square-o pr-1"}),this.props.actionNameDelete?this.props.actionNameDelete:"УСТГАХ")):o.a.createElement("div",{className:"modal-body mt-3"})))),o.a.createElement("div",{className:r}))}}])&&l(t.prototype,n),r&&l(t,r),m}(a.Component)},945:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var a=n(954);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c={saveRequest:function(e){var t=r(r({},Object(a.b)()),{},{body:e});return fetch("".concat(i,"/save-request/"),t).then(a.c)},handleRequestData:function(e){var t=r({},Object(a.a)());return fetch("".concat(i,"/").concat(e,"/get-request-data/"),t).then(a.c)},getToolDatas:function(e){var t=r(r({},Object(a.b)()),{},{body:JSON.stringify({regis_number:e})});return fetch("/llc/get_tool_datas/",t).then(a.c)},sendRequest:function(e,t){var n=r(r({},Object(a.b)()),{},{body:JSON.stringify({mergejilten:t})});return fetch("".concat(i,"/").concat(e,"/send-request/"),n).then(a.c)},removeRequest:function(e){var t=r({},Object(a.a)());return fetch("".concat(i,"/").concat(e,"/remove-request/"),t).then(a.c)},getSearchItems:function(){var e=r({},Object(a.a)());return fetch("".concat(i,"/get-search-field/"),e).then(a.c)}},i="/llc/backend"},954:function(e,t,n){"use strict";function a(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),a=0;a<n.length;a++){var o=n[a].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}return t}function o(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var a=n&&n.message||e.statusText;return Promise.reject(a)}return n}))}function r(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":a("csrftoken")}}}function l(){return{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}}n.d(t,"c",(function(){return o})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return l}))},956:function(e,t,n){"use strict";n.d(t,"a",(function(){return A}));var a=n(0),o=n.n(a),r=n(109),l=n(941);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=d(e);if(t){var o=d(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(l,e);var t,n,a,r=u(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=r.call(this,e)).state={},t.handleProceed=t.handleProceed.bind(f(t)),t}return t=l,(n=[{key:"handleProceed",value:function(e,t){this.props.modal_comp_props.handleSelectedTool(e,t)}},{key:"render",value:function(){var e=this,t=this.props.list_of_datas;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12 overflow-auto text-justify my-2",style:{height:"calc(40vh - 35px - 7px)"}},o.a.createElement("table",{className:"table table_wrapper_table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," № "),o.a.createElement("th",{scope:"col"},"Багажны дугаар"),o.a.createElement("th",{scope:"col"},"Багажны марк"))),o.a.createElement("tbody",null,t?t.map((function(t,n){return o.a.createElement("tr",{key:n},o.a.createElement("td",null,n+1),o.a.createElement("td",null,o.a.createElement("a",{role:"button",className:"text-primary",onClick:function(n){return e.handleProceed(!0,t)}},t.bagaj_dugaar)),o.a.createElement("td",null,t.bagaj_mark))})):o.a.createElement("tr",null,o.a.createElement("td",null,"дата бүртгэлгүй байна"))))))}}])&&i(t.prototype,n),a&&i(t,a),l}(a.Component),h=n(71),b=n(938);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(){return(v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function g(e){return function(e){if(Array.isArray(e))return _(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return _(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function E(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function j(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=N(e);if(t){var o=N(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return w(this,n)}}function w(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function N(e){return(N=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var x=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}(l,e);var t,n,a,r=j(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=r.call(this,e)).state={modal_status:"closed",selected_tools:[]},t.modalOpen=t.modalOpen.bind(k(t)),t.modalChange=t.modalChange.bind(k(t)),t.handleModalOpen=t.handleModalOpen.bind(k(t)),t.handleSelectedTool=t.handleSelectedTool.bind(k(t)),t}return t=l,(n=[{key:"componentDidUpdate",value:function(e,t){var n=this.props.values,a=n.selected_tools;n.state,n.info,e.values.selected_tools!=a&&this.setState({selected_tools:a})}},{key:"handleSelectedTool",value:function(e,t,n){var a=g(this.state.selected_tools);e?a=a.concat(t):a.splice(n,1),this.props.values.handleSelectModel(a)}},{key:"handleModalOpen",value:function(e){this.modalChange("Эрх бүхий багажны жагсаалт",p,null,e,{handleSelectedTool:this.handleSelectedTool})}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"modalChange",value:function(e,t,n,a,o){this.setState({title:e,text:t,modalClose:n,list_of_datas:a,modal_comp_props:o}),this.modalOpen()}},{key:"render",value:function(){var e=this,t=this.props.values,n=t.tool_datas,a=t.info,r=t.state,l=t.selected_tools;return o.a.createElement("div",{className:"col-md-12"},o.a.createElement("label",{htmlFor:""}," Зураглал үйлдэхдээ ашигласан багаж"),o.a.createElement("div",{className:"row justify-content-center overflow-auto pl-5",style:{height:"23vh"}},o.a.createElement("table",{className:"table table-wrapper-table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," № "),o.a.createElement("th",{scope:"col"},"Багажны дугаар"),o.a.createElement("th",{scope:"col"},"Багажны марк"),o.a.createElement("th",{scope:"col"},"сертификатын дугаар"),o.a.createElement("th",{scope:"col"},"Дуусах хугацаа"))),o.a.createElement("tbody",null,l&&l.length>0?l.map((function(t,n){return o.a.createElement("tr",{key:n},o.a.createElement("th",{scope:"row"},n+1),o.a.createElement("td",null,t.bagaj_dugaar),o.a.createElement("td",null,t.bagaj_mark),o.a.createElement("td",null,t.certificate_number),o.a.createElement("td",null,t.expired_date),o.a.createElement("td",{className:"text-center mx-0 px-0"},a?null:"ИЛГЭЭСЭН"!=r&&o.a.createElement("a",{onClick:function(a){return e.handleSelectedTool(!1,t,n)}},o.a.createElement(b.a,{icon:"fa fa-minus-circle text-danger"}))))})):null))),a?null:o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("a",{type:"button",className:"btn text-primary",id:"tool_id",onClick:function(t){return e.handleModalOpen(n)}},o.a.createElement("i",{className:"fa fa-plus-circle text-success mt-2 mr-2"}," "),"Багаж сонгох"))),o.a.createElement(h.a,v({},this.state,{text:this.state.text,title:this.state.title,modalClose:this.state.modalClose,modal_status:this.state.modal_status,modal_comp_props:this.state.modal_comp_props})))}}])&&E(t.prototype,n),a&&E(t,a),l}(a.Component);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function C(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function P(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=D(e);if(t){var o=D(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return F(this,n)}}function F(e,t){return!t||"object"!==S(t)&&"function"!=typeof t?q(e):t}function q(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var A=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(i,e);var t,n,a,c=T(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).state={info:!1,desc_info:!1,state:e.state,disabled:!1,is_loading:!1,nationwide:"",form_checked:!1},t.handleLoaderActive=t.handleLoaderActive.bind(q(t)),t.getValueCheckbox=t.getValueCheckbox.bind(q(t)),t}return t=i,(n=[{key:"componentDidMount",value:function(){this.props.info&&this.setState({disabled:!0})}},{key:"componentDidUpdate",value:function(e,t){var n=this.props,a=n.state,o=n.geo_id;e.state!=a&&"ИЛГЭЭСЭН"==a&&this.setState({disabled:!0}),e.geo_id!==o&&("496"==o?this.setState({form_checked:!0}):this.setState({form_checked:!1}))}},{key:"handleLoaderActive",value:function(e){this.setState({is_loading:e})}},{key:"getValueCheckbox",value:function(e){var t=this.props.geo_id;1==e.target.checked?this.setState({nationwide:"496",form_checked:!0}):this.setState({nationwide:t,form_checked:!1})}},{key:"render",value:function(){var e,t,n,a,c,i,s,u=this,m=this.props,f=m.object_type,d=m.object_count,p=m.hurungu_oruulalt,h=m.zahialagch,b=m.project_name,y=m.vector_datas,v=m.id,g=m.file_name,_=m.info,E=(m.state,m.desc_info),O=m.aimag_name,j=m.aimag_geom,w=m.desc,k=m.emp_fields,N=m.mergejilten,S="";return N?S=N:k&&0<=k.length&&(S=k[0].mail),o.a.createElement("div",{className:"row p-3"},o.a.createElement(r.a,{is_loading:this.state.is_loading,text:"Хүсэлт илгээж байна. Түр хүлээнэ үү !!!"}),o.a.createElement("div",{className:"col-md-5"},o.a.createElement("form",{className:"form-row"},O&&!_&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"col-md-12 d-flex justify-content-between"},o.a.createElement("label",{htmlFor:"",className:"col-md-6 float-left px-0"},"Өгөгдлийн хамрах хүрээ"),o.a.createElement("div",{className:"col-md-6 d-flex justify-content-end align-items-center mb-1"},o.a.createElement("input",{className:"form-check-label mr-1",type:"checkbox",id:"check",checked:this.state.form_checked,onChange:function(e){return u.getValueCheckbox(e)}}),o.a.createElement("label",{htmlFor:"check",className:"my-auto"},"Улсын хэмжээнд"))),o.a.createElement("input",{className:"form-control col-md-12 mb-3  ml-1",type:"text",disabled:!0,value:O})),o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"zahialagch"},"Захиалагч байгууллага"),o.a.createElement("input",(C(e={type:"text",name:"zahialagch",id:"zahialagch",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),C(e,"value",h),C(e,"onChange",(function(e){u.props.handleOnChange(e)})),e))),o.a.createElement("div",{className:"form-group col-md-12 m-0"},o.a.createElement("label",{htmlFor:"project_name"},"Төслийн нэр"),o.a.createElement("input",(C(t={type:"text",id:"project_name",name:"project_name",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),C(t,"value",b),C(t,"onChange",(function(e){u.props.handleOnChange(e)})),t))),o.a.createElement("div",{className:"form-group col-md-6 my-4 col-sm-6"},o.a.createElement("label",{htmlFor:"object_type"},"Обьектийн төрөл"),o.a.createElement("textarea",(C(n={type:"text",name:"object_type",id:"object_type",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),C(n,"value",f),C(n,"onChange",(function(e){u.props.handleOnChange(e)})),n))),o.a.createElement("div",{className:"form-group col-md-6 col-sm-6 my-4"},o.a.createElement("label",{htmlFor:"object_count"},"Обьектийн тоо хэмжээ"),o.a.createElement("textarea",(C(a={type:"text",name:"object_count",id:"object_count",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),C(a,"value",d),C(a,"onChange",(function(e){u.props.handleOnChange(e)})),a))),o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"hurungu_oruulalt"}," Хөрөнгө оруулалтын байдал "),o.a.createElement("textarea",(C(c={name:"hurungu_oruulalt",rows:"3",id:"hurungu_oruulalt",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),C(c,"value",p),C(c,"onChange",(function(e){u.props.handleOnChange(e)})),c))),_&&o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"zahialagch",className:"col-md-12 p-0"}," Мэргэжилтэн сонгох"),o.a.createElement("select",{className:"form-control",name:"mergejilten",id:"mergejilten",onChange:function(e){u.props.handleOnChange(e)},value:S},o.a.createElement("option",{value:""},"Илгээх мэргэжилтэнээ сонгоно уу "),k&&k.length>0?k.map((function(e,t){return o.a.createElement("optgroup",{id:t,label:e.org_name},o.a.createElement("option",{value:e.mail},e.first_name))})):null)),E&&o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"description-id"},"Тайлбар"),o.a.createElement("textarea",{type:"text",name:"description",id:"description-id",className:"form-control",value:w,disabled:this.state.disabled})),o.a.createElement(x,{values:this.props}),_?null:o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"choose",className:"col-md-12"},"Орон зайн мэдээлэл"),o.a.createElement("label",(C(i={htmlFor:"choose-file",id:"choose",className:"custom-file-upload col-md-6 text-center ".concat(g?"":"border-danger")},"id","choose-file-label"),C(i,"data-toggle","toolpit"),C(i,"data-placement","top"),C(i,"title",g||"файл сонгогдоогүй байна "),i),"файл оруулах"),o.a.createElement("input",(C(s={type:"file",accept:"zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed",name:"uploadDocument"},"type","file"),C(s,"id","choose-file"),C(s,"name","files"),C(s,"onChange",(function(e){return u.props.handleOnChange(e)})),C(s,"style",{display:"none"}),s)),g&&o.a.createElement("small",{className:"col-md-5 ml-2"},g))),this.props.submitClass&&o.a.createElement(this.props.submitClass,{valid_request:document.getElementsByClassName("is-valid"),nationwide:this.state.nationwide,values:this.props,mergejilten:S,loader:this.handleLoaderActive})),v&&o.a.createElement("div",{className:"col-md-7"},o.a.createElement(l.a,{vector_datas:y,height:"80vh",aimag_geom:j})))}}])&&P(t.prototype,n),a&&P(t,a),i}(a.Component)},964:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return o}));var a=function(e){return"ШИНЭ"==e?"text-success":"ШИЙДВЭРЛЭГДСЭН"==e?"text-primary":"text-warning"},o=function(e){var t;return"ХҮЛЭЭГДЭЖ БУЙ"==e?t="text-warning":"БАТАЛГААЖСАН"==e?t="text-success":"ЦУЦЛАСАН"==e||"БУЦААГДСАН"==e?t="text-danger":"ШИНЭ"==e&&(t="text-primary"),t}}}]);