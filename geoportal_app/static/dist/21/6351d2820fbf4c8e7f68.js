(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{187:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var r=n(0),o=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function l(e,t){return(l=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=f(e);if(t){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function u(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?s(e):t}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&l(e,t)}(u,e);var t,n,r,a=i(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=a.call(this,e)).alerts=[],t.total=[],t.array=[],t.key=0,t.state={},t.loadNotif=t.loadNotif.bind(s(t)),t}return t=u,(n=[{key:"componentDidUpdate",value:function(e){e.too!==this.props.too&&this.loadNotif()}},{key:"loadNotif",value:function(){var e=this.total.length,t=this.props,n=t.too,r=t.style,a=t.msg,c="list-group-item rounded animated slideInLeft";this.props.show&&(this.key++,e>n&&1!=e&&(this.total.shift(),this.setState({status:"устгасан"})),n>e&&e>0&&(this.total=this.total.concat([o.a.createElement("li",{key:this.key,className:"".concat(c," list-group-item-").concat(r," my-1 text-wrap")},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-".concat(this.props.icon,"-circle fa-1x my-3 animated bounceIn my-1")})," ",a))]),this.setState({status:"нэмсэн"})),0==e&&(this.total.push(o.a.createElement("li",{key:this.key,className:"".concat(c," list-group-item-").concat(r," my-1 text-wrap")},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-".concat(this.props.icon,"-circle fa-1x my-3 animated bounceIn my-1")})," ",a))),this.setState({status:"нэмсэн"})),1==e&&0==n&&(this.total.pop(),this.setState({status:"устгасан"})))}},{key:"render",value:function(){return this.state.arr,o.a.createElement("div",{className:"position-fixed bg-transparent col-md-2",style:{zIndex:1030,top:0,right:0}},o.a.createElement("ul",{className:"bg-transparent"},this.total))}}])&&c(t.prototype,n),r&&c(t,r),u}(r.Component)},536:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var r=n(0),o=n.n(r),a=n(29);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(f,e);var t,n,r,c=s(f);function f(){return l(this,f),c.apply(this,arguments)}return t=f,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&i(t.prototype,n),r&&i(t,r),f}(r.Component)},910:function(e,t,n){var r=n(62),o=n(919);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},919:function(e,t,n){(t=n(63)(!1)).push([e.i,".img {\n    margin-right: 1rem;\n    max-width: 5%;\n}\n\n.fileContainer {\n    margin-bottom: 0px;\n    margin-top: 0px\n}\n\n* {\n    box-sizing: border-box;\n}\n\n.bundle-container-bundleForm {\n    background-color: white;\n    height: calc(95vh - 50px);\n    border-radius: 0.5rem;\n    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;\n}\n\n.bundle-table-scroll {\n    overflow-y: scroll;\n    height: calc(44vh - 47px);\n}\n\n::-webkit-scrollbar {\n    width: 4px;\n    height: 5px;\n}\n\n.bundle-item_drop-scrol {\n    background-color: white;\n    height: calc(1vh - 2px);\n}\n\n@media (min-width: 576px) and (max-width: 1200px){\n    .bundle-BundleAdminRights-scroll {\n        height: auto;\n    }\n}\n\n@media (min-width: 1200px){\n    .bundle-BundleAdminRights-scroll {\n        overflow-y: scroll;\n        height: calc(97vh - 55px);\n    }\n}",""]),e.exports=t},970:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return ke}));var r=n(0),o=n.n(r),a=n(46);function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={getAll:function(){var e=l({},{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}});return fetch("".concat("/back","/bundle/all/"),e).then(f)},update:function(e){var t=l(l({},p()),{},{body:JSON.stringify(e)});return fetch("".concat("/back","/bundle/update/"),t).then(f)},swap:function(e,t){var n=l(l({},p()),{},{body:JSON.stringify({swap_one:e,swap_two:t})});return fetch("".concat("/back","/bundle/swap/"),n).then(f)},roleCreate:function(e){var t=l(l({},p()),{},{body:JSON.stringify(e)});return fetch("".concat("/back","/bundle/role-create/"),t).then(f)},roleRemove:function(e){var t=l(l({},p()),{},{body:JSON.stringify(e)});return fetch("".concat("/back","/bundle/role-remove/"),t).then(f)},defaultCheckUpdate:function(e){var t=l(l({},p()),{},{body:JSON.stringify(e)});return fetch("".concat("/back","/bundle/default-check-update/"),t).then(f)},detail:function(e){var t=l({},{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}});return fetch("".concat("/back","/bundle/").concat(e,"/update-detail/"),t).then(f)},getLayer:function(e){var t=l({},{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}});return fetch("".concat("/back","/bundle/get-layer/"),t).then(f)}};function s(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),r=0;r<n.length;r++){var o=n[r].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}return t}function f(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var r=n&&n.message||e.statusText;return Promise.reject(r)}return n}))}function p(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":s("csrftoken")}}}n(910);var d=n(29);function m(e){return(m="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=g(e);if(t){var o=g(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==m(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(c,e);var t,n,r,a=b(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={},t}return t=c,(n=[{key:"render",value:function(){var e=this,t=this.props.values,n=t.id,r=t.name,a=t.icon_url,c=t.wms_list,l=this.props,i=l.idx,u=l.values;return o.a.createElement("tr",{key:i,draggable:!0,onDrop:function(t){return e.props.onDrop(t,u,i)},onDragOver:function(t){return e.props.onDragOver(t,u,i)},onDrag:function(t){return e.props.onDrag(t,u,i)}},o.a.createElement("td",{scope:"col",className:"text-dark"},i+1),o.a.createElement("td",null,o.a.createElement(d.c,{to:"/back/дэд-сан/".concat(n,"/засах/")},o.a.createElement("img",{className:"img",src:a}),r)),o.a.createElement("td",null,c.map((function(e,t){return e.is_active?o.a.createElement("p",{key:t},o.a.createElement("span",null,o.a.createElement("i",{className:"fa fa-check-circle",style:{color:"green"},"aria-hidden":"false"})),o.a.createElement("span",null,o.a.createElement("a",null," ",e.name))):o.a.createElement("p",{key:t},o.a.createElement("span",null,o.a.createElement("i",{className:"fa fa-times-circle",style:{color:"#FF4748"}})),o.a.createElement("span",{className:"text-muted"},o.a.createElement("a",null,o.a.createElement("del",null," ",e.name))))}))))}}])&&y(t.prototype,n),r&&y(t,r),c}(r.Component);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function k(e,t){return(k=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function w(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=x(e);if(t){var o=x(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return S(this,n)}}function S(e,t){return!t||"object"!==E(t)&&"function"!=typeof t?j(e):t}function j(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var N=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&k(e,t)}(c,e);var t,n,r,a=w(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={bundle_list:[],firt_item:{},firt_item_idx:null},t.handleListUpdated=t.handleListUpdated.bind(j(t)),t.onDrag=t.onDrag.bind(j(t)),t.onDrop=t.onDrop.bind(j(t)),t.onDragOver=t.onDragOver.bind(j(t)),t.handleSwap=t.handleSwap.bind(j(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){this.handleListUpdated()}},{key:"handleListUpdated",value:function(){var e=this;u.getAll().then((function(t){var n=t.bundle_list;e.setState({bundle_list:n})}))}},{key:"handleRemove",value:function(e){var t=this;u.remove(e).then((function(e){e.success&&t.handleListUpdated()})),this.modalCloseTime()}},{key:"onDrag",value:function(e,t,n){e.preventDefault(),this.setState({firt_item:t,firt_item_idx:n})}},{key:"onDragOver",value:function(e,t,n){e.preventDefault()}},{key:"onDrop",value:function(e,t,n){e.preventDefault();var r=this.state,o=r.bundle_list,a=r.firt_item,c=r.firt_item_idx,l=o;l[n]=a,l[c]=t,this.handleSwap(a.id,t.id),this.setState({bundle_list:l})}},{key:"handleSwap",value:function(e,t){u.swap(e,t)}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"table-responsive table_wrapper"},o.a.createElement("table",{className:"table table_wrapper_table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," # "),o.a.createElement("th",{scope:"col"}," Сангийн нэр "),o.a.createElement("th",{scope:"col"}," WMS сервис "))),o.a.createElement("tbody",null,this.state.bundle_list.map((function(t,n){return o.a.createElement(O,{key:t.id,idx:n,values:t,handleRemove:function(){return e.handleRemove(t.id)},onDrag:e.onDrag,onDragOver:e.onDragOver,onDrop:e.onDrop})})))))))))}}])&&_(t.prototype,n),r&&_(t,r),c}(r.Component),P=n(101),R=n.n(P),C=n(536);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function T(){return(T=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function I(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var n=[],r=!0,o=!1,a=void 0;try{for(var c,l=e[Symbol.iterator]();!(r=(c=l.next()).done)&&(n.push(c.value),!t||n.length!==t);r=!0);}catch(e){o=!0,a=e}finally{try{r||null==l.return||l.return()}finally{if(o)throw a}}return n}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return B(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return B(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function B(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function L(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function U(e,t){return(U=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function F(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=X(e);if(t){var o=X(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return A(this,n)}}function A(e,t){return!t||"object"!==D(t)&&"function"!=typeof t?M(e):t}function M(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function X(e){return(X=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var q=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&U(e,t)}(c,e);var t,n,r,a=F(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={id:e.values.id,name:e.values.name,layers:e.values.layers,icon:e.values.icon,icon_url:e.values.icon_url,icon_url_err:""},t.handleChange=t.handleChange.bind(M(t)),t.handleSave=t.handleSave.bind(M(t)),t.handleLayerToggle=t.handleLayerToggle.bind(M(t)),t.onDrop=t.onDrop.bind(M(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){}},{key:"componentDidUpdate",value:function(e){if(this.props.values.id!==e.values.id){var t=this.props.values,n=t.id,r=t.name,o=t.layers,a=t.icon_url;this.setState({id:n,name:r,layers:o,icon_url:a})}}},{key:"handleChange",value:function(e,t){var n,r,o;this.setState((n={},r=e,o=t.target.value,r in n?Object.defineProperty(n,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):n[r]=o,n))}},{key:"handleSave",value:function(){var e=this.state,t=e.id,n=e.name,r=e.layers,o=e.icon,a=e.icon_url;if(t){var c={id:t,name:n,layers:r,icon:o,icon_url:a};this.props.handleSave(c)}else if(o){this.setState({icon_url_err:""});var l={id:t,name:n,layers:r,icon:o};this.props.handleSave(l)}else this.setState({icon_url_err:"Зураг алга байна"})}},{key:"handleLayerToggle",value:function(e){var t=this.state.layers,n=parseInt(e.target.value);e.target.checked?t.push(n):t=t.filter((function(e){return e!=n})),this.setState({layers:t})}},{key:"onDrop",value:function(e){var t=this,n=I(e,1)[0];if(n){var r=new FileReader;r.onload=function(e){t.setState({icon:btoa(e.target.result)})},r.readAsBinaryString(n)}}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"form-group",style:{marginBottom:"8px"}},o.a.createElement("label",{htmlFor:"id_name"}," Сангийн нэр: "),o.a.createElement("input",{type:"text",className:"form-control",id:"id_name",placeholder:"сангийн нэр",onChange:function(t){return e.handleChange("name",t)},value:this.state.name,style:{marginBottom:"8px"}})),o.a.createElement("div",{className:"bundle-table-scroll border border-light rounded"},this.props.formOptions.map((function(t,n){var r=t.name,a=t.layers,c=t.is_active;return o.a.createElement("div",{className:"form-group",style:{marginTop:"10px"},key:n},o.a.createElement("div",{className:"col-md-12"},c?o.a.createElement("div",{id:"accordion2"},o.a.createElement("div",{className:" mb-2"},o.a.createElement("div",{className:"card-header",style:{padding:"5px"}},o.a.createElement("button",{key:n,className:"btn btn-link shadow-none text-dark text-left collapsed",style:{padding:"5px"},"data-toggle":"collapse","data-target":"#collapse-".concat(n),"aria-expanded":"true","aria-controls":"collapse-".concat(n)},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-check-circle",style:{color:"green"},"aria-hidden":"true"}),o.a.createElement("span",{className:"ml-2"},r)))),o.a.createElement("div",{id:"collapse-".concat(n),className:"collapse","data-parent":"#accordion2"},o.a.createElement("div",{className:"card-body"},o.a.createElement("dd",null,a.map((function(t){return o.a.createElement("div",{key:t.id},o.a.createElement("label",{style:{marginLeft:"25px"}},o.a.createElement("input",{type:"checkbox",checked:e.state.layers.indexOf(t.id)>-1,onChange:e.handleLayerToggle,value:t.id}),o.a.createElement("a",null," ",t.name)))}))))))):o.a.createElement("div",null,o.a.createElement("div",{className:" mb-2"},o.a.createElement("div",{className:"card-header",style:{padding:"5px"}},o.a.createElement("button",{key:n,className:"btn btn-link shadow-none text-dark text-left",style:{padding:"5px"},"data-toggle":"collapse","data-target":"#collapse-".concat(n),"aria-expanded":"true","aria-controls":"collapse-".concat(n)},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-times-circle",style:{color:"#FF4748"}}),o.a.createElement("span",{className:"ml-2"},r))))))))}))),o.a.createElement("div",{className:"form-group text-center mt-3"},o.a.createElement("label",{htmlFor:"id_icon",className:"mr-2",style:{marginBottom:"0px"}}," Icon: "),!this.state.icon&&o.a.createElement("img",{src:this.state.icon_url,style:{width:"50px"},className:"uploadPicture ml-2"}),o.a.createElement(R.a,{withPreview:!0,withIcon:!1,buttonText:"Icon оруулах",onChange:this.onDrop,imgExtension:[".jpg",".png"],maxFileSize:5242880,singleImage:!0,label:""}),this.state.icon_url_err&&o.a.createElement("p",{className:"text-danger"},this.state.icon_url_err)),o.a.createElement("div",{className:"form-group"},o.a.createElement("button",{className:"btn gp-btn-primary btn-block waves-effect waves-light",onClick:this.handleSave},"Хадгал")),o.a.createElement(C.a,T({},this.props,{name:"Буцах",navlink_url:"/back/дэд-сан/"})))}}])&&L(t.prototype,n),r&&L(t,r),c}(r.Component),J=n(187);function W(e){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function H(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function z(e,t){return(z=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function G(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=Q(e);if(t){var o=Q(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return $(this,n)}}function $(e,t){return!t||"object"!==W(t)&&"function"!=typeof t?K(e):t}function K(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Q(e){return(Q=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var V=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&z(e,t)}(c,e);var t,n,r,a=G(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).too=0,t.state={id:e.values.id,check:t.props.roleChecks.checks,roles:t.props.roleChecks.roles,layerRoles:[]},t.handleLayerToggle=t.handleLayerToggle.bind(K(t)),t.DefaultCheck=t.DefaultCheck.bind(K(t)),t.addNotif=t.addNotif.bind(K(t)),t}return t=c,(n=[{key:"handleLayerToggle",value:function(e){var t=this,n=this.state.roles,r=this.state.check,o=this.props.wmsId,a=parseInt(e.target.value),c=this.props.values.id;if(e.target.checked){n.push(a);var l={bundleId:o,roleId:a,layerId:c,check:r};u.roleCreate(l).then((function(e){var n=e.success;e.item,n&&t.addNotif("success","Амжилттай нэмлээ","check")}))}else if(5!=a){n=n.filter((function(e){return e!=a}));var i={bundleId:o,roleId:a,layerId:c};u.roleRemove(i).then((function(e){var n=e.success;e.item,n&&t.addNotif("success","Амжилттай устгалаа","times")}))}this.setState({roles:n})}},{key:"DefaultCheck",value:function(e){var t=this,n=this.props.wmsId,r=this.props.values.id;if(e.target.checked){this.setState({check:1});var o={bundleId:n,layerId:r,check:1};u.defaultCheckUpdate(o).then((function(e){var n=e.success;e.item,n&&t.addNotif("success","Амжилттай нэмлээ","check")}))}else{this.setState({check:0});var a={bundleId:n,layerId:r,check:0};u.defaultCheckUpdate(a).then((function(e){var n=e.success;e.item,n&&t.addNotif("success","Амжилттай устгалаа","times")}))}}},{key:"componentDidMount",value:function(){}},{key:"addNotif",value:function(e,t,n){var r=this;this.too++,this.setState({show:!0,style:e,msg:t,icon:n});var o=setInterval((function(){r.too--,r.setState({show:!0}),clearInterval(o)}),2e3)}},{key:"render",value:function(){var e=this,t=this.props.values,n=t.id,r=t.name;return o.a.createElement("tr",null,o.a.createElement("td",null,r),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",onChange:this.DefaultCheck,checked:this.state.check>0,value:n})),this.props.role.map((function(t,n){var r=t.id;return o.a.createElement("td",{key:n},5!=r&&o.a.createElement("input",{type:"checkbox",onChange:e.handleLayerToggle,checked:e.state.roles.indexOf(r)>-1,value:r}))})),o.a.createElement(J.a,{show:this.state.show,too:this.too,style:this.state.style,msg:this.state.msg,icon:this.state.icon}))}}])&&H(t.prototype,n),r&&H(t,r),c}(r.Component);function Y(e){return(Y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Z(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ee(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function te(e,t){return(te=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ne(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=oe(e);if(t){var o=oe(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return re(this,n)}}function re(e,t){return!t||"object"!==Y(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function oe(e){return(oe=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ae=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&te(e,t)}(c,e);var t,n,r,a=ne(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={id:e.values.id,name:e.values.name,layers:e.values.layers,icon:e.values.icon,icon_url:e.values.icon_url},t}return t=c,(n=[{key:"componentDidUpdate",value:function(e){if(this.props.values.id!==e.values.id){var t=this.props.values,n=t.id,r=t.name,o=t.layers;this.setState({id:n,name:r,layers:o})}}},{key:"render",value:function(){var e=this;return o.a.createElement(o.a.Fragment,null,this.props.formOptions.map((function(t,n){t.id;var r,a=t.name,c=t.layers,l=t.is_active,i=t.layer_visible;return o.a.createElement("div",{key:n,className:"",id:"accordion3"},i&&o.a.createElement("div",{className:"row ml-1 card-header"},l?o.a.createElement("button",{key:n,className:"btn btn-link shadow-none text-dark text-left collapsed",style:{padding:"5px"},"data-toggle":"collapse","data-target":"#r-collapse-".concat(n),"aria-expanded":"true","aria-controls":"collapse-".concat(n)},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-check-circle",style:{color:"green"},"aria-hidden":"false"}),o.a.createElement("span",{className:"ml-2"},a))):o.a.createElement("button",{key:n,className:"btn btn-link shadow-none text-dark text-left collapsed",style:{padding:"5px"},"data-toggle":"collapse","data-target":"#r-collapse-".concat(n),"aria-expanded":"true","aria-controls":"collapse-".concat(n)},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-times-circle",style:{color:"#FF4748"}}),o.a.createElement("span",{className:"ml-2"},a)))),i?o.a.createElement("div",(Z(r={className:"table-responsive card-body",id:"r-collapse-".concat(n)},"className","collapse"),Z(r,"data-parent","#accordion3"),r),o.a.createElement("table",{className:"table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"}," Давхаргын нэр "),o.a.createElement("th",{scope:"col"}," Харагдах чек "),e.props.formOptionsRole.map((function(e,t){var n=e.id;return 1==n?o.a.createElement("th",{key:t,scope:"col"},"Нээлтэй өгөгдөл"):2==n?o.a.createElement("th",{key:t,scope:"col"},"Дан нэвтэрсэн"):null})))),o.a.createElement("tbody",null,c.map((function(t){return e.state.layers.indexOf(t.id)>-1&&e.props.values.roles.map((function(n){return n.layer_id==t.id&&o.a.createElement(V,{key:t.id,values:t,wmsId:e.state.id,role:e.props.formOptionsRole,roleChecks:n})}))}))))):null)})))}}])&&ee(t.prototype,n),r&&ee(t,r),c}(r.Component);function ce(e){return(ce="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function le(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function ie(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?le(Object(n),!0).forEach((function(t){ue(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):le(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function ue(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function se(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function fe(e,t){return(fe=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function pe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=ye(e);if(t){var o=ye(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return de(this,n)}}function de(e,t){return!t||"object"!==ce(t)&&"function"!=typeof t?me(e):t}function me(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ye(e){return(ye=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var he=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&fe(e,t)}(c,e);var t,n,r,a=pe(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).initial_form_values={id:null,name:"",icon:"",icon_url:"",layers:[]},t.state={bundle_list:[],form_options:[],form_options_role:[],form_values:ie({},t.initial_form_values)},t.handleSaveSuccess=t.handleSaveSuccess.bind(me(t)),t.handleSave=t.handleSave.bind(me(t)),t.handleListUpdated=t.handleListUpdated.bind(me(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){this.handleListUpdated()}},{key:"handleListUpdated",value:function(){var e=this,t=this.props.match.params.id;t?u.detail(t).then((function(t){var n=t.bundle_list,r=t.form_options,o=t.form_options_role;e.setState({form_values:n,form_options:r,form_options_role:o})})):u.getLayer().then((function(t){var n=t.form_options;e.setState({form_options:n})}))}},{key:"handleSaveSuccess",value:function(){this.handleListUpdated()}},{key:"handleSave",value:function(e){var t=this;e.id&&u.update(e).then((function(e){e.success&&t.handleSaveSuccess()}))}},{key:"render",value:function(){return o.a.createElement("div",{className:"clearfix"},o.a.createElement("div",{className:"row",style:{padding:"0px"}},o.a.createElement("div",{className:"col-lg-4"},o.a.createElement("div",{className:"w-auto p-2 shadow-sm mb-2 bg-white rounded card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(q,{handleSave:this.handleSave,handleCancel:this.handleFormCancel,formOptions:this.state.form_options,values:this.state.form_values})))),this.props.match.params.id&&o.a.createElement("div",{className:"col-lg-8"},o.a.createElement("div",{className:"bundle-BundleAdminRights-scroll card mb-2 table-responsive "},o.a.createElement("div",{className:"card-body"},o.a.createElement(ae,{handleSave:this.handleSave,formOptions:this.state.form_options,formOptionsRole:this.state.form_options_role,values:this.state.form_values}))))))}}])&&se(t.prototype,n),r&&se(t,r),c}(r.Component);function be(e){return(be="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ve(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ge(e,t){return(ge=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Oe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=_e(e);if(t){var o=_e(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Ee(this,n)}}function Ee(e,t){return!t||"object"!==be(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function _e(e){return(_e=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ke=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ge(e,t)}(l,e);var t,n,r,c=Oe(l);function l(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),c.call(this,e)}return t=l,(n=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{path:"/back/дэд-сан/:id/засах/",component:he}),o.a.createElement(a.a,{path:"/back/дэд-сан/үүсгэх/",component:he}),o.a.createElement(a.a,{exact:!0,path:"/back/дэд-сан/",component:N}))}}])&&ve(t.prototype,n),r&&ve(t,r),l}(r.Component)}}]);