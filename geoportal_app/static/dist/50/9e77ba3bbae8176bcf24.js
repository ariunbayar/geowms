(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{971:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return w}));var r=n(0),o=n.n(r),i=n(13),c=n(979);function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,e){return(a=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=p(t);if(e){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(t,e){return!e||"object"!==u(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&a(t,e)}(u,t);var e,n,r,i=l(u);function u(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),(e=i.call(this,t)).state={refresh:!1,"жагсаалтын_холбоос":"/back/payment/payment-list/",custom_query:{},"талбарууд":[{field:"user_firstname",title:"Хэрэглэгч",has_action:!0},{field:"is_success",title:"Төлөв"},{field:"total_amount",title:"Нийт дүн"},{field:"description",title:"Тодорхойлолт"},{field:"code",title:"Код"},{field:"message",title:"Мэдэгдэл"},{field:"data_id",title:"Дата ID"},{field:"bank_unique_number",title:"Банкны дугаар"},{field:"geo_unique_number",title:"Гео дугаар"},{field:"created_at",title:"Огноо"}],"хувьсах_талбарууд":[{field:"user_firstname",action:function(t){return e.go_link(t)}},{field:"is_success",text:""},{field:"total_amount",text:""},{field:"description",text:""},{field:"code",text:""},{field:"message",text:""},{field:"data_id",text:""},{field:"bank_unique_number",text:""},{field:"geo_unique_number",text:""},{field:"created_at",text:""}]},e}return e=u,(n=[{key:"go_link",value:function(t){this.props.history.push("/back/user/".concat(t.user_id,"/дэлгэрэнгүй/"))}},{key:"render",value:function(){var t=this.state,e=t.refresh,n=t.талбарууд,r=t.жагсаалтын_холбоос,i=t.хувьсах_талбарууд;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement(c.a,{refresh:e,color:"bg-dark","талбарууд":n,"жагсаалтын_холбоос":r,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":i}))))}}])&&f(e.prototype,n),r&&f(e,r),u}(r.Component);function b(t){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function d(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _(t,e){return(_=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function m(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=v(t);if(e){var o=v(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return h(this,n)}}function h(t,e){return!e||"object"!==b(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var w=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_(t,e)}(u,t);var e,n,r,c=m(u);function u(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),c.call(this,t)}return e=u,(n=[{key:"render",value:function(){return o.a.createElement(i.d,null,o.a.createElement(i.b,{exact:!0,path:"/back/log/",component:y}))}}])&&d(e.prototype,n),r&&d(e,r),u}(r.Component)}}]);