(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1012:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var o=n(15);function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c={getRequest:function(t){var e=a({},Object(o.a)());return fetch(t,e).then(o.c)},postRequest:function(t,e){var n=a(a({},Object(o.b)()),{},{body:JSON.stringify(e)});return fetch(t,n).then(o.c)}}},1051:function(t,e,n){"use strict";(function(t){var o=n(0),r=n.n(o),a=n(979),i=n(1012);function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function l(t,e){return(l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function u(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=m(t);if(e){var r=m(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return f(this,n)}}function f(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?p(t):e}function p(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function m(t){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var d=function(e){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&l(t,e)}(m,e);var n,o,c,f=u(m);function m(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,m),(e=f.call(this,t)).state={refresh:!1,"талбарууд":[{field:"name",title:"Албан тушаал"}],"хувьсах_талбарууд":[{field:"name",text:""}],"нэмэлт_талбарууд":[{title:"Засах",text:"",icon:"fa fa-pencil-square-o text-success",action:function(t){return e.handleEdit(t)}},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(t){return e.handleAsk(t)},width:"100px"}],"жагсаалтын_холбоос":"","нэмэх_товч":"",custom_query:{},back_link:""},e.handleRemove=e.handleRemove.bind(p(e)),e.handleConfig=e.handleConfig.bind(p(e)),e.handleAsk=e.handleAsk.bind(p(e)),e}return n=m,(o=[{key:"UNSAFE_componentWillMount",value:function(){this.handleConfig()}},{key:"handleEdit",value:function(t){var e=this.props.match.params,n=e.level,o=e.id;this.props.is_backend?this.props.history.push("/back/байгууллага/түвшин/".concat(n,"/").concat(o,"/position/").concat(t.id,"/edit/")):this.props.history.push("/gov/perm/position/".concat(t.id,"/edit/"))}},{key:"handleConfig",value:function(){if(this.props.is_backend){var t=this.props.match.params,e=t.level,n=t.id;this.setState({"жагсаалтын_холбоос":"/back/api/org/".concat(n,"/position/"),custom_query:{org_id:n},"нэмэх_товч":"/back/байгууллага/түвшин/".concat(e,"/").concat(n,"/position/create/"),back_link:"/back/байгууллага/түвшин/".concat(e,"/").concat(n,"/position/")})}else this.setState({"жагсаалтын_холбоос":"/gov/api/role/position/","нэмэх_товч":"/gov/perm/position/create/",back_link:"/gov/api/role/position/"})}},{key:"handleAsk",value:function(e){var n,o=this;n=this.props.is_backend?"/back/api/org/".concat(e.id,"/position/remove/"):"/gov/api/role/position/".concat(e.id,"/remove/");var r={modal_status:"open",modal_icon:"fa fa-exclamation-circle",modal_bg:"",icon_color:"warning",title:"Албан тушаал устгах",text:'Та "'.concat(e.name,'" нэртэй албан тушаалыг устгах уу?'),has_button:!0,actionNameBack:"Үгүй",actionNameDelete:"Тийм",modalAction:function(){return o.handleRemove(n)},modalClose:null};t.MODAL(r)}},{key:"handleRemove",value:function(e){var n=this;i.a.getRequest(e).then((function(e){var o=e.success,r=e.data,a=e.error;if(o){n.setState({refresh:!n.state.refresh});var i={modal_status:"open",modal_icon:"fa fa-check-circle",modal_bg:"",icon_color:"success",title:r,text:"",has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};t.MODAL(i)}else{var c={modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:"Алдаа гарлаа",text:a,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};t.MODAL(c)}}))}},{key:"render",value:function(){var t=this.state,e=t.refresh,n=t.талбарууд,o=t.жагсаалтын_холбоос,i=t.хувьсах_талбарууд,c=t.custom_query,s=t.нэмэх_товч,l=t.нэмэлт_талбарууд,u=t.body;return r.a.createElement("div",{className:"".concat(this.props.is_backend?"":"card")},r.a.createElement("div",{className:"".concat(this.props.is_backend?"":"card-body")},r.a.createElement("div",{className:"col-md-12"},r.a.createElement(a.a,{refresh:e,color:"bg-dark","талбарууд":n,"жагсаалтын_холбоос":o,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":i,"нэмэх_товч":s||null,custom_query:c,"нэмэлт_талбарууд":l,body:u}))))}}])&&s(n.prototype,o),c&&s(n,c),m}(o.Component);e.a=d}).call(this,n(47))},1052:function(t,e,n){"use strict";(function(t){var o=n(0),r=n.n(o),a=n(22),i=n(36),c=n(1012);function s(t){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function f(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=d(t);if(e){var r=d(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return p(this,n)}}function p(t,e){return!e||"object"!==s(e)&&"function"!=typeof e?m(t):e}function m(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var b=Object(i.c)().shape({name:Object(i.d)().max(250,"250-с илүүгүй урттай утга оруулна уу!").required("Хоосон байна утга оруулна уу.")}),h=function(e){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(p,e);var n,o,i,s=f(p);function p(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,p),(e=s.call(this,t)).state={form_values:{name:""},is_backend:t.is_backend,org_id:t.match.params.id,level:t.match.params.level,link:"",back_link:"",pos_id:t.match.params.pos_id?t.match.params.pos_id:null},e.handleSubmit=e.handleSubmit.bind(m(e)),e.handleConfig=e.handleConfig.bind(m(e)),e.handleDetail=e.handleDetail.bind(m(e)),e}return n=p,(o=[{key:"UNSAFE_componentWillMount",value:function(){this.handleConfig()}},{key:"handleConfig",value:function(){var t,e=this.state,n=e.org_id,o=e.level,r=e.is_backend,a=e.pos_id;r?(this.setState({link:"/back/api/org/".concat(n,"/position/create/"),back_link:"/back/байгууллага/түвшин/".concat(o,"/").concat(n,"/position/")}),a&&(t="/back/api/org/".concat(a,"/position/detail/"),this.handleDetail(t))):(this.setState({link:"/gov/api/role/position/create/",back_link:"/gov/perm/position/"}),a&&(t="/gov/api/role/position/".concat(a,"/detail/"),this.handleDetail(t)))}},{key:"handleDetail",value:function(t){var e=this;c.a.getRequest(t).then((function(t){var n=t.success,o=t.datas;n&&e.setState({form_values:{name:o.name}})}))}},{key:"handleSubmit",value:function(e,n){var o=this,r=n.setSubmitting,a=n.setErrors,i=this.state,s=i.pos_id,l=i.org_id,u=i.is_backend,f=this.state.link;s&&(e.pos_id=s,f=u?"/back/api/org/".concat(l,"/position/edit/"):"/gov/api/role/position/".concat(s,"/edit/")),c.a.postRequest(f,e).then((function(e){var n=e.success,r=e.data,i=e.error;if(n){var c={modal_status:"open",modal_icon:"fa fa-check-circle",modal_bg:"",icon_color:"success",title:"Амжилттай хадгаллаа",text:r,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:function(){return o.props.history.push(o.state.back_link)}};t.MODAL(c)}else{a({name:i});var s={modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:"Алдаа гарлаа",text:i,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};t.MODAL(s)}})),r(!1)}},{key:"render",value:function(){var t=this.state,e=t.form_values,n=t.is_backend;return t.check,r.a.createElement("div",{className:"".concat(!n&&"card")},r.a.createElement("div",{className:"".concat(!n&&"card-body")},r.a.createElement("div",{className:"row"},r.a.createElement(a.e,{enableReinitialize:!0,initialValues:e,validationSchema:b,onSubmit:this.handleSubmit},(function(t){var e=t.errors,n=t.isSubmitting;return r.a.createElement(a.d,{className:"col-12"},r.a.createElement("div",{className:"form-group col-md-6"},r.a.createElement("label",{htmlFor:"id_name"},"Албан тушаал"),r.a.createElement(a.b,{className:"form-control ".concat(e.name?"is-invalid":""),name:"name",id:"id_name",type:"text",placeholder:"Албан тушаал"}),r.a.createElement(a.a,{name:"name",component:"div",className:"invalid-feedback"})),r.a.createElement("div",{className:"form-group pl-2"},r.a.createElement("button",{type:"submit",className:"btn btn-primary waves-effect waves-light m-1",disabled:n},n&&r.a.createElement("i",{className:"fa fa-spinner fa-spin"}),n&&r.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!n&&"Хадгалах")))})))))}}])&&l(n.prototype,o),i&&l(n,i),p}(o.Component);e.a=h}).call(this,n(47))},15:function(t,e,n){"use strict";n.d(e,"c",(function(){return r})),n.d(e,"b",(function(){return a})),n.d(e,"a",(function(){return i}));function o(t){var e=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),o=0;o<n.length;o++){var r=n[o].trim();if(r.substring(0,t.length+1)===t+"="){e=decodeURIComponent(r.substring(t.length+1));break}}return e}function r(t){return t.text().then((function(e){var n=e&&JSON.parse(e);if(!t.ok){-1!==[401,403].indexOf(t.status)&&location.reload(!0);var o=t.status,r={text:n&&n.message||t.statusText,code:o};return Promise.reject(r)}return n}))}function a(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":o("csrftoken")}}}function i(){return{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}}},933:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return b}));var o=n(0),r=n.n(o),a=n(13),i=n(1051),c=n(1052);function s(t){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(){return(l=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t}).apply(this,arguments)}function u(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function f(t,e){return(f=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function p(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=d(t);if(e){var r=d(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return m(this,n)}}function m(t,e){return!e||"object"!==s(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var b=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&f(t,e)}(m,t);var e,n,o,s=p(m);function m(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,m),(e=s.call(this,t)).state={is_backend:!1,is_allow:!1},e}return e=m,(n=[{key:"componentDidMount",value:function(){var t=this.props,e=t.is_superuser,n=t.is_admin,o=this.state;o.is_backend,o.is_allow,e?this.setState({is_backend:!0,is_allow:e}):this.setState({is_backend:!1,is_allow:n})}},{key:"render",value:function(){var t=this.state,e=t.is_allow,n=t.is_backend;return r.a.createElement(a.d,null,e&&r.a.createElement(r.a.Fragment,null,r.a.createElement(a.b,{exact:!0,path:"/gov/perm/position/",component:function(t){return r.a.createElement(i.a,l({},t,{is_backend:n}))}}),r.a.createElement(a.b,{exact:!0,path:"/gov/perm/position/create/",component:function(t){return r.a.createElement(c.a,l({},t,{is_backend:n}))}}),r.a.createElement(a.b,{exact:!0,path:"/gov/perm/position/:pos_id/edit/",component:function(t){return r.a.createElement(c.a,l({},t,{is_backend:n}))}}),r.a.createElement(a.b,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/",component:function(t){return r.a.createElement(i.a,l({},t,{is_backend:n}))}}),r.a.createElement(a.b,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/create/",component:function(t){return r.a.createElement(c.a,l({},t,{is_backend:n}))}}),r.a.createElement(a.b,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/:pos_id/edit/",component:function(t){return r.a.createElement(c.a,l({},t,{is_backend:n}))}})))}}])&&u(e.prototype,n),o&&u(e,o),m}(o.Component)}}]);