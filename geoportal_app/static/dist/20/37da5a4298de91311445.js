(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{107:function(e,t,a){"use strict";a.d(t,"a",(function(){return p}));var n=a(0),r=a.n(n);a(132);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=m(e);if(t){var r=m(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return u(this,a)}}function u(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&i(e,t)}(u,e);var t,a,n,o=s(u);function u(){return l(this,u),o.apply(this,arguments)}return t=u,(a=[{key:"render",value:function(){return this.props.is_loading?r.a.createElement("div",{className:"loader text-center"},r.a.createElement("div",null,r.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"}),r.a.createElement("br",null),this.props.text?this.props.text:"Түр хүлээнэ үү...")):null}}])&&c(t.prototype,a),n&&c(t,n),u}(n.Component)},889:function(e,t,a){"use strict";a.d(t,"a",(function(){return p}));var n=a(0),r=a.n(n);function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=m(e);if(t){var r=m(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return s(this,a)}}function s(e,t){return!t||"object"!==o(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var p=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(m,e);var t,a,o,s=i(m);function m(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,m),(t=s.call(this,e)).state={status:t.props.status||"initial"},t.handleOpen=t.handleOpen.bind(u(t)),t.handleProceed=t.handleProceed.bind(u(t)),t.handleClose=t.handleClose.bind(u(t)),t}return t=m,(a=[{key:"componentDidMount",value:function(){"initial"==this.state.status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(e){this.props.status!=e.status&&(["initial","open"].includes(this.props.status)&&this.handleOpen(),["closing","closed"].includes(this.props.status)&&this.handleClose(null,0))}},{key:"handleOpen",value:function(){var e=this;this.setState({status:"initial"}),setTimeout((function(){e.setState({status:"open"})}),0)}},{key:"handleClose",value:function(e,t){var a=this;t=void 0===t?150:t,this.setState({status:"closing"}),setTimeout((function(){a.setState({status:"closed"}),e&&e()}),t)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var e=this,t=this.state.status,a="modal fade"+("initial"==t?" d-block":"")+("open"==t?" show d-block":"")+("closing"==t?" d-block":"")+("closed"==t?" d-none":""),o="modal-backdrop fade"+("open"==t?" show":"")+("closed"==t?" d-none":"");return r.a.createElement(n.Fragment,null,r.a.createElement("div",{className:a,onClick:function(){return e.handleProceed()}},r.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},r.a.createElement("div",{className:"modal-content",style:{border:"none",borderRadius:"7px",background:"#ebebeb"}},r.a.createElement("div",{className:"d-flex justify-content-center"},"danger"==this.props.model_type_icon?r.a.createElement("i",{className:"fa fa-times-circle fa-3x my-3 animated bounceIn text-danger","aria-hidden":"true"}):"primary"==this.props.model_type_icon?r.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn gp-text-primary","aria-hidden":"true"}):"warning"==this.props.model_type_icon?r.a.createElement("i",{className:"fa fa-exclamation-circle fa-3x my-3 animated bounceIn text-warning","aria-hidden":"true"}):r.a.createElement("i",{className:"fa fa-check-circle fa-3x my-3 animated bounceIn text-success","aria-hidden":"true"})),r.a.createElement("div",{className:"d-flex justify-content-center my-1"},r.a.createElement("h6",{className:"text-dark"},this.props.title)),r.a.createElement("div",{className:"modal-body text-wrap ml-2 mr-2 my-3 text-justify"},r.a.createElement("a",{className:"text-dark"},this.props.text))))),r.a.createElement("div",{className:o}))}}])&&l(t.prototype,a),o&&l(t,o),m}(n.Component)},906:function(e,t,a){var n=a(66),r=a(929);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var o={insert:"head",singleton:!1};n(r,o);e.exports=r.locals||{}},929:function(e,t,a){(t=a(67)(!1)).push([e.i,".bundle-view-scroll {\n    overflow-y: scroll;\n    height: calc(95vh);\n}\n\n.bundle-view-right-scroll {\n    overflow-y: scroll;\n    height: calc(95vh - 36px);\n}",""]),e.exports=t},973:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return W}));var n=a(0),r=a.n(n),o=a(49),l=a(216);function c(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?c(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var u={getall:function(){var e=i({},Object(l.a)());return fetch("".concat(m,"/all/"),e).then(l.c)},getPropertyFields:function(e){var t=i({},Object(l.b)());return fetch("".concat(m,"/property-fields/").concat(e,"/"),t).then(l.c)},setPropertyFields:function(e,t,a,n){var r=i(i({},Object(l.b)()),{},{body:JSON.stringify({fid:e,fields:t,tid:a,values:n})});return fetch("".concat(m,"/property-fields/save/"),r).then(l.c)}},m="/back/dedsan-butests";var p=a(889),f=(a(906),a(235),a(880)),d=a(131),y=a(538),h=a(224),_=a(467);function v(e){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function E(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=O(e);if(t){var r=O(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return w(this,a)}}function w(e,t){return!t||"object"!==v(t)&&"function"!=typeof t?k(e):t}function k(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function O(e){return(O=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var N=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(l,e);var t,a,n,o=E(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={geojson:[],dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",style_name:e.style_name,view_name:e.view_name?e.view_name:"geoserver_desing_view",url:e.url,defualt_url:e.defualt_url,geom_type:e.geom_type,is_loading:!1},t.loadMapData=t.loadMapData.bind(k(t)),t.loadMap=t.loadMap.bind(k(t)),t}return t=l,(a=[{key:"componentDidMount",value:function(){this.loadMap(),this.loadMapData()}},{key:"componentDidUpdate",value:function(e,t){e.geom_type!=this.props.geom_type&&this.setState({geom_type:this.props.geom_type})}},{key:"loadMap",value:function(){var e=new f.a({layers:[new d.a({source:new y.a})],target:"map",view:new _.a({center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.map=e}},{key:"loadMapData",value:function(){var e=this.state,t=e.style_name,a=e.url,n=e.defualt_url,r=e.geom_type,o=(e.dataProjection,e.featureProjection),l=[];l=t?{FORMAT:"image/png",styles:t}:{FORMAT:"image/png",cql_filter:"field_type like '".concat(r,"'")};var c={tile:new d.a({source:new h.a({projection:o,url:a||n,params:l})})};this.map.addLayer(c.tile)}},{key:"render",value:function(){return r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12 m-1 h-100 w-100"},r.a.createElement("div",{id:"map",style:{height:"calc( 49vh - 34px - 7px)"}})),this.state.is_loading?r.a.createElement("span",{className:"text-center d-block text-sp",style:{position:"fixed",top:"60%",right:"20%"}}," ",r.a.createElement("i",{className:"fa fa-spinner fa-pulse fa-3x fa-fw"})," ",r.a.createElement("br",null)," Түр хүлээнэ үү... "):null)}}])&&b(t.prototype,a),n&&b(t,n),l}(n.Component),S=a(107);function x(e){return(x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function j(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function P(e,t){return(P=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function C(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=F(e);if(t){var r=F(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return R(this,a)}}function R(e,t){return!t||"object"!==x(t)&&"function"!=typeof t?T(e):t}function T(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function F(e){return(F=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var z=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&P(e,t)}(l,e);var t,a,n,o=C(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={show:!1,id_list:[],save_is_load:!1,modal_alert_check:"closed",title:"",model_type_icon:"success",view_name:"",style_names:e.style_names,url:e.url,defualt_url:e.defualt_url,geom_type:e.geom_type,is_loading:e.property_loading,zoom_stop:0,zoom_start:0,cache_type:"seed",number_of_cache:2,image_format:"png",tile_cache_check:!1},t.handleInput=t.handleInput.bind(T(t)),t.handleOnChange=t.handleOnChange.bind(T(t)),t.handleSave=t.handleSave.bind(T(t)),t.handleOnClick=t.handleOnClick.bind(T(t)),t}return t=l,(a=[{key:"handleOnClick",value:function(){this.setState({check_style:!0})}},{key:"handleOnChange",value:function(e){var t,a,n;this.setState((t={},a=e.target.name,n=e.target.value,a in t?Object.defineProperty(t,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[a]=n,t))}},{key:"handleInput",value:function(e){var t=this.state.id_list,a=parseInt(e.target.value);e.target.checked?t.push(a):t=t.filter((function(e){return e!=a})),this.setState({id_list:t})}},{key:"handleSave",value:function(){var e=this,t=this.props.fid,a=this.props.tid,n=this.state,r=n.id_list,o=n.style_name,l=n.geom_type,c=n.zoom_stop,i=n.zoom_start,s=n.number_of_cache,m=n.image_format,p=n.cache_type,f={style_name:o,geom_type:l,tile_cache_check:n.tile_cache_check,cache_values:{zoom_stop:c,zoom_start:i,number_of_cache:s,cache_type:p,image_format:m}};this.setState({save_is_load:!0}),u.setPropertyFields(t,r,a,f).then((function(t){var a=t.success,n=t.info;a?(e.setState({save_is_load:!1,modal_alert_check:"open",title:n,model_type_icon:"success"}),e.props.getAll(),e.modalCloseTime()):(e.setState({save_is_load:!1,modal_alert_check:"open",title:n,model_type_icon:"danger"}),e.modalCloseTime())}))}},{key:"componentDidMount",value:function(){var e=this.props.id_list;this.setState({id_list:e})}},{key:"componentDidUpdate",value:function(e,t){var a=this.state,n=a.style_name,r=(a.view_name,a.tile_cache_check);if(t.style_name!=n&&this.setState({check_style:!1,style_name:n}),t.tile_cache_check!=r&&this.setState({check_style:!1,style_name:n,tile_cache_check:r}),e.view_name!=this.props.view_name&&this.setState({check_style:!1,style_name:this.props.view_style_name}),e.fields!==this.props.fields){var o=this.props.fields;this.setState({fields:o})}if(e.id_list!==this.props.id_list){var l=this.props.id_list;this.setState({id_list:l})}if(e.view_name!==this.props.view_name){var c=this.props.view_name;this.setState({view_name:c})}if(e.style_names!==this.props.style_names&&this.setState({style_names:this.props.style_names}),e.url!==this.props.url&&this.setState({url:this.props.url}),e.view_style_name!==this.props.view_style_name&&this.setState({style_name:this.props.view_style_name}),e.geom_type!==this.props.geom_type&&this.setState({geom_type:this.props.geom_type}),e.defualt_url!==this.props.defualt_url&&this.setState({defualt_url:this.props.defualt_url}),e.property_loading!==this.props.property_loading&&this.setState({is_loading:this.props.property_loading}),e.fid!==this.props.fid&&this.setState({tile_cache_check:!1}),e.cache_values!==this.props.cache_values&&this.props.cache_values)if(this.props.cache_values.length>0){var i=this.props.cache_values[0];this.setState({zoom_stop:i.zoom_stop,zoom_start:i.zoom_start,cache_type:i.cache_type,number_of_cache:i.number_of_cache,image_format:i.image_format})}else this.setState({zoom_stop:0,zoom_start:0,cache_type:"seed",number_of_cache:0,image_format:"png"})}},{key:"handleModalAlert",value:function(){this.setState({modal_alert_check:"closed"}),clearTimeout(this.state.timer)}},{key:"modalCloseTime",value:function(){var e=this;this.state.timer=setTimeout((function(){e.setState({modal_alert_check:"closed"})}),2e3)}},{key:"render",value:function(){var e=this,t=this.props,a=t.fields,n=t.fid,o=t.fname,l=this.state,c=l.check_style,i=l.is_loading,s=l.cache_type,u=l.id_list,m=l.save_is_load,f=l.view_name,d=l.style_names,y=l.style_name,h=l.url,_=l.defualt_url,v=l.geom_type,b=l.zoom_stop,g=l.zoom_start,E=l.number_of_cache,w=l.tile_cache_check,k=l.image_format;return r.a.createElement("div",{className:"card col-md-6 mb-1 bundle-view-right-scroll",style:{left:"10px"}},r.a.createElement("div",{className:"card-body"},n?r.a.createElement("div",null,v&&r.a.createElement("fieldset",null,r.a.createElement("div",{className:"form-row border m-1 p-1"},r.a.createElement("div",{className:"form-row col-md-12  text-center"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"",className:"m-2"},r.a.createElement("h5",null,"tilecache тохируулах")),r.a.createElement("input",{type:"checkbox",checked:w,onChange:function(t){return e.setState({tile_cache_check:!w})}}))),w&&r.a.createElement("div",{className:"form-row col-md-12"},r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"",className:"m-2"},"Зургийн формат"),r.a.createElement("select",{className:"form-control form-control-sm",value:k,onChange:function(t){return e.setState({image_format:t.target.value})}},r.a.createElement("option",{value:"jpeg"},"jpeg"),r.a.createElement("option",{value:"png"},"png"))),r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"",className:"m-2"},"Томруулах эхний утга"),r.a.createElement("input",{type:"number",name:"zoom_start",className:"form-control col-4"+(g>21?" is-invalid":""),value:g,onChange:function(t){return e.handleOnChange(t)}}),g>21&&r.a.createElement("label",{className:"text-danger"},"Томруулах эхний утга нь хамгийн ихдээ 21 байна")),r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"",className:"m-2"},"Томруулах сүүлчийн утга"),r.a.createElement("input",{type:"number",name:"zoom_stop",className:"form-control col-4"+(b>21?" is-invalid":""),value:b,onChange:function(t){return e.handleOnChange(t)}}),b>21&&r.a.createElement("label",{className:"text-danger"},"Томруулах сүүлчийн утга нь хамгийн ихдээ 21 байна")),r.a.createElement("div",{className:"form-group col-md-4"},r.a.createElement("label",{htmlFor:"color",className:"m-2"},"Үйлдлийн төрөл"),r.a.createElement("select",{className:"form-control form-control-sm",value:s,onChange:function(t){return e.setState({cache_type:t.target.value})}},r.a.createElement("option",{value:"seed"},"seed"),r.a.createElement("option",{value:"reseed"},"reseed"),r.a.createElement("option",{value:"truncate"},"Truncate"))),r.a.createElement("div",{className:"form-group col-md-4 mr-2"},r.a.createElement("label",{htmlFor:"number_of_cache",className:"m-2"},"Хэрэглэх таскуудын тоо"),r.a.createElement("input",{type:"number",name:"number_of_cache",className:"form-control col-4"+(b>100?" is-invalid":""),value:E,onChange:function(t){return e.handleOnChange(t)}}),E>100&&r.a.createElement("label",{className:"text-danger"},"Хэрэглэх таскын тоо хамгийн ихдээ 100 байна")))),r.a.createElement("div",{className:"form-row border m-1 p-2 pl-2"},r.a.createElement("div",{className:"form-row col-md-12 text-center"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("label",{htmlFor:"color",className:"m-2"},r.a.createElement("h5",null,"давхаргын style тохируулах")))),r.a.createElement("div",{className:"form-group col-md-6"},r.a.createElement("label",{htmlFor:"id_geoserver_user"},"Style-ийн нэр"),r.a.createElement("select",{className:"form-control form-control-sm",value:y||"",onChange:function(t){return e.setState({style_name:t.target.value})}},r.a.createElement("option",{value:y},y||""),d.map((function(e,t){return r.a.createElement("option",{value:e,key:t},e)})))),r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement("button",{type:"button",className:"btn btn-primary",onClick:this.handleOnClick},"Style-ийг шалгах")),c&&r.a.createElement("div",{className:"form-row col-md-12"},r.a.createElement("div",{className:"form-group col-md-12"},r.a.createElement(N,{style_name:y,view_name:f,url:h,defualt_url:_,geom_type:v}))))),r.a.createElement("table",{className:"table table-bordered m-1"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{colSpan:4,className:"text-center"},r.a.createElement("h4",{className:"text-center"},o),f&&r.a.createElement("h4",{className:"text-center"},r.a.createElement("small",null,"View name: ",f)))),r.a.createElement("tr",null,r.a.createElement("th",{className:"text-center",style:{width:"15%"}},"Data ",r.a.createElement("br",null),"type"),r.a.createElement("th",{className:"text-center",style:{width:"15%"}},"View"),r.a.createElement("th",{className:"text-center",style:{width:"70%"}},"Property")),a.map((function(t,a){return r.a.createElement(r.a.Fragment,null,t.data_types.map((function(t,a){return r.a.createElement(r.a.Fragment,null,r.a.createElement("tr",{key:a},r.a.createElement("th",{rowSpan:t.data_type_configs.length+1,className:"text-wrap align-middle text-justify m-2"},r.a.createElement("span",{className:"text-center align-middle"},"(",t.data_type_name_eng,")"),r.a.createElement("br",null),r.a.createElement("span",{className:"text-center align-middle"},t.data_type_name),r.a.createElement("br",null),r.a.createElement("span",{className:"text-justify text-muted align-middle"},r.a.createElement("small",null,t.data_type_definition)))),t.data_type_configs.map((function(t,a){return r.a.createElement(r.a.Fragment,null,r.a.createElement("tr",{key:a},r.a.createElement("th",null,r.a.createElement("div",{className:"icheck-primary"},r.a.createElement("input",{id:t.property_name,type:"checkbox",checked:u.indexOf(t.property_id)>-1,onChange:e.handleInput,value:t.property_id}),r.a.createElement("label",{htmlFor:t.property_name}))),r.a.createElement("th",null,r.a.createElement("label",{htmlFor:t.property_name,"data-toggle":"tooltip","data-placement":"right",title:t.property_definition},t.property_name,r.a.createElement("br",null),"(",t.value_types.map((function(e,t){return r.a.createElement("span",{key:t},e.value_type_name)})),")"))))})))})))})))),m?r.a.createElement("a",{className:"btn btn-block gp-btn-primary text-white"},"Уншиж байна"):r.a.createElement("a",{onClick:this.handleSave,className:"btn btn-block gp-btn-primary text-white"},"View үүсгэх")):r.a.createElement("div",null,r.a.createElement("h4",{className:"text-center"},"Property Хоосон байна")),r.a.createElement(p.a,{title:this.state.title,model_type_icon:this.state.model_type_icon,status:this.state.modal_alert_check,modalAction:function(){return e.handleModalAlert()}}),r.a.createElement(S.a,{is_loading:i})))}}])&&j(t.prototype,a),n&&j(t,n),l}(n.Component);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function M(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function B(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=U(e);if(t){var r=U(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return q(this,a)}}function q(e,t){return!t||"object"!==D(t)&&"function"!=typeof t?I(e):t}function I(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function U(e){return(U=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var J=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(l,e);var t,a,n,o=B(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={list_all:[],fields:[],fid:null,tid:null,id_list:[],view_name:"",fname:null,prev_event:null,prev_theme_event:null,prev_package_event:null,check_package_event:null,style_names:[],url:"",defualt_url:"",view_style_name:"",geom_type:"",is_loading:!1,property_loading:!1,cache_values:[]},t.getAll=t.getAll.bind(I(t)),t.getProperties=t.getProperties.bind(I(t)),t.active_view=t.active_view.bind(I(t)),t}return t=l,(a=[{key:"componentDidMount",value:function(){this.getAll()}},{key:"getAll",value:function(){var e=this;this.setState({is_loading:!0}),u.getall().then((function(t){var a=t.success,n=t.data,r=t.style_names,o=t.defualt_url;a&&e.setState({list_all:n,style_names:r,defualt_url:o,is_loading:!1})}))}},{key:"getProperties",value:function(e,t,a,n){var r=this;this.active_view(n),this.setState({fid:e,tid:t,fname:a,property_loading:!0}),u.getPropertyFields(e).then((function(e){var t=e.success,a=e.fields,n=e.id_list,o=e.view_name,l=e.url,c=e.style_name,i=e.geom_type,s=e.cache_values;t?r.setState({fields:a,id_list:n,view_name:o,url:l,view_style_name:c,geom_type:i,property_loading:!1,cache_values:s}):r.setState({property_loading:!1})}))}},{key:"componentDidUpdate",value:function(e,t){t.geom_type!==this.state.geom_type&&this.setState({geom_type:this.state.geom_type})}},{key:"active_view",value:function(e){this.setState({fields:[],id_list:[],view_name:""});var t=e.id,a=this.state.prev_event,n=this.state.prev_theme_event,r=this.state.prev_package_event,o=this.state.check_package_event,l=t.split("-").length;e.className="list-group-item collapsed active",1===l&&(e.querySelector("i").className="icon expand-icon fa fa-minus",null!==n&&(a.className="list-group-item collapsed",n.querySelector("i").className="icon expand-icon fa fa-plus"),this.setState({prev_theme_event:e})),2===l&&(n.className="list-group-item collapsed",null!==r?r.id.split("-")[0]===t.split("-")[0]?r.id===t?"icon expand-icon fa fa-minus ml-4"===e.querySelector("i").className?(a.className="list-group-item collapsed",e.querySelector("i").className="icon expand-icon fa fa-plus ml-4"):e.querySelector("i").className="icon expand-icon fa fa-minus ml-4":(e.querySelector("i").className="icon expand-icon fa fa-minus ml-4",a.className="list-group-item collapsed",r.querySelector("i").className="icon expand-icon fa fa-plus ml-4"):(e.querySelector("i").className="icon expand-icon fa fa-minus ml-4",null!==o&&(a.className="list-group-item collapsed",o.querySelector("i").className="icon expand-icon fa fa-plus ml-4"),this.setState({check_package_event:r})):e.querySelector("i").className="icon expand-icon fa fa-minus ml-4",this.setState({prev_package_event:e})),3===l&&(a.className="list-group-item collapsed"),this.setState({prev_event:e})}},{key:"render",value:function(){var e=this,t=this.state,a=t.list_all,n=(t.fid,t.tid,t.style_names),o=t.view_style_name,l=t.url,c=t.defualt_url,i=t.geom_type,s=t.is_loading,u=t.property_loading,m=t.cache_values;return r.a.createElement("div",{className:"row m-0"},r.a.createElement("div",{className:"col-md-6"},r.a.createElement("div",{className:"card bundle-view-scroll mb-0"},r.a.createElement("div",{className:"card-header text-uppercase"},"Theme"),r.a.createElement("div",{className:"card-body"},r.a.createElement("div",{id:"accordion1"},a.map((function(t,a){return r.a.createElement("ul",{className:"list-group",key:a},r.a.createElement("li",{className:"list-group-item collapsed",id:"".concat(a),"data-toggle":"collapse","data-target":"#collapse-theme".concat(a),"aria-expanded":"false","aria-controls":"collapse-theme".concat(a),onClick:function(t){return e.active_view(t.currentTarget)}},r.a.createElement("i",{className:"icon expand-icon fa fa-plus",id:"".concat(a)}),"  ",t.name),r.a.createElement("div",{id:"collapse-theme".concat(a),className:"collapse","data-parent":"#accordion1"},r.a.createElement("div",{id:"accordion10".concat(a)},t.package.map((function(n,o){return r.a.createElement("ul",{className:"list-group",key:o},r.a.createElement("li",{className:"list-group-item collapsed",id:"".concat(a,"-").concat(o),"data-toggle":"collapse","data-target":"#collapse-packages".concat(a).concat(o),"aria-expanded":"false","aria-controls":"collapse-packages".concat(a).concat(o),onClick:function(t){return e.active_view(t.currentTarget)}},r.a.createElement("i",{className:"icon expand-icon fa fa-plus ml-4",id:"".concat(a,"-").concat(o)}),"  ",n.name),r.a.createElement("div",{id:"collapse-packages".concat(a).concat(o),className:"collapse","data-parent":"#accordion10".concat(a)},r.a.createElement("div",{id:"accordion100".concat(o)},n.features.map((function(n,l){return r.a.createElement("ul",{className:"list-group",key:l},r.a.createElement("li",{className:"list-group-item",id:"".concat(a,"-").concat(o,"-").concat(l),onClick:function(a){return e.getProperties(n.id,t.id,n.name,a.currentTarget)}},r.a.createElement("i",{className:n.view?"fa fa-table text-success":"fa fa-table text-muted",style:{paddingLeft:"40px"}}),"  ",r.a.createElement("span",{className:"p-0",id:"".concat(a,"-").concat(o,"-").concat(l)}," ",n.name),n.view&&r.a.createElement("ul",{style:{paddingLeft:"90px"},id:"".concat(a,"-").concat(o,"-").concat(l)},r.a.createElement("li",{id:"features-".concat(a).concat(o).concat(l)},n.view.view_name))))})))))})))))}))))),r.a.createElement(S.a,{is_loading:s})),r.a.createElement(z,{getAll:this.getAll,fields:this.state.fields,fid:this.state.fid,fname:this.state.fname,tid:this.state.tid,id_list:this.state.id_list,view_name:this.state.view_name,style_names:n,url:l,defualt_url:c,view_style_name:o,geom_type:i,property_loading:u,cache_values:m}))}}])&&M(t.prototype,a),n&&M(t,n),l}(n.Component);function L(e){return(L="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function V(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function G(e,t){return(G=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function H(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=Q(e);if(t){var r=Q(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return K(this,a)}}function K(e,t){return!t||"object"!==L(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function Q(e){return(Q=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var W=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&G(e,t)}(c,e);var t,a,n,l=H(c);function c(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),l.call(this,e)}return t=c,(a=[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(o.c,null,r.a.createElement(o.a,{path:"/back/inspire-views/",component:J})))}}])&&V(t.prototype,a),n&&V(t,n),c}(n.Component)}}]);