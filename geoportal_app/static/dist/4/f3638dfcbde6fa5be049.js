(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{145:function(t,e,n){"use strict";n.d(e,"a",(function(){return f}));var o=n(0),r=n.n(o);function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=p(t);if(e){var r=p(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return l(this,n)}}function l(t,e){return!e||"object"!==a(e)&&"function"!=typeof e?u(t):e}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var f=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(p,t);var e,n,a,l=c(p);function p(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,p),(e=l.call(this,t)).state={modal_status:e.props.modal_status||"initial"},e.handleOpen=e.handleOpen.bind(u(e)),e.handleClose=e.handleClose.bind(u(e)),e.handleProceed=e.handleProceed.bind(u(e)),e}return e=p,(n=[{key:"componentDidMount",value:function(){"initial"==this.state.modal_status&&this.handleOpen()}},{key:"componentDidUpdate",value:function(t){this.props.modal_status!=t.modal_status&&(["initial","open"].includes(this.props.modal_status)&&this.handleOpen(),["closing","closed"].includes(this.props.modal_status)&&this.handleClose())}},{key:"handleOpen",value:function(){var t=this;this.setState({modal_status:"initial"}),setTimeout((function(){t.setState({modal_status:"open"})}),0)}},{key:"handleClose",value:function(t){var e=this;this.setState({modal_status:"closing"}),setTimeout((function(){e.setState({modal_status:"closed"}),t?t():(e.setState({modal_status:"closed"}),e.props.modalClose&&e.props.modalClose())}),150)}},{key:"handleProceed",value:function(){this.handleClose(this.props.modalAction)}},{key:"render",value:function(){var t=this,e=this.state.modal_status,n="modal fade"+("initial"==e?" d-block":"")+("open"==e?" show d-block":"")+("closing"==e?" d-block":"")+("closed"==e?" d-none":""),a="modal-backdrop fade"+("open"==e?" show":"")+("closed"==e?" d-none":"");return r.a.createElement(o.Fragment,null,r.a.createElement("div",{className:n},r.a.createElement("div",{className:"modal-dialog modal-dialog-centered"},r.a.createElement("div",{className:"modal-content border-0 rounded-lg ".concat(this.props.modal_bg?this.props.modal_bg:"bg-light")},r.a.createElement("div",{className:"col-md-12 offset-md-12 float-right my-1"},r.a.createElement("button",{type:"button",className:"close mt-2 mr-2","aria-label":"Close"},r.a.createElement("span",{"aria-hidden":"true",onClick:function(){return t.handleClose()}},"×"))),r.a.createElement("div",{className:"d-flex justify-content-center"},this.props.modal_icon&&r.a.createElement("i",{className:"".concat(this.props.modal_icon," fa-3x my-3 animated bounceIn text-").concat(this.props.icon_color),"aria-hidden":"true"})),r.a.createElement("div",{className:"d-flex justify-content-center"},r.a.createElement("h5",null,this.props.title&&this.props.title)),r.a.createElement("div",{className:"modal-body text-center text-wrap ml-2 mr-2 text-justify"},this.props.text&&this.props.text),this.props.has_button?r.a.createElement("div",{className:"modal-footer border-0"},r.a.createElement("button",{type:"button",onClick:function(){return t.handleClose()},className:"btn btn-primary waves-effect waves-light"},r.a.createElement("i",{className:"fa fa-times pr-1"}),this.props.actionNameBack?this.props.actionNameBack:"БУЦАХ"),r.a.createElement("button",{type:"button",onClick:this.handleProceed,className:"btn btn-outline-primary waves-effect waves-light"},r.a.createElement("i",{className:"fa fa-check-square-o pr-1"}),this.props.actionNameDelete?this.props.actionNameDelete:"УСТГАХ")):r.a.createElement("div",{className:"modal-body mt-3"})))),r.a.createElement("div",{className:a}))}}])&&i(e.prototype,n),a&&i(e,a),p}(o.Component)},906:function(t,e,n){"use strict";n.d(e,"a",(function(){return f}));n(2);var o=n(0),r=n.n(o);function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=p(t);if(e){var r=p(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return l(this,n)}}function l(t,e){return!e||"object"!==a(e)&&"function"!=typeof e?u(t):e}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var f=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(l,t);var e,n,o,a=c(l);function l(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),(e=a.call(this,t)).state={items:[],page:1,total_page:1,is_loading:!1,searchQuery:e.props.searchQuery},e.loadPage=e.loadPage.bind(u(e)),e.nextPage=e.nextPage.bind(u(e)),e.prevPage=e.prevPage.bind(u(e)),e.addPage=e.addPage.bind(u(e)),e}return e=l,(n=[{key:"componentDidMount",value:function(){this.loadPage(this.state.page,this.state.searchQuery)}},{key:"componentDidUpdate",value:function(t){if(t.searchQuery!==this.props.searchQuery){var e=this.props.searchQuery;this.setState({searchQuery:e}),this.loadPage(1,e)}if(t.load!==this.props.load){var n=this.props.searchQuery;this.loadPage(1,n)}if(this.props.search_state&&t.search_state!==this.props.search_state){var o=this.props.searchQuery;this.loadPage(1,o)}}},{key:"nextPage",value:function(){this.loadPage(this.state.page+1,this.state.searchQuery)}},{key:"prevPage",value:function(){this.loadPage(this.state.page-1,this.state.searchQuery)}},{key:"loadPage",value:function(t,e){var n=this;if(!this.state.is_loading)if(t=Math.max(t,1),t=Math.min(t,this.state.total_page),this.setState({is_loading:!0}),this.props.search_state){var o=this.props.search_state;this.props.paginate(t,e,o).then((function(t){var e=t.page,o=t.total_page;n.setState({page:e,total_page:o,is_loading:!1})}))}else this.props.paginate(t,e).then((function(t){var e=t.page,o=t.total_page;n.setState({page:e,total_page:o,is_loading:!1})}))}},{key:"addPage",value:function(t){var e=t.target.value;this.setState({page:e}),this.loadPage(e,"")}},{key:"render",value:function(){var t=this,e=this.state,n=e.page,o=e.total_page;return r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"float-left"},r.a.createElement("strong",{className:"gp-text-primary"},"Хуудас ",n,"-",o)),r.a.createElement("div",{className:"float-right btn-group group-round m-1"},r.a.createElement("button",{type:"button",value:"1",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(e){return t.addPage(e)}},"<<")," ",n>1&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),n>1&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),r.a.createElement("button",{type:"button",value:n,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":"")},n)," ",n<o&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.nextPage},">"),r.a.createElement("button",{type:"button",value:o,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(e){return t.addPage(e)}},">>")," ")))}}])&&i(e.prototype,n),o&&i(e,o),l}(o.Component)},908:function(t,e,n){"use strict";n.d(e,"a",(function(){return st}));var o=n(0),r=n.n(o),a=n(471),i=(n(220),n(120)),s=n(890),c=n(474),l=n(2),u=n(136),p=n(421),f=n(422),h=n(141),d=n(895),m=n(241),y=n(217),b=n(470),g=n(539),v=n(70),_=n(126),w=n(229),O=n(16),P=n(21),j=n(517),x=n(514),S=n(78),k=n(15);function C(t){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function E(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function N(t,e){return(N=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function D(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=z(t);if(e){var r=z(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return R(this,n)}}function R(t,e){return!e||"object"!==C(e)&&"function"!=typeof e?M(t):e}function M(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function z(t){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}S.a;var L=n(7),T=n.n(L);function Q(t){return(Q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function G(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function A(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function F(t,e,n){return e&&A(t.prototype,e),n&&A(t,n),t}function B(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&U(t,e)}function U(t,e){return(U=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Y(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=X(t);if(e){var r=X(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return J(this,n)}}function J(t,e){return!e||"object"!==Q(e)&&"function"!=typeof e?V(t):e}function V(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function X(t){return(X=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var I=function(t){B(n,t);var e=Y(n);function n(t){var o;return G(this,n),(o=e.call(this,t)).handleCoordinateSet=o.handleCoordinateSet.bind(V(o)),o}return F(n,[{key:"componentDidMount",value:function(){this.handleCoordinateSet()}},{key:"componentDidUpdate",value:function(t){this.handleCoordinateSet()}},{key:"handleCoordinateSet",value:function(){var t=T.a.findDOMNode(this);t.focus(),t.select()}},{key:"render",value:function(){return r.a.createElement("input",{type:"text",className:"form-control",onChange:function(){},onBlur:this.props.handleBlur,value:this.props.coordinate})}}]),n}(o.Component),q=function(t){B(n,t);var e=Y(n);function n(t){var o;G(this,n);var r=t||{};(o=e.call(this,{element:document.createElement("div"),target:r.target})).is_component_initialized=!1;var a="coordinate-copy-control ".concat(k.b," ").concat(k.c);return o.element.className=a,o.renderComponent=o.renderComponent.bind(V(o)),o.toggleControl=o.toggleControl.bind(V(o)),o}return F(n,[{key:"toggleControl",value:function(t){this.element.classList.toggle(k.c,!t)}},{key:"renderComponent",value:function(t){var e=this;t.handleBlur=function(){return e.toggleControl(!1)},this.is_component_initialized||(T.a.render(r.a.createElement(I,t),this.element),this.is_component_initialized=!0),T.a.hydrate(r.a.createElement(I,t),this.element)}},{key:"setCoordinate",value:function(t){this.renderComponent({coordinate:t}),this.toggleControl(!0)}}]),n}(S.a),H=(n(942),n(36));function W(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function K(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?W(Object(n),!0).forEach((function(e){Z(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):W(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function Z(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var $={loadWMSLayers:function(t){var e=K({},Object(H.a)());return fetch("/дэд-сан/".concat(t,"/давхаргууд/"),e).then(H.c)},loadBaseLayers:function(){var t=K({},Object(H.a)());return fetch("/суурь-давхарга/",t).then(H.c)},findSum:function(t){var e=K(K({},Object(H.b)()),{},{body:JSON.stringify({x:t[0],y:t[1]})});return fetch("/gov/api/tseg-personal/findSum/",e).then(H.c)}};function tt(t){return(tt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function et(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function nt(t,e){return(nt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function ot(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,o=it(t);if(e){var r=it(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return rt(this,n)}}function rt(t,e){return!e||"object"!==tt(e)&&"function"!=typeof e?at(t):e}function at(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function it(t){return(it=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var st=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&nt(t,e)}(k,t);var e,n,o,S=ot(k);function k(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,k),(e=S.call(this,t)).state={format:new a.a,dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",is_sidebar_open:!0,coordinate_clicked:"",vector_layer:null,is_draw_open:!1,draw_layer:null,draw:null,source_draw:null,info:[],xy:[],latlongx:t.latlongx,latlongy:t.latlongy,map_open:!0,geoms:[],ayuul_geoms:[],geom_points:[]},e.controls={coordinateCopy:new q},e.marker=e.initMarker(),e.handleMapDataLoaded=e.handleMapDataLoaded.bind(at(e)),e.handleMapClick=e.handleMapClick.bind(at(e)),e.loadMapData=e.loadMapData.bind(at(e)),e.showFeaturesAt=e.showFeaturesAt.bind(at(e)),e.handleSetCenter=e.handleSetCenter.bind(at(e)),e.loadGeojson=e.loadGeojson.bind(at(e)),e.snap=e.snap.bind(at(e)),e}return e=k,(n=[{key:"initMarker",value:function(){var t=new h.c({image:new d.a({anchor:[.5,86],anchorXUnits:"fraction",anchorYUnits:"pixels",scale:.4,src:"/static/assets/image/marker.png"})}),e=new v.a([0,0]),n=new i.a({geometry:e});return n.setStyle(t),{feature:n,point:e}}},{key:"componentDidMount",value:function(){this.loadMapData()}},{key:"loadMapData",value:function(){var t=this;$.loadBaseLayers().then((function(e){var n=e.base_layer_list;t.handleMapDataLoaded(n)}))}},{key:"snap",value:function(t){var e=new g.a({source:t.getSource()});this.map.addInteraction(e)}},{key:"loadGeojson",value:function(t,e){var n=this,o=this.map,r={Polygon:new h.c({stroke:new m.a({color:e,width:4}),fill:new y.a({color:"rgba(255, 255, 0, 0.1)"})}),Point:new h.c({image:new b.a({radius:5,fill:new y.a({color:"blue"})})})},i=[];t.map((function(t){var e=t.id,o=t.geom;if(o){var r=(new a.a).readFeatures(o,{dataProjection:n.state.dataProjection,featureProjection:n.state.featureProjection})[0];r.setProperties({id:e}),i.push(r)}}));var s=new f.a({features:i}),c=new p.a({name:"vector_layer",source:s,style:function(t){return r[t.getGeometry().getType()]}});o.addLayer(c),this.snap(c),"orange"==e&&(this.vectorLayer=c),"red"==e&&(this.ayuul_vectorLayer=c),"blue"==e&&(this.geom_point_layer=c)}},{key:"handleMapDataLoaded",value:function(t){var e=this,n=t.reduce((function(t,e,n){var o;return"xyz"==e.tilename&&(o=new u.a({source:new _.a({crossOrigin:"Anonymous",url:e.url})})),"wms"==e.tilename&&(o=new u.a({source:new w.a({url:e.url,params:{LAYERS:e.layers,FORMAT:"image/png"}})})),t.base_layers.push(o),t.base_layer_controls.push({is_active:0==n,thumbnail_1x:e.thumbnail_1x,thumbnail_2x:e.thumbnail_2x,layer:o}),t}),{base_layers:[],base_layer_controls:[]}),o=n.base_layers,r=(n.base_layer_controls,new p.a({source:new f.a,style:new h.c({stroke:new m.a({color:"rgba(100, 255, 0, 1)",width:2}),fill:new y.a({color:"rgba(100, 255, 0, 0.3)"})})}));this.setState({vector_layer:r});var a=new p.a({source:new f.a({features:[this.marker.feature]})}),i=new s.a({target:"map",controls:Object(P.a)().extend([new j.a({projection:this.state.dataProjection,coordinateFormat:function(t){return Object(O.f)(t,"{y},{x}",6)},undefinedHTML:""}),new x.a,this.controls.coordinateCopy]),layers:[o[0]].concat([r,a]),view:new c.a({projection:this.state.projection,center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.props.only_see||i.on("click",this.handleMapClick),this.map=i,"ayuul"!==this.props.type&&this.handleSetCenter(),this.props.loadTseg&&this.props.loadTseg((function(t){return e.handleSetTseg(t)}))}},{key:"handleSetTseg",value:function(t){if(t&&this.map&&t[0]>60){var e=this.map.getView(),n=e.getProjection(),o=Object(l.p)(t,this.state.dataProjection,n);this.marker.point.setCoordinates(o),e.setCenter(o)}}},{key:"handleMapClick",value:function(t){if(!this.props.only_see){this.marker.point.setCoordinates(t.coordinate);var e=t.map.getView().getProjection(),n=Object(l.p)(t.coordinate,e,this.state.dataProjection),o=Object(O.f)(n,"{y},{x}",6);this.setState({coordinate_clicked:o}),this.showFeaturesAt(o)}}},{key:"showFeaturesAt",value:function(t){var e=this,n=t.split(",").map((function(t){return Number(t)}));this.props.coordinatCheck?this.props.handleXY(n,null,null):$.findSum(n).then((function(t){var o=t.success,r=t.info;e.props.handleXY(n,r,o)}))}},{key:"componentDidUpdate",value:function(t){if(t.xy!==this.props.xy&&this.handleSetCenter(),t.geoms!==this.props.geoms){this.vectorLayer&&this.vectorLayer.getSource().clear();var e=this.props.geoms;this.setState({geoms:e}),this.loadGeojson(e,"orange")}if(t.ayuul_geoms!==this.props.ayuul_geoms){this.ayuul_vectorLayer&&this.ayuul_vectorLayer.getSource().clear();var n=this.props.ayuul_geoms;this.setState({ayuul_geoms:n}),this.loadGeojson(n,"red")}if(t.geom_points!==this.props.geom_points){this.geom_point_layer&&this.geom_point_layer.getSource().clear();var o=this.props.geom_points;this.setState({geom_points:o}),this.loadGeojson(o,"blue")}}},{key:"handleSetCenter",value:function(){var t=this.props.xy;if(t&&this.map&&t[0]>60){var e=this.map.getView(),n=e.getProjection(),o=Object(l.p)(t,this.state.dataProjection,n);this.marker.point.setCoordinates(o),e.setCenter(o)}}},{key:"render",value:function(){var t=this;return r.a.createElement("div",{className:""},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"🌍"},r.a.createElement("div",{id:this.state.map_open?"map":"map-disable",className:"mt-2"})))),r.a.createElement("button",{type:"button",className:"btn btn-info btn-sm waves-effect waves-light m-1 map-open-button",onClick:function(){return t.setState((function(t){return{map_open:!t.map_open}}))}},this.state.map_open?"Газрын зураг хаах":"Газрын зураг нээх"))}}])&&et(e.prototype,n),o&&et(e,o),k}(o.Component)},942:function(t,e,n){var o=n(54),r=n(943);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[t.i,r,""]]);var a={insert:"head",singleton:!1};o(r,a);t.exports=r.locals||{}},943:function(t,e,n){(e=n(55)(!1)).push([t.i,".🌍 {\n    position: fixed;\n}\n\n.🌍 > #map{\n    width: 18%;\n    height: 70%;\n    right: 25px;\n    position: fixed;\n    z-index: 100;\n    top: 125px;\n}\n.map-open-button{\n    right: 20px;\n    top:93px;\n    position: fixed;\n}\n.суурь-давхаргууд{\n    right: 1px;\n    z-index: -100;\n    bottom: 2px;\n    height: 32px;\n    position: absolute;\n\n}\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 24.3%;\n    height: 2.1rem;\n    overflow: hidden;\n    margin: 1px;\n    height: 27px;\n    bottom: 2px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n\n.ol-full-screen .ol-full-screen-false{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-full-screen .ol-full-screen-true{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-zoom {\n    width: 27px;\n    height: 54px;\n    left: unset;\n    right: .5rem;\n    top: 1px;\n}\n.ol-zoom  .ol-zoom-out{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n\n}\n.ol-zoom .ol-zoom-in{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n}\n\n.ol-mouse-position {\n    right: 4rem;\n    background: rgba(0,60,136,0.3);\n    border-radius: 4px;\n    padding: 2px .2rem;\n    font-size: smaller;\n    color: #eee;\n    text-align: center;\n    width: 8.8rem;\n    min-height: 1rem;\n}\n\n.coordinate-copy-control {\n    width: 10rem;\n    left: 2%;\n    top: 0.5rem;\n    opacity: 1;\n}\n.coordinate-copy-control.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-scale-line{\n    position: absolute;\n    bottom: 34px;\n}",""]),t.exports=e}}]);