(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{1106:function(e,t,n){var r=n(69),o=n(1107);"string"==typeof(o=o.__esModule?o.default:o)&&(o=[[e.i,o,""]]);var a={insert:"head",singleton:!1};r(o,a);e.exports=o.locals||{}},1107:function(e,t,n){(t=n(70)(!1)).push([e.i,".суурь-давхаргууд{\n    right: .0rem;\n    z-index: -100;\n    bottom: 2px;\n    height: 2.1rem;\n    position: absolute;\n\n}\n\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 5.6rem;\n    height: 1.75rem;\n    overflow: hidden;\n    margin: 1px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n",""]),e.exports=t},15:function(e,t,n){"use strict";n.d(t,"c",(function(){return o})),n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return i}));function r(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),r=0;r<n.length;r++){var o=n[r].trim();if(o.substring(0,e.length+1)===e+"="){t=decodeURIComponent(o.substring(e.length+1));break}}return t}function o(e){return e.text().then((function(t){var n=t&&JSON.parse(t);if(!e.ok){-1!==[401,403].indexOf(e.status)&&location.reload(!0);var r=e.status,o={text:n&&n.message||e.statusText,code:r};return Promise.reject(o)}return n}))}function a(){return{method:"POST",headers:{"X-Requested-With":"XMLHttpRequest","X-CSRFToken":r("csrftoken")}}}function i(){return{method:"GET",headers:{"X-Requested-With":"XMLHttpRequest"}}}},246:function(e,t,n){"use strict";(function(e){function r(e){var t={"ШИНЭ":"text-success","ИЛГЭЭСЭН":"text-warning","ШИЙДВЭРЛЭГДСЭН":"text-primary"};return t[e]?t[e]:""}function o(e){var t={"ШИЙДВЭРЛЭГДСЭН":"text-success","ХҮЛЭЭГДЭЖ БУЙ":"text-warning","ЦУЦЛАСАН":"text-danger","БУЦААГДСАН":"text-danger","ШИНЭ":"text-primary","БАТАЛГААЖСАН":"text-success"};return t[e]?t[e]:""}function a(e){return e.includes("Multi")||(e="Multi".concat("",e)),e}function i(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Амжилттай хууллаа",r=document.createElement("textarea");r.innerText=t,document.body.appendChild(r),r.select(),document.execCommand("copy"),r.remove(),e.NOTIF&&e.NOTIF("success",n,"check")}function c(e,t,n){return"exact"==e?t==n:t[e](n)}function u(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return e.sort((function(e,r){var o=e,a=r;return n&&(o=r,a=e),o[t]-a[t]})),e}n.d(t,"e",(function(){return r})),n.d(t,"d",(function(){return o})),n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return c})),n.d(t,"f",(function(){return u}))}).call(this,n(47))},46:function(e,t,n){"use strict";n.d(t,"f",(function(){return G})),n.d(t,"c",(function(){return x})),n.d(t,"b",(function(){return O})),n.d(t,"e",(function(){return k})),n.d(t,"a",(function(){return R})),n.d(t,"d",(function(){return L}));var r=n(302),o=n(2),a=n(67),i=n(127),c=n(106),u=n(159),s=n(93),l=n(58),f=n(19);function p(e){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t){return(y=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function m(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=b(e);if(t){var o=b(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return h(this,n)}}function h(e,t){return!t||"object"!==p(t)&&"function"!=typeof t?v(e):t}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var g=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&y(e,t)}(a,e);var t,n,r,o=m(a);function a(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a);var n=e||{};(t=o.call(this,{element:document.createElement("div"),target:n.target})).toggleLayer=t.toggleLayer.bind(v(t)),t.initLayer=t.initLayer.bind(v(t)),t.handleClick=t.handleClick.bind(v(t)),t.last_active=null;var r=n.layers.map(t.initLayer),i="суурь-давхаргууд ".concat(f.e," ").concat(f.b),c=t.element;return c.className=i,r.forEach((function(e){return c.appendChild(e)})),t}return t=a,(n=[{key:"initLayer",value:function(e){var t=this,n=e.thumbnail_1x,r=e.thumbnail_2x,o=e.layer,a=e.is_active,i=document.createElement("a");i.setAttribute("href","#"),i.className="суурь-давхарга"+(a?" active":"");var c=document.createElement("img");return c.srcset="".concat(n," 1x, ").concat(r," 2x"),i.appendChild(c),i.addEventListener("click",(function(e){e.preventDefault(),t.handleClick(i,o)})),this.toggleLayer(!0===a,i,o),i}},{key:"toggleLayer",value:function(e,t,n){this.last_active&&e&&(this.last_active.layer.setVisible(!1),this.last_active.el.classList.toggle("active",!1)),n.setVisible(e),t.classList.toggle("active",e),e&&(this.last_active={el:t,layer:n})}},{key:"handleClick",value:function(e,t){this.last_active&&this.last_active.el===e||this.toggleLayer(!0,e,t)}}])&&d(t.prototype,n),r&&d(t,r),a}(l.a),P=n(57),S=(n(246),n(15)),w={get:function(){var e=Object(S.a)();return fetch("/суурь-давхарга/",e).then(S.c)}};function E(e,t,n,r,o,a,i){try{var c=e[a](i),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(r,o)}function _(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function i(e){E(a,r,o,i,c,"next",e)}function c(e){E(a,r,o,i,c,"throw",e)}i(void 0)}))}}var G={data_projection:"EPSG:4326",feature_projection:"EPSG:3857",format:new r.a,au_search_layer_name:"administrative",options_scale:[{zoom:"2.9903484967519145",scale:5e6},{zoom:"4.3576399772248543",scale:1e6},{zoom:"7.3376399772248575",scale:1e5},{zoom:"8.738265134288114",scale:5e4},{zoom:"9.721598467621447",scale:25e3},{zoom:"10.781598467621446",scale:1e4},{zoom:"12.194931800954776",scale:5e3},{zoom:"14.383305008368451",scale:1e3}],resolutions:[.703125,.3515625,.17578125,.087890625,.0439453125,.02197265625,.010986328125,.0054931640625,.00274658203125,.001373291015625,.0006866455078125,.00034332275390625,.000171661376953125,858306884765625e-19,4291534423828125e-20,21457672119140625e-21,10728836059570312e-21,5364418029785156e-21,2682209014892578e-21,1341104507446289e-21,6.705522537231445e-7,3.3527612686157227e-7],gridNames:["EPSG:4326:0","EPSG:4326:1","EPSG:4326:2","EPSG:4326:3","EPSG:4326:4","EPSG:4326:5","EPSG:4326:6","EPSG:4326:7","EPSG:4326:8","EPSG:4326:9","EPSG:4326:10","EPSG:4326:11","EPSG:4326:12","EPSG:4326:13","EPSG:4326:14","EPSG:4326:15","EPSG:4326:16","EPSG:4326:17","EPSG:4326:18","EPSG:4326:19","EPSG:4326:20","EPSG:4326:21"]};function x(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"id";if(t){var r=t.getFeatures();if(null!=r&&r.length>0)for(var o=0;o<r.length;o++){var a=r[o].getProperties();if(a[n]==e){t.removeFeature(r[o]);break}}}}function j(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:G.data_projection,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:G.feature_projection,r=Object(o.p)(e,t,n);return r}function O(e){return Object(o.d)([e[0],e[1]])}function k(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:window.map,r=n.getView(),o=r.getProjection(),a=j(e,G.data_projection,o);r.animate({zoom:t},{center:r.setCenter(a)})}function R(e){e.getSource().clear()}function L(e){return M.apply(this,arguments)}function M(){return(M=_(regeneratorRuntime.mark((function e(t){var n,r,o,l,f,p,d,y;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w.get();case 2:n=e.sent,r=n.base_layer_list,o=[.703125,.3515625,.17578125,.087890625,.0439453125,.02197265625,.010986328125,.0054931640625,.00274658203125,.001373291015625,.0006866455078125,.00034332275390625,.000171661376953125,858306884765625e-19,4291534423828125e-20,21457672119140625e-21,10728836059570312e-21,5364418029785156e-21,2682209014892578e-21,1341104507446289e-21,6.705522537231445e-7,3.3527612686157227e-7],l=["EPSG:4326:0","EPSG:4326:1","EPSG:4326:2","EPSG:4326:3","EPSG:4326:4","EPSG:4326:5","EPSG:4326:6","EPSG:4326:7","EPSG:4326:8","EPSG:4326:9","EPSG:4326:10","EPSG:4326:11","EPSG:4326:12","EPSG:4326:13","EPSG:4326:14","EPSG:4326:15","EPSG:4326:16","EPSG:4326:17","EPSG:4326:18","EPSG:4326:19","EPSG:4326:20","EPSG:4326:21"],"base_layer",r&&(f=r.reduce((function(e,t,n){var r;return"xyz"==t.tilename&&(r=new a.a({preload:6,source:new i.a({crossOrigin:"Anonymous",url:t.url}),name:"base_layer"})),"wms"==t.tilename&&(r=new a.a({source:new c.a({ratio:1,url:t.url,params:{LAYERS:t.layers,FORMAT:"image/png",VERSION:"1.1.1",STYLES:"",exceptions:"application/vnd.ogc.se_inimage"},tileLoadFunction:P.b}),name:"base_layer"})),"wmts"==t.tilename&&(r=new a.a({source:new u.a({url:t.url,layer:t.layers,matrixSet:G.feature_projection,format:"image/png",projection:G.feature_projection,tileGrid:new s.b({tileSize:[256,256],extent:[-180,-90,180,90],origin:[-180,90],resolutions:o,matrixIds:l}),tileLoadFunction:P.b,style:"",wrapX:!0})})),e.base_layers.push(r),e.base_layer_controls.push({is_active:0==n,thumbnail_1x:t.thumbnail_1x,thumbnail_2x:t.thumbnail_2x,layer:r}),e}),{base_layers:[],base_layer_controls:[]}),p=f.base_layers,d=f.base_layer_controls,y=Array(),p.map((function(e){return y.push(e)})),t.getLayers().forEach((function(e){y.push(e),t.removeLayer(e)})),y.map((function(e){return t.addLayer(e)})),t.addControl(new g({layers:d})));case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},57:function(e,t,n){"use strict";n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return o}));var r=function(e,t){var n=new XMLHttpRequest;n.open("GET",t),n.responseType="arraybuffer",n.onload=function(){var t=new Uint8Array(this.response),n=new Blob([t],{type:"image/png"}),r=(window.URL||window.webkitURL).createObjectURL(n);e.getImage().src=r},n.send()},o=function(e){"ALL"===e?(localStorage.clear(),setTimeout((function(){window.location.reload()}),1e3)):localStorage.removeItem(e)}},938:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return S}));var r=n(0),o=n.n(r),a=n(580),i=n(130),c=n(226),u=n(223),s=n(302),l=n(172),f=n(197),p=n(46);n(245),n(1106);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t,n,r,o,a,i){try{var c=e[a](i),u=c.value}catch(e){return void n(e)}c.done?t(u):Promise.resolve(u).then(r,o)}function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=P(e);if(t){var o=P(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return b(this,n)}}function b(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?g(e):t}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function P(e){return(P=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var S=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(S,e);var t,n,r,d,b,P=v(S);function S(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,S),(t=P.call(this,e)).state={dataProjection:"EPSG:4326",featureProjection:"EPSG:3857",allowed_geom:e.allowed_geom},t.loadMap=t.loadMap.bind(g(t)),t.loadMapData=t.loadMapData.bind(g(t)),t}return t=S,(n=[{key:"componentDidMount",value:function(){this.loadMap()}},{key:"loadMap",value:(d=regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new a.a({layers:[],target:"map"}),this.map=t,e.next=4,Object(p.d)(t);case 4:this.loadMapData(this.state.allowed_geom);case 5:case"end":return e.stop()}}),e,this)})),b=function(){var e=this,t=arguments;return new Promise((function(n,r){var o=d.apply(e,t);function a(e){y(o,n,r,a,i,"next",e)}function i(e){y(o,n,r,a,i,"throw",e)}a(void 0)}))},function(){return b.apply(this,arguments)})},{key:"loadMapData",value:function(e){var t={MultiPolygon:new i.c({stroke:new c.a({color:"green",width:2}),fill:new u.a({color:"rgba(0,255,0,0.3)"})})},n=e,r=(new s.a).readFeatures(n,{dataProjection:this.state.dataProjection,featureProjection:this.state.featureProjection}),o=new l.a({features:r}),a=new f.a({source:o,style:function(e){return t[e.getGeometry().getType()]}});this.map.addLayer(a),this.map.getView().fit(r[0].getGeometry(),{padding:[20,20,20,20]})}},{key:"render",value:function(){return o.a.createElement("div",{className:"card"},o.a.createElement("div",{className:"card-body"},o.a.createElement("div",{id:"map",style:{height:"calc( 98vh - 85px - 15px)"}})))}}])&&m(t.prototype,n),r&&m(t,r),S}(r.Component)}}]);