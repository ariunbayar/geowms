(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{984:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return O}));var o=n(0),r=n.n(o),a=n(889),i=n(474),c=n(544),u=n(137),f=n(142),l=n(241),p=n(217),s=n(471),y=n(422),d=n(421),b=(n(220),n(36)),g={getRegion:function(){var e=Object(b.a)();return fetch("/gov/api/role/region/",e).then(b.c)}};function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function v(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function w(e,t){return(w=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function m(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,o=R(e);if(t){var r=R(this).constructor;n=Reflect.construct(o,arguments,r)}else n=o.apply(this,arguments);return P(this,n)}}function P(e,t){return!t||"object"!==h(t)&&"function"!=typeof t?j(e):t}function j(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function R(e){return(R=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&w(e,t)}(h,e);var t,n,o,b=m(h);function h(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),(t=b.call(this,e)).state={dataProjection:"EPSG:4326",featureProjection:"EPSG:3857"},t.loadMap=t.loadMap.bind(j(t)),t.loadMapData=t.loadMapData.bind(j(t)),t.getRegion=t.getRegion.bind(j(t)),t}return t=h,(n=[{key:"componentDidMount",value:function(){this.loadMap()}},{key:"getRegion",value:function(){var e=this;g.getRegion().then((function(t){var n=t.allowed_geom;e.loadMapData(n)}))}},{key:"loadMap",value:function(){var e=new a.a({layers:[new u.a({source:new c.a})],target:"map",view:new i.a({center:[11461613.630815497,5878656.0228370065],zoom:5.041301562246971})});this.map=e,this.getRegion()}},{key:"loadMapData",value:function(e){var t={MultiPolygon:new f.c({stroke:new l.a({color:"green",width:2}),fill:new p.a({color:"rgba(0,255,0,0.3)"})})},n=e,o=(new s.a).readFeatures(n,{dataProjection:this.state.dataProjection,featureProjection:this.state.featureProjection}),r=new y.a({features:o}),a=new d.a({source:r,style:function(e){return t[e.getGeometry().getType()]}});this.map.addLayer(a),this.map.getView().fit(o[0].getGeometry(),{padding:[300,300,300,300]})}},{key:"render",value:function(){return r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-body"},r.a.createElement("div",{id:"map",style:{height:"calc( 98vh - 85px - 15px)"}})))}}])&&v(t.prototype,n),o&&v(t,o),h}(o.Component)}}]);