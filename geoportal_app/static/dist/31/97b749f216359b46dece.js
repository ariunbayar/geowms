(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{1005:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(36);function o(e,t){var n=[];return e.map((function(e){t?"geometry"!==e.type&&("integer"!=e.type&&"double precision"!=e.type&&"bigint"!=e.type||(n[e.name]=r.b().typeError("Заавал тоо байх ёстой !").required("Нөхцөл хоосон байна !")),"character varying"!=e.type&&"character"!=e.type||(n[e.name]=r.d().max(50,"Хэт урт байна !").required("Нөхцөл хоосон байна !"))):"id"!==e.name&&"geometry"!==e.type&&("integer"!=e.type&&"double precision"!=e.type&&"bigint"!=e.type||(n[e.name]=r.b().typeError("Заавал тоо байх ёстой !").required("Нөхцөл хоосон байна !")),"character varying"!=e.type&&"character"!=e.type||(n[e.name]=r.d().max(50,"Хэт урт байна !").required("Нөхцөл хоосон байна !")))})),r.c(n)}},1006:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n(36);function o(){var e=[];return e.order_no=r.d().required("Нөхцөл хоосон байна !"),e.order_at=r.a().required("Нөхцөл хоосон байна !"),r.c(e)}},1078:function(e,t,n){var r=n(67),o=n(1079);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},1079:function(e,t,n){(t=n(68)(!1)).push([e.i,".reaquest #map{\n    width: auto;\n    height: calc( 90vh - 85px - 15px);\n}",""]),e.exports=t},956:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return be}));var r=n(0),o=n.n(r),a=n(13),c=n(54);function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u={getAll:function(){var e=i({},Object(c.a)());return fetch("/gov/api/org-request/change-request/",e).then(c.c)},detail:function(e,t,n){var r=Object(c.a)();return fetch("".concat("/gov/api/inspire","/").concat(e,"/").concat(t,"/").concat(n,"/detailUpdate/"),r).then(c.c)},controlToApprove:function(e,t){var n=i(i({},Object(c.b)()),{},{body:JSON.stringify({values:e,change_request_id:t})});return fetch("/gov/api/inspire/control-to-approve/",n).then(c.c)},controlToRemove:function(e){var t=i(i({},Object(c.b)()),{},{body:JSON.stringify({change_request_id:e})});return fetch("/gov/api/inspire/control-to-remove/",t).then(c.c)}};n(246);var f=n(584),p=n(976),d=n(69),m=n(304),y=n(303),h=(n(1078),n(131)),b=n(226),v=n(223),g=n(348),_=n(172),E=n(197);function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function O(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function j(e,t){return(j=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function N(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=k(e);if(t){var o=k(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return S(this,n)}}function S(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?P(e):t}function P(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var x=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&j(e,t)}(c,e);var t,n,r,a=N(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"},t.loadMapData=t.loadMapData.bind(P(t)),t.loadMap=t.loadMap.bind(P(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){var e=this.props.geoJson;this.loadMap(),this.loadMapData(e)}},{key:"loadMap",value:function(){var e=new f.a({layers:[new d.a({source:new p.a})],target:"map",view:new m.a({center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.map=e}},{key:"loadMapData",value:function(e){var t={MultiPolygon:new h.c({stroke:new b.a({color:"green",width:2}),fill:new v.a({color:"rgba(0,255,0,0.3)"})}),Polygon:new h.c({stroke:new b.a({color:"green",width:2}),fill:new v.a({color:"rgba(0,255,0,0.3)"})}),Point:new h.c({image:new g.a({radius:5,fill:new v.a({color:"green"})})}),LineString:new h.c({stroke:new b.a({color:"green",width:2})}),MultiLineString:new h.c({stroke:new b.a({color:"green",width:2})}),MultiPoint:new h.c({image:new g.a({radius:5,fill:new v.a({color:"green"})})})},n={MultiPolygon:new h.c({stroke:new b.a({color:"red",width:2}),fill:new v.a({color:"rgba(255,0,0,0.3)"})}),Polygon:new h.c({stroke:new b.a({color:"red",width:2}),fill:new v.a({color:"rgba(255,0,0,0.3)"})}),Point:new h.c({image:new g.a({radius:5,fill:new v.a({color:"blue"})})}),LineString:new h.c({stroke:new b.a({color:"red",width:2})}),MultiLineString:new h.c({stroke:new b.a({color:"red",width:2})}),MultiPoint:new h.c({image:new g.a({radius:5,fill:new v.a({color:"red"})})})},r=e,o=0;if(r.features){if(r.features[0]&&Object.keys(r.features[0]).length>0){var a=(new y.a).readFeatures(r.features[0],{dataProjection:this.state.dataProjection,featureProjection:this.state.featureProjection}),c=new _.a({features:a}),l=new E.a({source:c,style:function(e){return t[e.getGeometry().getType()]}});this.map.addLayer(l)}if(r.features[1]&&Object.keys(r.features[1]).length>0){var i=(new y.a).readFeatures(r.features[1],{dataProjection:this.state.dataProjection,featureProjection:this.state.featureProjection}),s=new _.a({features:i}),u=new E.a({source:s,style:function(e){return n[e.getGeometry().getType()]}});o=1,this.map.addLayer(u)}0!=o?this.map.getView().fit(i[0].getGeometry(),{padding:[300,300,300,300]}):this.map.getView().fit(a[0].getGeometry(),{padding:[300,300,300,300]})}}},{key:"render",value:function(){return this.props.geoJson,o.a.createElement("div",{className:"container-fluid"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12 px-0 reaquest"},o.a.createElement("div",{id:"map"}))))}}])&&O(t.prototype,n),r&&O(t,r),c}(r.Component),R=n(22),q=n(1005),C=n(1006);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function T(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function M(e,t){return(M=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=F(e);if(t){var o=F(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return I(this,n)}}function I(e,t){return!t||"object"!==D(t)&&"function"!=typeof t?J(e):t}function J(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function F(e){return(F=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var G=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&M(e,t)}(l,e);var t,n,a,c=A(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=c.call(this,e)).state={is_loading:!0,tid:e.tid,fid:e.fid,gid:e.gid,change_request_id:e.change_request_id,values:{},geojson:{},order_at:"",order_no:"",description:e.description},t.onSubmit=t.onSubmit.bind(J(t)),t.handleUpdate=t.handleUpdate.bind(J(t)),t.validationSchema=q.a.bind(J(t)),t.handleRemove=t.handleRemove.bind(J(t)),t}return t=l,(n=[{key:"onSubmit",value:function(e,t){var n=this,r=(t.setStatus,t.setSubmitting,this.state.change_request_id);this.props.handleIsload(!0),u.controlToApprove(e,r).then((function(e){e.success,e.info,n.props.handleIsload(!1),n.props.handleClose()}))}},{key:"handleRemove",value:function(){var e=this,t=this.state.change_request_id;u.controlToRemove(t).then((function(t){t.success&&e.props.handleClose()}))}},{key:"componentDidMount",value:function(){this.handleUpdate()}},{key:"handleUpdate",value:function(){var e=this,t=this.state,n=t.tid,r=t.fid,o=t.gid;this.props.form_json||u.detail(o,n,r).then((function(t){var n=t.success,r=t.datas;n&&e.setState({values:r,is_loading:!1})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.values,a=t.description,c=this.props,l=c.form_json,i=c.state;if((this.state.is_loading||0==n.length)&&!l)return o.a.createElement("p",{className:"text-center"}," ",o.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"})," ",o.a.createElement("br",null)," Түр хүлээнэ үү... ");var s=n;return l&&(s=l),o.a.createElement("div",{className:"overflow-auto card-body"},o.a.createElement(R.e,{enableReinitialize:!0,initialValues:{form_values:s,order_at:this.state.order_at,order_no:this.state.order_no},validationSchema:C.a,onSubmit:this.onSubmit},(function(t){var n=t.errors,c=(t.status,t.touched,t.isSubmitting,t.setFieldValue,t.handleBlur,t.handleChange,t.setValues,t.values);return t.isValid,t.dirty,o.a.createElement(R.d,null,o.a.createElement(R.c,{name:"form_values",render:function(t){return o.a.createElement("div",null,c.form_values&&c.form_values.length>0?c.form_values.map((function(e,t){return o.a.createElement("div",{key:t,className:"row my-3"},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},e.property_code?e.property_code:"")),"option"==e.value_type?o.a.createElement("div",{className:"col-md-9"},o.a.createElement(r.Fragment,null,o.a.createElement(R.b,{name:"form_values.".concat(t,".data")||!1,as:"select",className:"form-control",disabled:"ХЯНАХ"!=i},e.data_list&&e.data_list.map((function(e,t){return o.a.createElement("option",{key:t,value:e.code_list_id?e.code_list_id:""},e.code_list_name?e.code_list_name:"")})))),o.a.createElement("small",null,e.property_definition?e.property_definition:"")):o.a.createElement("div",{className:"col-md-9"},"boolean"==e.value_type_id?o.a.createElement(R.b,{name:"form_values.".concat(t,".data")||!1,as:"select",className:"form-control",disabled:"ХЯНАХ"!=i},o.a.createElement("option",{value:"true"},"True"),o.a.createElement("option",{value:"false"},"False")):o.a.createElement(R.b,{name:"form_values.".concat(t,".data")||!1,className:"form-control",disabled:"ХЯНАХ"!=i,placeholder:e.property_name,type:e.value_type}),o.a.createElement("small",null,e.property_definition?e.property_definition:"")))})):null,"ХЯНАХ"==i?o.a.createElement("div",null,o.a.createElement("div",{className:"row my-3 "},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},"Тушаалын дугаар")),o.a.createElement("div",{className:"col-md-9"},o.a.createElement(R.b,{name:"order_no",className:"form-control "+(n.order_no?"is-invalid":""),placeholder:"Тушаалын дугаар"}),o.a.createElement(R.a,{className:"text-danger",name:"order_no",component:"span"}))),o.a.createElement("div",{className:"row my-3 "},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},"Тушаал гарсан огноо ")),o.a.createElement("div",{className:"col-md-9"},o.a.createElement(R.b,{name:"order_at",className:"form-control "+(n.order_at?"is-invalid":""),placeholder:"Тушаал гарсан огноо",type:"date"}),o.a.createElement(R.a,{className:"text-danger",name:"order_at",component:"span"}))),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6"},o.a.createElement("button",{type:"submit",className:"btn btn-block gp-btn-primary"},"Хадгалах")),o.a.createElement("div",{className:"col-md-6"},o.a.createElement("button",{onClick:e.handleRemove,className:"btn btn-block btn-danger"},"Устгах")))):"ТАТГАЛЗСАН"==i?o.a.createElement("div",{className:"row my-3"},o.a.createElement("div",{className:"col-md-3"},o.a.createElement("label",{className:"col-form-label"},"Тайлбар")),o.a.createElement("div",{className:"col-md-9"},o.a.createElement("input",{type:"text",className:"form-control",value:a,disabled:!0}))):null)}}))})))}}])&&T(t.prototype,n),a&&T(t,a),l}(r.Component);function L(e){return(L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function U(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function V(e,t){return(V=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=K(e);if(t){var o=K(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return B(this,n)}}function B(e,t){return!t||"object"!==L(t)&&"function"!=typeof t?H(e):t}function H(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function K(e){return(K=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var Q=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&V(e,t)}(l,e);var t,n,a,c=z(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=c.call(this,e)).state={status:t.props.status||"initial",is_loading:!1},t.handleOpen=t.handleOpen.bind(H(t)),t.handleClose=t.handleClose.bind(H(t)),t.handleIsload=t.handleIsload.bind(H(t)),t}return t=l,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"handleIsload",value:function(e){this.setState({is_loading:e})}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose())}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e){var t=this;this.setState({status:"closing"}),setTimeout((function(){t.setState({status:"closed"}),t.props.modalClose(),t.props.getAll()}),150)}},{key:"render",value:function(){var e=this,t=this.state.status,n="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),a="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":""),c=this.props,l=c.form_json,i=c.state,s=c.feature_id,u=c.theme_id,f=c.old_geo_id,p=c.change_request_id,d=c.description;return o.a.createElement(r.Fragment,null,o.a.createElement("div",{className:n+" ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap",style:{height:"calc( 103vh - 85px - 15px)"}},o.a.createElement("div",{className:"col-md-10 d-flex justify-content-center container"},o.a.createElement("div",{className:"modal-content animated row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"row mt-2",style:{background:"white"},onClick:function(){return e.handleClose()}},o.a.createElement("div",{className:"col-md-11"},o.a.createElement("h5",{className:"text-center text-justify"},"Илгээсэн хүсэлт")),o.a.createElement("div",{className:"col-md-1"},o.a.createElement("button",{type:"button",className:"close float-right","data-dismiss":"modal","aria-label":"Close"},o.a.createElement("span",{"aria-hidden":"true"},"×")))),o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-6 overflow-auto text-justify",style:{height:"calc( 90vh - 85px - 15px)"}},o.a.createElement(G,{state:i,handleIsload:this.handleIsload,handleClose:this.handleClose,tid:u,fid:s,gid:f,change_request_id:p,form_json:l,description:d})),o.a.createElement("div",{className:l||"ХЯНАХ"==i?"col-md-6":"col-md-12"},o.a.createElement(x,{geoJson:this.props.geo_json})))))),this.state.is_loading&&o.a.createElement("div",{className:"text-center d-block text-sp",style:{position:"fixed",top:"30%",left:"45%",backgroundColor:"rgba(255, 255, 255, 0.4)"}},o.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"})," ",o.a.createElement("br",null)," Хүсэлтийг шалгаж байна түр хүлээнэ үү...")),o.a.createElement("div",{className:a}))}}])&&U(t.prototype,n),a&&U(t,a),l}(r.Component);function W(e){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function X(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Y(e,t){return(Y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Z(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=te(e);if(t){var o=te(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return $(this,n)}}function $(e,t){return!t||"object"!==W(t)&&"function"!=typeof t?ee(e):t}function ee(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function te(e){return(te=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ne=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&Y(e,t)}(c,e);var t,n,r,a=Z(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={is_model_request_open:!1},t.handleRequestOpen=t.handleRequestOpen.bind(ee(t)),t.handleRequestClose=t.handleRequestClose.bind(ee(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){}},{key:"handleRequestOpen",value:function(){this.setState({is_model_request_open:!0})}},{key:"handleRequestClose",value:function(){this.setState({is_model_request_open:!1})}},{key:"render",value:function(){var e=this.state.is_model_request_open,t=this.props.idx,n=this.props.values,r=n.id,a=n.theme_name,c=n.package_name,l=n.feature_name,i=n.state,s=n.form_json,u=n.geo_json,f=n.employee,p=n.org,d=n.created_at,m=n.kind,y=n.order_at,h=n.order_no,b=n.feature_id,v=n.theme_id,g=n.old_geo_id,_=n.change_request_id,E=n.project_name,w=n.description;return o.a.createElement("tr",{className:"text-center"},o.a.createElement("td",null,t+1),o.a.createElement("td",{className:"text-left"},a+"/"+c+"/"+l),o.a.createElement("td",null,p+"/"+f),o.a.createElement("td",null,h),o.a.createElement("td",null,y),o.a.createElement("td",null,d),"ШИНЭ"==i?o.a.createElement("td",{className:"text-priamry"},"ШИНЭ"):"ТАТГАЛЗСАН"==i?o.a.createElement("td",{className:"text-danger"},"ТАТГАЛЗСАН"):"ЗӨВШӨӨРСӨН"==i?o.a.createElement("td",{className:"text-success"},"ЗӨВШӨӨРСӨН"):"ХЯНАХ"==i?o.a.createElement("td",{className:"gp-text-primary"},"ХЯНАХ"):null,"ҮҮССЭН"==m?o.a.createElement("td",{className:"text-success"},"ҮҮССЭН"):"ЗАССАН"==m?o.a.createElement("td",{className:"text-primary"},"ЗАССАН"):"ЦУЦЛАСАН"==m?o.a.createElement("td",{className:"text-danger"},"ЦУЦЛАСАН"):"БУЦААГДСАН"==m?o.a.createElement("td",{className:"text-danger"},"БУЦААГДСАН"):"УСТГАСАН"==m?o.a.createElement("td",{className:"text-danger"},"УСТГАСАН"):null,o.a.createElement("td",null,E),o.a.createElement("td",null,o.a.createElement("button",{className:"btn btn-primary",onClick:this.handleRequestOpen},"ХЯНАХ"==i?"ХЯНАХ":"ДЭЛГЭРЭНГҮЙ"),e&&o.a.createElement(Q,{modalClose:this.handleRequestClose,geo_json:u,form_json:s,title:"Илгээсэн хүсэлт",kind:m,id:r,state:i,description:w,feature_id:b,theme_id:v,old_geo_id:g,change_request_id:_,getAll:this.props.getAll})))}}])&&X(t.prototype,n),r&&X(t,r),c}(r.Component);function re(e){return(re="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function oe(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function ae(e,t){return(ae=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function ce(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=se(e);if(t){var o=se(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return le(this,n)}}function le(e,t){return!t||"object"!==re(t)&&"function"!=typeof t?ie(e):t}function ie(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function se(e){return(se=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var ue=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ae(e,t)}(c,e);var t,n,r,a=ce(c);function c(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),(t=a.call(this,e)).state={org_request:[]},t.getAll=t.getAll.bind(ie(t)),t}return t=c,(n=[{key:"componentDidMount",value:function(){this.getAll()}},{key:"getAll",value:function(){var e=this;u.getAll().then((function(t){var n=t.success,r=t.org_request;n&&e.setState({org_request:r})}))}},{key:"render",value:function(){var e=this,t=this.state.org_request;return o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"col-md-12"},o.a.createElement("div",{className:"table-responsive"},o.a.createElement("table",{className:"table"},o.a.createElement("thead",null,o.a.createElement("tr",{className:"text-center"},o.a.createElement("th",{scope:"col"},"№"),o.a.createElement("th",{scope:"col"},"Орон зайн өгөгдөл"),o.a.createElement("th",{scope:"col"},"Байгууллага / мэргэжилтэн"),o.a.createElement("th",{scope:"col"},"Тушаалын дугаар"),o.a.createElement("th",{scope:"col"},"Тушаал гарсан огноо"),o.a.createElement("th",{scope:"col"},"Огноо"),o.a.createElement("th",null,"Төлөв"),o.a.createElement("th",null,"Өөрчлөлт"),o.a.createElement("th",null,"ААН / ТӨСЛИЙН НЭР"),o.a.createElement("th",null))),o.a.createElement("tbody",null,t.length>0?t.map((function(t,n){return o.a.createElement(ne,{key:n,idx:n,values:t,getAll:e.getAll})})):o.a.createElement("tr",null,o.a.createElement("td",{className:"text-justify"},"Өөрчлөлт байхгүй байна")))))))}}])&&oe(t.prototype,n),r&&oe(t,r),c}(r.Component);function fe(e){return(fe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function pe(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function de(e,t){return(de=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function me(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=he(e);if(t){var o=he(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return ye(this,n)}}function ye(e,t){return!t||"object"!==fe(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function he(e){return(he=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var be=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&de(e,t)}(l,e);var t,n,r,c=me(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=c.call(this,e)).state={},t}return t=l,(n=[{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement(a.d,null,o.a.createElement(a.b,{path:"/gov/history/",component:ue}))))}}])&&pe(t.prototype,n),r&&pe(t,r),l}(r.Component)}}]);