(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{951:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return y}));var r=n(0),l=n.n(r);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),e}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function f(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=m(e);if(t){var l=m(this).constructor;n=Reflect.construct(r,arguments,l)}else n=r.apply(this,arguments);return p(this,n)}}function p(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var g=function(e){c(n,e);var t=f(n);function n(){return i(this,n),t.apply(this,arguments)}return u(n,[{key:"render",value:function(){return l.a.createElement("strong",null,l.a.createElement("a",{href:this.props.href,target:"_blank"},this.props.text||this.props.href," ",l.a.createElement("i",{className:"fa fa-external-link ","aria-hidden":"true"})))}}]),n}(r.Component),y=function(e){c(n,e);var t=f(n);function n(){return i(this,n),t.apply(this,arguments)}return u(n,[{key:"render",value:function(){return l.a.createElement("div",{className:"container my-3 p-3  mb-5 shadow card"},l.a.createElement("div",{className:"row ml-3"},l.a.createElement("div",{className:"my-0"},l.a.createElement("h4",{className:"text-center"},"Plugin суулгах заавар"),l.a.createElement("ol",null,l.a.createElement("li",null,l.a.createElement(g,{href:"/static/assets/qgis_plugin.zip",text:"Qgis plugin татах"})),l.a.createElement("li",null,l.a.createElement("strong",null,"Plugins","->"," Manage and Install Plugins ","->"," Install from ZIP ","->","ZIP file татаж авсан замыг заана ","->"," Install Plugin"),l.a.createElement("img",{className:"m-3",src:"/static/assets/image/plugin/plugin_dir.png",width:"600px"})),l.a.createElement("li",null,l.a.createElement("strong",null,"Qgis дээр 'plugin reloader' суулгах"),l.a.createElement("ul",{className:"list-unstyled"},l.a.createElement("li",null,l.a.createElement("h6",null,"Qgis ","->"," Manage and Install Plugins ","->"," Not installed ","->"," Plugin reloader"),l.a.createElement("img",{src:"/static/assets/image/plugin/plugin.png",width:"600px"})),l.a.createElement("li",{className:"mt-3"},l.a.createElement("img",{src:"/static/assets/image/plugin/plugin_builder.png",width:"600px"})))),l.a.createElement("li",null,l.a.createElement("strong",null,'Үүсгэсэн   "plugin"-ийг     Qgis-тай холбох'),l.a.createElement("h6",null,"Qgis ","->","  Manage and Install Plugins ","->"," Installed ","->"," 'qgis_plugin' ")),l.a.createElement("li",{className:"mt-3"},l.a.createElement("strong",null,'Үүсгэсэн   "plugin"-ийг     Plugin Reloader-тай холбох. Ингэснээр "Plugin"-ийг дахин дахин ачааллах боломжтой болно. '),l.a.createElement("h6",null,"Qgis ","->","  Plugin Reloader","->"," Configure ","->"," Select plugin you want to reload ","->"," qgis_plugin."))))))}}]),n}(r.Component)}}]);