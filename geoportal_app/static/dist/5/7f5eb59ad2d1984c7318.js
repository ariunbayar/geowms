(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{164:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var o=n(0),a=n.n(o);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=p(e);if(t){var a=p(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(p,e);var t,n,r,l=c(p);function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=l.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t}return t=p,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose(null,0))}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e,t){var n=this;t=void 0===t?150:t,this.setState({status:"closing"}),setTimeout((function(){n.setState({status:"closed"}),e&&e()}),t)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),r="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return a.a.createElement(o.Fragment,null,a.a.createElement("div",{className:n,onClick:function(){return e.handleProceed()}},a.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},a.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},a.a.createElement("div",{className:"d-flex justify-content-center"},"danger"==this.props.model_type_icon?a.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"primary"==this.props.model_type_icon?a.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn gp-text-primary","aria-hidden":"true"}):"warning"==this.props.model_type_icon?a.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):a.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),a.a.createElement("div",{className:"d-flex justify-content-center my-1"},a.a.createElement("h6",{className:"text-dark"},this.props.title)),a.a.createElement("div",{className:"modal-body text-wrap ml-2 mr-2 my-3 text-justify"},a.a.createElement("a",{className:"text-dark"},this.props.text))))),a.a.createElement("div",{className:r}))}}])&&i(t.prototype,n),r&&i(t,r),p}(o.Component)},241:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));var o=n(0),a=n.n(o);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=p(e);if(t){var a=p(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(p,e);var t,n,r,l=c(p);function p(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,p),(t=l.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t}return t=p,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),e?e():(t.setState({status:"closed"}),t.props.modalClose&&t.props.modalClose())}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),r="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return a.a.createElement(o.Fragment,null,a.a.createElement("div",{className:n},a.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},a.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},a.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},a.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},a.a.createElement("span",{"aria-hidden":"true",onClick:function(){return e.handleClose()}},"×"))),a.a.createElement("div",{className:"d-flex justify-content-center"},"success"==this.props.model_type_icon?a.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"warning"==this.props.model_type_icon?a.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):a.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),a.a.createElement("div",{className:"d-flex justify-content-center"},a.a.createElement("h5",null,this.props.title)),a.a.createElement("div",{className:"modal-body text-center text-wrap ml-2 mr-2 text-justify"},this.props.text),a.a.createElement("div",{className:"modal-footer",style:{border:"none"}},a.a.createElement("button",{type:"button",onClick:function(){return e.handleClose()},className:"btn btn-primary waves-effect waves-light"},a.a.createElement("i",{className:"fa fa-times"}),this.props.actionNameBack?this.props.actionNameBack:"  БУЦАХ"),a.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},a.a.createElement("i",{className:"fa fa-check-square-o"}),this.props.actionNameDelete?this.props.actionNameDelete:"  УСТГАХ"))))),a.a.createElement("div",{className:r}))}}])&&i(t.prototype,n),r&&i(t,r),p}(o.Component)},901:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));n(2);var o=n(0),a=n.n(o);function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=p(e);if(t){var a=p(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==r(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(l,e);var t,n,o,r=c(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=r.call(this,e)).state={items:[],page:1,total_page:1,is_loading:!1,searchQuery:t.props.searchQuery},t.loadPage=t.loadPage.bind(u(t)),t.nextPage=t.nextPage.bind(u(t)),t.prevPage=t.prevPage.bind(u(t)),t.addPage=t.addPage.bind(u(t)),t}return t=l,(n=[{key:"componentDidMount",value:function(){this.loadPage(this.state.page,this.state.searchQuery)}},{key:"componentDidUpdate",value:function(e){if(e.searchQuery!==this.props.searchQuery){var t=this.props.searchQuery;this.setState({searchQuery:t}),this.loadPage(1,t)}if(e.load!==this.props.load){var n=this.props.searchQuery;this.loadPage(1,n)}if(this.props.search_state&&e.search_state!==this.props.search_state){var o=this.props.searchQuery;this.loadPage(1,o)}}},{key:"nextPage",value:function(){this.loadPage(this.state.page+1,this.state.searchQuery)}},{key:"prevPage",value:function(){this.loadPage(this.state.page-1,this.state.searchQuery)}},{key:"loadPage",value:function(e,t){var n=this;if(!this.state.is_loading)if(e=Math.max(e,1),e=Math.min(e,this.state.total_page),this.setState({is_loading:!0}),this.props.search_state){var o=this.props.search_state;this.props.paginate(e,t,o).then((function(e){var t=e.page,o=e.total_page;n.setState({page:t,total_page:o,is_loading:!1})}))}else this.props.paginate(e,t).then((function(e){var t=e.page,o=e.total_page;n.setState({page:t,total_page:o,is_loading:!1})}))}},{key:"addPage",value:function(e){var t=e.target.value;this.setState({page:t}),this.loadPage(t,"")}},{key:"render",value:function(){var e=this,t=this.state,n=t.page,o=t.total_page;return a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"float-left"},a.a.createElement("strong",{className:"gp-text-primary"},"Хуудас ",n,"-",o)),a.a.createElement("div",{className:"float-right btn-group group-round m-1"},a.a.createElement("button",{type:"button",value:"1",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},"<<")," ",n>1&&a.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),n>1&&a.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),a.a.createElement("button",{type:"button",value:n,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":"")},n)," ",n<o&&a.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.nextPage},">"),a.a.createElement("button",{type:"button",value:o,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},">>")," ")))}}])&&i(t.prototype,n),o&&i(t,o),l}(o.Component)},905:function(e,t,n){"use strict";n.d(t,"a",(function(){return se}));var o=n(0),a=n.n(o),r=n(887),i=(n(219),n(118)),s=n(888),c=n(473),l=n(2),u=n(166),p=n(286),f=n(287),d=n(139),h=n(892),m=n(240),y=n(216),b=n(336),g=n(536),v=n(70),w=n(124),_=n(230),x=n(16),O=n(21),P=n(516),k=n(514),j=n(78),S=n(15);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function C(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function R(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=T(e);if(t){var a=T(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return D(this,n)}}function D(e,t){return!t||"object"!==E(t)&&"function"!=typeof t?M(e):t}function M(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function T(e){return(T=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}j.a;var z=n(7),L=n.n(z);function Q(e){return(Q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function A(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function F(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function G(e,t,n){return t&&F(e.prototype,t),n&&F(e,n),e}function I(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&B(e,t)}function B(e,t){return(B=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function U(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=V(e);if(t){var a=V(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return Y(this,n)}}function Y(e,t){return!t||"object"!==Q(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function V(e){return(V=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var X=function(e){I(n,e);var t=U(n);function n(e){var o;return A(this,n),(o=t.call(this,e)).handleCoordinateSet=o.handleCoordinateSet.bind(J(o)),o}return G(n,[{key:"componentDidMount",value:function(){this.handleCoordinateSet()}},{key:"componentDidUpdate",value:function(e){this.handleCoordinateSet()}},{key:"handleCoordinateSet",value:function(){var e=L.a.findDOMNode(this);e.focus(),e.select()}},{key:"render",value:function(){return a.a.createElement("input",{type:"text",className:"form-control",onChange:function(){},onBlur:this.props.handleBlur,value:this.props.coordinate})}}]),n}(o.Component),q=function(e){I(n,e);var t=U(n);function n(e){var o;A(this,n);var a=e||{};(o=t.call(this,{element:document.createElement("div"),target:a.target})).is_component_initialized=!1;var r="coordinate-copy-control ".concat(S.b," ").concat(S.c);return o.element.className=r,o.renderComponent=o.renderComponent.bind(J(o)),o.toggleControl=o.toggleControl.bind(J(o)),o}return G(n,[{key:"toggleControl",value:function(e){this.element.classList.toggle(S.c,!e)}},{key:"renderComponent",value:function(e){var t=this;e.handleBlur=function(){return t.toggleControl(!1)},this.is_component_initialized||(L.a.render(a.a.createElement(X,e),this.element),this.is_component_initialized=!0),L.a.hydrate(a.a.createElement(X,e),this.element)}},{key:"setCoordinate",value:function(e){this.renderComponent({coordinate:e}),this.toggleControl(!0)}}]),n}(j.a),H=(n(937),n(36));function W(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function K(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?W(Object(n),!0).forEach((function(t){Z(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):W(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Z(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var $={loadWMSLayers:function(e){var t=K({},Object(H.a)());return fetch("/дэд-сан/".concat(e,"/давхаргууд/"),t).then(H.c)},loadBaseLayers:function(){var e=K({},Object(H.a)());return fetch("/суурь-давхарга/",e).then(H.c)},findSum:function(e){var t=K(K({},Object(H.b)()),{},{body:JSON.stringify({x:e[0],y:e[1]})});return fetch("/gov/api/tseg-personal/findSum/",t).then(H.c)}};function ee(e){return(ee="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function te(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function ne(e,t){return(ne=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function oe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=ie(e);if(t){var a=ie(this).constructor;n=Reflect.construct(o,arguments,a)}else n=o.apply(this,arguments);return ae(this,n)}}function ae(e,t){return!t||"object"!==ee(t)&&"function"!=typeof t?re(e):t}function re(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ie(e){return(ie=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var se=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ne(e,t)}(S,e);var t,n,o,j=oe(S);function S(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,S),(t=j.call(this,e)).state={format:new r.a,dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",is_sidebar_open:!0,coordinate_clicked:"",vector_layer:null,is_draw_open:!1,draw_layer:null,draw:null,source_draw:null,info:[],xy:[],latlongx:e.latlongx,latlongy:e.latlongy,map_open:!0,geoms:[],ayuul_geoms:[],geom_points:[]},t.controls={coordinateCopy:new q},t.marker=t.initMarker(),t.handleMapDataLoaded=t.handleMapDataLoaded.bind(re(t)),t.handleMapClick=t.handleMapClick.bind(re(t)),t.loadMapData=t.loadMapData.bind(re(t)),t.showFeaturesAt=t.showFeaturesAt.bind(re(t)),t.handleSetCenter=t.handleSetCenter.bind(re(t)),t.loadGeojson=t.loadGeojson.bind(re(t)),t.snap=t.snap.bind(re(t)),t}return t=S,(n=[{key:"initMarker",value:function(){var e=new d.c({image:new h.a({anchor:[.5,86],anchorXUnits:"fraction",anchorYUnits:"pixels",scale:.4,src:"/static/assets/image/marker.png"})}),t=new v.a([0,0]),n=new i.a({geometry:t});return n.setStyle(e),{feature:n,point:t}}},{key:"componentDidMount",value:function(){this.loadMapData()}},{key:"loadMapData",value:function(){var e=this;$.loadBaseLayers().then((function(t){var n=t.base_layer_list;e.handleMapDataLoaded(n)}))}},{key:"snap",value:function(e){var t=new g.a({source:e.getSource()});this.map.addInteraction(t)}},{key:"loadGeojson",value:function(e,t){var n=this,o=this.map,a={Polygon:new d.c({stroke:new m.a({color:t,width:4}),fill:new y.a({color:"rgba(255, 255, 0, 0.1)"})}),Point:new d.c({image:new b.a({radius:5,fill:new y.a({color:"blue"})})})},i=[];e.map((function(e){var t=e.id,o=e.geom;if(o){var a=(new r.a).readFeatures(o,{dataProjection:n.state.dataProjection,featureProjection:n.state.featureProjection})[0];a.setProperties({id:t}),i.push(a)}}));var s=new f.a({features:i}),c=new p.a({name:"vector_layer",source:s,style:function(e){return a[e.getGeometry().getType()]}});o.addLayer(c),this.snap(c),"orange"==t&&(this.vectorLayer=c),"red"==t&&(this.ayuul_vectorLayer=c),"blue"==t&&(this.geom_point_layer=c)}},{key:"handleMapDataLoaded",value:function(e){var t=this,n=e.reduce((function(e,t,n){var o;return"xyz"==t.tilename&&(o=new u.a({source:new w.a({crossOrigin:"Anonymous",url:t.url})})),"wms"==t.tilename&&(o=new u.a({source:new _.a({url:t.url,params:{LAYERS:t.layers,FORMAT:"image/png"}})})),e.base_layers.push(o),e.base_layer_controls.push({is_active:0==n,thumbnail_1x:t.thumbnail_1x,thumbnail_2x:t.thumbnail_2x,layer:o}),e}),{base_layers:[],base_layer_controls:[]}),o=n.base_layers,a=(n.base_layer_controls,new p.a({source:new f.a,style:new d.c({stroke:new m.a({color:"rgba(100, 255, 0, 1)",width:2}),fill:new y.a({color:"rgba(100, 255, 0, 0.3)"})})}));this.setState({vector_layer:a});var r=new p.a({source:new f.a({features:[this.marker.feature]})}),i=new s.a({target:"map",controls:Object(O.a)().extend([new P.a({projection:this.state.dataProjection,coordinateFormat:function(e){return Object(x.f)(e,"{y},{x}",6)},undefinedHTML:""}),new k.a,this.controls.coordinateCopy]),layers:[o[0]].concat([a,r]),view:new c.a({projection:this.state.projection,center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.props.only_see||i.on("click",this.handleMapClick),this.map=i,"ayuul"!==this.props.type&&this.handleSetCenter(),this.props.loadTseg&&this.props.loadTseg((function(e){return t.handleSetTseg(e)}))}},{key:"handleSetTseg",value:function(e){if(e&&this.map&&e[0]>60){var t=this.map.getView(),n=t.getProjection(),o=Object(l.p)(e,this.state.dataProjection,n);this.marker.point.setCoordinates(o),t.setCenter(o)}}},{key:"handleMapClick",value:function(e){if(!this.props.only_see){this.marker.point.setCoordinates(e.coordinate);var t=e.map.getView().getProjection(),n=Object(l.p)(e.coordinate,t,this.state.dataProjection),o=Object(x.f)(n,"{y},{x}",6);this.setState({coordinate_clicked:o}),this.showFeaturesAt(o)}}},{key:"showFeaturesAt",value:function(e){var t=this,n=e.split(",").map((function(e){return Number(e)}));this.props.coordinatCheck?this.props.handleXY(n,null,null):$.findSum(n).then((function(e){var o=e.success,a=e.info;t.props.handleXY(n,a,o)}))}},{key:"componentDidUpdate",value:function(e){if(e.xy!==this.props.xy&&this.handleSetCenter(),e.geoms!==this.props.geoms){this.vectorLayer&&this.vectorLayer.getSource().clear();var t=this.props.geoms;this.setState({geoms:t}),this.loadGeojson(t,"orange")}if(e.ayuul_geoms!==this.props.ayuul_geoms){this.ayuul_vectorLayer&&this.ayuul_vectorLayer.getSource().clear();var n=this.props.ayuul_geoms;this.setState({ayuul_geoms:n}),this.loadGeojson(n,"red")}if(e.geom_points!==this.props.geom_points){this.geom_point_layer&&this.geom_point_layer.getSource().clear();var o=this.props.geom_points;this.setState({geom_points:o}),this.loadGeojson(o,"blue")}}},{key:"handleSetCenter",value:function(){var e=this.props.xy;if(e&&this.map&&e[0]>60){var t=this.map.getView(),n=t.getProjection(),o=Object(l.p)(e,this.state.dataProjection,n);this.marker.point.setCoordinates(o),t.setCenter(o)}}},{key:"render",value:function(){var e=this;return a.a.createElement("div",{className:""},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col-md-12"},a.a.createElement("div",{className:"🌍"},a.a.createElement("div",{id:this.state.map_open?"map":"map-disable",className:"mt-2"})))),a.a.createElement("button",{type:"button",className:"btn btn-info btn-sm waves-effect waves-light m-1 map-open-button",onClick:function(){return e.setState((function(e){return{map_open:!e.map_open}}))}},this.state.map_open?"Газрын зураг хаах":"Газрын зураг нээх"))}}])&&te(t.prototype,n),o&&te(t,o),S}(o.Component)},937:function(e,t,n){var o=n(55),a=n(938);"string"==typeof(a=a.__esModule?a.default:a)&&(a=[[e.i,a,""]]);var r={insert:"head",singleton:!1};o(a,r);e.exports=a.locals||{}},938:function(e,t,n){(t=n(56)(!1)).push([e.i,".🌍 {\n    position: fixed;\n}\n\n.🌍 > #map{\n    width: 18%;\n    height: 70%;\n    right: 25px;\n    position: fixed;\n    z-index: 100;\n    top: 125px;\n}\n.map-open-button{\n    right: 20px;\n    top:93px;\n    position: fixed;\n}\n.суурь-давхаргууд{\n    right: 1px;\n    z-index: -100;\n    bottom: 2px;\n    height: 32px;\n    position: absolute;\n\n}\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 24.3%;\n    height: 2.1rem;\n    overflow: hidden;\n    margin: 1px;\n    height: 27px;\n    bottom: 2px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n\n.ol-full-screen .ol-full-screen-false{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-full-screen .ol-full-screen-true{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-zoom {\n    width: 27px;\n    height: 54px;\n    left: unset;\n    right: .5rem;\n    top: 1px;\n}\n.ol-zoom  .ol-zoom-out{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n\n}\n.ol-zoom .ol-zoom-in{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n}\n\n.ol-mouse-position {\n    right: 4rem;\n    background: rgba(0,60,136,0.3);\n    border-radius: 4px;\n    padding: 2px .2rem;\n    font-size: smaller;\n    color: #eee;\n    text-align: center;\n    width: 8.8rem;\n    min-height: 1rem;\n}\n\n.coordinate-copy-control {\n    width: 10rem;\n    left: 2%;\n    top: 0.5rem;\n    opacity: 1;\n}\n.coordinate-copy-control.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-scale-line{\n    position: absolute;\n    bottom: 34px;\n}",""]),e.exports=t}}]);