(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{1064:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var o=n(35);function r(e){return null!=e?Object(o.d)().max(e,"${max}-с илүүгүй урттай оруулна уу!").required("Хоосон байна!"):Object(o.d)().required("Хоосон байна!")}var a=Object(o.c)().shape({old_password:r(20),new_password:r(20),re_new_password:r(20)})},110:function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var o=n(0),r=n.n(o);n(111);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=f(e);if(t){var r=f(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return u(this,n)}}function u(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(u,e);var t,n,o,a=s(u);function u(){return c(this,u),a.apply(this,arguments)}return t=u,(n=[{key:"render",value:function(){return this.props.is_loading?r.a.createElement("div",{className:"loader text-center"},r.a.createElement("div",null,r.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"}),r.a.createElement("br",null),this.props.text?this.props.text:"Түр хүлээнэ үү...")):null}}])&&l(t.prototype,n),o&&l(t,o),u}(o.Component)},899:function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"default",(function(){return w}));var o=n(0),r=n.n(o),a=n(1064),c=n(21),l=n(261),i=n(110);function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=b(e);if(t){var r=b(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==s(t)&&"function"!=typeof t?m(e):t}function m(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var w=function(t){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(b,t);var n,o,s,p=d(b);function b(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,b),(t=p.call(this,e)).state={old_password:"",new_password:"",re_new_password:"",is_loading:!1},t.handleSubmit=t.handleSubmit.bind(m(t)),t.modalClose=t.modalClose.bind(m(t)),t}return n=b,(o=[{key:"handleSubmit",value:function(t){var n=this;this.setState({is_loading:!0}),t.new_password==t.re_new_password?l.a.updatePassword(t.new_password,t.old_password,t.re_new_password).then((function(t){var o=t.success,r=t.error,a=t.msg;if(o){var c={modal_status:"open",modal_icon:"fa fa-check-circle",modal_bg:"",icon_color:"success",title:a,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:function(){return n.modalClose()}};e.MODAL(c),n.setState({is_loading:!1})}else{var l={modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:r,has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null};e.MODAL(l),n.setState({is_loading:!1})}})):(e.MODAL({modal_status:"open",modal_icon:"fa fa-times-circle",modal_bg:"",icon_color:"danger",title:"Таарахгүй байна",has_button:!1,actionNameBack:"",actionNameDelete:"",modalAction:null,modalClose:null}),this.setState({is_loading:!1}))}},{key:"modalClose",value:function(){window.location.href="/logout"}},{key:"render",value:function(){var e=this.state.is_loading;return r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body"},r.a.createElement(i.a,{is_loading:e,text:"Уншиж байна"}),r.a.createElement(c.e,{enableReinitialize:!0,initialValues:this.state,onSubmit:this.handleSubmit,validationSchema:a.a},(function(e){var t=e.errors;return Object.keys(t).length,r.a.createElement(c.d,null,r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"password"},"Хуучин нууц үг:"),r.a.createElement(c.b,{name:"old_password",type:"password",className:"form-control "+(t.old_password?"is-invalid":""),id:"password",placeholder:"Одоогийн нууц үг оруулах"}),r.a.createElement(c.a,{name:"old_password",component:"div",className:"invalid-feedback"}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"new_password"},"Шинэ нууц үг:"),r.a.createElement(c.b,{name:"new_password",type:"password",className:"form-control "+(t.new_password?"is-invalid":""),id:"new_password",placeholder:"Шинэ нууц үг оруулах"}),r.a.createElement(c.a,{name:"new_password",component:"div",className:"invalid-feedback"}))),r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"re_new_password"},"Шинэ нууц үг дахин оруулах:"),r.a.createElement(c.b,{name:"re_new_password",type:"password",className:"form-control "+(t.re_new_password?"is-invalid":""),id:"re_new_password",placeholder:"Шинэ нууц үг дахин оруулах"}),r.a.createElement(c.a,{name:"re_new_password",component:"div",className:"invalid-feedback"}))),r.a.createElement("div",{className:"form-group"},r.a.createElement("button",{type:"submit",className:"btn gp-btn-primary"},"Хадгалах")))}))))}}])&&u(n.prototype,o),s&&u(n,s),b}(o.Component)}.call(this,n(121))}}]);