(window.webpackJsonp=window.webpackJsonp||[]).push([[47],{979:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return B}));var r=n(0),o=n.n(r),a=n(49),c=n(48);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var f={revokeState:function(e,t){var n=u(u({},Object(c.b)()),{},{body:JSON.stringify({id:e,state:t})});return fetch("".concat(s,"/revoke-change-state/"),n).then(c.c)},paginatedList:function(e,t,n,r){var o=u(u({},Object(c.b)()),{},{body:JSON.stringify({page:e,per_page:t,query:n,state:r})});return fetch("".concat(s,"/revoke-search/"),o).then(c.c)},getChoices:function(){var e=u({},Object(c.a)());return fetch("".concat(s,"/get_choices/"),e).then(c.c)}},s="/gov/api/revoke_request";var p=n(888),h=n(908),y=n(904);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?m(Object(n),!0).forEach((function(t){_(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):m(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function _(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=k(e);if(t){var o=k(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return j(this,n)}}function j(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?w(e):t}function w(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var P=function(e){var t=e.values;return t.org+"/"+t.employee},E=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(c,e);var t,n,r,a=O(c);function c(e){var t,n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(n=a.call(this,e)).state=(_(t={items:[],is_loading:!1,search_query:"",current_page:1,revoke_per_page:20,list_length:null,search_state:"",state:null,kind:null,search_geom:null,theme_id:null,package_id:null,feature_id:null},"is_loading",!1),_(t,"refresh",!1),_(t,"талбарууд",[{field:"theme_name",title:"Орон зайн өгөгдөл",has_action:!1,is_sort:!0},{field:"org",title:"Байгууллага / мэргэжилтэн",has_action:!0},{field:"order_no",title:"Тушаалын дугаар"},{field:"order_at",title:"Тушаал гарсан огноо"},{field:"created_at",title:"Огноо"},{field:"state",title:"Төлөв",has_action:!0}]),_(t,"жагсаалтын_холбоос","/gov/api/revoke_request/"),_(t,"хувьсах_талбарууд",[{field:"org",component:P},{field:"theme_name",component:h.a,props:{refreshData:function(){return n.refreshData()}}},{field:"state",action:function(e){return"ШИНЭ"==(t=e)?n="text-warning":"ТАТГАЛЗСАН"==t?n="text-danger":("ЗӨВШӨӨРСӨН"==t||"ХЯНАХ"==t)&&(n="text-success"),n;var t,n},action_type:!0}]),_(t,"нэмэлт_талбарууд",[{title:"Шийдвэрлэх",component:y.a,props:{button_name:"Шийдвэрлэх",hide_btn:!1,refreshData:function(){return n.refreshData()}}},{title:"Харах",component:y.a,props:{button_name:"Үзэх",hide_btn:!0,refreshData:function(){return n.refreshData()}}}]),_(t,"custom_query",{}),t),n.setLoading=n.setLoading.bind(w(n)),n.handleSearch=n.handleSearch.bind(w(n)),n.refreshData=n.refreshData.bind(w(n)),n}return t=c,(n=[{key:"componentDidMount",value:function(){var e=this;f.getChoices().then((function(t){var n=t.success,r=t.modules,o=t.choices;n&&e.setState({modules:r,choices:o})}))}},{key:"refreshData",value:function(){this.setState({refresh:!this.state.refresh})}},{key:"setLoading",value:function(){this.setState({is_loading:!0})}},{key:"onChangeItems",value:function(e,t,n){var r,o,a,c=Object();this.state[n].map((function(n,r){n.id==e&&(o=n[t])})),"modules"==n?(a="theme_id",c.package_id=null,c.feature_id=null):"packages"==n&&(a="package_id",c.feature_id=null),this.setState(b((_(r={},t,o),_(r,a,e),r),c))}},{key:"handleSearch",value:function(){var e=this.state,t=(e.field,e.state),n=e.theme_id,r=e.package_id,o=e.feature_id,a=Object();t&&(a.state=t),n&&(a.theme_id=n),r&&(a.package_id=r),o&&(a.feature_id=o);var c=Object();"theme_id"in a||("package_id"in a&&(delete a.package_id,c.package_id=null),"feature_id"in a&&(delete a.feature_id,c.feature_id=null)),"package_id"in a||"feature_id"in a&&(delete a.feature_id,c.feature_id=null),this.setState(b({custom_query:a},c))}},{key:"render",value:function(){var e=this,t=this.state,n=t.choices,r=t.modules,a=this.state,c=a.жагсаалтын_холбоос,i=a.талбарууд,u=a.хувьсах_талбарууд,l=a.нэмэлт_талбарууд,f=a.refresh;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"col-md-12 row"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Орон зайн өгөгдөл"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.onChangeItems(t.target.value,"packages","modules")}},o.a.createElement("option",{value:""},"--- Дэд сангаар хайх ---"),r&&r.length>0?r.map((function(e,t){return o.a.createElement("option",{key:t,value:e.id},e.name)})):null)),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("label",{htmlFor:""},"Төлөв"),o.a.createElement("select",{className:"form-control form-control-xs",onChange:function(t){return e.setState({state:t.target.value})}},o.a.createElement("option",{value:""},"--- Төлөвөөр хайх ---"),n&&n.length>0?n[0].map((function(e,t){return o.a.createElement("option",{key:t,value:e[0]},e[1])})):null)),o.a.createElement("button",{className:"btn gp-btn-primary d-flex justify-content-center m-3 float-right",onClick:function(){return e.handleSearch()}},"Хайх")),o.a.createElement("br",null),o.a.createElement("div",{className:"col-md-12"},o.a.createElement(p.a,{refresh:f,color:"primary","талбарууд":i,"жагсаалтын_холбоос":c,per_page:20,"уншиж_байх_үед_зурвас":"Хүсэлтүүд уншиж байна","хувьсах_талбарууд":u,"нэмэлт_талбарууд":l,max_data:"open","хайлт":"closed",sort_name:"-created_at",custom_query:this.state.custom_query}))))}}])&&v(t.prototype,n),r&&v(t,r),c}(r.Component);function S(e){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function D(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function x(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=q(e);if(t){var o=q(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return N(this,n)}}function N(e,t){return!t||"object"!==S(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function q(e){return(q=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var B=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&R(e,t)}(i,e);var t,n,r,c=C(i);function i(){return D(this,i),c.apply(this,arguments)}return t=i,(n=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/gov/revoke-request/",component:E}))}}])&&x(t.prototype,n),r&&x(t,r),i}(r.Component)}}]);