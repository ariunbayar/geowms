(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{927:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return w}));var r=n(0),o=n.n(r),c=n(49);function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={roles:function(){var e=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},Object(c.a)());return fetch("/gov/api/bundle/",e).then(c.c)}};function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=y(e);if(t){var o=y(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return h(this,n)}}function h(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(a,e);var t,n,r,c=s(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=c.call(this,e)).state={org_role:t.props.org_role},t.handlePermChange=t.handlePermChange.bind(m(t)),t}return t=a,(n=[{key:"handlePermChange",value:function(e){}},{key:"render",value:function(){var e=this.props.org_role,t=e.bundle,n=e.perm_view,r=e.perm_create,c=e.perm_remove,a=e.perm_revoke,l=e.perm_review,u=e.perm_approve;return o.a.createElement("tr",null,o.a.createElement("td",null,t.name),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_view",checked:n,onChange:this.handlePermChange})),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_create",checked:r,onChange:this.handlePermChange})),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_remove",checked:c,onChange:this.handlePermChange})),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_revoke",checked:a,onChange:this.handlePermChange})),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_review",checked:l,onChange:this.handlePermChange})),o.a.createElement("td",null,o.a.createElement("input",{type:"checkbox",name:"perm_approve",checked:u,onChange:this.handlePermChange})))}}])&&f(t.prototype,n),r&&f(t,r),a}(r.Component);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=E(e);if(t){var o=E(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return _(this,n)}}function _(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var w=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(a,e);var t,n,r,c=O(a);function a(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(t=c.call(this,e)).state={employee:[],org_roles:[],list:[],currentPage:1,orgPerPage:20},t}return t=a,(n=[{key:"componentDidMount",value:function(){this.handlegetAll()}},{key:"handlegetAll",value:function(){var e=this;u.roles().then((function(t){var n=t.org_roles;n&&e.setState({org_roles:n})}))}},{key:"handleChange",value:function(e,t){this.setState({org_roles:this.state.org_roles.map((function(n,r){return e==r?t:n}))})}},{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"table-responsive"},o.a.createElement("table",{className:"table table-bordered"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"},"Оронзайн суурь өгөгдлийн сан"),o.a.createElement("th",{scope:"col"},"харах"),o.a.createElement("th",{scope:"col"},"нэмэх"),o.a.createElement("th",{scope:"col"},"хасах"),o.a.createElement("th",{scope:"col"},"цуцлах"),o.a.createElement("th",{scope:"col"},"хянах"),o.a.createElement("th",{scope:"col"},"батлах"))),o.a.createElement("tbody",null,this.state.org_roles.map((function(e,t){return o.a.createElement(b,{key:t,org_role:e})})))))))}}])&&v(t.prototype,n),r&&v(t,r),a}(r.Component)}}]);