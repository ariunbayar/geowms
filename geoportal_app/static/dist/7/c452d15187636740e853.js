(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1013:function(e,t,n){"use strict";(function(e){var o=n(0),a=n.n(o),r=n(941),i=n(973);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=m(e);if(t){var a=m(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?p(e):t}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(m,t);var n,o,c,f=u(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=f.call(this,e)).state={refresh:!1,"талбарууд":[{field:"name",title:"Албан тушаал"}],"хувьсах_талбарууд":[{field:"name",text:""}],"нэмэлт_талбарууд":[{title:"Засах",text:"",icon:"fa fa-pencil-square-o text-success",action:function(e){return t.handleEdit(e)}},{title:"Устгах",text:"",icon:"fa fa-trash-o text-danger",action:function(e){return t.handleAsk(e)},width:"100px"}],"жагсаалтын_холбоос":"","нэмэх_товч":"",custom_query:{},back_link:""},t.handleRemove=t.handleRemove.bind(p(t)),t.handleConfig=t.handleConfig.bind(p(t)),t.handleAsk=t.handleAsk.bind(p(t)),t}return n=m,(o=[{key:"UNSAFE_componentWillMount",value:function(){this.handleConfig()}},{key:"handleEdit",value:function(e){var t=this.props.match.params,n=t.level,o=t.id;this.props.is_backend?this.props.history.push("/back/байгууллага/түвшин/".concat(n,"/").concat(o,"/position/").concat(e.id,"/edit/")):this.props.history.push("/gov/perm/position/".concat(e.id,"/edit/"))}},{key:"handleConfig",value:function(){if(this.props.is_backend){var e=this.props.match.params,t=e.level,n=e.id;this.setState({"жагсаалтын_холбоос":"/back/api/org/".concat(n,"/position/"),custom_query:{org_id:n},"нэмэх_товч":"/back/байгууллага/түвшин/".concat(t,"/").concat(n,"/position/create/"),back_link:"/back/байгууллага/түвшин/".concat(t,"/").concat(n,"/position/")})}else this.setState({"жагсаалтын_холбоос":"/gov/api/role/position/","нэмэх_товч":"/gov/perm/position/create/",back_link:"/gov/api/role/position/"})}},{key:"handleAsk",value:function(t){var n,o=this;n=this.props.is_backend?"/back/api/org/".concat(t.id,"/position/remove/"):"/gov/api/role/position/".concat(t.id,"/remove/");var a={modal_status:"open",modal_icon:"fa fa-exclamation-circle",modal_bg:"",icon_color:"warning",title:"Албан тушаал устгах",text:'Та "'.concat(t.name,'" нэртэй албан тушаалыг устгах уу?'),has_button:!0,actionNameBack:"Үгүй",actionNameDelete:"Тийм",modalAction:function(){return o.handleRemove(n)},modalClose:null};e.MODAL(a)}},{key:"handleRemove",value:function(t){var n=this;i.a.getRequest(t).then((function(t){var o=t.success,a=t.data,r=t.error;if(o){n.setState({refresh:!n.state.refresh});var i={modal_status:"open",modal_icon:"fa fa-check-circle",modal_bg:"",icon_color:"success",title:a,text:"",has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};e.MODAL(i)}else{var c={modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:"Алдаа гарлаа",text:r,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};e.MODAL(c)}}))}},{key:"render",value:function(){var e=this.state,t=e.refresh,n=e.талбарууд,o=e.жагсаалтын_холбоос,i=e.хувьсах_талбарууд,c=e.custom_query,l=e.нэмэх_товч,s=e.нэмэлт_талбарууд,u=e.body;return a.a.createElement("div",{className:"".concat(this.props.is_backend?"":"card")},a.a.createElement("div",{className:"".concat(this.props.is_backend?"":"card-body")},a.a.createElement("div",{className:"col-md-12"},a.a.createElement(r.a,{refresh:t,color:"bg-dark","талбарууд":n,"жагсаалтын_холбоос":o,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":i,"нэмэх_товч":l||null,custom_query:c,"нэмэлт_талбарууд":s,body:u}))))}}])&&l(n.prototype,o),c&&l(n,c),m}(o.Component);t.a=d}).call(this,n(121))},1014:function(e,t,n){"use strict";(function(e){var o=n(0),a=n.n(o),r=n(21),i=n(35),c=n(973);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=d(e);if(t){var a=d(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var b=Object(i.c)().shape({name:Object(i.d)().max(250,"250-с илүүгүй урттай утга оруулна уу!").required("Хоосон байна утга оруулна уу.")}),h=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(p,t);var n,o,i,l=f(p);function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=l.call(this,e)).state={form_values:{name:""},is_backend:e.is_backend,org_id:e.match.params.id,level:e.match.params.level,link:"",back_link:"",pos_id:e.match.params.pos_id?e.match.params.pos_id:null},t.handleSubmit=t.handleSubmit.bind(m(t)),t.handleConfig=t.handleConfig.bind(m(t)),t.handleDetail=t.handleDetail.bind(m(t)),t}return n=p,(o=[{key:"UNSAFE_componentWillMount",value:function(){this.handleConfig()}},{key:"handleConfig",value:function(){var e,t=this.state,n=t.org_id,o=t.level,a=t.is_backend,r=t.pos_id;a?(this.setState({link:"/back/api/org/".concat(n,"/position/create/"),back_link:"/back/байгууллага/түвшин/".concat(o,"/").concat(n,"/position/")}),r&&(e="/back/api/org/".concat(r,"/position/detail/"),this.handleDetail(e))):(this.setState({link:"/gov/api/role/position/create/",back_link:"/gov/perm/position/"}),r&&(e="/gov/api/role/position/".concat(r,"/detail/"),this.handleDetail(e)))}},{key:"handleDetail",value:function(e){var t=this;c.a.getRequest(e).then((function(e){var n=e.success,o=e.datas;n&&t.setState({form_values:{name:o.name}})}))}},{key:"handleSubmit",value:function(t,n){var o=this,a=n.setSubmitting,r=n.setErrors,i=this.state,l=i.pos_id,s=i.org_id,u=i.is_backend,f=this.state.link;l&&(t.pos_id=l,f=u?"/back/api/org/".concat(s,"/position/edit/"):"/gov/api/role/position/".concat(l,"/edit/")),c.a.postRequest(f,t).then((function(t){var n=t.success,a=t.data,i=t.error;if(n){var c={modal_status:"open",modal_icon:"fa fa-check-circle",modal_bg:"",icon_color:"success",title:"Амжилттай хадгаллаа",text:a,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:function(){return o.props.history.push(o.state.back_link)}};e.MODAL(c)}else{r({name:i});var l={modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:"Алдаа гарлаа",text:i,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};e.MODAL(l)}})),a(!1)}},{key:"render",value:function(){var e=this.state,t=e.form_values,n=e.is_backend;return e.check,a.a.createElement("div",{className:"".concat(!n&&"card")},a.a.createElement("div",{className:"".concat(!n&&"card-body")},a.a.createElement("div",{className:"row"},a.a.createElement(r.e,{enableReinitialize:!0,initialValues:t,validationSchema:b,onSubmit:this.handleSubmit},(function(e){var t=e.errors,n=e.isSubmitting;return a.a.createElement(r.d,{className:"col-12"},a.a.createElement("div",{className:"form-group col-md-6"},a.a.createElement("label",{htmlFor:"id_name"},"Албан тушаал"),a.a.createElement(r.b,{className:"form-control ".concat(t.name?"is-invalid":""),name:"name",id:"id_name",type:"text",placeholder:"Албан тушаал"}),a.a.createElement(r.a,{name:"name",component:"div",className:"invalid-feedback"})),a.a.createElement("div",{className:"form-group pl-2"},a.a.createElement("button",{type:"submit",className:"btn btn-primary waves-effect waves-light m-1",disabled:n},n&&a.a.createElement("i",{className:"fa fa-spinner fa-spin"}),n&&a.a.createElement("a",{className:"text-light"},"Шалгаж байна."),!n&&"Хадгалах")))})))))}}])&&s(n.prototype,o),i&&s(n,i),p}(o.Component);t.a=h}).call(this,n(121))},892:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return b}));var o=n(0),a=n.n(o),r=n(14),i=n(1013),c=n(1014);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=d(e);if(t){var a=d(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return m(this,n)}}function m(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var b=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(m,e);var t,n,o,l=p(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=l.call(this,e)).state={is_backend:!1,is_allow:!1},t}return t=m,(n=[{key:"componentDidMount",value:function(){var e=this.props,t=e.is_superuser,n=e.is_admin,o=this.state;o.is_backend,o.is_allow,t?this.setState({is_backend:!0,is_allow:t}):this.setState({is_backend:!1,is_allow:n})}},{key:"render",value:function(){var e=this.state,t=e.is_allow,n=e.is_backend;return a.a.createElement(r.c,null,t&&a.a.createElement(a.a.Fragment,null,a.a.createElement(r.a,{exact:!0,path:"/gov/perm/position/",component:function(e){return a.a.createElement(i.a,s({},e,{is_backend:n}))}}),a.a.createElement(r.a,{exact:!0,path:"/gov/perm/position/create/",component:function(e){return a.a.createElement(c.a,s({},e,{is_backend:n}))}}),a.a.createElement(r.a,{exact:!0,path:"/gov/perm/position/:pos_id/edit/",component:function(e){return a.a.createElement(c.a,s({},e,{is_backend:n}))}}),a.a.createElement(r.a,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/",component:function(e){return a.a.createElement(i.a,s({},e,{is_backend:n}))}}),a.a.createElement(r.a,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/create/",component:function(e){return a.a.createElement(c.a,s({},e,{is_backend:n}))}}),a.a.createElement(r.a,{exact:!0,path:"/back/байгууллага/түвшин/:level/:id/position/:pos_id/edit/",component:function(e){return a.a.createElement(c.a,s({},e,{is_backend:n}))}})))}}])&&u(t.prototype,n),o&&u(t,o),m}(o.Component)},959:function(e,t,n){"use strict";n.d(t,"c",(function(){return a})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return i}));function o(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),o=0;o<n.length;o++){var a=n[o].trim();if(a.substring(0,e.length+1)===e+"="){t=decodeURIComponent(a.substring(e.length+1));break}}return t}function a(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var o=e.status,a={text:n&&n.message||e.statusText,code:o};return Promise.reject(a)}return n}))}function r(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":o("csrftoken")}}}function i(){return{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}}},973:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var o=n(959);function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var c={getRequest:function(e){var t=r({},Object(o.a)());return fetch(e,t).then(o.c)},postRequest:function(e,t){var n=r(r({},Object(o.b)()),{},{body:JSON.stringify(t)});return fetch(e,n).then(o.c)}}}}]);