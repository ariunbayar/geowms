(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{71:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var a=n(0),o=n.n(a);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,n,r,s=i(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=s.call(this,e)).state={modal_status:t.props.modal_status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t}return t=m,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.modal_status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.modal_status!=e.modal_status&&(["initial","open"].includes(this.props.modal_status)&&this.handleOpen(),["closing","closed"].includes(this.props.modal_status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({modal_status:"initial"}),setTimeout((function(){e.setState({modal_status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({modal_status:"closing"}),setTimeout((function(){t.setState({modal_status:"closed"}),e?e():(t.setState({modal_status:"closed"}),t.props.modalClose&&t.props.modalClose())}),150)}},{key:"modalClose",value:function(){var e=this,t=this.props.has_button;this.setState({modal_status:"closing"}),setTimeout((function(){e.setState({modal_status:"closed"}),!t&&e.props.modalClose&&e.props.modalClose()}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.modal_status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),r="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(a.Fragment,null,o.a.createElement("div",{className:n},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content border-0 rounded-lg ".concat(this.props.modal_bg?this.props.modal_bg:"bg-light")},o.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},o.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true",onClick:function(){return e.handleClose()}},"×"))),o.a.createElement("div",{className:"d-flex justify-content-center"},this.props.modal_icon&&o.a.createElement("i",{className:"".concat(this.props.modal_icon," fa-3x my-3 animated bounceIn text-").concat(this.props.icon_color),"aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center"},o.a.createElement("h5",null,this.props.title&&this.props.title)),o.a.createElement("div",{className:"modal-body text-wrap text-center ml-2 mr-2 "},this.props.text&&("string"==typeof this.props.text?o.a.createElement("small",{className:""},this.props.text):o.a.createElement(this.props.text,this.props))),this.props.has_button?o.a.createElement("div",{className:"modal-footer border-0"},o.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn btn-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-times pr-1"}),this.props.actionNameBack?this.props.actionNameBack:"БУЦАХ"),o.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},o.a.createElement("i",{className:"fa fa-check-square-o pr-1"}),this.props.actionNameDelete?this.props.actionNameDelete:"УСТГАХ")):o.a.createElement("div",{className:"modal-body mt-3"})))),o.a.createElement("div",{className:r}))}}])&&l(t.prototype,n),r&&l(t,r),m}(a.Component)},943:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var a=n(0),o=n.n(a);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(s,e);var t,n,a,r=i(s);function s(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(t=r.call(this,e)).state={selected_value:""},t.dataSelection=t.dataSelection.bind(u(t)),t}return t=s,(n=[{key:"dataSelection",value:function(e){var t=this,n=e.target.value,a=this.props,o=a.data_list,r=a.state_name,l=a.name_key,c=a.opt_key,i=a.option_key;o.map((function(a,o){l?a[c].map((function(o,l){n==o[i]&&t.props.handleSelectField(r,a[c],e)})):n==a[i]&&t.props.handleSelectField(r,a,e)})),this.setState({selected_value:n})}},{key:"render",value:function(){var e=this,t=this.props,n=t.default_value,a=t.label,r=t.default_text,l=t.option_key,c=t.option_name,i=t.opt_key,s=t.name_key,u=t.className,m=t.data_list,f=t.option_text,d=this.state,h=a||"";return o.a.createElement("div",{className:"form-group ".concat(u||"col-md-4")},o.a.createElement("label",{id:h},h),o.a.createElement("select",{value:d.selected_value?d.selected_value:n,className:"custom-select  ".concat(!n&&"border-danger"),onChange:function(t){return e.dataSelection(t)}},o.a.createElement("option",{value:""},"---",r||""," ---"),s?m.map((function(e,t){return o.a.createElement("optgroup",{key:t,label:e[s],value:n},p(e[i],l,c,f))})):p(m,l,c,f)))}}])&&l(t.prototype,n),a&&l(t,a),s}(a.Component);function p(e,t,n,a){return e&&e.length>0&&e.map((function(e,r){return o.a.createElement("option",{key:r,name:e[n],value:e[t]},a?e[a]:e[n])}))}},954:function(e,t,n){"use strict";var a=n(0),o=n.n(a);function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],a=!0,o=!1,r=void 0;try{for(var l,c=e[Symbol.iterator]();!(a=(l=c.next()).done)&&(n.push(l.value),!t||n.length!==t);a=!0);}catch(e){o=!0,r=e}finally{try{a||null==c.return||c.return()}finally{if(o)throw r}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}t.a=function(e){var t=r(Object(a.useState)(""),2),n=t[0],l=t[1],c=r(Object(a.useState)(""),2),i=c[0],s=c[1];Object(a.useEffect)((function(){u(e.file)}),[e.file]);var u=function(e){if(e){var t=e.size;l((t/=1024).toFixed(3)),s("KB")}},m=e.file,f=e.className,p=e.default_text,d=e.accept;return o.a.createElement("div",null,o.a.createElement("div",{className:"row ".concat(f)},o.a.createElement("div",{className:"custom-file col-md-6 my-auto ml-3"},o.a.createElement("label",{className:"custom-file-label",htmlFor:"customFile"}," ",m?m.name:p),o.a.createElement("input",{type:"file",name:"file",id:"customFile",style:{display:"none"},className:"custom-file-input",onChange:function(t){return e.getFile(t)},accept:d})),o.a.createElement("div",{className:"col-md-5 d-flex flex-column ml-4"},o.a.createElement("i",null," файлын нэр:    ",m?m.name:""," "),o.a.createElement("i",null," файлын хэмжээ:  ",m&&m.name?o.a.createElement("span",null,n,"   ",i):""," "))))}},960:function(e,t,n){"use strict";n.d(t,"a",(function(){return I}));var a=n(0),o=n.n(a),r=n(110),l=n(943),c=n(954),i=n(945);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=h(e);if(t){var o=h(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?d(e):t}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(l,e);var t,n,a,r=f(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=r.call(this,e)).state={},t.handleProceed=t.handleProceed.bind(d(t)),t}return t=l,(n=[{key:"handleProceed",value:function(e,t){this.props.modal_comp_props.handleSelectedTool(e,t)}},{key:"render",value:function(){var e=this,t=this.props.list_of_datas;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12 overflow-auto text-justify my-2",style:{height:"calc(40vh - 35px - 7px)"}},o.a.createElement("table",{className:"table table_wrapper_table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," № "),o.a.createElement("th",{scope:"col"},"Багажны дугаар"),o.a.createElement("th",{scope:"col"},"Багажны марк"))),o.a.createElement("tbody",null,t?t.map((function(t,n){return o.a.createElement("tr",{key:n},o.a.createElement("td",null,n+1),o.a.createElement("td",null,o.a.createElement("a",{role:"button",className:"text-primary",onClick:function(n){return e.handleProceed(!0,t)}},t.bagaj_dugaar)),o.a.createElement("td",null,t.bagaj_mark))})):o.a.createElement("tr",null,o.a.createElement("td",null,"дата бүртгэлгүй байна"))))))}}])&&u(t.prototype,n),a&&u(t,a),l}(a.Component),b=n(71),v=n(941);function _(e){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function g(){return(g=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function E(e){return function(e){if(Array.isArray(e))return O(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return O(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return O(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function O(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function w(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function j(e,t){return(j=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function S(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=N(e);if(t){var o=N(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return x(this,n)}}function x(e,t){return!t||"object"!==_(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function N(e){return(N=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&j(e,t)}(l,e);var t,n,a,r=S(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=r.call(this,e)).state={modal_status:"closed",selected_tools:[]},t.modalOpen=t.modalOpen.bind(k(t)),t.modalChange=t.modalChange.bind(k(t)),t.handleModalOpen=t.handleModalOpen.bind(k(t)),t.handleSelectedTool=t.handleSelectedTool.bind(k(t)),t}return t=l,(n=[{key:"componentDidUpdate",value:function(e,t){var n=this.props.values,a=n.selected_tools;n.state,n.info,e.values.selected_tools!=a&&this.setState({selected_tools:a})}},{key:"handleSelectedTool",value:function(e,t,n){var a=E(this.state.selected_tools);e?a=a.concat(t):a.splice(n,1),this.props.values.handleSelectModel(a)}},{key:"handleModalOpen",value:function(e){this.modalChange("Эрх бүхий багажны жагсаалт",y,null,e,{handleSelectedTool:this.handleSelectedTool})}},{key:"modalOpen",value:function(){var e=this;this.setState({modal_status:"open"},(function(){e.setState({modal_status:"initial"})}))}},{key:"modalChange",value:function(e,t,n,a,o){this.setState({title:e,text:t,modalClose:n,list_of_datas:a,modal_comp_props:o}),this.modalOpen()}},{key:"render",value:function(){var e=this,t=this.props.values,n=t.tool_datas,a=t.info,r=t.state,l=t.selected_tools;return o.a.createElement("div",{className:"col-md-12"},o.a.createElement("label",{htmlFor:""}," Зураглал үйлдэхдээ ашигласан багаж"),o.a.createElement("div",{className:"row justify-content-center overflow-auto pl-5",style:{height:"23vh"}},o.a.createElement("table",{className:"table table-wrapper-table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," № "),o.a.createElement("th",{scope:"col"},"Багажны дугаар"),o.a.createElement("th",{scope:"col"},"Багажны марк"),o.a.createElement("th",{scope:"col"},"сертификатын дугаар"),o.a.createElement("th",{scope:"col"},"Дуусах хугацаа"))),o.a.createElement("tbody",null,l&&l.length>0?l.map((function(t,n){return o.a.createElement("tr",{key:n},o.a.createElement("th",{scope:"row"},n+1),o.a.createElement("td",null,t.bagaj_dugaar),o.a.createElement("td",null,t.bagaj_mark),o.a.createElement("td",null,t.certificate_number),o.a.createElement("td",null,t.expired_date),o.a.createElement("td",{className:"text-center mx-0 px-0"},a?null:"ИЛГЭЭСЭН"!=r&&o.a.createElement("a",{onClick:function(a){return e.handleSelectedTool(!1,t,n)}},o.a.createElement(v.a,{icon:"fa fa-minus-circle text-danger"}))))})):null))),a?null:o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("a",{type:"button",className:"btn text-primary",id:"tool_id",onClick:function(t){return e.handleModalOpen(n)}},o.a.createElement("i",{className:"fa fa-plus-circle text-success mt-2 mr-2"}," "),"Багаж сонгох"))),o.a.createElement(b.a,g({},this.state,{text:this.state.text,title:this.state.title,modalClose:this.state.modalClose,modal_status:this.state.modal_status,modal_comp_props:this.state.modal_comp_props})))}}])&&w(t.prototype,n),a&&w(t,a),l}(a.Component);function P(e){return(P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(){return(R=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function T(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function F(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function B(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=D(e);if(t){var o=D(this).constructor;n=Reflect.construct(a,arguments,o)}else n=a.apply(this,arguments);return z(this,n)}}function z(e,t){return!t||"object"!==P(t)&&"function"!=typeof t?M(e):t}function M(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function D(e){return(D=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var I=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(u,e);var t,n,a,s=B(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=s.call(this,e)).state={info:!1,desc_info:!1,state:e.state,disabled:!1,is_loading:!1,nationwide:"",form_checked:!1,investment_status:[{id:1,name:"Төсөл, хөтөлбөрийн"},{id:2,name:"Орон нутгийн"},{id:3,name:"Улсын төсвийн"},{id:4,name:"Хувийн"}]},t.handleLoaderActive=t.handleLoaderActive.bind(M(t)),t.getValueCheckbox=t.getValueCheckbox.bind(M(t)),t}return t=u,(n=[{key:"componentDidMount",value:function(){this.props.info&&this.setState({disabled:!0})}},{key:"componentDidUpdate",value:function(e,t){var n=this.props,a=n.state,o=n.geo_id;e.state!=a&&"ИЛГЭЭСЭН"==a&&this.setState({disabled:!0}),e.geo_id!==o&&("496"==o?this.setState({form_checked:!0}):this.setState({form_checked:!1}))}},{key:"handleLoaderActive",value:function(e){this.setState({is_loading:e})}},{key:"getValueCheckbox",value:function(e){var t=this.props.geo_id;1==e.target.checked?this.setState({nationwide:"496",form_checked:!0}):this.setState({nationwide:t,form_checked:!1})}},{key:"render",value:function(){var e,t,n,a,s=this,u=this.props,m=u.object_type,f=u.object_count,p=u.hurungu_oruulalt,d=u.zahialagch,h=u.project_name,y=u.vector_datas,b=u.id,v=u.info,_=u.desc_info,g=u.mergejilten,E=u.aimag_name,O=u.aimag_geom,w=u.desc,j=u.emp_fields,S=this.state.investment_status,x="";if(g)x=g;else if(j&&0<=j.length){var k;x=(null===(k=j[0])||void 0===k?void 0:k.user_id)||"Байхгүй"}return v&&p&&(S=[S[p-1]]),o.a.createElement("div",{className:"row p-3"},o.a.createElement(r.a,{is_loading:this.state.is_loading,text:"Хүсэлт илгээж байна. Түр хүлээнэ үү !!!"}),o.a.createElement("div",{className:"col-md-5"},o.a.createElement("form",{className:"form-row"},E&&!v&&o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"col-md-12 d-flex justify-content-between"},o.a.createElement("label",{htmlFor:"",className:"col-md-6 float-left px-0"},"Өгөгдлийн хамрах хүрээ"),o.a.createElement("div",{className:"col-md-6 d-flex justify-content-end align-items-center mb-1"},o.a.createElement("input",{className:"form-check-label mr-1",type:"checkbox",id:"check",checked:this.state.form_checked,onChange:function(e){return s.getValueCheckbox(e)}}),o.a.createElement("label",{htmlFor:"check",className:"my-auto"},"Улсын хэмжээнд"))),o.a.createElement("input",{className:"form-control col-md-12 mb-3  ml-1",type:"text",disabled:!0,value:E})),o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"zahialagch"},"Захиалагч байгууллага"),o.a.createElement("input",(T(e={type:"text",name:"zahialagch",id:"zahialagch",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),T(e,"value",d),T(e,"onChange",(function(e){s.props.handleOnChange(e)})),e))),o.a.createElement("div",{className:"form-group col-md-12 m-0"},o.a.createElement("label",{htmlFor:"project_name"},"Төслийн нэр"),o.a.createElement("input",(T(t={type:"text",id:"project_name",name:"project_name",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),T(t,"value",h),T(t,"onChange",(function(e){s.props.handleOnChange(e)})),t))),o.a.createElement("div",{className:"form-group col-md-6 my-4 col-sm-6"},o.a.createElement("label",{htmlFor:"object_type"},"Обьектийн төрөл"),o.a.createElement("textarea",(T(n={type:"text",name:"object_type",id:"object_type",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),T(n,"value",m),T(n,"onChange",(function(e){s.props.handleOnChange(e)})),n))),o.a.createElement("div",{className:"form-group col-md-6 col-sm-6 my-4"},o.a.createElement("label",{htmlFor:"object_count"},"Обьектийн тоо хэмжээ"),o.a.createElement("textarea",(T(a={type:"text",name:"object_count",id:"object_count",className:"form-control",disabled:this.state.disabled},"disabled",this.props.disabled),T(a,"value",f),T(a,"onChange",(function(e){s.props.handleOnChange(e)})),a))),o.a.createElement("div",{className:"form-group col-md-12 "},o.a.createElement(l.a,{state_name:"hurungu_oruulalt",label:"Хөрөнгө оруулалтын байдал",option_name:"name",option_key:"id",className:"col-md-12 px-0 mx-0",data_list:S,default_value:p,default_text:"----   хөрөнгө оруулалтын байдлыг сонгоно уу  ----",handleSelectField:this.props.handleOnChange})),v&&o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"zahialagch",className:"col-md-12 p-0"}," Мэргэжилтэн сонгох"),o.a.createElement("select",{className:"form-control",name:"mergejilten",id:"mergejilten",onChange:function(e){s.props.handleOnChange(e)},value:x},o.a.createElement("option",{value:""},"Илгээх мэргэжилтэнээ сонгоно уу "),j&&j.length>0?j.map((function(e,t){return o.a.createElement("optgroup",{id:t,label:e.org_name},o.a.createElement("option",{value:e.user_id},e.first_name))})):null)),_&&o.a.createElement("div",{className:"form-group col-md-12"},o.a.createElement("label",{htmlFor:"description-id"},"Тайлбар"),o.a.createElement("textarea",{type:"text",name:"description",id:"description-id",className:"form-control",value:w,disabled:this.state.disabled})),o.a.createElement(C,{values:this.props}),v?null:o.a.createElement("div",{className:"form-group col-md-12 ml-2"},o.a.createElement("label",null,"Орон зайн мэдээлэл"),o.a.createElement(c.a,R({},this.props,{className:"mt-2",default_text:"Файл оруулна уу",getFile:this.props.handleOnChange,accept:"zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"})))),this.props.submitClass&&o.a.createElement(this.props.submitClass,{valid_request:document.getElementsByClassName("is-valid"),nationwide:this.state.nationwide,values:this.props,mergejilten:x,loader:this.handleLoaderActive})),b&&o.a.createElement("div",{className:"col-md-7"},o.a.createElement(i.a,{vector_datas:y,height:"80vh",aimag_geom:O})))}}])&&F(t.prototype,n),a&&F(t,a),u}(a.Component)},973:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return o}));var a=function(e){return"ШИНЭ"==e?"text-success":"ШИЙДВЭРЛЭГДСЭН"==e?"text-primary":"text-warning"},o=function(e){var t;return"ХҮЛЭЭГДЭЖ БУЙ"==e?t="text-warning":"БАТАЛГААЖСАН"==e?t="text-success":"ЦУЦЛАСАН"==e||"БУЦААГДСАН"==e?t="text-danger":"ШИНЭ"==e&&(t="text-primary"),t}}}]);