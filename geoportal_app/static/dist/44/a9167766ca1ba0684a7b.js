(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{962:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return K}));var r=n(0),a=n.n(r),o=n(50),c=n(28),l=n(219);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){f(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function f(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s={getAll:function(){var e=u({},Object(l.a)());return fetch("/back/gis/table_list/",e).then(l.c)},getDetail:function(e,t){var n=u({},Object(l.a)());return fetch("/back/gis/field_list/".concat(e,"/").concat(t,"/"),n).then(l.c)}};function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=v(e);if(t){var a=v(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return h(this,n)}}function h(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?d(e):t}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var E=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(l,e);var t,n,r,o=b(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={items:[],size_max:1},t.readableFileSize=t.readableFileSize.bind(d(t)),t}return t=l,(n=[{key:"componentDidMount",value:function(){var e=this;s.getAll().then((function(t){var n=t.items,r=n.reduce((function(e,t){return Math.max(t.size,e)}),0);e.setState({items:n,size_max:r})}))}},{key:"readableFileSize",value:function(e){if(0==e)return"0 Bytes";var t=Math.floor(Math.log(e)/Math.log(1e3));return parseFloat((e/Math.pow(1e3,t)).toFixed(2))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][t]}},{key:"render",value:function(){var e=this;if(!this.state.items)return"";var t=this.state,n=t.items,r=t.size_max;return a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"card"},a.a.createElement("div",{className:"card-body"},a.a.createElement("div",{className:"my-4"},a.a.createElement("div",{className:"p-3"},a.a.createElement("div",{className:"table-responsive"},a.a.createElement("table",{className:"table"},a.a.createElement("thead",null,a.a.createElement("tr",null,a.a.createElement("th",{scope:"col"}),a.a.createElement("th",{scope:"col"},"table/view"),a.a.createElement("th",{scope:"col"},"size"),a.a.createElement("th",{scope:"col"},"rows"))),a.a.createElement("tbody",null,n.map((function(t,n){var o=t.schemaname,l=t.tablename,i=t.oid,u=t.kind,f=t.size,s=t.rows;return a.a.createElement("tr",{key:n},a.a.createElement("td",null,a.a.createElement(c.c,{to:"/back/gis/detail/".concat(o,"/").concat(l,"/"),className:"badge badge-secondary m-1"},"OID:"+i)),a.a.createElement("td",null,"table"==u&&a.a.createElement("i",{className:"fa fa-table",title:"Table"}),"view"==u&&a.a.createElement("i",{className:"fa fa-eye",title:"View"})," ","".concat(o,".").concat(l)),a.a.createElement("td",null,a.a.createElement("progress",{max:r,value:f})," ",e.readableFileSize(f)),a.a.createElement("td",null,s))})))))))))))}}])&&m(t.prototype,n),r&&m(t,r),l}(r.Component);function O(e){return(O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function w(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function g(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function j(e,t){return(j=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=P(e);if(t){var a=P(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return S(this,n)}}function S(e,t){return!t||"object"!==O(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function P(e){return(P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var k=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&j(e,t)}(c,e);var t,n,r,o=_(c);function c(){return w(this,c),o.apply(this,arguments)}return t=c,(n=[{key:"render",value:function(){var e=this.props.values;return a.a.createElement("tr",null,Object.keys(e).map((function(t){return a.a.createElement("td",{key:t}," ",e[t]," ")})))}}])&&g(t.prototype,n),r&&g(t,r),c}(r.Component);function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function D(e,t){return(D=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function x(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=T(e);if(t){var a=T(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return B(this,n)}}function B(e,t){return!t||"object"!==N(t)&&"function"!=typeof t?z(e):t}function z(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&D(e,t)}(c,e);var t,n,r,o=x(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=o.call(this,e)).state={items:"",data:""},t.handleData=t.handleData.bind(z(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){var e=this,t=this.props.match.params.schemaname,n=this.props.match.params.tablename;s.getDetail(t,n).then((function(t){var n=t.items,r=t.data;e.handleData(n,r)}))}},{key:"handleData",value:function(e,t){this.setState({items:e,data:t})}},{key:"render",value:function(){if(!this.state.items)return"";var e=this.state,t=e.items,n=e.data,r=n.length,o=t.length;return a.a.createElement("div",{className:"card"},a.a.createElement("div",{className:"card-body"},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12 mb-4"},a.a.createElement("a",{href:"#",className:"btn gp-outline-primary",onClick:this.props.history.goBack},a.a.createElement("i",{className:"fa fa-angle-double-left"})," Буцах"))),a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"my-4"},a.a.createElement("div",{className:"p-3"},a.a.createElement("div",{className:"table-responsive"},a.a.createElement("table",{className:"table"},a.a.createElement("thead",null,a.a.createElement("tr",null,a.a.createElement("th",{scope:"col"},"№"),a.a.createElement("th",{scope:"col"},"field name"),a.a.createElement("th",{scope:"col"},"field type"))),a.a.createElement("tbody",null,0==o?a.a.createElement("tr",null,a.a.createElement("td",null,"Хоосон байна ")):t.map((function(e,t){return a.a.createElement("tr",{key:t},a.a.createElement("td",null,t+1),a.a.createElement("td",null,e.name),a.a.createElement("td",null,e.type))}))))))))),a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"my-4"},a.a.createElement("div",{className:"p-3"},a.a.createElement("div",{className:"table-responsive"},a.a.createElement("p",null,"Дурын 10 өгөгдөл:"),a.a.createElement("table",{className:"table"},a.a.createElement("thead",null,a.a.createElement("tr",null,0==r?a.a.createElement("tr",null,a.a.createElement("th",null,"Хоосон байна ")):Object.keys(n[0]).map((function(e){return a.a.createElement("th",{key:e,scope:"col"},e," ")})))),a.a.createElement("tbody",null,0===n?a.a.createElement("tr",null,a.a.createElement("td",null,"Хоосон байна ")):n.map((function(e,t){return a.a.createElement(k,{key:t,values:e})})))))))))))}}])&&R(t.prototype,n),r&&R(t,r),c}(r.Component);function M(e){return(M="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function F(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function J(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=I(e);if(t){var a=I(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return G(this,n)}}function G(e,t){return!t||"object"!==M(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function I(e){return(I=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var K=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(l,e);var t,n,r,c=J(l);function l(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),c.call(this,e)}return t=l,(n=[{key:"render",value:function(){return a.a.createElement(o.c,null,a.a.createElement(o.a,{exact:!0,path:"/back/gis/",component:E}),a.a.createElement(o.a,{exact:!0,path:"/back/gis/detail/:schemaname/:tablename/",component:C}))}}])&&F(t.prototype,n),r&&F(t,r),l}(r.Component)}}]);