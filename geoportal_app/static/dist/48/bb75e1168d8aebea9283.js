(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{981:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return B}));var n=r(0),o=r.n(n),a=r(46),c=r(49);function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var f={revokeState:function(e,t){var r=u(u({},Object(c.b)()),{},{body:JSON.stringify({id:e,state:t})});return fetch("".concat(s,"/revoke-change-state/"),r).then(c.c)},paginatedList:function(e,t,r,n){var o=u(u({},Object(c.b)()),{},{body:JSON.stringify({page:e,per_page:t,query:r,state:n})});return fetch("".concat(s,"/revoke-search/"),o).then(c.c)},getChoices:function(){var e=u({},Object(c.a)());return fetch("".concat(s,"/get_choices/"),e).then(c.c)}},s="/gov/api/revoke_request";var p=r(890),y=r(910),h=r(906);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?m(Object(r),!0).forEach((function(t){_(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function _(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function v(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=k(e);if(t){var o=k(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return j(this,r)}}function j(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?w(e):t}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var P=function(e){var t=e.values;return t.org+"/"+t.employee},E=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(c,e);var t,r,n,a=O(c);function c(e){var t,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(r=a.call(this,e)).state=(_(t={items:[],is_loading:!1,search_query:"",current_page:1,revoke_per_page:20,list_length:null,search_state:"",state:null,kind:null,search_geom:null,theme_id:null,package_id:null,feature_id:null},"is_loading",!1),_(t,"refresh",!1),_(t,"талбарууд",[{field:"theme_name",title:"Орон зайн өгөгдөл",has_action:!1,is_sort:!0},{field:"org",title:"Байгууллага / мэргэжилтэн",has_action:!0},{field:"order_no",title:"Тушаалын дугаар"},{field:"order_at",title:"Тушаал гарсан огноо"},{field:"created_at",title:"Огноо"},{field:"state",title:"Төлөв",has_action:!0}]),_(t,"жагсаалтын_холбоос","/gov/api/revoke_request/"),_(t,"хувьсах_талбарууд",[{field:"org",component:P},{field:"theme_name",component:y.a,props:{refreshData:function(){return r.refreshData()}}},{field:"state",action:function(e){return"ШИНЭ"==(t=e)?r="text-warning":"ТАТГАЛЗСАН"==t?r="text-danger":("ЗӨВШӨӨРСӨН"==t||"ХЯНАХ"==t)&&(r="text-success"),r;var t,r},action_type:!0}]),_(t,"нэмэлт_талбарууд",[{title:"Шийдвэрлэх",component:h.a,props:{hide_btn:!1,refreshData:function(){return r.refreshData()}}},{title:"Харах",component:h.a,props:{is_not_array:!0,button_name:"Үзэх",hide_btn:!0,refreshData:function(){return r.refreshData()}}}]),_(t,"custom_query",{}),t),r.setLoading=r.setLoading.bind(w(r)),r.handleSearch=r.handleSearch.bind(w(r)),r.refreshData=r.refreshData.bind(w(r)),r}return t=c,(r=[{key:"componentDidMount",value:function(){var e=this;f.getChoices().then((function(t){var r=t.success,n=t.modules,o=t.choices;r&&e.setState({modules:n,choices:o})}))}},{key:"refreshData",value:function(){this.setState({refresh:!this.state.refresh})}},{key:"setLoading",value:function(){this.setState({is_loading:!0})}},{key:"onChangeItems",value:function(e,t,r){var n,o,a,c=Object();this.state[r].map((function(r,n){r.id==e&&(o=r[t])})),"modules"==r?(a="theme_id",c.package_id=null,c.feature_id=null):"packages"==r&&(a="package_id",c.feature_id=null),this.setState(b((_(n={},t,o),_(n,a,e),n),c))}},{key:"handleSearch",value:function(){var e=this.state,t=(e.field,e.state),r=e.theme_id,n=e.package_id,o=e.feature_id,a=Object();t&&(a.state=t),r&&(a.theme_id=r),n&&(a.package_id=n),o&&(a.feature_id=o);var c=Object();"theme_id"in a||("package_id"in a&&(delete a.package_id,c.package_id=null),"feature_id"in a&&(delete a.feature_id,c.feature_id=null)),"package_id"in a||"feature_id"in a&&(delete a.feature_id,c.feature_id=null),this.setState(b({custom_query:a},c))}},{key:"render",value:function(){var e=this,t=this.state,r=t.choices,n=t.modules,a=this.state,c=a.жагсаалтын_холбоос,i=a.талбарууд,u=a.хувьсах_талбарууд,l=a.нэмэлт_талбарууд,f=a.refresh;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"col-md-12 row"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Орон зайн өгөгдөл"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.onChangeItems(t.target.value,"packages","modules")}},o.a.createElement("option",{value:""},"--- Дэд сангаар хайх ---"),n&&n.length>0?n.map((function(e,t){return o.a.createElement("option",{key:t,value:e.id},e.name)})):null)),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Төлөв"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.setState({state:t.target.value})}},o.a.createElement("option",{value:""},"--- Төлөвөөр хайх ---"),r&&r.length>0?r[0].map((function(e,t){return o.a.createElement("option",{key:t,value:e[0]},e[1])})):null)),o.a.createElement("button",{className:"btn gp-btn-primary d-flex justify-content-center m-3 float-right",onClick:function(){return e.handleSearch()}},"Хайх")),o.a.createElement("br",null),o.a.createElement("div",{className:"col-md-12"},o.a.createElement(p.a,{refresh:f,color:"primary","талбарууд":i,"жагсаалтын_холбоос":c,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":u,"нэмэлт_талбарууд":l,max_data:"open","хайлт":"closed",sort_name:"-created_at",custom_query:this.state.custom_query}))))}}])&&v(t.prototype,r),n&&v(t,n),c}(n.Component);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function D(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function x(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=q(e);if(t){var o=q(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return N(this,r)}}function N(e,t){return!t||"object"!==S(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function q(e){return(q=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var B=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(i,e);var t,r,n,c=C(i);function i(){return D(this,i),c.apply(this,arguments)}return t=i,(r=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/revoke-request/",component:E}))}}])&&x(t.prototype,r),n&&x(t,n),i}(n.Component)}}]);