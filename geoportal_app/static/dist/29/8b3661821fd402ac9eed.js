(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{893:function(e,t,n){"use strict";n.d(t,"a",(function(){return B})),n.d(t,"b",(function(){return T}));var r=n(0),o=n.n(r);n(897);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function a(e,t){return(a=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=s(e);if(t){var o=s(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&a(e,t)}(l,e);var t,n,r,c=f(l);function l(){return u(this,l),c.apply(this,arguments)}return t=l,(n=[{key:"render",value:function(){var e=this.props,t=e.icon,n=e.size,r=e.color;return o.a.createElement("i",{className:"hover-fx ".concat(t," ").concat(n," ").concat(r)})}}])&&i(t.prototype,n),r&&i(t,r),l}(r.Component);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function m(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var o=d(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(u,e);var t,n,r,c=m(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=c.call(this,e)).state={value:e.value,main_values:e.main_values,options:e.options},t}return t=u,(n=[{key:"render",value:function(){var e=this,t=this.props,n=t.name,r=t.mn_name,c=t.className,u=t.children,i=this.state,a=(i.value,i.main_values,i.options);return Array(),u.length,o.a.createElement("select",{name:n,id:"id_".concat(n),style:{fontSize:"0.8rem"},className:c||" custom-select",onChange:function(t){return e.props.handleOnChangeSelect(t.target.value,n)}},o.a.createElement("option",{value:""},"--- ",r," сонгоно уу ---"),a.map((function(e,t){return o.a.createElement("option",{key:t,value:e.code_list_id},e.code_list_name)})))}}])&&b(t.prototype,n),r&&b(t,r),u}(r.PureComponent);function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function w(){return(w=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function j(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function P(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function S(e,t){return(S=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function E(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=k(e);if(t){var o=k(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return R(this,n)}}function R(e,t){return!t||"object"!==g(t)&&"function"!=typeof t?x(e):t}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&S(e,t)}(u,e);var t,n,r,c=E(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=c.call(this,e)).state={value:e.value,children:[]},t.handleOnChange=t.handleOnChange.bind(x(t)),t.handleOnChangeSelect=t.handleOnChangeSelect.bind(x(t)),t}return t=u,(n=[{key:"handleOnChange",value:function(e,t){this.props.sendValue(e,t),this.setState({value:e})}},{key:"handleOnChangeSelect",value:function(e,t){var n=this.props.options,r=Array();n.map((function(t,n){t.children&&t.code_list_id==e&&(r=t.children)})),this.setState(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){j(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({value:e},r)),this.props.sendValue(e,t)}},{key:"render",value:function(){var e=this,t=this.props,n=t.name,r=t.type,c=t.mn_name,u=t.placeholder,i=t.className,a=(t.options,t.main_values,this.state),f=a.value,l=a.children;return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"id_".concat(n)},c),"select"==r?o.a.createElement("div",null,l.length>0?o.a.createElement(O,w({},this.props,{handleOnChangeSelect:this.handleOnChangeSelect,value:f})):o.a.createElement(O,w({},this.props,{children:l,handleOnChangeSelect:this.handleOnChangeSelect,value:f}))):"textarea"==r?o.a.createElement("textarea",{className:i||" form-control",name:n,id:"id_".concat(n),cols:"30",rows:"10",onChange:function(t){return e.handleOnChange(t.target.value,n)}}):o.a.createElement("input",{className:i||" form-control",type:r,name:n,placeholder:u,onChange:function(t){return e.handleOnChange(t.target.value,n)}}))}}])&&P(t.prototype,n),r&&P(t,r),u}(r.PureComponent),B=p,T=C},897:function(e,t,n){var r=n(62),o=n(898);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var c={insert:"head",singleton:!1};r(o,c);e.exports=o.locals||{}},898:function(e,t,n){(t=n(63)(!1)).push([e.i,"\n.hover-fx {\n    display: inline-block;\n    cursor: pointer;\n    width: 30px;\n    height: 30px;\n    line-height: 32px;\n    border-radius: 50%;\n    text-align: center;\n    position: relative;\n    color: #f1f3f4;\n    background-color: rgba(255, 255, 255, 0.1);\n    transition: 300ms;\n}\n\n.hover-fx:after {\n    pointer-events: none;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n    content: '';\n    box-sizing: content-box;\n    box-shadow: 0 0 0 3px #f1f3f4;\n    top: 0;\n    left: 0;\n    opacity: 0;\n    transition: 300ms;\n}\n\n.hover-fx:hover {\n    background-color: #f1f3f4;\n    color: #f1f3f4;\n}\n\n.hover-fx:hover:after {\n    opacity: 1;\n    transform: scale(1.15);\n}",""]),e.exports=t},978:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return L}));var r=n(0),o=n.n(r),c=n(46),u=n(29);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(i,e);var t,n,r,c=l(i);function i(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,e)}return t=i,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card-body"},o.a.createElement("h1",null,"hello"),o.a.createElement(u.c,{className:"btn btn-block btn-primary",to:"/gov/tseg-personal/add/"},"nemeh"))}}])&&a(t.prototype,n),r&&a(t,r),i}(r.Component);function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=O(e);if(t){var o=O(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return d(this,n)}}function d(e,t){return!t||"object"!==b(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function O(e){return(O=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var g=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(i,e);var t,n,r,c=v(i);function i(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,e)}return t=i,(n=[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,"hi"),o.a.createElement(u.c,{className:"btn btn-block btn-primary",to:"/gov/tseg-personal/add/"},"nemeh"))}}])&&h(t.prototype,n),r&&h(t,r),i}(r.Component),w=n(49);function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function j(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var P={getFormFields:function(){var e=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach((function(t){j(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},Object(w.a)());return fetch("".concat("/gov/api/tseg","/get-fields/"),e).then(w.c)}};var S=n(893);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function R(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function x(e,t){return(x=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function k(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=T(e);if(t){var o=T(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return C(this,n)}}function C(e,t){return!t||"object"!==E(t)&&"function"!=typeof t?B(e):t}function B(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var N=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&x(e,t)}(u,e);var t,n,r,c=k(u);function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=c.call(this,e)).state={fields:[],values:{}},t.getFields=t.getFields.bind(B(t)),t.getValue=t.getValue.bind(B(t)),t}return t=u,(n=[{key:"getValue",value:function(e,t){var n=this.state.values;n[t]=e,this.setState({values:n})}},{key:"componentDidMount",value:function(){this.getFields()}},{key:"getFields",value:function(){var e=this;P.getFormFields().then((function(t){var n=t.success,r=t.fields;n&&e.setState({fields:r})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.fields,r=t.values;return o.a.createElement("div",{className:"card-body"},o.a.createElement("h1",null,"Nemeh bolon zasah"),n.map((function(t,n){return o.a.createElement(S.b,{key:n,mn_name:t.property_name,name:t.property_id,placeholder:t.property_name,type:t.value_type_id,sendValue:e.getValue,options:t.data_list,main_values:r})})))}}])&&R(t.prototype,n),r&&R(t,r),u}(r.Component);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function F(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function V(e,t){return(V=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=J(e);if(t){var o=J(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return A(this,n)}}function A(e,t){return!t||"object"!==D(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function J(e){return(J=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var M=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&V(e,t)}(u,e);var t,n,r,c=z(u);function u(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),c.call(this,e)}return t=u,(n=[{key:"render",value:function(){return o.a.createElement("div",null,o.a.createElement("h1",null,"Ustan Nemeh bolon zasah"))}}])&&F(t.prototype,n),r&&F(t,r),u}(r.Component);function U(e){return(U="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function q(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function G(e,t){return(G=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=K(e);if(t){var o=K(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return I(this,n)}}function I(e,t){return!t||"object"!==U(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function K(e){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var L=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&G(e,t)}(i,e);var t,n,r,u=H(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=u.call(this,e)).state={},t}return t=i,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement(c.c,null,o.a.createElement(c.a,{path:"/gov/tseg-personal/list/",component:y}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/list/",component:g}),o.a.createElement(c.a,{path:"/gov/tseg-personal/add/",component:N}),o.a.createElement(c.a,{path:"/gov/tseg-personal/:id/edit/",component:N}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/add/",component:M}),o.a.createElement(c.a,{path:"/gov/tseg-personal/tseg-ustsan/:id/edit/",component:M})))}}])&&q(t.prototype,n),r&&q(t,r),i}(r.Component)}}]);