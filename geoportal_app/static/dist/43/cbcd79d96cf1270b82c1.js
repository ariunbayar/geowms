(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{542:function(e,t,n){"use strict";n.d(t,"a",(function(){return y}));var r=n(0),o=n.n(r),a=n(30);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(f,e);var t,n,r,c=s(f);function f(){return i(this,f),c.apply(this,arguments)}return t=f,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&l(t.prototype,n),r&&l(t,r),f}(r.Component)},921:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return K}));var r=n(0),o=n.n(r),a=n(15),c=n(50);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s={paginatedList:function(e,t,n){var r=l(l({},Object(c.b)()),{},{body:JSON.stringify({page:e,per_page:t,query:n})});return fetch("/gov/api/system/",r).then(c.c)},detail:function(e){var t=l({},Object(c.a)());return fetch("/gov/api/system/".concat(e,"/detail/"),t).then(c.c)}};var f=n(97),p=n(542);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v(e);if(t){var o=v(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return h(this,n)}}function h(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var _=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(c,e);var t,n,r,a=d(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={checked_array:e.layer.attributes||[]},t}return t=c,(n=[{key:"componentDidUpdate",value:function(e){if(e.layer!==this.props.layer){var t=this.props.layer;this.setState({checked_array:t.attributes})}}},{key:"render",value:function(){var e=this.props,t=e.wms,n=e.layer,r=e.idx,a=this.state.checked_array;return o.a.createElement("ul",{key:r,id:"collapse-".concat(r),className:"collapsed","data-parent":"#accordion1"},t.attributes.featureTypes.map((function(e,t){return e.typeName==n.code&&e.properties.map((function(e,t){return o.a.createElement("li",null,o.a.createElement("div",{className:"icheck-primary"},o.a.createElement("input",{type:"checkbox",id:"active-delete-".concat(n.code,"-").concat(t),checked:a.indexOf(e.name)>-1,value:e.name,disabled:!0}),o.a.createElement("label",{htmlFor:"active-delete-".concat(n.code,"-").concat(t)}," ",e.name)))}))})))}}])&&m(t.prototype,n),r&&m(t,r),c}(r.Component);function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(){return(O=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function w(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?E(Object(n),!0).forEach((function(t){j(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function j(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function k(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=x(e);if(t){var o=x(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return S(this,n)}}function S(e,t){return!t||"object"!==g(t)&&"function"!=typeof t?R(e):t}function R(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&N(e,t)}(c,e);var t,n,r,a=P(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).too=0,t.state={system:{},system_wms_list:[],public_url:"",copy_url_is:!1,private_url:"",is_state:!1},t.copyToClipboard=t.copyToClipboard.bind(R(t)),t.addNotif=t.addNotif.bind(R(t)),t}return t=c,(n=[{key:"addNotif",value:function(e,t,n){var r=this;this.too++,this.setState({show:!0,style:e,msg:t,icon:n});var o=setInterval((function(){r.too--,r.setState({show:!0}),clearInterval(o)}),2e3)}},{key:"componentDidMount",value:function(){var e=this;s.detail(this.props.match.params.system_id).then((function(t){var n=t.system,r=t.public_url,o=t.private_url,a=n.wms_list.map((function(e){return w(w({},e),{},{layer_list:e.layer_list.filter((function(e){return n.layers.indexOf(e.id)>-1}))})})).filter((function(e){return e.layer_list.length}));e.setState({system:n,system_wms_list:a,public_url:r,private_url:o})}))}},{key:"copyToClipboard",value:function(e){var t=document.createElement("textarea");t.innerText=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove(),this.addNotif("success","Амжилттай хууллаа","times")}},{key:"render",value:function(){var e=this,t=this.state.system,n=(t.id,t.name),r=t.token,a=t.website,c=this.state.is_state;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(p.a,O({},this.props,{name:"Буцах"})),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("h5",null,n),o.a.createElement("p",null,o.a.createElement("strong",null,"Token"),": ",r," "),a&&o.a.createElement("p",null,o.a.createElement("strong",null,"Вебсайт"),": ",a," ")),o.a.createElement("div",{className:"col-md-9 pr-0 pl-0"},o.a.createElement("ul",{className:"nav nav-tabs nav-tabs-dark-gray col-12"},o.a.createElement("li",{className:"nav-item gp-text-primary"},o.a.createElement("a",{onClick:function(){return e.setState({is_state:!1})},className:"nav-link active","data-toggle":"tab",href:"#tabe-4"},o.a.createElement("i",{className:"icon-home"})," ",o.a.createElement("span",{className:"hidden-xs"},"Интернэт сүлжээ"))),o.a.createElement("li",{className:"nav-item gp-text-primary"},o.a.createElement("a",{onClick:function(){return e.setState({is_state:!0})},className:"nav-link","data-toggle":"tab",href:"#tabe-4"},o.a.createElement("i",{className:"icon-home"})," ",o.a.createElement("span",{className:"hidden-xs"},"Төрийн сүлжээ"))))),o.a.createElement("div",{className:"col-md-9 border-top-0 border border-secondary"},o.a.createElement("div",{className:"col-md-12 mt-3 mb-3"},c?o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-9",disabled:!0,value:this.state.private_url}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return e.copyToClipboard(e.state.private_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах"))):o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-9",disabled:!0,value:this.state.public_url}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return e.copyToClipboard(e.state.public_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах")))),this.state.system_wms_list.map((function(t){return o.a.createElement("div",{className:"col-md-12 mt-3 mb-3 ml-3",key:t.id},o.a.createElement("h5",null," ",t.name," "),o.a.createElement("ul",null,t.layer_list.map((function(n,r){return o.a.createElement("li",{key:r},"GeoJSON: ",n.title," (",n.code,")",o.a.createElement("div",{className:"input-group mt-2"},o.a.createElement("input",{type:"text",className:"form-control col-7",disabled:!0,value:"".concat(c?n.json_private_url:n.json_public_url)}),o.a.createElement("span",{className:"input-group-btn"},o.a.createElement("button",{className:"btn btn-outline-primary ml-1",type:"button",onClick:function(){return e.copyToClipboard(c?n.json_private_url:n.json_public_url)}},o.a.createElement("i",{className:"fa fa-clone","aria-hidden":"true"})," Хуулах"))),o.a.createElement("div",null,o.a.createElement("a",{"data-toggle":"collapse","data-target":"#collapse-".concat(r),"aria-expanded":"false","aria-controls":"#collapse-".concat(t.id+n.id)},"Багана эрх")),n&&o.a.createElement(_,{wms:t,idx:r,layer:n,addNotif:e.addNotif}))}))))}))))),o.a.createElement(f.b,{show:this.state.show,too:this.too,style:this.state.style,msg:this.state.msg,icon:this.state.icon}))}}])&&k(t.prototype,n),r&&k(t,r),c}(r.Component),D=n(937);function T(e){return(T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function J(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function q(e,t){return(q=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function I(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=F(e);if(t){var o=F(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return B(this,n)}}function B(e,t){return!t||"object"!==T(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function F(e){return(F=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var G=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&q(e,t)}(c,e);var t,n,r,a=I(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={refresh:!1,"жагсаалтын_холбоос":"/gov/api/system/",custom_query:{},"талбарууд":[{field:"name",title:"Нэр",has_action:!0},{field:"token",title:"Токен"},{field:"created_at",title:"Огноо"}],"хувьсах_талбарууд":[{field:"name",action:function(e){return t.go_link(e)}}]},t}return t=c,(n=[{key:"go_link",value:function(e){this.props.history.push("/gov/system/".concat(e.id,"/дэлгэрэнгүй/"))}},{key:"render",value:function(){var e=this.state,t=(e.refresh,e.талбарууд),n=e.жагсаалтын_холбоос,r=e.хувьсах_талбарууд;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(D.a,{"талбарууд":t,"жагсаалтын_холбоос":n,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":r,color:"primary"})))}}])&&J(t.prototype,n),r&&J(t,r),c}(r.Component);function L(e){return(L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function M(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function U(e,t){return(U=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=H(e);if(t){var o=H(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return A(this,n)}}function A(e,t){return!t||"object"!==L(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function H(e){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var K=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&U(e,t)}(i,e);var t,n,r,c=z(i);function i(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,e)}return t=i,(n=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/system/",component:G}),o.a.createElement(a.a,{exact:!0,path:"/gov/system/:system_id/дэлгэрэнгүй/",component:C}))}}])&&M(t.prototype,n),r&&M(t,r),i}(r.Component)}}]);