(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{902:function(e,t,n){var r=n(67),o=n(903);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},903:function(e,t,n){(t=n(68)(!1)).push([e.i,".reaquest #map{\n    width: auto;\n    height: calc( 90vh - 85px - 15px);\n}\n\n\n.⚙-toggle-swipe-button {\n    padding: 1px 5px;\n    font-size: 15px;\n    top: 56px;\n    right: 7px;\n    background-color: rgba(0,60,136,0.5);\n    position: absolute;\n    border-radius: 3px;\n    width: 25px;\n    height: 25px;\n}\n.⚙-toggle-swipe-button:active{\n    background-color: rgba(0,60,136,0.7);\n}\n.⚙-toggle-swipe-button:hover{\n    background-color: rgba(0,60,136,0.7);\n}\n",""]),e.exports=t},904:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(34);function o(e,t){var n=[];return e.map((function(e){t?"geometry"!==e.type&&("integer"!=e.type&&"double precision"!=e.type&&"bigint"!=e.type||(n[e.name]=r.b().typeError("Заавал тоо байх ёстой !").required("Нөхцөл хоосон байна !")),"character varying"!=e.type&&"character"!=e.type||(n[e.name]=r.d().max(50,"Хэт урт байна !").required("Нөхцөл хоосон байна !"))):"id"!==e.name&&"geometry"!==e.type&&("integer"!=e.type&&"double precision"!=e.type&&"bigint"!=e.type||(n[e.name]=r.b().typeError("Заавал тоо байх ёстой !").required("Нөхцөл хоосон байна !")),"character varying"!=e.type&&"character"!=e.type||(n[e.name]=r.d().max(50,"Хэт урт байна !").required("Нөхцөл хоосон байна !")))})),r.c(n)}},905:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(34);function o(){var e=[];return e.order_no=r.d().required("Нөхцөл хоосон байна !"),e.order_at=r.a().required("Нөхцөл хоосон байна !"),r.c(e)}},906:function(e,t,n){"use strict";n.d(t,"a",(function(){return C}));var r=n(0),o=n.n(r),a=(n(215),n(881)),c=n(470),i=n(880),l=(n(902),n(137)),s=n(236),u=n(212),f=n(332),p=n(882),d=n(285),m=n(162),y=n(283),h=n(529),b=n(471);function v(e){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=E(e);if(t){var o=E(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return w(this,n)}}function w(e,t){return!t||"object"!==v(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function E(e){return(E=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(n,e);var t=_(n);function n(e){var r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,n);var o=e||{},a=(r=t.call(this,{element:document.createElement("div"),target:o.target})).element;a.className="⚙-toggle-swipe-button";var c=document.createElement("a");c.setAttribute("data-toggle","tooltip"),c.setAttribute("data-placement","right"),c.setAttribute("title","Layer swipd"),c.setAttribute("href","#"),a.setAttribute("id","⚙-toggle-swipe-button-id");var i=document.createElement("i");return i.setAttribute("aria-hidden","true"),i.className="fa fa-superpowers text-white",c.appendChild(i),a.addEventListener("click",(function(e){e.preventDefault(),o.swipeButton()})),a.appendChild(c),r}return n}(n(76).a);function j(e){return(j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=R(e);if(t){var o=R(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return k(this,n)}}function k(e,t){return!t||"object"!==j(t)&&"function"!=typeof t?x(e):t}function x(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function R(e){return(R=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&N(e,t)}(g,e);var t,n,r,v=P(g);function g(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,g),(t=v.call(this,e)).state={dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",is_layer_swipe:!1,last_layer:null},t.loadMapData=t.loadMapData.bind(x(t)),t.loadMap=t.loadMap.bind(x(t)),t.swipeButton=t.swipeButton.bind(x(t)),t.layerSwipe=t.layerSwipe.bind(x(t)),t}return t=g,(n=[{key:"componentDidMount",value:function(){this.loadMap(),this.loadMapData()}},{key:"loadMap",value:function(){var e=this,t=new a.a({layers:[new m.a({source:new p.a})],target:"map",view:new c.a({center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});t.addControl(new O({swipeButton:this.swipeButton})),this.map=t;var n=new h.a({hitTolerance:20});t.addInteraction(n),n.on("select",(function(t){return e.props.selectedFeature(t)})),1==this.props.values.length&&t.removeInteraction(n)}},{key:"loadMapData",value:function(){var e=this,t={MultiPolygon:new l.c({stroke:new s.a({color:"green",width:2}),fill:new u.a({color:"rgba(0,255,0,0.3)"})}),Polygon:new l.c({stroke:new s.a({color:"green",width:2}),fill:new u.a({color:"rgba(0,255,0,0.3)"})}),Point:new l.c({image:new f.a({radius:5,fill:new u.a({color:"green"})})}),LineString:new l.c({stroke:new s.a({color:"green",width:2})}),MultiLineString:new l.c({stroke:new s.a({color:"green",width:2})}),MultiPoint:new l.c({image:new f.a({radius:5,fill:new u.a({color:"green"})})})},n={MultiPolygon:new l.c({stroke:new s.a({color:"red",width:2}),fill:new u.a({color:"rgba(255,0,0,0.3)"})}),Polygon:new l.c({stroke:new s.a({color:"red",width:2}),fill:new u.a({color:"rgba(255,0,0,0.3)"})}),Point:new l.c({image:new f.a({radius:5,fill:new u.a({color:"blue"})})}),LineString:new l.c({stroke:new s.a({color:"red",width:2})}),MultiLineString:new l.c({stroke:new s.a({color:"red",width:2})}),MultiPoint:new l.c({image:new f.a({radius:5,fill:new u.a({color:"red"})})})},r=this.props.values,o=0;r.map((function(r,a){var c=r.id,l=r.geo_json;if(l.features){if(l.features[0]&&Object.keys(l.features[0]).length>0){var s=(new i.a).readFeatures(l.features[0],{dataProjection:e.state.dataProjection,featureProjection:e.state.featureProjection});s[0].setProperties({id:c});var u=new d.a({features:s}),f=new y.a({source:u,style:function(e){return t[e.getGeometry().getType()]}});e.map.addLayer(f)}if(l.features[1]&&Object.keys(l.features[1]).length>0){var p=(new i.a).readFeatures(l.features[1],{dataProjection:e.state.dataProjection,featureProjection:e.state.featureProjection}),m=new d.a({features:p}),h=new y.a({source:m,style:function(e){return n[e.getGeometry().getType()]}});o=1,e.map.addLayer(h),e.setState({last_layer:h})}0!=o?e.map.getView().fit(p[0].getGeometry(),{padding:[300,300,300,300]}):e.map.getView().fit(s[0].getGeometry(),{padding:[300,300,300,300]})}}))}},{key:"layerSwipe",value:function(e){var t=this;if(e){var n=this.state.last_layer;(r=document.getElementById("swipe")).value=50,n&&(n.on("prerender",(function(e){var n=e.context,o=t.map.getSize(),a=o[0]*(r.value/100),c=Object(b.a)(e,[a,0]),i=Object(b.a)(e,[o[0],0]),l=Object(b.a)(e,[a,o[1]]),s=Object(b.a)(e,o);n.save(),n.beginPath(),n.moveTo(c[0],c[1]),n.lineTo(l[0],l[1]),n.lineTo(s[0],s[1]),n.lineTo(i[0],i[1]),n.closePath(),n.clip()})),n.on("postrender",(function(e){e.context.restore()})),r.addEventListener("input",(function(){t.map.render()}),!1))}else{var r;(r=document.getElementById("swipe")).value=0}}},{key:"swipeButton",value:function(){this.state.is_layer_swipe?(this.setState({is_layer_swipe:!1}),this.layerSwipe(!1)):(this.setState({is_layer_swipe:!0}),this.layerSwipe(!0))}},{key:"render",value:function(){var e=this.state.is_layer_swipe;return o.a.createElement("div",{className:"container-fluid"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12 px-0 reaquest"},o.a.createElement("div",{id:"map"}),o.a.createElement("input",{className:e?"":"d-none",id:"swipe",type:"range",style:{width:"100%"}}))))}}])&&S(t.prototype,n),r&&S(t,r),g}(r.Component)},955:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return $}));var r=n(0),o=n.n(r),a=n(49),c=n(53);function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={getAll:function(){var e=l({},Object(c.a)());return fetch("/gov/api/org-request/change-request/",e).then(c.c)},detail:function(e,t,n){var r=Object(c.a)();return fetch("".concat("/gov/api/inspire","/").concat(e,"/").concat(t,"/").concat(n,"/detailUpdate/"),r).then(c.c)},controlToApprove:function(e,t){var n=l(l({},Object(c.b)()),{},{body:JSON.stringify({values:e,change_request_id:t})});return fetch("/gov/api/inspire/control-to-approve/",n).then(c.c)},controlToRemove:function(e){var t=l(l({},Object(c.b)()),{},{body:JSON.stringify({change_request_id:e})});return fetch("/gov/api/inspire/control-to-remove/",t).then(c.c)}};var f=n(906),p=n(19),d=n(904),m=n(905);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t){return(b=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=w(e);if(t){var o=w(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return g(this,n)}}function g(e,t){return!t||"object"!==y(t)&&"function"!=typeof t?_(e):t}function _(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var E=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&b(e,t)}(i,e);var t,n,a,c=v(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).state={is_loading:!0,tid:e.tid,fid:e.fid,gid:e.gid,change_request_id:e.change_request_id,values:{},geojson:{},order_at:"",order_no:""},t.onSubmit=t.onSubmit.bind(_(t)),t.handleUpdate=t.handleUpdate.bind(_(t)),t.validationSchema=d.a.bind(_(t)),t.handleRemove=t.handleRemove.bind(_(t)),t}return t=i,(n=[{key:"onSubmit",value:function(e,t){var n=this,r=(t.setStatus,t.setSubmitting,this.state.change_request_id);this.props.handleIsload(!0),u.controlToApprove(e,r).then((function(e){e.success,e.info,n.props.handleIsload(!1),n.props.handleClose()}))}},{key:"handleRemove",value:function(){var e=this,t=this.state.change_request_id;u.controlToRemove(t).then((function(t){t.success&&e.props.handleClose()}))}},{key:"componentDidMount",value:function(){this.handleUpdate()}},{key:"handleUpdate",value:function(){var e=this,t=this.state,n=t.tid,r=t.fid,o=t.gid;u.detail(o,n,r).then((function(t){var n=t.success,r=t.datas;n&&e.setState({values:r,is_loading:!1})}))}},{key:"render",value:function(){var e=this,t=this.state.values;return this.state.is_loading||0==t.length?o.a.createElement("p",{className:"text-center"}," ",o.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"})," ",o.a.createElement("br",null)," Түр хүлээнэ үү... "):o.a.createElement("div",{className:"overflow-auto card-body"},o.a.createElement(p.e,{enableReinitialize:!0,initialValues:{form_values:t,order_at:this.state.order_at,order_no:this.state.order_no},validationSchema:m.a,onSubmit:this.onSubmit},(function(t){t.errors,t.status,t.touched,t.isSubmitting,t.setFieldValue,t.handleBlur,t.handleChange,t.setValues;var n=t.values;return t.isValid,t.dirty,o.a.createElement(p.d,null,o.a.createElement(p.c,{name:"form_values",render:function(t){return o.a.createElement("div",null,n.form_values&&n.form_values.length>0?n.form_values.map((function(e,t){return o.a.createElement("div",{key:t,className:"row my-3 "},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},e.property_code?e.property_code:"")),"option"==e.value_type?o.a.createElement("div",{className:"col-md-9"},o.a.createElement(r.Fragment,null,o.a.createElement(p.b,{name:"form_values.".concat(t,".data")||!1,as:"select",className:"form-control",disabled:1==e.role},e.data_list&&e.data_list.map((function(e,t){return o.a.createElement("option",{key:t,value:e.code_list_id?e.code_list_id:""},e.code_list_name?e.code_list_name:"")})))),o.a.createElement("small",null,e.property_definition?e.property_definition:"")):o.a.createElement("div",{className:"col-md-9"},"boolean"==e.value_type_id?o.a.createElement(p.b,{name:"form_values.".concat(t,".data")||!1,as:"select",className:"form-control",disabled:1==e.role},o.a.createElement("option",{value:"true"},"True"),o.a.createElement("option",{value:"false"},"False")):o.a.createElement(p.b,{name:"form_values.".concat(t,".data")||!1,className:"form-control",disabled:1==e.role,placeholder:e.property_name,type:e.value_type}),o.a.createElement("small",null,e.property_definition?e.property_definition:"")))})):null,o.a.createElement("div",{className:"row my-3 "},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},"Тушаалын дугаар")),o.a.createElement("div",{className:"col-md-9"},o.a.createElement(p.b,{name:"order_no",className:"form-control",placeholder:"Тушаалын дугаар"}),o.a.createElement(p.a,{name:"order_no",component:"span"}))),o.a.createElement("div",{className:"row my-3 "},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},"Тушаал гарсан огноо ")),o.a.createElement("div",{className:"col-md-9"},o.a.createElement(p.b,{name:"order_at",className:"form-control",placeholder:"Тушаал гарсан огноо",type:"date"}),o.a.createElement(p.a,{name:"order_at",component:"span"}))),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("button",{type:"submit",className:"btn btn-block gp-btn-primary"},"Хадгалах")),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("button",{onClick:e.handleRemove,className:"btn btn-block btn-danger"},"Устгах"))))}}))})))}}])&&h(t.prototype,n),a&&h(t,a),i}(r.Component);function O(e){return(O="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function S(e,t){return(S=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function N(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=x(e);if(t){var o=x(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return P(this,n)}}function P(e,t){return!t||"object"!==O(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var R=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&S(e,t)}(i,e);var t,n,a,c=N(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).state={status:t.props.status||"initial",is_loading:!1},t.handleOpen=t.handleOpen.bind(k(t)),t.handleClose=t.handleClose.bind(k(t)),t.handleIsload=t.handleIsload.bind(k(t)),t}return t=i,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"handleIsload",value:function(e){this.setState({is_loading:e})}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),t.props.modalClose(),t.props.getAll()}),150)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":""),c=this.props,i=c.form_json,l=c.state,s=c.feature_id,u=c.theme_id,p=c.old_geo_id,d=c.change_request_id;return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n+" ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap",style:{height:"calc( 103vh - 85px - 15px)"}},o.a.createElement("div",{className:"col-md-10 d-flex justify-content-center container"},o.a.createElement("div",{className:"modal-content animated row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"row mt-2",style:{background:"white"},onClick:function(){return e.handleClose()}},o.a.createElement("div",{className:"col-md-11"},o.a.createElement("h5",{className:"text-center text-justify"},"Илгээсэн хүсэлт")),o.a.createElement("div",{className:"col-md-1"},o.a.createElement("button",{type:"button",className:"close float-right","data-dismiss":"modal","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true"},"×")))),o.a.createElement("div",{className:"row"},i&&o.a.createElement("div",{className:"col-md-6 overflow-auto text-justify",style:{height:"calc( 90vh - 85px - 15px)"}},i.map((function(e,t){return o.a.createElement("div",{key:t,className:"row my-3"},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},e.property_code)),o.a.createElement("div",{className:"col-md-2"}),o.a.createElement("div",{className:"col-md-6 mr-1"},o.a.createElement("input",{className:"form-control",disabled:!0,placeholder:e.property_name,value:e.data,type:e.value_type}),o.a.createElement("div",{className:"col-form-label "},e.property_definition)))}))),4==l&&o.a.createElement("div",{className:"col-md-6 overflow-auto text-justify",style:{height:"calc( 90vh - 85px - 15px)"}},o.a.createElement(E,{handleIsload:this.handleIsload,handleClose:this.handleClose,tid:u,fid:s,gid:p,change_request_id:d})),o.a.createElement("div",{className:i||4==l?"col-md-6":"col-md-12"},o.a.createElement(f.a,{geoJson:this.props.geo_json})))))),this.state.is_loading&&o.a.createElement("div",{className:"text-center d-block text-sp",style:{position:"fixed",top:"30%",left:"45%",backgroundColor:"rgba(255, 255, 255, 0.4)"}},o.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"})," ",o.a.createElement("br",null)," Хүсэлтийг шалгаж байна түр хүлээнэ үү...")),o.a.createElement("div",{className:a}))}}])&&j(t.prototype,n),a&&j(t,a),i}(r.Component);function C(e){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function q(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function D(e,t){return(D=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function T(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=I(e);if(t){var o=I(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return M(this,n)}}function M(e,t){return!t||"object"!==C(t)&&"function"!=typeof t?A(e):t}function A(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function I(e){return(I=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var B=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&D(e,t)}(c,e);var t,n,r,a=T(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={is_model_request_open:!1},t.handleRequestOpen=t.handleRequestOpen.bind(A(t)),t.handleRequestClose=t.handleRequestClose.bind(A(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){}},{key:"handleRequestOpen",value:function(){this.setState({is_model_request_open:!0})}},{key:"handleRequestClose",value:function(){this.setState({is_model_request_open:!1})}},{key:"render",value:function(){var e=this.state.is_model_request_open,t=this.props.idx,n=this.props.values,r=n.id,a=n.theme_name,c=n.package_name,i=n.feature_name,l=n.state,s=n.form_json,u=n.geo_json,f=n.employee,p=n.org,d=n.created_at,m=n.kind,y=n.order_at,h=n.order_no,b=n.feature_id,v=n.theme_id,g=n.old_geo_id,_=n.change_request_id;return o.a.createElement("tr",null,o.a.createElement("td",null,t+1),o.a.createElement("td",null,a+"/"+c+"/"+i),o.a.createElement("td",null,p+"/"+f),o.a.createElement("td",null,h),o.a.createElement("td",null,y),o.a.createElement("td",null,d),1==l?o.a.createElement("td",{className:"text-priamry"},"ШИНЭ"):2==l?o.a.createElement("td",{className:"text-danger"},"ТАТГАЛЗСАН"):3==l?o.a.createElement("td",{className:"text-success"},"ЗӨВШӨӨРСӨН"):4==l?o.a.createElement("td",{className:"gp-text-primary"},"ХЯНАХ"):null,1==m?o.a.createElement("td",{className:"text-success"},"ҮҮССЭН"):2==m?o.a.createElement("td",{className:"text-primary"},"ЗАССАН"):5==m?o.a.createElement("td",{className:"text-danger"},"ЦУЦЛАСАН"):3==m?o.a.createElement("td",{className:"text-danger"},"УСТГАСАН"):null,1==l||4==l?o.a.createElement("td",null,o.a.createElement("button",{className:"btn btn-primary",onClick:this.handleRequestOpen},1==l?"ДЭЛГЭРЭНГҮЙ":"ХЯНАХ"),e&&o.a.createElement(R,{modalClose:this.handleRequestClose,geo_json:u,form_json:s,title:"Илгээсэн хүсэлт",kind:m,id:r,state:l,feature_id:b,theme_id:v,old_geo_id:g,change_request_id:_,getAll:this.props.getAll})):o.a.createElement("td",null))}}])&&q(t.prototype,n),r&&q(t,r),c}(r.Component);function L(e){return(L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function F(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function G(e,t){return(G=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function U(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=z(e);if(t){var o=z(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return V(this,n)}}function V(e,t){return!t||"object"!==L(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var H=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&G(e,t)}(c,e);var t,n,r,a=U(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={org_request:[]},t.getAll=t.getAll.bind(J(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){this.getAll()}},{key:"getAll",value:function(){var e=this;u.getAll().then((function(t){var n=t.success,r=t.org_request;n&&e.setState({org_request:r})}))}},{key:"render",value:function(){var e=this,t=this.state.org_request;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"table-responsive"},o.a.createElement("table",{className:"table"},o.a.createElement("thead",null,o.a.createElement("tr",null,o.a.createElement("th",{scope:"col"},"№"),o.a.createElement("th",{scope:"col"},"Орон зайн өгөгдөл"),o.a.createElement("th",{scope:"col"},"Байгууллага / мэргэжилтэн"),o.a.createElement("th",{scope:"col"},"Тушаалын дугаар"),o.a.createElement("th",{scope:"col"},"Тушаал гарсан огноо"),o.a.createElement("th",{scope:"col"},"Огноо"),o.a.createElement("th",null,"Төлөв"),o.a.createElement("th",null,"Өөрчлөлт"),o.a.createElement("th",null))),o.a.createElement("tbody",null,t.length>0?t.map((function(t,n){return o.a.createElement(B,{key:n,idx:n,values:t,getAll:e.getAll})})):o.a.createElement("tr",null,o.a.createElement("td",{className:"text-justify"},"Өөрчлөлт байхгүй байна")))))))}}])&&F(t.prototype,n),r&&F(t,r),c}(r.Component);function K(e){return(K="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Q(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function W(e,t){return(W=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function X(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=Z(e);if(t){var o=Z(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Y(this,n)}}function Y(e,t){return!t||"object"!==K(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Z(e){return(Z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var $=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&W(e,t)}(i,e);var t,n,r,c=X(i);function i(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,i),(t=c.call(this,e)).state={},t}return t=i,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(a.c,null,o.a.createElement(a.a,{path:"/gov/history/",component:H}))))}}])&&Q(t.prototype,n),r&&Q(t,r),i}(r.Component)}}]);