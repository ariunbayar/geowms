(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{891:function(e,t,n){"use strict";n.d(t,"a",(function(){return p}));var r=n(0),o=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=f(e);if(t){var o=f(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return s(this,n)}}function s(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(f,e);var t,n,a,s=l(f);function f(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,f),(t=s.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t}return t=f,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose(null,0))}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e,t){var n=this;t=void 0===t?150:t,this.setState({status:"closing"}),setTimeout((function(){n.setState({status:"closed"}),e&&e()}),t)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n,onClick:function(){return e.handleProceed()}},o.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},o.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},o.a.createElement("div",{className:"d-flex justify-content-center"},"danger"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"primary"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn gp-text-primary","aria-hidden":"true"}):"warning"==this.props.model_type_icon?o.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):o.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),o.a.createElement("div",{className:"d-flex justify-content-center my-1"},o.a.createElement("h6",{className:"text-dark"},this.props.title)),o.a.createElement("div",{className:"modal-body text-wrap ml-2 mr-2 my-3 text-justify"},o.a.createElement("a",{className:"text-dark"},this.props.text))))),o.a.createElement("div",{className:a}))}}])&&i(t.prototype,n),a&&i(t,a),f}(r.Component)},892:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var r=n(0),o=n.n(r),a=n(28);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function u(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=p(e);if(t){var o=p(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return f(this,n)}}function f(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(f,e);var t,n,r,i=u(f);function f(){return c(this,f),i.apply(this,arguments)}return t=f,(n=[{key:"render",value:function(){return this.props.navlink_url?o.a.createElement(a.c,{className:"geo-back-btn geo-back-btn-toggled",to:this.props.navlink_url},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):this.props.back_url?o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.push(this.props.back_url)},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name)):o.a.createElement("a",{className:"geo-back-btn geo-back-btn-toggled",id:"geo-back-btn",onClick:this.props.history.goBack},o.a.createElement("small",{className:"fa fa-chevron-circle-left"}," ",this.props.name&&this.props.name))}}])&&l(t.prototype,n),r&&l(t,r),f}(r.Component)},960:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return Q}));var r=n(0),o=n.n(r),a=n(50),i=n(893),c=n(892);function l(e){return(l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(){return(s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=h(e);if(t){var o=h(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return d(this,n)}}function d(e,t){return!t||"object"!==l(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var y=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(l,e);var t,n,r,a=p(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={"жагсаалтын_холбоос":"/back/api/user/paginatedList/","талбарууд":[{field:"first_name",title:"Нэр",has_action:!0},{field:"email",title:"Цахим шуудан"},{field:"roles",title:"roles"},{field:"is_active",title:"Идэвхтэй эсэх",has_action:!0},{field:"is_sso",title:"ДАН системээр баталгаажсан эсэх",has_action:!0}],"хувьсах_талбарууд":[{field:"first_name",text:"",action:function(e){return t.go_link(e)},action_type:!1},{field:"is_active",text:"",action:t.set_active_color,action_type:!0},{field:"is_sso",text:"",component:t.dan_img,action_type:!1}],refresh:!0},t.go_link=t.go_link.bind(m(t)),t}return t=l,(n=[{key:"dan_img",value:function(e){return e.values.is_sso?o.a.createElement("img",{className:"dan-logo-icon",src:"/static/assets/image/logo/dan-logo2.png"}):o.a.createElement("p",null)}},{key:"set_active_color",value:function(e){var t="text-danger fa fa-times";return e&&(t="text-success fa fa-check"),t}},{key:"go_link",value:function(e){this.props.history.push("/back/user/".concat(e.id,"/дэлгэрэнгүй/"))}},{key:"render",value:function(){var e=this.state,t=e.талбарууд,n=e.жагсаалтын_холбоос,r=e.хувьсах_талбарууд,a=e.нэмэлт_талбарууд,l=e.refresh;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-lg-12"},o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(i.a,{"талбарууд":t,"жагсаалтын_холбоос":n,"уншиж_байх_үед_зурвас":"Уншиж байна","хувьсах_талбарууд":r,"нэмэлт_талбарууд":a,refresh:l})))),o.a.createElement(c.a,s({},this.props,{name:"Буцах"})))}}])&&u(t.prototype,n),r&&u(t,r),l}(r.Component);function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach((function(t){_(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function _(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var g={getAll:function(e,t){var n=v(v({},S()),{},{body:JSON.stringify({last:e,first:t})});return fetch("".concat(O,"/all/"),n).then(k)},detail:function(e){var t=v({},{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}});return fetch("".concat(O,"/").concat(e,"/дэлгэрэнгүй/"),t).then(k)},userDetailChange:function(e,t){var n=v(v({},S()),{},{body:JSON.stringify({id:e,is_active:t})});return fetch("".concat(O,"/userDetailChange/"),n).then(k)},roleCreate:function(e){var t=v(v({},S()),{},{body:JSON.stringify(e)});return fetch("".concat(O,"/roleCreate/"),t).then(k)}},O="/back/api/user";function k(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var r=n&&n.message||e.statusText;return Promise.reject(r)}return n}))}function E(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),r=0;r<n.length;r++){var o=n[r].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}return t}function S(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":E("csrftoken")}}}function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=x(e);if(t){var o=x(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return N(this,n)}}function N(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?R(e):t}function R(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var T=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(c,e);var t,n,a,i=C(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=i.call(this,e)).state={status:"initial"},t.handleOpen=t.handleOpen.bind(R(t)),t.handleClose=t.handleClose.bind(R(t)),t.handleProceed=t.handleProceed.bind(R(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),e?e():t.props.modalClose&&t.props.modalClose()}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n},o.a.createElement("div",{className:"modal-dialog modal-dialog-scrollable"},o.a.createElement("div",{className:"modal-content"},o.a.createElement("div",{className:"modal-header"},o.a.createElement("h5",{className:"modal-title"},this.props.title),o.a.createElement("button",{type:"button",className:"close","data-dismiss":"modal","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true",onClick:this.handleClose},"×"))),o.a.createElement("div",{className:"modal-body"},this.props.text),o.a.createElement("div",{className:"modal-footer"},o.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn gp-outline-primary"},"Буцах"),o.a.createElement("button",{type:"button",onClick:function(){return e.handleProceed()},className:"btn gp-btn-primary text-white"},"Хязгаарлах"))))),o.a.createElement("div",{className:a}))}}])&&j(t.prototype,n),a&&j(t,a),c}(r.Component),D=n(891);function I(e){return(I="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function M(){return(M=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function L(e,t){return(L=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function F(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=q(e);if(t){var o=q(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return J(this,n)}}function J(e,t){return!t||"object"!==I(t)&&"function"!=typeof t?X(e):t}function X(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function q(e){return(q=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var U=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&L(e,t)}(i,e);var t,n,r,a=F(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=a.call(this,e)).state={user_detail:[],roles:[],all_role:[],role_id:"",roleId:null,check:!1,is_superuser:!1,is_active:!1,is_modal_limit_open:!1,role_name:"",modal_alert_check:"closed",title_name:""},t.handleModalLimitClose=t.handleModalLimitClose.bind(X(t)),t.handleModalLimitOpen=t.handleModalLimitOpen.bind(X(t)),t.handleIsActiveTrue=t.handleIsActiveTrue.bind(X(t)),t.handleIsActiveFalse=t.handleIsActiveFalse.bind(X(t)),t.handleOnClick=t.handleOnClick.bind(X(t)),t.getRole=t.getRole.bind(X(t)),t.handleSaveSuccess=t.handleSaveSuccess.bind(X(t)),t.closeModalTime=t.closeModalTime.bind(X(t)),t}return t=i,(n=[{key:"componentDidMount",value:function(){this.handleSaveSuccess()}},{key:"handleSaveSuccess",value:function(){var e=this;g.detail(this.props.match.params.id).then((function(t){var n=t.user_detail,r=t.roles,o=t.all_role;e.setState({user_detail:n,roles:r,all_role:o,is_active:n.is_active,is_superuser:n.is_superuser}),r.map((function(t){return e.setState({roleId:t.id,role_name:t.name})}))}))}},{key:"handleModalLimitOpen",value:function(){this.setState({is_modal_limit_open:!this.state.is_modal_limit_open})}},{key:"handleModalLimitClose",value:function(){this.setState({is_modal_delete_open:!1})}},{key:"handleIsActiveFalse",value:function(){var e=this;g.userDetailChange(this.props.match.params.id,!1).then((function(t){t.success&&e.setState({is_active:!1,is_modal_limit_open:!1})}))}},{key:"getRole",value:function(){var e=this,t=this.props.match.params.id,n={roleId:this.state.role_id,id:t};g.roleCreate(n).then((function(t){var n=t.success;t.item,n&&(e.handleSaveSuccess(),e.setState({check:!1}))}))}},{key:"handleOnClick",value:function(e){this.setState({role_id:e,check:!0,roleId:e})}},{key:"handleIsActiveFalse",value:function(){var e=this;g.userDetailChange(this.props.match.params.id,!1).then((function(t){t.success&&(e.setState({is_active:!1,is_modal_limit_open:!1}),e.setState({modal_alert_check:"open"}),e.setState({title_name:"хязгаарлалаа"}))})),this.closeModalTime()}},{key:"handleIsActiveTrue",value:function(){var e=this;g.userDetailChange(this.props.match.params.id,!0).then((function(t){t.success&&(e.setState({is_active:!0}),e.setState({modal_alert_check:"open"}),e.setState({title_name:"идэвхжилээ"}))})),this.closeModalTime()}},{key:"handleModalAlert",value:function(){this.setState({modal_alert_check:"closed"}),clearTimeout(this.state.timer)}},{key:"closeModalTime",value:function(){var e=this;this.state.timer=setTimeout((function(){e.setState({modal_alert_check:"closed"})}),2e3)}},{key:"render",value:function(){var e=this,t=this.state.user_detail,n=t.id,r=t.first_name,a=t.email,i=t.is_sso,l=t.last_name,s=t.gender,u=t.username,f=t.last_login,p=t.date_joined,d=this.state,m=d.is_modal_limit_open,h=d.check,y=d.is_active,b=d.role_name;return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-4 mb-4"},o.a.createElement("p",null,o.a.createElement("strong",null,"Системийн ID"),": ",n," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Нэр"),": ",l," ",r," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Хүйс"),": ",s," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Цахим хаяг"),": ",a," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Хэрэглэгчийн нэр"),": ",i?o.a.createElement("a",null,r):o.a.createElement("a",null," ",u)," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Хэрэглэгчийн эрх"),":",b," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Идэвхитэй эсэх"),": ",y?"Идэвхтэй":"-","  ",y?o.a.createElement("button",{className:"btn btn-outline-danger",onClick:this.handleModalLimitOpen},"Хязгаарлах"):o.a.createElement("button",{className:"btn gp-outline-primary",onClick:this.handleIsActiveTrue},"Идэвхжүүлэх")),o.a.createElement("p",null,o.a.createElement("strong",null,"Бүртгүүлсэн огноо"),": ",p," "),o.a.createElement("p",null,o.a.createElement("strong",null,"Сүүлд нэвтэрсэн огноо"),": ",f," "),o.a.createElement("div",null,m&&o.a.createElement(T,{modalClose:this.handleModalLimitClose,modalAction:this.handleIsActiveFalse,text:"Та хэрэглэгчийн системд нэвтрэх эрхийг хязгаарлах гэж байна. Хязгаарлагдсан хэрэглэгч систем нэвтрэх эрхгүй болохыг анхаарна уу!",title:"Тохиргоог хязгаарлах"}))),o.a.createElement("div",{className:"col-md-8 mb-4"},o.a.createElement("h4",null,"Хэрэглэгчийн эрхийн түвшинүүд "),o.a.createElement("table",null,o.a.createElement("tbody",null,this.state.all_role.map((function(t){return o.a.createElement("tr",{key:t.id},o.a.createElement("td",null,o.a.createElement("input",{type:"radio",checked:t.id===e.state.roleId,name:"input",onChange:function(){return e.handleOnClick(t.id)}}),"  ",t.name))})))),o.a.createElement("br",null),h&&o.a.createElement("button",{type:"button",className:"btn gp-outline-primary",onClick:this.getRole},"Хадгалах")),o.a.createElement(D.a,{title:["Амжилттай ",this.state.title_name],model_type_icon:"success",status:this.state.modal_alert_check,modalAction:function(){return e.handleModalAlert()}}))),o.a.createElement(c.a,M({},this.props,{name:"Буцах"})))}}])&&A(t.prototype,n),r&&A(t,r),i}(r.Component);function H(e){return(H="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function W(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function B(e,t){return(B=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function G(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=K(e);if(t){var o=K(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return z(this,n)}}function z(e,t){return!t||"object"!==H(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function K(e){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Q=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&B(e,t)}(c,e);var t,n,r,i=G(c);function c(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),i.call(this,e)}return t=c,(n=[{key:"render",value:function(){return o.a.createElement(a.c,null,o.a.createElement(a.a,{exact:!0,path:"/back/user/",component:y}),o.a.createElement(a.a,{exact:!0,path:"/back/user/:id/дэлгэрэнгүй/",component:U}))}}])&&W(t.prototype,n),r&&W(t,r),c}(r.Component)}}]);