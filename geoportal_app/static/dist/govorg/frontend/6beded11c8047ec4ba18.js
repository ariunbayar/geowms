(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{106:function(e,t,n){var r=n(67),o=n(112);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},112:function(e,t,n){(t=n(68)(!1)).push([e.i,".loader {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    background-color: rgba(255,255,255,0.7);\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    z-index: 1;\n}\n\n.suspense-loader {\n    position: fixed;\n    height: 100%;\n    width: 100%;\n    background-color: rgba(255,255,255,0.9);\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    z-index: 1;\n}\n",""]),e.exports=t},20:function(e,t,n){"use strict";var r=n(0),o=n.n(r),a=n(30),c=n(50);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var o=m(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(p,e);var t,n,c,i=f(p);function p(){return u(this,p),i.apply(this,arguments)}return t=p,(n=[{key:"getNavLinkClass",value:function(e){return("exact"in this.props?this.props.location.pathname===e:this.props.location.pathname.substr(0,e.length)===e)?"active":""}},{key:"render",value:function(){return o.a.createElement("li",{className:this.getNavLinkClass(this.props.url)},o.a.createElement(a.c,{activeClassName:"active",to:this.props.url,className:"waves-effect"},this.props.icon&&o.a.createElement(r.Fragment,null,o.a.createElement("i",{className:this.props.icon})," "),o.a.createElement("span",null,this.props.text),this.props.children&&o.a.createElement("i",{className:"fa fa-angle-left pull-right"}),this.props.count>-1&&o.a.createElement("small",{className:"badge float-right badge-info"},this.props.count)),this.props.children)}}])&&l(t.prototype,n),c&&l(t,c),p}(r.Component);t.a=Object(c.f)(y)},227:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var r=n(0),o=n.n(r);n(106);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=f(e);if(t){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(s,e);var t,n,r,a=l(s);function s(){return c(this,s),a.apply(this,arguments)}return t=s,(n=[{key:"render",value:function(){var e=this.props,t=e.color,n=e.is_loading,r=e.text;return n?o.a.createElement("div",{className:"suspense-loader text-center"},o.a.createElement("div",null,o.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw",style:{color:t||"#0088CA"}}),o.a.createElement("br",null),o.a.createElement("p",{style:{color:t||"#0088CA"}},r||"Түр хүлээнэ үү..."))):null}}])&&i(t.prototype,n),r&&i(t,r),s}(r.Component)},229:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(44);function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i={tableListTeevriinSuljee:function(){var e=Object(r.a)();return fetch("/gov/api/teevriin_suljee/table_list/",e).then(r.c)},tableListBairZuinZurag:function(){var e=Object(r.a)();return fetch("/gov/api/bair_zuin_zurag/table_list/",e).then(r.c)},tableListBarilgaSuurinGazar:function(){var e=Object(r.a)();return fetch("/gov/api/barilga_suurin_gazar/table_list/",e).then(r.c)},tableListDedButets:function(){var e=Object(r.a)();return fetch("/gov/api/ded_butets/table_list/",e).then(r.c)},getCount:function(){var e=a({},Object(r.a)());return fetch("/gov/api/org-request/getCount/",e).then(r.c)},detail:function(){var e=a({},Object(r.a)());return fetch("/profile/api/info/",e).then(r.c)},updatePassword:function(e,t,n){var o=a(a({},Object(r.b)()),{},{body:JSON.stringify({new_password:e,old_password:t,re_password:n})});return fetch("/profile/api/update-password/",o).then(r.c)},getEmpRoles:function(){var e=Object(r.a)();return fetch("/gov/emp-role/",e).then(r.c)},getApproveAndRevoke:function(){var e=Object(r.a)();return fetch("/gov/get_approve_and_revoke/",e).then(r.c)},loadBaseLayers:function(){var e=a({},Object(r.a)());return fetch("/суурь-давхарга/",e).then(r.c)}}},44:function(e,t,n){"use strict";function r(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),r=0;r<n.length;r++){var o=n[r].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}return t}function o(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var r=n&&n.message||e.statusText;return Promise.reject(r)}return n}))}function a(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":r("csrftoken")}}}function c(){return{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}}n.d(t,"c",(function(){return o})),n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return c}))},870:function(e,t,n){n(141),e.exports=n(878)},878:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(7),c=n(30),i=n(50),u=n(229),l=n(20),s=n(227);n(879);function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(){return(p=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function g(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=h(e);if(t){var o=h(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?b(e):t}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=o.a.lazy((function(){return n.e(3).then(n.bind(null,894))})),E=o.a.lazy((function(){return n.e(47).then(n.bind(null,963))})),O=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(20)]).then(n.bind(null,955))})),_=o.a.lazy((function(){return Promise.all([n.e(0),n.e(19)]).then(n.bind(null,953))})),x=o.a.lazy((function(){return Promise.all([n.e(0),n.e(17)]).then(n.bind(null,938))})),j=o.a.lazy((function(){return Promise.all([n.e(1),n.e(32)]).then(n.bind(null,961))})),w=o.a.lazy((function(){return n.e(31).then(n.bind(null,954))})),k=o.a.lazy((function(){return Promise.all([n.e(0),n.e(22)]).then(n.bind(null,957))})),P=o.a.lazy((function(){return Promise.all([n.e(0),n.e(36)]).then(n.bind(null,968))})),S=o.a.lazy((function(){return n.e(49).then(n.bind(null,935))})),R=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(3),n.e(4),n.e(37)]).then(n.bind(null,943))})),C=o.a.lazy((function(){return Promise.all([n.e(0),n.e(48)]).then(n.bind(null,966))})),N=o.a.lazy((function(){return Promise.all([n.e(0),n.e(5),n.e(26)]).then(n.bind(null,942))})),z=o.a.lazy((function(){return Promise.all([n.e(0),n.e(5),n.e(45)]).then(n.bind(null,939))})),D=o.a.lazy((function(){return Promise.all([n.e(0),n.e(27)]).then(n.bind(null,949))})),q=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(38)]).then(n.bind(null,945))})),L=o.a.lazy((function(){return n.e(46).then(n.bind(null,936))})),A=o.a.lazy((function(){return Promise.all([n.e(0),n.e(1),n.e(3),n.e(28)]).then(n.bind(null,952))})),T=o.a.lazy((function(){return Promise.resolve().then(n.bind(null,879))})),B=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(v,e);var t,n,a,f=g(v);function v(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,v),(t=f.call(this,e)).state={org_level:e.org.org_level,name:e.org.name,map_list:[],emp_role:{},approve:!1,revoke:!1,base_layer_list:[]},t.requestCount=t.requestCount.bind(b(t)),t.getEmpRoles=t.getEmpRoles.bind(b(t)),t.getApproveAndRevoke=t.getApproveAndRevoke.bind(b(t)),t.getBaseLayer=t.getBaseLayer.bind(b(t)),t}return t=v,(n=[{key:"componentDidMount",value:function(){Promise.all([this.requestCount(),this.getEmpRoles(),this.getApproveAndRevoke(),this.getBaseLayer()])}},{key:"getBaseLayer",value:function(){var e=this;u.a.loadBaseLayers().then((function(t){var n=t.base_layer_list;e.setState({base_layer_list:n})}))}},{key:"requestCount",value:function(){var e=this;u.a.getCount().then((function(t){var n=t.success,r=t.count,o=t.revoke_count;t.info,n&&e.setState({request_count:r,revoke_count:o})}))}},{key:"getEmpRoles",value:function(){var e=this;u.a.getEmpRoles().then((function(t){var n=t.success,r=t.emp_role;n&&e.setState({emp_role:r})}))}},{key:"getApproveAndRevoke",value:function(){var e=this;u.a.getApproveAndRevoke().then((function(t){var n=t.approve,r=t.revoke;e.setState({approve:n,revoke:r})}))}},{key:"render",value:function(){var e=this,t=this.props.org,n=t.org_role,a=t.employee,u=t.allowed_geom,f=t.covid_configs,m=this.state,y=m.emp_role,g=m.approve,v=m.revoke,b=m.base_layer_list;return o.a.createElement(c.a,null,o.a.createElement("div",{id:"sidebar-wrapper","data-simplebar":"","data-simplebar-auto-hide":"true"},o.a.createElement("div",{className:"brand-logo"},o.a.createElement("a",{href:"/"},o.a.createElement("img",{src:"/static/assets/image/logo/logo-2.png",className:"logo-icon",alt:"logo icon"}),o.a.createElement("h5",{className:"logo-text"},"ГЕОПОРТАЛ"))),o.a.createElement("ul",{className:"sidebar-menu do-nicescrol"},o.a.createElement(l.a,{icon:"gp-text-primary fa fa-key",url:"#",text:"Байгууллага"},o.a.createElement("ul",{className:"sidebar-submenu"},o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/",text:"Эрхүүд"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/region/",text:"Хамрах хүрээ"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/employee/",text:"Хэрэглэгч"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/role/",text:"Хэрэглэгчийн эрх"}),a.is_admin&&o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/addresses/",text:"Ажилчдын хаяг"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/perm/erguuleg/",text:"Эргүүлийн мэдээлэл"}))),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-link",url:"/gov/system/",text:"Систем"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-assistive-listening-systems",url:"/gov/meta/",text:"Мета"}),v&&o.a.createElement(l.a,{icon:"gp-text-primary fa fa-times-circle",url:"/gov/revoke-request/",text:"Цуцлах хүсэлт",count:this.state.revoke_count}),g&&o.a.createElement(l.a,{icon:"gp-text-primary fa fa-plug",url:"/gov/org-request/",text:"Хүсэлт",count:this.state.request_count}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-database",url:"/gov/org/map/",text:"Дэд сан"},o.a.createElement("ul",{className:"sidebar-submenu"},o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/tuuhen-ov/",text:"Түүхэн өв бүртгэл"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/froms/tseg-info/tsegpersonal/",text:"Цэгийн мэдээлэл"},o.a.createElement("ul",{className:"sidebar-submenu"},o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/froms/tseg-info/tsegpersonal/tseg-personal/",text:"Шинэ цэг"}),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/froms/tseg-info/tsegpersonal/tseg-ustsan/",text:"Цэг устгах"}))),o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/zip-code/",text:"Зипкод"}),Object.keys(y).length>0&&Object.keys(y.themes).length>0?y.themes.map((function(e,t){return o.a.createElement(l.a,{key:t,icon:"gp-text-primary fa fa-circle-o",url:"/gov/org/map/".concat(e.id),text:e.name},o.a.createElement("ul",{className:"sidebar-submenu"},Object.keys(y.package_features).length>0?y.package_features.map((function(t,n){return e.id==t.parent_id?o.a.createElement(l.a,{key:n,icon:"fa fa-circle-o gp-text-primary",url:"/gov/org/map/".concat(e.id,"/").concat(t.id),text:t.name},o.a.createElement("ul",{className:"sidebar-submenu"},Object.keys(t.features).length>0?t.features.map((function(n,r){return o.a.createElement(l.a,{key:r,icon:"fa fa-circle-o gp-text-primary",url:"/gov/org/map/".concat(e.id,"/").concat(t.id,"/").concat(n.id,"/"),text:n.name,count:n.count})})):null)):null})):null))})):null,o.a.createElement(l.a,{icon:"gp-text-primary fa fa-circle-o",url:"/gov/history/",text:"Өөрчлөлтийн түүх"}))),a.is_admin&&o.a.createElement(l.a,{icon:"gp-text-primary fa fa-medkit",url:"/gov/covid-config/",text:"Covid Тохиргоо"}),o.a.createElement(l.a,{icon:"gp-text-primary zmdi zmdi-pin-help",url:"/gov/help/",text:"Тусламж"}))),o.a.createElement("div",{className:"clearfix"},o.a.createElement("div",{className:"content-wrapper"},o.a.createElement(r.Suspense,{fallback:o.a.createElement(s.a,{is_loading:!0,text:"Хуудас ачаалж байна."})},o.a.createElement(i.c,null,o.a.createElement(i.a,{path:"/gov/froms/",component:z}),o.a.createElement(i.a,{path:"/gov/tuuhen-ov/",component:N}),o.a.createElement(i.a,{path:"/gov/system/",component:j}),o.a.createElement(i.a,{path:"/gov/revoke-request/",component:k}),o.a.createElement(i.a,{path:"/gov/meta/",component:w}),o.a.createElement(i.a,{path:"/gov/perm/region/",component:C}),o.a.createElement(i.a,{path:"/gov/perm/role/",component:function(e){return o.a.createElement(A,p({},e,{org_roles:n,employee:a}))}}),o.a.createElement(i.a,{path:"/gov/role/role/",component:A}),o.a.createElement(i.a,{path:"/gov/org/map/:tid/:pid/:fid/",component:function(t){return o.a.createElement(x,p({},t,{base_layer_list:b,employee:a,refreshCount:function(){return e.requestCount()},org_geom:u}))}}),o.a.createElement(i.a,{path:"/gov/perm/addresses/",component:function(e){return o.a.createElement(q,p({},e,{employee:a}))}}),o.a.createElement(i.a,{path:"/gov/perm/erguuleg/",component:function(e){return o.a.createElement(q,p({},e,{employee:a}))}}),o.a.createElement(i.a,{path:"/gov/zip-code/",component:D}),o.a.createElement(i.a,{path:"/gov/org-request/",component:O}),o.a.createElement(i.a,{path:"/gov/history/",component:_}),o.a.createElement(i.a,{exact:!0,path:"/gov/perm/",component:function(e){return o.a.createElement(d,p({},e,{org_roles:n}))}}),o.a.createElement(i.a,{exact:!0,path:"/gov/perm/org/",component:E}),o.a.createElement(i.a,{path:"/gov/perm/employee/",component:function(t){return o.a.createElement(R,p({},t,{org_roles:n,employee:a,getEmpRoles:e.getEmpRoles}))}}),o.a.createElement(i.a,{exact:!0,path:"/gov/help/",component:L}),o.a.createElement(i.a,{exact:!0,path:"/gov/profile/",component:S}),o.a.createElement(i.a,{exact:!0,path:"/gov/profile/password/",component:P}),o.a.createElement(i.a,{exact:!0,path:"/gov/covid-config/",component:function(e){return o.a.createElement(T,p({},e,{covid_configs:f}))}}))))))}}])&&m(t.prototype,n),a&&m(t,a),v}(r.Component),J=JSON.parse(document.getElementById("org-app-data").innerHTML);Object(a.render)(o.a.createElement(B,{org:J}),document.getElementById("org-app"))},879:function(e,t,n){"use strict";n.r(t);var r=n(0),o=n.n(r),a=n(44);function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){u(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var l={setConfig:function(e){var t=i(i({},Object(a.b)()),{},{body:JSON.stringify({values:e})});return fetch("".concat("/gov","/set-config/"),t).then(a.c)}};function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function m(e,t,n){return t&&p(e.prototype,t),n&&p(e,n),e}function y(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=d(e);if(t){var o=d(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return b(this,n)}}function b(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?h(e):t}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function d(e){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var E=function(e){y(n,e);var t=v(n);function n(e){var r;return f(this,n),(r=t.call(this,e)).state={value:e.value},r.handleOnChange=r.handleOnChange.bind(h(r)),r}return m(n,[{key:"handleOnChange",value:function(e,t){this.setState({value:e}),this.props.setValue(e,t)}},{key:"render",value:function(){var e=this,t=this.state.value,n=this.props,r=n.name,a=n.mn_name;return o.a.createElement("div",{className:"form-group"},o.a.createElement("label",{htmlFor:"id_".concat(r)},a),o.a.createElement("input",{className:"form-control",value:t,id:"id_".concat(r),name:r,onChange:function(t){return e.handleOnChange(t.target.value,r)}}))}}]),n}(r.Component),O=function(e){y(n,e);var t=v(n);function n(e){var r;return f(this,n),(r=t.call(this,e)).state={values:[]},r.setValue=r.setValue.bind(h(r)),r.setConfig=r.setConfig.bind(h(r)),r}return m(n,[{key:"componentDidMount",value:function(){var e=this.props.covid_configs;this.setState({values:e})}},{key:"setConfig",value:function(){l.setConfig(this.state.values).then((function(e){e.success;var t=e.info;alert(t)})).catch((function(e){alert(" Алдаа гарсан байна ")}))}},{key:"setValue",value:function(e,t){Object()[t]=e;var n=this.state.values;n.map((function(r,o){r.name==t&&(n[o].value=e)})),this.setState({values:n})}},{key:"render",value:function(){var e=this,t=this.props.covid_configs;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},t.map((function(t,n){return o.a.createElement(E,{key:n,type:"text",value:t.value,name:t.name,setValue:e.setValue,mn_name:t.mn_name})}))),o.a.createElement("button",{className:"btn btn-primary",onClick:this.setConfig},"Хадгалах"))}}]),n}(r.Component);t.default=O}},[[870,2,0]]]);