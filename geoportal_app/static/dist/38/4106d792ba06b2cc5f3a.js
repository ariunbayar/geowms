(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{187:function(t,e,n){"use strict";n.d(e,"a",(function(){return p}));var r=n(0),o=n.n(r);function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function c(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=f(t);if(e){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return u(this,n)}}function u(t,e){return!e||"object"!==a(e)&&"function"!=typeof e?s(t):e}function s(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(u,t);var e,n,r,a=l(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=a.call(this,t)).alerts=[],e.total=[],e.array=[],e.key=0,e.state={},e.loadNotif=e.loadNotif.bind(s(e)),e}return e=u,(n=[{key:"componentDidUpdate",value:function(t){t.too!==this.props.too&&this.loadNotif()}},{key:"loadNotif",value:function(){var t=this.total.length,e=this.props,n=e.too,r=e.style,a=e.msg,c="list-group-item rounded animated slideInLeft";this.props.show&&(this.key++,t>n&&1!=t&&(this.total.shift(),this.setState({status:"устгасан"})),n>t&&t>0&&(this.total=this.total.concat([o.a.createElement("li",{key:this.key,className:"".concat(c," list-group-item-").concat(r," my-1 text-wrap")},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-".concat(this.props.icon,"-circle fa-1x my-3 animated bounceIn my-1")})," ",a))]),this.setState({status:"нэмсэн"})),0==t&&(this.total.push(o.a.createElement("li",{key:this.key,className:"".concat(c," list-group-item-").concat(r," my-1 text-wrap")},o.a.createElement("a",null,o.a.createElement("i",{className:"fa fa-".concat(this.props.icon,"-circle fa-1x my-3 animated bounceIn my-1")})," ",a))),this.setState({status:"нэмсэн"})),1==t&&0==n&&(this.total.pop(),this.setState({status:"устгасан"})))}},{key:"render",value:function(){return this.state.arr,o.a.createElement("div",{className:"position-fixed bg-transparent col-md-2",style:{zIndex:1030,top:0,right:0}},o.a.createElement("ul",{className:"bg-transparent"},this.total))}}])&&c(e.prototype,n),r&&c(e,r),u}(r.Component)},536:function(t,e,n){"use strict";n.d(e,"a",(function(){return y}));var r=n(0),o=n.n(r),a=n(29);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function l(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(f,t);var e,n,r,c=s(f);function f(){return i(this,f),c.apply(this,arguments)}return e=f,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&l(e.prototype,n),r&&l(e,r),f}(r.Component)},983:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return K}));var r=n(0),o=n.n(r),a=n(46),c=n(49);function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s={paginatedList:function(t,e,n){var r=l(l({},Object(c.b)()),{},{body:JSON.stringify({page:t,per_page:e,query:n})});return fetch("/gov/api/system/",r).then(c.c)},detail:function(t){var e=l({},Object(c.a)());return fetch("/gov/api/system/".concat(t,"/detail/"),e).then(c.c)}};var f=n(187),p=n(536);function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function m(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function b(t,e){return(b=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function h(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v(t);if(e){var o=v(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return d(this,n)}}function d(t,e){return!e||"object"!==y(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var O=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&b(t,e)}(c,t);var e,n,r,a=h(c);function c(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),(e=a.call(this,t)).state={checked_array:t.layer.attributes||[]},e}return e=c,(n=[{key:"componentDidUpdate",value:function(t){if(t.layer!==this.props.layer){var e=this.props.layer;this.setState({checked_array:e.attributes})}}},{key:"render",value:function(){var t=this.props,e=t.wms,n=t.layer,r=t.idx,a=this.state.checked_array;return o.a.createElement("ul",{key:r,id:"collapse-".concat(r),className:"collapsed","data-parent":"#accordion1"},e.attributes.featureTypes.map((function(t,e){return t.typeName==n.code&&t.properties.map((function(t,e){return o.a.createElement("li",null,o.a.createElement("div",{className:"icheck-primary"},o.a.createElement("input",{type:"checkbox",id:"active-delete-".concat(n.code,"-").concat(e),checked:a.indexOf(t.name)>-1,value:t.name,disabled:!0}),o.a.createElement("label",{htmlFor:"active-delete-".concat(n.code,"-").concat(e)}," ",t.name)))}))})))}}])&&m(e.prototype,n),r&&m(e,r),c}(r.Component);function _(t){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function g(){return(g=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function E(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function w(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?E(Object(n),!0).forEach((function(e){j(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function j(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function k(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function N(t,e){return(N=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function P(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=R(t);if(e){var o=R(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return S(this,n)}}function S(t,e){return!e||"object"!==_(e)&&"function"!=typeof e?x(t):e}function x(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function R(t){return(R=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var C=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&N(t,e)}(c,t);var e,n,r,a=P(c);function c(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),(e=a.call(this,t)).too=0,e.state={system:{},system_wms_list:[],public_url:"",copy_url_is:!1,private_url:"",is_state:!1},e.copyToClipboard=e.copyToClipboard.bind(x(e)),e.addNotif=e.addNotif.bind(x(e)),e}return e=c,(n=[{key:"addNotif",value:function(t,e,n){var r=this;this.too++,this.setState({show:!0,style:t,msg:e,icon:n});var o=setInterval((function(){r.too--,r.setState({show:!0}),clearInterval(o)}),2e3)}},{key:"componentDidMount",value:function(){var t=this;s.detail(this.props.match.params.system_id).then((function(e){var n=e.system,r=e.public_url,o=e.private_url,a=n.wms_list.map((function(t){return w(w({},t),{},{layer_list:t.layer_list.filter((function(t){return n.layers.indexOf(t.id)>-1}))})})).filter((function(t){return t.layer_list.length}));t.setState({system:n,system_wms_list:a,public_url:r,private_url:o})}))}},{key:"copyToClipboard",value:function(t){var e=document.createElement("textarea");e.innerText=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove(),this.addNotif("success","Амжилттай хуулаа","times")}},{key:"render",value:function(){var t=this,e=this.state.system,n=(e.id,e.name),r=e.token,a=e.website,c=this.state.is_state;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(p.a,g({},this.props,{name:"Буцах"})),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("h5",null,n),o.a.createElement("p",null,o.a.createElement("strong",null,"Token"),": ",r," "),a&&o.a.createElement("p",null,o.a.createElement("strong",null,"Вебсайт"),": ",a," ")),o.a.createElement("div",{className:"col-md-9 pr-0 pl-0"},o.a.createElement("ul",{className:"nav nav-tabs nav-tabs-dark-gray col-12"},o.a.createElement("li",{className:"nav-item gp-text-primary"},o.a.createElement("a",{onClick:function(){return t.setState({is_state:!1})},className:"nav-link active","data-toggle":"tab",href:"#tabe-4"},o.a.createElement("i",{className:"icon-home"})," ",o.a.createElement("span",{className:"hidden-xs"},"Интернэт сүлжээ"))),o.a.createElement("li",{className:"nav-item gp-text-primary"},o.a.createElement("a",{onClick:function(){return t.setState({is_state:!0})},className:"nav-link","data-toggle":"tab",href:"#tabe-4"},o.a.createElement("i",{className:"icon-home"})," ",o.a.createElement("span",{className:"hidden-xs"},"Төрийн сүлжээ"))))),o.a.createElement("div",{className:"col-md-9 border-top-0 border border-secondary"},o.a.createElement("div",{className:"col-md-12 mt-3 mb-3"},c?o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-9",disabled:!0,value:this.state.private_url}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return t.copyToClipboard(t.state.private_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах"))):o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-9",disabled:!0,value:this.state.public_url}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return t.copyToClipboard(t.state.public_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах")))),this.state.system_wms_list.map((function(e){return o.a.createElement("div",{className:"col-md-12 mt-3 mb-3 ml-3",key:e.id},o.a.createElement("h5",null," ",e.name," "),o.a.createElement("ul",null,e.layer_list.map((function(n,r){return o.a.createElement("li",{key:r},"GeoJSON: ",n.title," (",n.code,")",o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-7",disabled:!0,value:"".concat(c?n.json_private_url:n.json_public_url)}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return t.copyToClipboard(c?n.json_private_url:n.json_public_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах"))),o.a.createElement("div",null,o.a.createElement("a",{"data-toggle":"collapse","data-target":"#collapse-".concat(r),"aria-expanded":"false","aria-controls":"#collapse-".concat(e.id+n.id)},"Багана эрх")),n&&o.a.createElement(O,{wms:e,idx:r,layer:n,addNotif:t.addNotif}))}))))}))))),o.a.createElement(f.a,{show:this.state.show,too:this.too,style:this.state.style,msg:this.state.msg,icon:this.state.icon}))}}])&&k(e.prototype,n),r&&k(e,r),c}(r.Component),T=n(890);function B(t){return(B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function D(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function I(t,e){return(I=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function J(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=L(t);if(e){var o=L(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return q(this,n)}}function q(t,e){return!e||"object"!==B(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function L(t){return(L=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var U=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&I(t,e)}(c,t);var e,n,r,a=J(c);function c(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,c),(e=a.call(this,t)).state={refresh:!1,"жагсаалтын_холбоос":"/gov/api/system/",custom_query:{},"талбарууд":[{field:"name",title:"Нэр",has_action:!0},{field:"token",title:"Токен"},{field:"created_at",title:"Огноо"}],"хувьсах_талбарууд":[{field:"name",action:function(t){return e.go_link(t)}}]},e}return e=c,(n=[{key:"go_link",value:function(t){this.props.history.push("/gov/system/".concat(t.id,"/дэлгэрэнгүй/"))}},{key:"render",value:function(){var t=this.state,e=(t.refresh,t.талбарууд),n=t.жагсаалтын_холбоос,r=t.хувьсах_талбарууд;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(T.a,{"талбарууд":e,"жагсаалтын_холбоос":n,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":r,color:"primary"})))}}])&&D(e.prototype,n),r&&D(e,r),c}(r.Component);function z(t){return(z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function F(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function G(t,e){return(G=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function M(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=H(t);if(e){var o=H(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return A(this,n)}}function A(t,e){return!e||"object"!==z(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function H(t){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var K=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&G(t,e)}(i,t);var e,n,r,c=M(i);function i(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,t)}return e=i,(n=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/system/",component:U}),o.a.createElement(a.a,{exact:!0,path:"/gov/system/:system_id/дэлгэрэнгүй/",component:C}))}}])&&F(e.prototype,n),r&&F(e,r),i}(r.Component)}}]);