(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{983:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return w}));var r=a(0),n=a.n(r),s=a(216);function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i={updatePassword:function(e){var t=c(c({},Object(s.b)()),{},{body:JSON.stringify(e)});return fetch("/profile/api/update-password/",t).then(s.c)}};function u(e){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function m(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function d(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,r=v(e);if(t){var n=v(this).constructor;a=Reflect.construct(r,arguments,n)}else a=r.apply(this,arguments);return b(this,a)}}function b(e,t){return!t||"object"!==u(t)&&"function"!=typeof t?h(e):t}function h(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var w=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(o,e);var t,a,r,s=f(o);function o(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),(t=s.call(this,e)).state={is_save_success:null,msg:"",old_password:"",new_password:"",renew_password:"",save_btn_status:"disabled"},t.handleSave=t.handleSave.bind(h(t)),t.handleChange=t.handleChange.bind(h(t)),t}return t=o,(a=[{key:"handleChange",value:function(e,t){var a;this.setState((m(a={},e,t),m(a,"is_save_success",null),a)),this.state.old_password&&this.state.new_password&&this.state.renew_password&&this.setState({save_btn_status:"active"})}},{key:"handleSave",value:function(){var e=this,t=this.state,a=t.old_password,r=t.new_password,n=t.renew_password;if(this.setState({save_btn_status:"disabled"}),r===n){var s={old_password:a,new_password:r};i.updatePassword(s).then((function(t){var a=t.success,r=t.msg,n=t.error;!a&&(r=n),e.setState({is_save_success:a,msg:r})}))}else this.setState({is_save_success:!1,msg:"Шинэ нууц үг буруу"})}},{key:"render",value:function(){var e=this;return n.a.createElement("div",{className:"d-flex align-items-center justify-content-center pt-5 mt-5"},n.a.createElement("div",{className:"card border-primary border-top-sm border-bottom-sm card-authentication1 mx-auto animated bounceInDown"},n.a.createElement("div",{className:"card-body"},n.a.createElement("div",{className:"card-content p-2"},n.a.createElement("div",{className:"text-center"},n.a.createElement("i",{className:"fa fa-key fa-3x"})),n.a.createElement("div",{className:"card-title text-uppercase text-center py-3"},"Нууц үг солих"),n.a.createElement("form",null,n.a.createElement("div",{className:"form-group"},n.a.createElement("div",{className:"position-relative has-icon-right"},n.a.createElement("label",{htmlFor:"password"},"Хуучин нууц үг"),n.a.createElement("input",{type:"password",className:"form-control form-control-rounded",disabled:!0===this.state.is_save_success,placeholder:"Хуучин нууц үгээ оруулна уу",value:this.state.old_password,onChange:function(t){return e.handleChange("old_password",t.target.value)}}),n.a.createElement("div",{className:"form-control-position"},n.a.createElement("i",{className:"icon-lock"})))),n.a.createElement("div",{className:"form-group"},n.a.createElement("div",{className:"position-relative has-icon-right"},n.a.createElement("label",{htmlFor:"new_password"},"Шинэ нууц үг"),n.a.createElement("input",{type:"password",className:"form-control form-control-rounded",disabled:!0===this.state.is_save_success,placeholder:"Шинэ нууц үгээ оруулна уу",value:this.state.new_password,onChange:function(t){return e.handleChange("new_password",t.target.value)}}),n.a.createElement("div",{className:"form-control-position"},n.a.createElement("i",{className:"icon-lock"})))),n.a.createElement("div",{className:"form-group"},n.a.createElement("div",{className:"position-relative has-icon-right"},n.a.createElement("label",{htmlFor:"renew_password"},"Шинэ нууц үг ( давтах )"),n.a.createElement("input",{type:"password",className:"form-control form-control-rounded",disabled:!0===this.state.is_save_success,placeholder:"Шинэ нууц үгээ дахин оруулна уу",value:this.state.renew_password,onChange:function(t){return e.handleChange("renew_password",t.target.value)}}),n.a.createElement("div",{className:"form-control-position"},n.a.createElement("i",{className:"icon-lock"})))),!0===this.state.is_save_success&&n.a.createElement("div",{className:"alert alert-outline-success alert-dismissible alert-round",role:"alert"},n.a.createElement("div",{className:"alert-icon"},n.a.createElement("i",{className:"icon-check ml-3"})),n.a.createElement("div",{className:"alert-message w-100 text-dark text-center"},n.a.createElement("span",null,this.state.msg),n.a.createElement("br",null),n.a.createElement("a",{href:"/login/"},"Та дахин нэвтэрнэ үү."))),!1===this.state.is_save_success&&n.a.createElement("div",{className:"alert alert-outline-danger alert-dismissible alert-round",role:"alert"},n.a.createElement("div",{className:"alert-icon"},n.a.createElement("i",{className:"icon-close ml-3"})),n.a.createElement("div",{className:"alert-message w-100 text-center"},n.a.createElement("span",null,this.state.msg))),n.a.createElement("button",{type:"button",className:"btn btn-primary shadow-primary btn-round btn-block waves-effect waves-light ".concat("active"===this.state.save_btn_status?"active":"disabled"),onClick:this.handleSave},"Хадгалах"))))))}}])&&d(t.prototype,a),r&&d(t,r),o}(r.Component)}}]);