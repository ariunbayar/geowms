(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{916:function(e,t,r){"use strict";r.d(t,"a",(function(){return f}));r(2);var n=r(0),a=r.n(n);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=p(e);if(t){var a=p(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return l(this,r)}}function l(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(l,e);var t,r,n,o=s(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={items:[],page:1,total_page:1,is_loading:!1,searchQuery:t.props.searchQuery,sort_name:t.props.sort_name},t.loadPage=t.loadPage.bind(u(t)),t.nextPage=t.nextPage.bind(u(t)),t.prevPage=t.prevPage.bind(u(t)),t.addPage=t.addPage.bind(u(t)),t}return t=l,(r=[{key:"componentDidMount",value:function(){this.loadPage(this.state.page,this.state.searchQuery,this.state.sort_name)}},{key:"componentDidUpdate",value:function(e){if(e.searchQuery!==this.props.searchQuery){var t=this.props.searchQuery;this.setState({searchQuery:t}),this.loadPage(1,t)}if(e.sort_name!==this.props.sort_name){var r=this.props.sort_name,n=this.props.searchQuery;this.setState({sort_name:r}),this.loadPage(1,n,r)}if(e.load!==this.props.load){var a=this.props.d;this.loadPage(1,a)}if(this.props.org_level&&e.org_level!==this.props.org_level){var o=this.props.searchQuery;this.loadPage(1,o)}}},{key:"nextPage",value:function(){this.loadPage(this.state.page+1,this.state.searchQuery,this.state.sort_name)}},{key:"prevPage",value:function(){this.loadPage(this.state.page-1,this.state.searchQuery,this.state.sort_name)}},{key:"loadPage",value:function(e,t,r){var n=this;if(!this.state.is_loading)if(e=Math.max(e,1),e=Math.min(e,this.state.total_page),this.setState({is_loading:!0}),this.props.org_level){var a=this.props.org_level;this.props.paginate(e,t,a,r).then((function(e){var t=e.page,r=e.total_page;n.setState({page:t,total_page:r,is_loading:!1})}))}else this.props.paginate(e,t,r).then((function(e){var t=e.page,r=e.total_page;n.setState({page:t,total_page:r,is_loading:!1})}))}},{key:"addPage",value:function(e){var t=e.target.value;this.setState({page:t}),this.loadPage(t,"")}},{key:"render",value:function(){for(var e=this,t=this.state,r=t.page,n=t.total_page,o=[],c=r;c<=n;c++)o.push(a.a.createElement("li",{className:"page-item",key:c},a.a.createElement("a",{className:"page-link"},c)));return a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"float-left"},a.a.createElement("strong",{className:"gp-text-primary"},"Хуудас ",r,"-",n)),a.a.createElement("div",{className:"float-right btn-group group-round"},a.a.createElement("button",{type:" button",value:"1",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},"<<")," ",r>1&&a.a.createElement("button",{type:" button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),a.a.createElement("button",{type:" button",value:r,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":"")},r)," ",r<n&&a.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.nextPage},">"),a.a.createElement("button",{type:" button",value:n,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},">>")," "))))}}])&&c(t.prototype,r),n&&c(t,n),l}(n.Component)},987:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return N}));var n=r(0),a=r.n(n),o=r(49),c=r(916),i=r(220);function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){u(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var p={paginatedList:function(e,t,r,n){var a=l(l({},Object(i.b)()),{},{body:JSON.stringify({page:e,per_page:t,query:r,sort_name:n})});return fetch("".concat("/back/api/error500","/paginatedList/"),a).then(i.c)}};function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function y(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=v(e);if(t){var a=v(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return b(this,r)}}function b(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?g(e):t}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var _=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(i,e);var t,r,n,o=d(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=o.call(this,e)).state={error500_list:[],error500_length:null,currentPage:1,usersPerPage:20,searchQuery:"",query_min:!1,search_load:!1},t.paginate=t.paginate.bind(g(t)),t.handleSearch=t.handleSearch.bind(g(t)),t}return t=i,(r=[{key:"paginate",value:function(e,t,r){var n=this,a=this.state.usersPerPage;return this.setState({currentPage:e}),p.paginatedList(e,a,t,r).then((function(e){return n.setState({error500_list:e.items,error500_length:e.items.length}),e}))}},{key:"handleSearch",value:function(e,t){t.target.value.length,this.setState(h({},e,t.target.value)),this.paginate(this.state.currentPage,t.target.value)}},{key:"render",value:function(){var e=this,t=this.state,r=t.error500_list,n=t.error500_length;return a.a.createElement("div",{className:"card"},a.a.createElement("div",{className:"card-body"},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"float-right search-bar mr-3"},a.a.createElement("input",{type:"text",className:"form-control",id:"searchQuery",placeholder:"Хайх",onChange:function(t){return e.handleSearch("searchQuery",t)},value:this.state.searchQuery}),a.a.createElement("a",null,a.a.createElement("i",{className:"icon-magnifier"})))),a.a.createElement("div",{className:"row pt-4"},0===n?a.a.createElement("h5",null,"Хэрэглэгч бүртгэлгүй байна "):r.map((function(e,t){return a.a.createElement("div",{className:"col-lg-12",id:"accordion1",key:t},a.a.createElement("a",{className:"list-group-item-action"},a.a.createElement("div",{className:"card mb-2"},a.a.createElement("div",{className:"card-header",style:{borderBottomWidth:"0px"}},a.a.createElement("button",{className:"btn btn-link shadow-none collapsed text-dark","data-toggle":"collapse","data-target":"#collapse-".concat(t),"aria-expanded":"false","aria-controls":"#collapse-".concat(t)},e.request_method," - ",e.created_at," - ",e.request_url)),a.a.createElement("div",{id:"collapse-".concat(t),className:"collapse","data-parent":"#accordion1"},a.a.createElement("div",{className:"card-body"},a.a.createElement("h4",null,"Headers"),a.a.createElement("pre",null,a.a.createElement("code",null,e.request_headers)),a.a.createElement("h4",null,"Exception"),a.a.createElement("pre",null,a.a.createElement("code",null,e.description)),a.a.createElement("h4",null,"POST arguments"),a.a.createElement("pre",null,a.a.createElement("code",null,e.request_data)))))))}))),a.a.createElement("div",{className:"pl-4 pt-4"},a.a.createElement(c.a,{sort_name:this.state.sort_name,paginate:this.paginate,searchQuery:this.state.searchQuery}))))}}])&&y(t.prototype,r),n&&y(t,n),i}(n.Component);function P(e){return(P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function E(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function w(e,t){return(w=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=j(e);if(t){var a=j(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return S(this,r)}}function S(e,t){return!t||"object"!==P(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var N=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&w(e,t)}(i,e);var t,r,n,c=O(i);function i(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),c.call(this,e)}return t=i,(r=[{key:"render",value:function(){return a.a.createElement(o.c,null,a.a.createElement(o.a,{exact:!0,path:"/back/error500/",component:_}))}}])&&E(t.prototype,r),n&&E(t,n),i}(n.Component)}}]);