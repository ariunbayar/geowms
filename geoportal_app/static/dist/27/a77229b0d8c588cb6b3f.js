(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{900:function(t,e,n){"use strict";n.d(e,"a",(function(){return D})),n.d(e,"b",(function(){return T}));var r=n(0),o=n.n(r);n(903);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function u(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=s(t);if(e){var o=s(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return l(this,n)}}function l(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}(l,t);var e,n,r,c=f(l);function l(){return u(this,l),c.apply(this,arguments)}return e=l,(n=[{key:"render",value:function(){var t=this.props,e=t.icon,n=t.size,r=t.color;return o.a.createElement("a",{className:"hover-fx"},o.a.createElement("i",{className:"".concat(e," ").concat(n," ").concat(r)}))}}])&&i(e.prototype,n),r&&i(e,r),l}(r.Component);function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function b(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function m(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=d(t);if(e){var o=d(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(t,e){return!e||"object"!==y(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var g=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(u,t);var e,n,r,c=m(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=c.call(this,t)).state={value:t.value,main_values:t.main_values,options:t.options},e}return e=u,(n=[{key:"render",value:function(){var t=this,e=this.props,n=e.name,r=e.mn_name,c=e.className,u=e.children,i=this.state,a=(i.value,i.main_values,i.options);return Array(),u.length,o.a.createElement("select",{name:n,id:"id_".concat(n),style:{fontSize:"0.8rem"},className:c||" custom-select",onChange:function(e){return t.props.handleOnChangeSelect(e.target.value,n)}},o.a.createElement("option",{value:""},"--- ",r," сонгоно уу ---"),a.map((function(t,e){return o.a.createElement("option",{key:e,value:t.code_list_id},t.code_list_name)})))}}])&&b(e.prototype,n),r&&b(e,r),u}(r.PureComponent);function O(t){return(O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function w(){return(w=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function _(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function j(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function S(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function P(t,e){return(P=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function E(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=k(t);if(e){var o=k(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return R(this,n)}}function R(t,e){return!e||"object"!==O(e)&&"function"!=typeof e?x(t):e}function x(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function k(t){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var C=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&P(t,e)}(u,t);var e,n,r,c=E(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=c.call(this,t)).state={value:t.value,children:[]},e.handleOnChange=e.handleOnChange.bind(x(e)),e.handleOnChangeSelect=e.handleOnChangeSelect.bind(x(e)),e}return e=u,(n=[{key:"handleOnChange",value:function(t,e){this.props.sendValue(t,e),this.setState({value:t})}},{key:"handleOnChangeSelect",value:function(t,e){var n=this.props.options,r=Array();n.map((function(e,n){e.children&&e.code_list_id==t&&(r=e.children)})),console.log(r),this.setState(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?_(Object(n),!0).forEach((function(e){j(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({value:t},r)),this.props.sendValue(t,e)}},{key:"render",value:function(){var t=this,e=this.props,n=e.name,r=e.type,c=e.mn_name,u=e.placeholder,i=e.className,a=(e.options,e.main_values,this.state),f=a.value,l=a.children;return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"id_".concat(n)},c),"select"==r?o.a.createElement("div",null,l.length>0?o.a.createElement(g,w({},this.props,{handleOnChangeSelect:this.handleOnChangeSelect,value:f})):o.a.createElement(g,w({},this.props,{children:l,handleOnChangeSelect:this.handleOnChangeSelect,value:f}))):"textarea"==r?o.a.createElement("textarea",{className:i||" form-control",name:n,id:"id_".concat(n),cols:"30",rows:"10",onChange:function(e){return t.handleOnChange(e.target.value,n)}}):o.a.createElement("input",{className:i||" form-control",type:r,name:n,placeholder:u,onChange:function(e){return t.handleOnChange(e.target.value,n)}}))}}])&&S(e.prototype,n),r&&S(e,r),u}(r.PureComponent),D=p,T=C},903:function(t,e,n){var r=n(55),o=n(904);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[t.i,o,""]]);var c={insert:"head",singleton:!1};r(o,c);t.exports=o.locals||{}},904:function(t,e,n){(e=n(56)(!1)).push([t.i,"\n.hover-fx {\n    display: inline-block;\n    cursor: pointer;\n    width: 30px;\n    height: 30px;\n    line-height: 32px;\n    border-radius: 50%;\n    text-align: center;\n    position: relative;\n    color: #f1f3f4;\n    background-color: rgba(255, 255, 255, 0.1);\n    transition: 300ms;\n}\n\n.hover-fx:after {\n    pointer-events: none;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n    content: '';\n    box-sizing: content-box;\n    box-shadow: 0 0 0 3px #f1f3f4;\n    top: 0;\n    left: 0;\n    opacity: 0;\n    transition: 300ms;\n}\n\n.hover-fx:hover {\n    background-color: #f1f3f4;\n    color: #f1f3f4;\n}\n\n.hover-fx:hover:after {\n    opacity: 1;\n    transform: scale(1.15);\n}",""]),t.exports=e},962:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return L}));var r=n(0),o=n.n(r),c=n(50),u=n(29);function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function a(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(t,e){return!e||"object"!==i(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(i,t);var e,n,r,c=l(i);function i(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,t)}return e=i,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card-body"},o.a.createElement("h1",null,"hello"),o.a.createElement(u.c,{className:"btn btn-block btn-primary",to:"/gov/tseg-personal/add/"},"nemeh"))}}])&&a(e.prototype,n),r&&a(e,r),i}(r.Component);function b(t){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function h(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function v(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=g(t);if(e){var o=g(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return d(this,n)}}function d(t,e){return!e||"object"!==b(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var O=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}(i,t);var e,n,r,c=v(i);function i(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,t)}return e=i,(n=[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,"hi"),o.a.createElement(u.c,{className:"btn btn-block btn-primary",to:"/gov/tseg-personal/add/"},"nemeh"))}}])&&h(e.prototype,n),r&&h(e,r),i}(r.Component),w=n(36);function _(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function j(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var S={getFormFields:function(){var t=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?_(Object(n),!0).forEach((function(e){j(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},Object(w.a)());return fetch("".concat("/gov/api/tseg","/get-fields/"),t).then(w.c)}};var P=n(900);function E(t){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function R(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function x(t,e){return(x=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function k(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=T(t);if(e){var o=T(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return C(this,n)}}function C(t,e){return!e||"object"!==E(e)&&"function"!=typeof e?D(t):e}function D(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function T(t){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var N=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&x(t,e)}(u,t);var e,n,r,c=k(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=c.call(this,t)).state={fields:[],values:{}},e.getFields=e.getFields.bind(D(e)),e.getValue=e.getValue.bind(D(e)),e}return e=u,(n=[{key:"getValue",value:function(t,e){var n=this.state.values;n[e]=t,this.setState({values:n})}},{key:"componentDidMount",value:function(){this.getFields()}},{key:"getFields",value:function(){var t=this;S.getFormFields().then((function(e){var n=e.success,r=e.fields;console.log(r),n&&t.setState({fields:r})}))}},{key:"render",value:function(){var t=this,e=this.state,n=e.fields,r=e.values;return console.log(r),o.a.createElement("div",{className:"card-body"},o.a.createElement("h1",null,"Nemeh bolon zasah"),n.map((function(e,n){return o.a.createElement(P.b,{key:n,mn_name:e.property_name,name:e.property_id,placeholder:e.property_name,type:e.value_type_id,sendValue:t.getValue,options:e.data_list,main_values:r})})))}}])&&R(e.prototype,n),r&&R(e,r),u}(r.Component);function F(t){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function V(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function z(t,e){return(z=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function A(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=M(t);if(e){var o=M(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return J(this,n)}}function J(t,e){return!e||"object"!==F(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function M(t){return(M=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var U=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&z(t,e)}(u,t);var e,n,r,c=A(u);function u(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),c.call(this,t)}return e=u,(n=[{key:"render",value:function(){return console.log("tseg nemeh"),o.a.createElement("div",null,o.a.createElement("h1",null,"Ustan Nemeh bolon zasah"))}}])&&V(e.prototype,n),r&&V(e,r),u}(r.Component);function q(t){return(q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function B(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function G(t,e){return(G=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function H(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=K(t);if(e){var o=K(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return I(this,n)}}function I(t,e){return!e||"object"!==q(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function K(t){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var L=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&G(t,e)}(i,t);var e,n,r,u=H(i);function i(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),(e=u.call(this,t)).state={},e}return e=i,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement(c.c,null,o.a.createElement(c.a,{path:"/gov/tseg-personal/list/",component:y}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/list/",component:O}),o.a.createElement(c.a,{path:"/gov/tseg-personal/add/",component:N}),o.a.createElement(c.a,{path:"/gov/tseg-personal/:id/edit/",component:N}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/add/",component:U}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/:id/edit/",component:U})))}}])&&B(e.prototype,n),r&&B(e,r),i}(r.Component)}}]);