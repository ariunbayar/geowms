(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{1053:function(e,t,n){var o=n(62),r=n(1054);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var a={insert:"head",singleton:!1};o(r,a);e.exports=r.locals||{}},1054:function(e,t,n){(t=n(63)(!1)).push([e.i,".🌍 {\n    position: fixed;\n}\n\n.🌍 > #map{\n    width: 18%;\n    height: 70%;\n    right: 25px;\n    position: fixed;\n    z-index: 100;\n    top: 125px;\n}\n.map-open-button{\n    right: 20px;\n    top:93px;\n    position: fixed;\n}\n.суурь-давхаргууд{\n    right: 1px;\n    z-index: -100;\n    bottom: 2px;\n    height: 32px;\n    position: absolute;\n\n}\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 24.3%;\n    height: 2.1rem;\n    overflow: hidden;\n    margin: 1px;\n    height: 27px;\n    bottom: 2px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n\n.ol-full-screen .ol-full-screen-false{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-full-screen .ol-full-screen-true{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-zoom {\n    width: 27px;\n    height: 54px;\n    left: unset;\n    right: .5rem;\n    top: 1px;\n}\n.ol-zoom  .ol-zoom-out{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n\n}\n.ol-zoom .ol-zoom-in{\n    width: 25px;\n    height: 25px;\n    font-size: 25px;\n}\n\n.ol-mouse-position {\n    right: 4rem;\n    background: rgba(0,60,136,0.3);\n    border-radius: 4px;\n    padding: 2px .2rem;\n    font-size: smaller;\n    color: #eee;\n    text-align: center;\n    width: 8.8rem;\n    min-height: 1rem;\n}\n\n.coordinate-copy-control {\n    width: 10rem;\n    left: 2%;\n    top: 0.5rem;\n    opacity: 1;\n}\n.coordinate-copy-control.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-scale-line{\n    position: absolute;\n    bottom: 34px;\n}",""]),e.exports=t},952:function(e,t,n){"use strict";n.d(t,"a",(function(){return se}));var o=n(0),r=n.n(o),a=n(334),i=(n(236),n(105)),s=n(890),c=n(471),l=n(2),u=n(136),p=n(282),f=n(283),h=n(145),d=n(935),y=n(235),m=n(214),b=n(333),g=n(535),v=n(61),_=n(125),w=n(221),P=n(17),O=n(31),j=n(514),x=n(512),S=n(79),k=n(18);function C(e){return(C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function E(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function R(e,t){return(R=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function M(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=z(e);if(t){var r=z(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return N(this,n)}}function N(e,t){return!t||"object"!==C(t)&&"function"!=typeof t?D(e):t}function D(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}S.a;var L=n(12),B=n.n(L);function T(e){return(T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function Q(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function G(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function A(e,t,n){return t&&G(e.prototype,t),n&&G(e,n),e}function F(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&U(e,t)}function U(e,t){return(U=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function Y(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=X(e);if(t){var r=X(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return J(this,n)}}function J(e,t){return!t||"object"!==T(t)&&"function"!=typeof t?V(e):t}function V(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function X(e){return(X=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var H=function(e){F(n,e);var t=Y(n);function n(e){var o;return Q(this,n),(o=t.call(this,e)).handleCoordinateSet=o.handleCoordinateSet.bind(V(o)),o}return A(n,[{key:"componentDidMount",value:function(){this.handleCoordinateSet()}},{key:"componentDidUpdate",value:function(e){this.handleCoordinateSet()}},{key:"handleCoordinateSet",value:function(){var e=B.a.findDOMNode(this);e.focus(),e.select()}},{key:"render",value:function(){return r.a.createElement("input",{type:"text",className:"form-control",onChange:function(){},onBlur:this.props.handleBlur,value:this.props.coordinate})}}]),n}(o.Component),I=function(e){F(n,e);var t=Y(n);function n(e){var o;Q(this,n);var r=e||{};(o=t.call(this,{element:document.createElement("div"),target:r.target})).is_component_initialized=!1;var a="coordinate-copy-control ".concat(k.b," ").concat(k.c);return o.element.className=a,o.renderComponent=o.renderComponent.bind(V(o)),o.toggleControl=o.toggleControl.bind(V(o)),o}return A(n,[{key:"toggleControl",value:function(e){this.element.classList.toggle(k.c,!e)}},{key:"renderComponent",value:function(e){var t=this;e.handleBlur=function(){return t.toggleControl(!1)},this.is_component_initialized||(B.a.render(r.a.createElement(H,e),this.element),this.is_component_initialized=!0),B.a.hydrate(r.a.createElement(H,e),this.element)}},{key:"setCoordinate",value:function(e){this.renderComponent({coordinate:e}),this.toggleControl(!0)}}]),n}(S.a),W=(n(1053),n(49));function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function K(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?q(Object(n),!0).forEach((function(t){Z(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Z(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var $={loadWMSLayers:function(e){var t=K({},Object(W.a)());return fetch("/дэд-сан/".concat(e,"/давхаргууд/"),t).then(W.c)},loadBaseLayers:function(){var e=K({},Object(W.a)());return fetch("/суурь-давхарга/",e).then(W.c)},findSum:function(e){var t=K(K({},Object(W.b)()),{},{body:JSON.stringify({x:e[0],y:e[1]})});return fetch("/gov/api/tseg-personal/findSum/",t).then(W.c)}};function ee(e){return(ee="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function te(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function ne(e,t){return(ne=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function oe(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=ie(e);if(t){var r=ie(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return re(this,n)}}function re(e,t){return!t||"object"!==ee(t)&&"function"!=typeof t?ae(e):t}function ae(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function ie(e){return(ie=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var se=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&ne(e,t)}(k,e);var t,n,o,S=oe(k);function k(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,k),(t=S.call(this,e)).state={format:new a.a,dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",is_sidebar_open:!0,coordinate_clicked:"",vector_layer:null,is_draw_open:!1,draw_layer:null,draw:null,source_draw:null,info:[],xy:[],latlongx:e.latlongx,latlongy:e.latlongy,map_open:!0,geoms:[],ayuul_geoms:[],geom_points:[]},t.controls={coordinateCopy:new I},t.marker=t.initMarker(),t.handleMapDataLoaded=t.handleMapDataLoaded.bind(ae(t)),t.handleMapClick=t.handleMapClick.bind(ae(t)),t.loadMapData=t.loadMapData.bind(ae(t)),t.showFeaturesAt=t.showFeaturesAt.bind(ae(t)),t.handleSetCenter=t.handleSetCenter.bind(ae(t)),t.loadGeojson=t.loadGeojson.bind(ae(t)),t.snap=t.snap.bind(ae(t)),t}return t=k,(n=[{key:"initMarker",value:function(){var e=new h.c({image:new d.a({anchor:[.5,86],anchorXUnits:"fraction",anchorYUnits:"pixels",scale:.4,src:"/static/assets/image/marker.png"})}),t=new v.a([0,0]),n=new i.a({geometry:t});return n.setStyle(e),{feature:n,point:t}}},{key:"componentDidMount",value:function(){this.loadMapData()}},{key:"loadMapData",value:function(){var e=this;$.loadBaseLayers().then((function(t){var n=t.base_layer_list;e.handleMapDataLoaded(n)}))}},{key:"snap",value:function(e){var t=new g.a({source:e.getSource()});this.map.addInteraction(t)}},{key:"loadGeojson",value:function(e,t){var n=this,o=this.map,r={Polygon:new h.c({stroke:new y.a({color:t,width:4}),fill:new m.a({color:"rgba(255, 255, 0, 0.1)"})}),Point:new h.c({image:new b.a({radius:5,fill:new m.a({color:"blue"})})})},i=[];e.map((function(e){var t=e.id,o=e.geom;if(o){var r=(new a.a).readFeatures(o,{dataProjection:n.state.dataProjection,featureProjection:n.state.featureProjection})[0];r.setProperties({id:t}),i.push(r)}}));var s=new f.a({features:i}),c=new p.a({name:"vector_layer",source:s,style:function(e){return r[e.getGeometry().getType()]}});o.addLayer(c),this.snap(c),"orange"==t&&(this.vectorLayer=c),"red"==t&&(this.ayuul_vectorLayer=c),"blue"==t&&(this.geom_point_layer=c)}},{key:"handleMapDataLoaded",value:function(e){var t=this,n=e.reduce((function(e,t,n){var o;return"xyz"==t.tilename&&(o=new u.a({source:new _.a({crossOrigin:"Anonymous",url:t.url})})),"wms"==t.tilename&&(o=new u.a({source:new w.a({url:t.url,params:{LAYERS:t.layers,FORMAT:"image/png"}})})),e.base_layers.push(o),e.base_layer_controls.push({is_active:0==n,thumbnail_1x:t.thumbnail_1x,thumbnail_2x:t.thumbnail_2x,layer:o}),e}),{base_layers:[],base_layer_controls:[]}),o=n.base_layers,r=(n.base_layer_controls,new p.a({source:new f.a,style:new h.c({stroke:new y.a({color:"rgba(100, 255, 0, 1)",width:2}),fill:new m.a({color:"rgba(100, 255, 0, 0.3)"})})}));this.setState({vector_layer:r});var a=new p.a({source:new f.a({features:[this.marker.feature]})}),i=new s.a({target:"map",controls:Object(O.a)().extend([new j.a({projection:this.state.dataProjection,coordinateFormat:function(e){return Object(P.f)(e,"{y},{x}",6)},undefinedHTML:""}),new x.a,this.controls.coordinateCopy]),layers:[o[0]].concat([r,a]),view:new c.a({projection:this.state.projection,center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.props.only_see||i.on("click",this.handleMapClick),this.map=i,"ayuul"!==this.props.type&&this.handleSetCenter(),this.props.loadTseg&&this.props.loadTseg((function(e){return t.handleSetTseg(e)}))}},{key:"handleSetTseg",value:function(e){if(e&&this.map&&e[0]>60){var t=this.map.getView(),n=t.getProjection(),o=Object(l.p)(e,this.state.dataProjection,n);this.marker.point.setCoordinates(o),t.setCenter(o)}}},{key:"handleMapClick",value:function(e){if(!this.props.only_see){this.marker.point.setCoordinates(e.coordinate);var t=e.map.getView().getProjection(),n=Object(l.p)(e.coordinate,t,this.state.dataProjection),o=Object(P.f)(n,"{y},{x}",6);this.setState({coordinate_clicked:o}),this.showFeaturesAt(o)}}},{key:"showFeaturesAt",value:function(e){var t=this,n=e.split(",").map((function(e){return Number(e)}));this.props.coordinatCheck?this.props.handleXY(n,null,null):$.findSum(n).then((function(e){var o=e.success,r=e.info;t.props.handleXY(n,r,o)}))}},{key:"componentDidUpdate",value:function(e){if(e.xy!==this.props.xy&&this.handleSetCenter(),e.geoms!==this.props.geoms){this.vectorLayer&&this.vectorLayer.getSource().clear();var t=this.props.geoms;this.setState({geoms:t}),this.loadGeojson(t,"orange")}if(e.ayuul_geoms!==this.props.ayuul_geoms){this.ayuul_vectorLayer&&this.ayuul_vectorLayer.getSource().clear();var n=this.props.ayuul_geoms;this.setState({ayuul_geoms:n}),this.loadGeojson(n,"red")}if(e.geom_points!==this.props.geom_points){this.geom_point_layer&&this.geom_point_layer.getSource().clear();var o=this.props.geom_points;this.setState({geom_points:o}),this.loadGeojson(o,"blue")}}},{key:"handleSetCenter",value:function(){var e=this.props.xy;if(e&&this.map&&e[0]>60){var t=this.map.getView(),n=t.getProjection(),o=Object(l.p)(e,this.state.dataProjection,n);this.marker.point.setCoordinates(o),t.setCenter(o)}}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:""},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"🌍"},r.a.createElement("div",{id:this.state.map_open?"map":"map-disable",className:"mt-2"})))),r.a.createElement("button",{type:"button",className:"btn btn-info btn-sm waves-effect waves-light m-1 map-open-button",onClick:function(){return e.setState((function(e){return{map_open:!e.map_open}}))}},this.state.map_open?"Газрын зураг хаах":"Газрын зураг нээх"))}}])&&te(t.prototype,n),o&&te(t,o),k}(o.Component)},960:function(e,t,n){"use strict";n.d(t,"a",(function(){return f}));n(2);var o=n(0),r=n.n(o);function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return(s=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function c(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=p(e);if(t){var r=p(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return l(this,n)}}function l(e,t){return!t||"object"!==a(t)&&"function"!=typeof t?u(e):t}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var f=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&s(e,t)}(l,e);var t,n,o,a=c(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=a.call(this,e)).state={items:[],page:1,total_page:1,is_loading:!1,searchQuery:t.props.searchQuery},t.loadPage=t.loadPage.bind(u(t)),t.nextPage=t.nextPage.bind(u(t)),t.prevPage=t.prevPage.bind(u(t)),t.addPage=t.addPage.bind(u(t)),t}return t=l,(n=[{key:"componentDidMount",value:function(){this.loadPage(this.state.page,this.state.searchQuery)}},{key:"componentDidUpdate",value:function(e){if(e.searchQuery!==this.props.searchQuery){var t=this.props.searchQuery;this.setState({searchQuery:t}),this.loadPage(1,t)}if(e.load!==this.props.load){var n=this.props.searchQuery;this.loadPage(1,n)}if(this.props.search_state&&e.search_state!==this.props.search_state){var o=this.props.searchQuery;this.loadPage(1,o)}}},{key:"nextPage",value:function(){this.loadPage(this.state.page+1,this.state.searchQuery)}},{key:"prevPage",value:function(){this.loadPage(this.state.page-1,this.state.searchQuery)}},{key:"loadPage",value:function(e,t){var n=this;if(!this.state.is_loading)if(e=Math.max(e,1),e=Math.min(e,this.state.total_page),this.setState({is_loading:!0}),this.props.search_state){var o=this.props.search_state;this.props.paginate(e,t,o).then((function(e){var t=e.page,o=e.total_page;n.setState({page:t,total_page:o,is_loading:!1})}))}else this.props.paginate(e,t).then((function(e){var t=e.page,o=e.total_page;n.setState({page:t,total_page:o,is_loading:!1})}))}},{key:"addPage",value:function(e){var t=e.target.value;this.setState({page:t}),this.loadPage(t,"")}},{key:"render",value:function(){var e=this,t=this.state,n=t.page,o=t.total_page;return r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-md-12"},r.a.createElement("div",{className:"float-left"},r.a.createElement("strong",{className:"gp-text-primary"},"Хуудас ",n,"-",o)),r.a.createElement("div",{className:"float-right btn-group group-round m-1"},r.a.createElement("button",{type:"button",value:"1",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},"<<")," ",n>1&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),n>1&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.prevPage},"<"),r.a.createElement("button",{type:"button",value:n,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":"")},n)," ",n<o&&r.a.createElement("button",{type:"button",className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:this.nextPage},">"),r.a.createElement("button",{type:"button",value:o,className:"btn gp-btn-primary waves-effect waves-light btn-sm"+(this.state.is_loading?" disabled":""),onClick:function(t){return e.addPage(t)}},">>")," ")))}}])&&i(t.prototype,n),o&&i(t,o),l}(o.Component)}}]);