(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["frontend/bundle"],{

/***/ "./frontend/bundle/src/components/App.jsx":
/*!************************************************!*\
  !*** ./frontend/bundle/src/components/App.jsx ***!
  \************************************************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DetailPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailPage */ "./frontend/bundle/src/components/DetailPage/index.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var App = /*#__PURE__*/function (_Component) {
  _inherits(App, _Component);

  var _super = _createSuper(App);

  function App() {
    _classCallCheck(this, App);

    return _super.apply(this, arguments);
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_DetailPage__WEBPACK_IMPORTED_MODULE_1__["DetailPage"], {
        bundle: this.props.bundle
      });
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/BundleMap.jsx":
/*!*****************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/BundleMap.jsx ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BundleMap; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/ol.css */ "./node_modules/ol/ol.css");
/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_ol_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol */ "./node_modules/ol/index.js");
/* harmony import */ var ol_proj__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/proj */ "./node_modules/ol/proj.js");
/* harmony import */ var ol_format_WMSGetFeatureInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/format/WMSGetFeatureInfo */ "./node_modules/ol/format/WMSGetFeatureInfo.js");
/* harmony import */ var ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/layer/Tile */ "./node_modules/ol/layer/Tile.js");
/* harmony import */ var ol_layer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/layer */ "./node_modules/ol/layer.js");
/* harmony import */ var ol_source__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/source */ "./node_modules/ol/source.js");
/* harmony import */ var ol_style__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/style */ "./node_modules/ol/style.js");
/* harmony import */ var ol_geom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ol/geom */ "./node_modules/ol/geom.js");
/* harmony import */ var ol_source_TileImage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ol/source/TileImage */ "./node_modules/ol/source/TileImage.js");
/* harmony import */ var ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ol/source/TileWMS */ "./node_modules/ol/source/TileWMS.js");
/* harmony import */ var ol_source_OSM__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ol/source/OSM */ "./node_modules/ol/source/OSM.js");
/* harmony import */ var ol_coordinate__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ol/coordinate */ "./node_modules/ol/coordinate.js");
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var _controls___WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./controls/СуурьДавхарга */ "./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx");
/* harmony import */ var _controls_CoordinateCopy__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./controls/CoordinateCopy */ "./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx");
/* harmony import */ var _controls_Modal__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./controls/Modal */ "./frontend/bundle/src/components/DetailPage/controls/Modal.jsx");
/* harmony import */ var _controls_DrawPayModal__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./controls/DrawPayModal */ "./frontend/bundle/src/components/DetailPage/controls/DrawPayModal.jsx");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./styles.css */ "./frontend/bundle/src/components/DetailPage/styles.css");
/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_styles_css__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./service */ "./frontend/bundle/src/components/DetailPage/service.js");
/* harmony import */ var _SidebarButton__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./SidebarButton */ "./frontend/bundle/src/components/DetailPage/SidebarButton.jsx");
/* harmony import */ var _Sidebar__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./Sidebar */ "./frontend/bundle/src/components/DetailPage/Sidebar.jsx");
/* harmony import */ var _controls_Draw__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./controls/Draw */ "./frontend/bundle/src/components/DetailPage/controls/Draw.jsx");
/* harmony import */ var ol_interaction_Draw__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ol/interaction/Draw */ "./node_modules/ol/interaction/Draw.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



























var BundleMap = /*#__PURE__*/function (_Component) {
  _inherits(BundleMap, _Component);

  var _super = _createSuper(BundleMap);

  function BundleMap(props) {
    var _this;

    _classCallCheck(this, BundleMap);

    _this = _super.call(this, props);
    _this.state = {
      projection: 'EPSG:3857',
      projection_display: 'EPSG:4326',
      bundle: props.bundle,
      map_wms_list: [],
      is_sidebar_open: true,
      coordinate_clicked: null,
      vector_layer: null,
      is_draw_open: false,
      draw_layer: null,
      draw: null,
      source_draw: null
    };
    _this.controls = {
      coordinateCopy: new _controls_CoordinateCopy__WEBPACK_IMPORTED_MODULE_16__["CoordinateCopy"](),
      modal: new _controls_Modal__WEBPACK_IMPORTED_MODULE_17__["Modal"](),
      drawModal: new _controls_DrawPayModal__WEBPACK_IMPORTED_MODULE_18__["DrawPayModal"](),
      sidebar: new _Sidebar__WEBPACK_IMPORTED_MODULE_22__["Sidebar"]()
    };
    _this.marker = _this.initMarker();
    _this.handleToggle = _this.handleToggle.bind(_assertThisInitialized(_this));
    _this.handleMapDataLoaded = _this.handleMapDataLoaded.bind(_assertThisInitialized(_this));
    _this.handleMapClick = _this.handleMapClick.bind(_assertThisInitialized(_this));
    _this.handleSetCenter = _this.handleSetCenter.bind(_assertThisInitialized(_this));
    _this.toggleSidebar = _this.toggleSidebar.bind(_assertThisInitialized(_this));
    _this.loadMapData = _this.loadMapData.bind(_assertThisInitialized(_this));
    _this.showFeaturesAt = _this.showFeaturesAt.bind(_assertThisInitialized(_this));
    _this.toggleDraw = _this.toggleDraw.bind(_assertThisInitialized(_this));
    _this.toggleDrawed = _this.toggleDrawed.bind(_assertThisInitialized(_this));
    _this.toggleDrawRemove = _this.toggleDrawRemove.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BundleMap, [{
    key: "initMarker",
    value: function initMarker() {
      var style = new ol_style__WEBPACK_IMPORTED_MODULE_8__["Style"]({
        image: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Icon"]({
          anchor: [0.5, 86],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          scale: 0.4,
          src: '/static/assets/image/marker.png'
        })
      });
      var point = new ol_geom__WEBPACK_IMPORTED_MODULE_9__["Point"]([0, 0]);
      var feature = new ol__WEBPACK_IMPORTED_MODULE_2__["Feature"]({
        geometry: point
      });
      feature.setStyle(style);
      return {
        feature: feature,
        point: point
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadMapData(this.state.bundle.id);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.coordinate_clicked !== this.state.coordinate_clicked) {
        this.controls.coordinateCopy.setCoordinate(this.state.coordinate_clicked);
      }

      if (this.props.bundle.id === prevProps.bundle.id) return;
      var bundle = this.props.bundle;
      this.setState({
        bundle: bundle
      });
      this.loadMapData(bundle.id);
    }
  }, {
    key: "loadMapData",
    value: function loadMapData(bundle_id) {
      var _this2 = this;

      Promise.all([_service__WEBPACK_IMPORTED_MODULE_20__["service"].loadBaseLayers(), _service__WEBPACK_IMPORTED_MODULE_20__["service"].loadWMSLayers(bundle_id)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            base_layer_list = _ref2[0].base_layer_list,
            wms_list = _ref2[1].wms_list;

        _this2.handleMapDataLoaded(base_layer_list, wms_list);
      });
    }
  }, {
    key: "handleMapDataLoaded",
    value: function handleMapDataLoaded(base_layer_list, wms_list) {
      var _this3 = this;

      var map_wms_list = wms_list.map(function (_ref3) {
        var name = _ref3.name,
            url = _ref3.url,
            layers = _ref3.layers;
        return {
          name: name,
          layers: layers.map(function (layer) {
            return _objectSpread(_objectSpread({}, layer), {}, {
              tile: new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
                source: new ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__["default"]({
                  projection: _this3.state.projection,
                  url: url,
                  params: {
                    'LAYERS': layer.code,
                    //'FORMAT': 'image/svg+xml',
                    'FORMAT': 'image/png'
                  }
                })
              })
            });
          })
        };
      });
      this.setState({
        map_wms_list: map_wms_list
      });

      var _base_layer_list$redu = base_layer_list.reduce(function (acc, base_layer_info, idx) {
        var layer;

        if (base_layer_info.tilename == "xyz") {
          layer = new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
            source: new ol_source_TileImage__WEBPACK_IMPORTED_MODULE_10__["default"]({
              crossOrigin: 'Anonymous',
              url: base_layer_info.url
            })
          });
        }

        if (base_layer_info.tilename == "wms") {
          layer = new ol_layer_Tile__WEBPACK_IMPORTED_MODULE_5__["default"]({
            source: new ol_source_TileWMS__WEBPACK_IMPORTED_MODULE_11__["default"]({
              url: base_layer_info.url,
              params: {
                'LAYERS': base_layer_info.layers,
                'FORMAT': 'image/png'
              }
            })
          });
        }

        acc.base_layers.push(layer);
        acc.base_layer_controls.push({
          is_active: idx == 0,
          thumbnail_1x: base_layer_info.thumbnail_1x,
          thumbnail_2x: base_layer_info.thumbnail_2x,
          layer: layer
        });
        return acc;
      }, {
        base_layers: [],
        base_layer_controls: []
      }),
          base_layers = _base_layer_list$redu.base_layers,
          base_layer_controls = _base_layer_list$redu.base_layer_controls;

      var vector_layer = new ol_layer__WEBPACK_IMPORTED_MODULE_6__["Vector"]({
        source: new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"](),
        style: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Style"]({
          stroke: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Stroke"]({
            color: 'rgba(100, 255, 0, 1)',
            width: 2
          }),
          fill: new ol_style__WEBPACK_IMPORTED_MODULE_8__["Fill"]({
            color: 'rgba(100, 255, 0, 0.3)'
          })
        })
      });
      this.setState({
        vector_layer: vector_layer
      });
      var marker_layer = new ol_layer__WEBPACK_IMPORTED_MODULE_6__["Vector"]({
        source: new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"]({
          features: [this.marker.feature]
        })
      });
      var map = new ol__WEBPACK_IMPORTED_MODULE_2__["Map"]({
        target: 'map',
        controls: Object(ol_control__WEBPACK_IMPORTED_MODULE_14__["defaults"])().extend([new ol_control__WEBPACK_IMPORTED_MODULE_14__["FullScreen"](), new ol_control__WEBPACK_IMPORTED_MODULE_14__["MousePosition"]({
          projection: this.state.projection_display,
          coordinateFormat: function coordinateFormat(coord) {
            return Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(coord, '{y},{x}', 6);
          },
          undefinedHTML: ''
        }), new _controls___WEBPACK_IMPORTED_MODULE_15__["СуурьДавхарга"]({
          layers: base_layer_controls
        }), new _SidebarButton__WEBPACK_IMPORTED_MODULE_21__["SidebarButton"]({
          toggleSidebar: this.toggleSidebar
        }), new _controls_Draw__WEBPACK_IMPORTED_MODULE_23__["DrawButton"]({
          toggleDraw: this.toggleDraw
        }), new ol_control__WEBPACK_IMPORTED_MODULE_14__["ScaleLine"](), this.controls.modal, this.controls.drawModal, this.controls.coordinateCopy, this.controls.sidebar]),
        layers: [].concat(_toConsumableArray(base_layers), _toConsumableArray(map_wms_list.reduce(function (acc_main, wms) {
          var tiles = wms.layers.map(function (layer) {
            return layer.tile;
          });
          return [].concat(_toConsumableArray(acc_main), _toConsumableArray(tiles));
        }, [])), [vector_layer, marker_layer]),
        view: new ol__WEBPACK_IMPORTED_MODULE_2__["View"]({
          projection: this.state.projection,
          center: [11461613.630815497, 5878656.0228370065],
          zoom: 5.041301562246971
        })
      });
      map.on('click', this.handleMapClick);
      this.map = map;
    }
  }, {
    key: "handleMapClick",
    value: function handleMapClick(event) {
      this.marker.point.setCoordinates(event.coordinate);
      var projection = event.map.getView().getProjection();
      var map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(event.coordinate, projection, this.state.projection_display);

      var coordinate_clicked = Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(map_coord, '{y},{x}', 6);

      this.setState({
        coordinate_clicked: coordinate_clicked
      });
      this.showFeaturesAt(event.coordinate);
    }
  }, {
    key: "showFeaturesAt",
    value: function showFeaturesAt(coordinate) {
      var _this4 = this;

      var view = this.map.getView();
      var projection = view.getProjection();
      var resolution = view.getResolution();
      this.state.map_wms_list.forEach(function (_ref4) {
        var layers = _ref4.layers;
        layers.forEach(function (_ref5) {
          var tile = _ref5.tile;
          var wms_source = tile.getSource();
          var url = wms_source.getFeatureInfoUrl(coordinate, resolution, projection, {
            //'INFO_FORMAT': 'text/xml'
            //'INFO_FORMAT': 'text/html'
            'INFO_FORMAT': 'application/vnd.ogc.gml'
          });

          if (url) {
            _this4.controls.modal.showModal(null, false);

            fetch(url).then(function (response) {
              return response.text();
            }).then(function (text) {
              var parser = new ol_format_WMSGetFeatureInfo__WEBPACK_IMPORTED_MODULE_4__["default"]();
              var features = parser.readFeatures(text);
              var source = new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"]({
                features: features
              });

              _this4.state.vector_layer.setSource(source);

              var feature_info = features.map(function (feature) {
                var geometry_name = feature.getGeometryName();
                var values = feature.getKeys().filter(function (key) {
                  return key != geometry_name;
                }).map(function (key) {
                  return [key, feature.get(key)];
                });
                return [feature.getId(), values];
              });

              _this4.controls.modal.showModal(feature_info, true);
            });
          } else {
            /* TODO */
            console.log('no feature url', wms_source);
          }
        });
      });
    }
  }, {
    key: "handleToggle",
    value: function handleToggle(idx) {
      var layer = this.state.layers[idx];
      layer.setVisible(!layer.getVisible());
    }
  }, {
    key: "handleSetCenter",
    value: function handleSetCenter(coord) {
      var view = this.map.getView();
      var map_projection = view.getProjection();
      var map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(coord, this.state.projection_display, map_projection);
      this.marker.point.setCoordinates(map_coord);
      view.setCenter(map_coord);
    }
  }, {
    key: "toggleSidebar",
    value: function toggleSidebar(event) {
      this.setState(function (prevState) {
        return {
          is_sidebar_open: !prevState.is_sidebar_open
        };
      });

      if (this.state.is_sidebar_open) {
        this.controls.sidebar.showSideBar(null, null, true);
      } else {
        this.controls.sidebar.showSideBar(this.state.map_wms_list, this.handleSetCenter, false);
      }
    }
  }, {
    key: "toggleDrawed",
    value: function toggleDrawed(event) {
      var projection = this.map.getView().getProjection();
      var coordinat = event.feature.getGeometry().getCoordinates();
      var coodrinatLeftTop = coordinat[0][3];
      var coodrinatLeftTop_map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(coodrinatLeftTop, projection, this.state.projection_display);

      var coodrinatLeftTopFormat = Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(coodrinatLeftTop_map_coord, '{y},{x}', 6);

      var coodrinatRightBottom = coordinat[0][1];
      var coodrinatRightBottom_map_coord = Object(ol_proj__WEBPACK_IMPORTED_MODULE_3__["transform"])(coodrinatRightBottom, projection, this.state.projection_display);

      var coodrinatRightBottomFormat = Object(ol_coordinate__WEBPACK_IMPORTED_MODULE_13__["format"])(coodrinatRightBottom_map_coord, '{y},{x}', 6);

      this.controls.drawModal.showModal(coodrinatLeftTop_map_coord, coodrinatRightBottom_map_coord);
    }
  }, {
    key: "toggleDrawRemove",
    value: function toggleDrawRemove() {
      var features = this.state.source_draw.getFeatures();

      if (features.length > 0) {
        var lastFeature = features[features.length - 1];
        this.state.source_draw.removeFeature(lastFeature);
      }
    }
  }, {
    key: "toggleDraw",
    value: function toggleDraw() {
      this.setState(function (prevState) {
        return {
          is_draw_open: !prevState.is_draw_open
        };
      });

      if (this.state.is_draw_open) {
        var source_draw = new ol_source__WEBPACK_IMPORTED_MODULE_7__["Vector"]();
        var draw_layer = new ol_layer__WEBPACK_IMPORTED_MODULE_6__["Vector"]({
          source: source_draw
        });
        this.setState({
          source_draw: source_draw
        });
        var draw = new ol_interaction_Draw__WEBPACK_IMPORTED_MODULE_24__["default"]({
          source: this.state.source_draw,
          type: 'Circle',
          geometryFunction: Object(ol_interaction_Draw__WEBPACK_IMPORTED_MODULE_24__["createBox"])()
        });
        this.setState({
          draw: draw,
          draw_layer: draw_layer
        });
        this.map.addLayer(draw_layer);
        this.map.addInteraction(draw);
        draw.on('drawend', this.toggleDrawed);
        draw.on('drawstart', this.toggleDrawRemove);
      } else {
        this.map.removeInteraction(this.state.draw);
        this.toggleDrawRemove();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "col-md-12"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "\uD83C\uDF0D"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        id: "map"
      })))));
    }
  }]);

  return BundleMap;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/Sidebar.jsx":
/*!***************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/Sidebar.jsx ***!
  \***************************************************************/
/*! exports provided: Sidebar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sidebar", function() { return Sidebar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers */ "./frontend/bundle/src/helpers.js");
/* harmony import */ var _WMSItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WMSItem */ "./frontend/bundle/src/components/DetailPage/WMSItem.jsx");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }








var SidebarComponent = /*#__PURE__*/function (_Component) {
  _inherits(SidebarComponent, _Component);

  var _super = _createSuper(SidebarComponent);

  function SidebarComponent(props) {
    var _this;

    _classCallCheck(this, SidebarComponent);

    _this = _super.call(this, props);
    _this.state = {
      coordinate: ''
    };
    _this.handleSubmitCoordinate = _this.handleSubmitCoordinate.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SidebarComponent, [{
    key: "handleSubmitCoordinate",
    value: function handleSubmitCoordinate(event) {
      event.preventDefault();
      var coord = _helpers__WEBPACK_IMPORTED_MODULE_1__["helpers"].parseCoordinateString(this.state.coordinate);
      this.props.handleSetCenter(coord);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\u041D\u044D\u0440\u044D\u043B\u0431\u044D\u0440\u044D\u044D\u0440 \u0445\u0430\u0439\u0445"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "\u0445\u0430\u0439\u0445 \u0443\u0442\u0433\u0430",
        "aria-label": "",
        "aria-describedby": ""
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn gp-outline-primary",
        type: "button"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-search mr-1",
        "aria-hidden": "true"
      }), "\u0425\u0430\u0439\u0445")))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
        onSubmit: this.handleSubmitCoordinate
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "form-group"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\u0411\u0430\u0439\u0440\u043B\u0430\u043B\u0430\u0430\u0440 \u0445\u0430\u0439\u0445"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group mb-3"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "\u04E9\u0440\u0433\u04E9\u0440\u04E9\u0433, \u0443\u0440\u0442\u0440\u0430\u0433",
        name: "coordinate",
        onChange: function onChange(e) {
          return _this2.setState({
            coordinate: e.target.value
          });
        },
        value: this.state.coordinate
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "input-group-append"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        className: "btn gp-outline-primary",
        type: "submit"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fa fa-search mr-1"
      }), "\u0425\u0430\u0439\u0445"))))), this.props.map_wms_list.map(function (wms, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSItem__WEBPACK_IMPORTED_MODULE_2__["default"], {
          wms: wms,
          key: idx
        });
      }));
    }
  }]);

  return SidebarComponent;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var Sidebar = /*#__PURE__*/function (_Control) {
  _inherits(Sidebar, _Control);

  var _super2 = _createSuper(Sidebar);

  function Sidebar(opt_options) {
    var _this3;

    _classCallCheck(this, Sidebar);

    var options = opt_options || {};
    _this3 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this3.is_component_initialized = false;
    var cssClasses = "col-md-2 \u2699  ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_5__["CLASS_HIDDEN"]);
    _this3.element.className = cssClasses;
    _this3.renderComponent = _this3.renderComponent.bind(_assertThisInitialized(_this3));
    _this3.toggleControl = _this3.toggleControl.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(Sidebar, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle(ol_css_js__WEBPACK_IMPORTED_MODULE_5__["CLASS_HIDDEN"], is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_3___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SidebarComponent, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_3___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(SidebarComponent, props), this.element);
    }
  }, {
    key: "showSideBar",
    value: function showSideBar(map_wms_list, handleSetCenter, islaod) {
      this.toggleControl(islaod);
      this.renderComponent({
        map_wms_list: map_wms_list,
        handleSetCenter: handleSetCenter
      });
    }
  }]);

  return Sidebar;
}(ol_control__WEBPACK_IMPORTED_MODULE_4__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/SidebarButton.jsx":
/*!*********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/SidebarButton.jsx ***!
  \*********************************************************************/
/*! exports provided: SidebarButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarButton", function() { return SidebarButton; });
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var SidebarButton = /*#__PURE__*/function (_Control) {
  _inherits(SidebarButton, _Control);

  var _super = _createSuper(SidebarButton);

  function SidebarButton(opt_options) {
    var _this;

    _classCallCheck(this, SidebarButton);

    var options = opt_options || {};
    _this = _super.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    var cssClasses = '⚙-toggle';
    var element = _this.element;
    element.className = cssClasses;
    var elementa = document.createElement('a');
    elementa.setAttribute('href', '#');
    var elementi = document.createElement('i');
    elementi.setAttribute('aria-hidden', 'true');
    elementi.className = 'fa fa-bars fa-lg';
    elementa.appendChild(elementi);
    element.addEventListener('click', function (event) {
      event.preventDefault();
      options.toggleSidebar();
    });
    element.appendChild(elementa);
    return _this;
  }

  return SidebarButton;
}(ol_control__WEBPACK_IMPORTED_MODULE_0__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSItem.jsx":
/*!***************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSItem.jsx ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WMSLayerItems__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WMSLayerItems */ "./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var WMSItem = /*#__PURE__*/function (_Component) {
  _inherits(WMSItem, _Component);

  var _super = _createSuper(WMSItem);

  function WMSItem(props) {
    var _this;

    _classCallCheck(this, WMSItem);

    _this = _super.call(this, props);
    _this.state = {
      name: props.wms.name,
      tiles: props.wms.tiles,
      layers: props.wms.layers,
      is_visible: true
    };
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WMSItem, [{
    key: "toggle",
    value: function toggle(e) {
      var is_visible = e.target.checked;
      this.setState({
        is_visible: is_visible
      });
      this.state.tile.setVisible(is_visible);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          tiles = _this$state.tiles,
          name = _this$state.name,
          layers = _this$state.layers,
          is_visible = _this$state.is_visible;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "my-1"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        className: "font-weight-bold",
        type: "checkbox",
        onChange: this.toggle,
        checked: is_visible
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
        className: "font-weight-bold",
        htmlFor: "formGroupInput"
      }, "\xA0", name)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSLayerItems__WEBPACK_IMPORTED_MODULE_1__["default"], {
        layers: layers,
        tileWMS: tiles
      }));
    }
  }]);

  return WMSItem;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx":
/*!********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSLayerItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var WMSLayerItem = /*#__PURE__*/function (_Component) {
  _inherits(WMSLayerItem, _Component);

  var _super = _createSuper(WMSLayerItem);

  function WMSLayerItem(props) {
    var _this;

    _classCallCheck(this, WMSLayerItem);

    _this = _super.call(this, props);
    _this.state = {
      name: props.layer.name,
      code: props.layer.code,
      tile: props.layer.tile,
      is_visible: props.layer.defaultCheck,
      legendURL: props.layer.legendURL
    };
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(WMSLayerItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.state.tile.setVisible(this.props.layer.defaultCheck);
    }
  }, {
    key: "toggle",
    value: function toggle(is_visible) {
      this.state.tile.setVisible(is_visible);
      this.setState({
        is_visible: is_visible
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          name = _this$state.name,
          code = _this$state.code,
          is_visible = _this$state.is_visible,
          legendURL = _this$state.legendURL;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "checkbox",
        onChange: function onChange(e) {
          return _this2.toggle(e.target.checked);
        },
        checked: is_visible
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", null, " ", name)), legendURL != "null" && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        className: "img",
        src: legendURL
      }))));
    }
  }]);

  return WMSLayerItem;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx":
/*!*********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/WMSLayerItems.jsx ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WMSLayerItems; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WMSLayerItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WMSLayerItem */ "./frontend/bundle/src/components/DetailPage/WMSLayerItem.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var WMSLayerItems = /*#__PURE__*/function (_Component) {
  _inherits(WMSLayerItems, _Component);

  var _super = _createSuper(WMSLayerItems);

  function WMSLayerItems(props) {
    var _this;

    _classCallCheck(this, WMSLayerItems);

    _this = _super.call(this, props);
    _this.state = {
      layers: props.layers
    };
    return _this;
  }

  _createClass(WMSLayerItems, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
        style: {
          listStyle: 'none'
        }
      }, this.state.layers.map(function (layer, idx) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WMSLayerItem__WEBPACK_IMPORTED_MODULE_1__["default"], {
          layer: layer,
          key: idx
        });
      }));
    }
  }]);

  return WMSLayerItems;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);



/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx":
/*!*******************************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/CoordinateCopy.jsx ***!
  \*******************************************************************************/
/*! exports provided: CoordinateCopy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoordinateCopy", function() { return CoordinateCopy; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var CopyInput = /*#__PURE__*/function (_Component) {
  _inherits(CopyInput, _Component);

  var _super = _createSuper(CopyInput);

  function CopyInput(props) {
    var _this;

    _classCallCheck(this, CopyInput);

    _this = _super.call(this, props);
    _this.handleCoordinateSet = _this.handleCoordinateSet.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(CopyInput, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleCoordinateSet();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this.handleCoordinateSet();
    }
  }, {
    key: "handleCoordinateSet",
    value: function handleCoordinateSet() {
      var input = react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.findDOMNode(this);
      input.focus();
      input.select();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
        type: "text",
        className: "form-control",
        onChange: function onChange() {},
        onBlur: this.props.handleBlur,
        value: this.props.coordinate
      });
    }
  }]);

  return CopyInput;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var CoordinateCopy = /*#__PURE__*/function (_Control) {
  _inherits(CoordinateCopy, _Control);

  var _super2 = _createSuper(CoordinateCopy);

  function CoordinateCopy(opt_options) {
    var _this2;

    _classCallCheck(this, CoordinateCopy);

    var options = opt_options || {};
    _this2 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this2.is_component_initialized = false;
    var cssClasses = "coordinate-copy-control ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_CONTROL"], " ").concat(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_HIDDEN"]);
    _this2.element.className = cssClasses;
    _this2.renderComponent = _this2.renderComponent.bind(_assertThisInitialized(_this2));
    _this2.toggleControl = _this2.toggleControl.bind(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(CoordinateCopy, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle(ol_css_js__WEBPACK_IMPORTED_MODULE_3__["CLASS_HIDDEN"], !is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this3 = this;

      props.handleBlur = function () {
        return _this3.toggleControl(false);
      };

      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CopyInput, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(CopyInput, props), this.element);
    }
  }, {
    key: "setCoordinate",
    value: function setCoordinate(coordinate) {
      this.renderComponent({
        coordinate: coordinate
      });
      this.toggleControl(true);
    }
  }]);

  return CoordinateCopy;
}(ol_control__WEBPACK_IMPORTED_MODULE_2__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/Draw.jsx":
/*!*********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/Draw.jsx ***!
  \*********************************************************************/
/*! exports provided: DrawButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawButton", function() { return DrawButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var DrawButton = /*#__PURE__*/function (_Control) {
  _inherits(DrawButton, _Control);

  var _super = _createSuper(DrawButton);

  function DrawButton(opt_options) {
    var _this;

    _classCallCheck(this, DrawButton);

    var options = opt_options || {};
    _this = _super.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    var cssClasses = 'draw-button';
    var element = _this.element;
    element.className = cssClasses;
    var elementa = document.createElement('a');
    elementa.setAttribute('href', '#');
    var elementi = document.createElement('i');
    elementi.setAttribute('aria-hidden', 'true');
    elementi.className = 'fa fa-object-ungroup';
    elementa.appendChild(elementi);
    element.addEventListener('click', function (event) {
      event.preventDefault();
      options.toggleDraw();
    });
    element.appendChild(elementa);
    return _this;
  }

  return DrawButton;
}(ol_control__WEBPACK_IMPORTED_MODULE_1__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/DrawPayModal.jsx":
/*!*****************************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/DrawPayModal.jsx ***!
  \*****************************************************************************/
/*! exports provided: DrawPayModal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawPayModal", function() { return DrawPayModal; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service */ "./frontend/bundle/src/components/DetailPage/service.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var ModalComponent = /*#__PURE__*/function (_Component) {
  _inherits(ModalComponent, _Component);

  var _super = _createSuper(ModalComponent);

  function ModalComponent(props) {
    var _this;

    _classCallCheck(this, ModalComponent);

    _this = _super.call(this, props);
    _this.state = {
      price: 3000,
      description: 'Газрын бүрхэвч, газар ашиглалт',
      payLoad: false
    };
    return _this;
  }

  _createClass(ModalComponent, [{
    key: "handlePayment",
    value: function handlePayment() {
      this.setState({
        payLoad: true
      });
      var _this$state = this.state,
          price = _this$state.price,
          description = _this$state.description;
      var _this$props = this.props,
          coodrinatLeftTop = _this$props.coodrinatLeftTop,
          coodrinatRightBottom = _this$props.coodrinatRightBottom;
      _service__WEBPACK_IMPORTED_MODULE_3__["service"].paymentDraw(price, description, coodrinatLeftTop, coodrinatRightBottom).then(function (_ref) {
        var payment_id = _ref.payment_id;

        if (payment_id) {
          setTimeout(function () {
            window.location.href = "/payment/purchase/".concat(payment_id, "/");
          }, 1000);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var payLoad = this.state.payLoad;
      var _this$props2 = this.props,
          coodrinatLeftTop = _this$props2.coodrinatLeftTop,
          coodrinatRightBottom = _this$props2.coodrinatRightBottom;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-dialog modal-dialog-scrollable",
        style: {
          zIndex: "5"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-content"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-header",
        onClick: this.props.handleClose
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
        className: "modal-title"
      }, "\u0414\u044D\u043B\u0433\u044D\u0440\u044D\u043D\u0433\u04AF\u0439 \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal",
        "aria-label": "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-body"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "containner"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, "X = ", coodrinatLeftTop[0]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, "Y = ", coodrinatLeftTop[1]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, "X = ", coodrinatRightBottom[0]), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "row"
      }, "Y = ", coodrinatRightBottom[1]))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-footer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: this.props.handleClose,
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0411\u0443\u0446\u0430\u0445"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.handlePayment();
        },
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0425\u0443\u0434\u0430\u043B\u0434\u0430\u0436 \u0430\u0432\u0430\u0445"))));
    }
  }]);

  return ModalComponent;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var DrawPayModal = /*#__PURE__*/function (_Control) {
  _inherits(DrawPayModal, _Control);

  var _super2 = _createSuper(DrawPayModal);

  function DrawPayModal(opt_options) {
    var _this3;

    _classCallCheck(this, DrawPayModal);

    var options = opt_options || {};
    _this3 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    console.log(options);
    _this3.is_component_initialized = false;
    _this3.element.className = 'modal fade show';
    _this3.renderComponent = _this3.renderComponent.bind(_assertThisInitialized(_this3));
    _this3.toggleControl = _this3.toggleControl.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(DrawPayModal, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle('d-block', is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this4 = this;

      props.handleClose = function () {
        return _this4.toggleControl(false);
      };

      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
    }
  }, {
    key: "showModal",
    value: function showModal(coodrinatLeftTop, coodrinatRightBottom) {
      this.toggleControl(true);
      this.renderComponent({
        coodrinatLeftTop: coodrinatLeftTop,
        coodrinatRightBottom: coodrinatRightBottom
      });
    }
  }]);

  return DrawPayModal;
}(ol_control__WEBPACK_IMPORTED_MODULE_2__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/Modal.jsx":
/*!**********************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/Modal.jsx ***!
  \**********************************************************************/
/*! exports provided: Modal */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return Modal; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service */ "./frontend/bundle/src/components/DetailPage/service.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var ModalComponent = /*#__PURE__*/function (_Component) {
  _inherits(ModalComponent, _Component);

  var _super = _createSuper(ModalComponent);

  function ModalComponent(props) {
    var _this;

    _classCallCheck(this, ModalComponent);

    _this = _super.call(this, props);
    _this.state = {
      price: 3000,
      description: 'Газрын бүрхэвч, газар ашиглалт',
      payload: false,
      data_id: 2
    };
    return _this;
  }

  _createClass(ModalComponent, [{
    key: "handlePayment",
    value: function handlePayment() {
      this.setState({
        payload: true
      });
      var _this$state = this.state,
          price = _this$state.price,
          description = _this$state.description,
          data_id = _this$state.data_id;
      _service__WEBPACK_IMPORTED_MODULE_3__["service"].payment(price, description, data_id).then(function (_ref) {
        var payment_id = _ref.payment_id;

        if (payment_id) {
          setTimeout(function () {
            window.location.href = "/payment/purchase/".concat(payment_id, "/");
          }, 1000);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          content = _this$props.content,
          is_complete = _this$props.is_complete;
      var payload = this.state.payload;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-dialog modal-dialog-scrollable",
        style: {
          zIndex: "5"
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-content"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-header",
        onClick: this.props.handleClose
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
        className: "modal-title"
      }, "\u0414\u044D\u043B\u0433\u044D\u0440\u044D\u043D\u0433\u04AF\u0439 \u043C\u044D\u0434\u044D\u044D\u043B\u044D\u043B"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal",
        "aria-label": "Close"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-body"
      }, !is_complete && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", null, "\u0422\u04AF\u0440 \u0445\u04AF\u043B\u044D\u044D\u043D\u044D \u04AF\u04AF..."), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "spinner-border ml-auto",
        role: "status",
        "aria-hidden": "true"
      })), is_complete && content.map(function (_ref2, idx) {
        var _ref3 = _slicedToArray(_ref2, 2),
            layer_name = _ref3[0],
            values = _ref3[1];

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          key: idx
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h6", null, layer_name), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
          className: "table"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, values.map(function (_ref4, val_idx) {
          var _ref5 = _slicedToArray(_ref4, 2),
              field = _ref5[0],
              value = _ref5[1];

          return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
            key: val_idx
          }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, field), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, value));
        }))));
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "modal-footer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: this.props.handleClose,
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0411\u0443\u0446\u0430\u0445"), payload ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0410\u0447\u0430\u0430\u043B\u043B\u0430\u0436 \u0431\u0430\u0439\u043D\u0430...", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
        "class": "spinner-border text-light",
        role: "status"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
        "class": "sr-only"
      }, "Loading..."))) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        onClick: function onClick() {
          return _this2.handlePayment();
        },
        className: "btn btn-secondary",
        "data-dismiss": "modal"
      }, "\u0425\u0443\u0434\u0430\u043B\u0434\u0430\u0436 \u0430\u0432\u0430\u0445"))));
    }
  }]);

  return ModalComponent;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

var Modal = /*#__PURE__*/function (_Control) {
  _inherits(Modal, _Control);

  var _super2 = _createSuper(Modal);

  function Modal(opt_options) {
    var _this3;

    _classCallCheck(this, Modal);

    var options = opt_options || {};
    _this3 = _super2.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this3.is_component_initialized = false;
    _this3.element.className = 'modal fade show';
    _this3.renderComponent = _this3.renderComponent.bind(_assertThisInitialized(_this3));
    _this3.toggleControl = _this3.toggleControl.bind(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(Modal, [{
    key: "toggleControl",
    value: function toggleControl(is_visible) {
      this.element.classList.toggle('d-block', is_visible);
    }
  }, {
    key: "renderComponent",
    value: function renderComponent(props) {
      var _this4 = this;

      props.handleClose = function () {
        return _this4.toggleControl(false);
      };

      if (!this.is_component_initialized) {
        react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
        this.is_component_initialized = true;
      }

      react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.hydrate( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ModalComponent, props), this.element);
    }
  }, {
    key: "showModal",
    value: function showModal(content, is_complete) {
      this.toggleControl(true);
      this.renderComponent({
        content: content,
        is_complete: is_complete
      });
    }
  }]);

  return Modal;
}(ol_control__WEBPACK_IMPORTED_MODULE_2__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx":
/*!******************************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/controls/СуурьДавхарга.jsx ***!
  \******************************************************************************/
/*! exports provided: СуурьДавхарга */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "СуурьДавхарга", function() { return СуурьДавхарга; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/control */ "./node_modules/ol/control.js");
/* harmony import */ var ol_css_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/css.js */ "./node_modules/ol/css.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var CLASS_ACTIVE = 'active';
var СуурьДавхарга = /*#__PURE__*/function (_Control) {
  _inherits(СуурьДавхарга, _Control);

  var _super = _createSuper(СуурьДавхарга);

  function СуурьДавхарга(opt_options) {
    var _this;

    _classCallCheck(this, СуурьДавхарга);

    var options = opt_options || {};
    _this = _super.call(this, {
      element: document.createElement('div'),
      target: options.target
    });
    _this.toggleLayer = _this.toggleLayer.bind(_assertThisInitialized(_this));
    _this.initLayer = _this.initLayer.bind(_assertThisInitialized(_this));
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.last_active = null;
    var base_layers = options.layers.map(_this.initLayer);
    var cssClasses = "\u0441\u0443\u0443\u0440\u044C-\u0434\u0430\u0432\u0445\u0430\u0440\u0433\u0443\u0443\u0434 ".concat(ol_css_js__WEBPACK_IMPORTED_MODULE_2__["CLASS_UNSELECTABLE"], " ").concat(ol_css_js__WEBPACK_IMPORTED_MODULE_2__["CLASS_CONTROL"]);
    var element = _this.element;
    element.className = cssClasses;
    base_layers.forEach(function (l) {
      return element.appendChild(l);
    });
    return _this;
  }

  _createClass(СуурьДавхарга, [{
    key: "initLayer",
    value: function initLayer(_ref) {
      var _this2 = this;

      var thumbnail_1x = _ref.thumbnail_1x,
          thumbnail_2x = _ref.thumbnail_2x,
          layer = _ref.layer,
          is_active = _ref.is_active;
      var el = document.createElement('a');
      el.setAttribute('href', '#');
      el.className = 'суурь-давхарга' + (is_active ? ' ' + CLASS_ACTIVE : '');
      var img = document.createElement('img');
      img.srcset = "".concat(thumbnail_1x, " 1x, ").concat(thumbnail_2x, " 2x");
      el.appendChild(img);
      el.addEventListener('click', function (event) {
        event.preventDefault();

        _this2.handleClick(el, layer);
      });
      this.toggleLayer(is_active === true, el, layer);
      return el;
    }
  }, {
    key: "toggleLayer",
    value: function toggleLayer(is_active, el, layer) {
      if (this.last_active && is_active) {
        this.last_active.layer.setVisible(false);
        this.last_active.el.classList.toggle(CLASS_ACTIVE, false);
      }

      layer.setVisible(is_active);
      el.classList.toggle(CLASS_ACTIVE, is_active);
      if (is_active) this.last_active = {
        el: el,
        layer: layer
      };
    }
  }, {
    key: "handleClick",
    value: function handleClick(el, layer) {
      if (this.last_active && this.last_active.el === el) return;
      this.toggleLayer(true, el, layer);
    }
  }]);

  return СуурьДавхарга;
}(ol_control__WEBPACK_IMPORTED_MODULE_1__["Control"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/index.jsx":
/*!*************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/index.jsx ***!
  \*************************************************************/
/*! exports provided: DetailPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DetailPage", function() { return DetailPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./service */ "./frontend/bundle/src/components/DetailPage/service.js");
/* harmony import */ var _BundleMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BundleMap */ "./frontend/bundle/src/components/DetailPage/BundleMap.jsx");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var DetailPage = /*#__PURE__*/function (_Component) {
  _inherits(DetailPage, _Component);

  var _super = _createSuper(DetailPage);

  function DetailPage(props) {
    var _this;

    _classCallCheck(this, DetailPage);

    _this = _super.call(this, props);
    _this.state = {
      bundle: props.bundle
    };
    return _this;
  }

  _createClass(DetailPage, [{
    key: "handleSelectBundle",
    value: function handleSelectBundle(e, bundle) {
      e.preventDefault();
      this.setState({
        bundle: bundle
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BundleMap__WEBPACK_IMPORTED_MODULE_2__["default"], {
        bundle: this.state.bundle
      });
    }
  }]);

  return DetailPage;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/service.js":
/*!**************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/service.js ***!
  \**************************************************************/
/*! exports provided: service */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "service", function() { return service; });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var service = {
  loadWMSLayers: loadWMSLayers,
  loadBaseLayers: loadBaseLayers,
  payment: payment,
  paymentDraw: paymentDraw
};

function getCookie(name) {
  var cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim(); // Does this cookie string begin with the name we want?

      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  return cookieValue;
}

function handleResponse(response) {
  return response.text().then(function (text) {
    var data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // TODO auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        location.reload(true);
      }

      var error = data && data.message || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function _getGetOptions() {
  return {
    method: 'GET',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  };
}

function _getPostOptions() {
  return {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': getCookie('csrftoken')
    }
  };
}

function loadWMSLayers(id) {
  var requestOptions = _objectSpread({}, _getGetOptions());

  return fetch("/\u0434\u044D\u0434-\u0441\u0430\u043D/".concat(id, "/\u0434\u0430\u0432\u0445\u0430\u0440\u0433\u0443\u0443\u0434/"), requestOptions).then(handleResponse);
}

function loadBaseLayers() {
  var requestOptions = _objectSpread({}, _getGetOptions());

  return fetch('/суурь-давхарга/', requestOptions).then(handleResponse);
}

function payment(price, description, data_id) {
  var requestOptions = _objectSpread(_objectSpread({}, _getPostOptions()), {}, {
    body: JSON.stringify({
      price: price,
      description: description,
      data_id: data_id
    })
  });

  return fetch('/back/payment/purchase/', requestOptions).then(handleResponse);
}

function paymentDraw(price, description, coodrinatLeftTop, coodrinatRightBottom) {
  var requestOptions = _objectSpread(_objectSpread({}, _getPostOptions()), {}, {
    body: JSON.stringify({
      price: price,
      description: description,
      coodrinatLeftTop: coodrinatLeftTop,
      coodrinatRightBottom: coodrinatRightBottom
    })
  });

  return fetch('/back/payment/purchase-draw/', requestOptions).then(handleResponse);
}

/***/ }),

/***/ "./frontend/bundle/src/components/DetailPage/styles.css":
/*!**************************************************************!*\
  !*** ./frontend/bundle/src/components/DetailPage/styles.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var api = __webpack_require__(/*! ../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
            var content = __webpack_require__(/*! !../../../../../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css");

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.i, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ "./frontend/bundle/src/helpers.js":
/*!****************************************!*\
  !*** ./frontend/bundle/src/helpers.js ***!
  \****************************************/
/*! exports provided: helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return helpers; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _wrapRegExp(re, groups) { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (_typeof(args[args.length - 1]) !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var helpers = {
  parseCoordinateString: parseCoordinateString
};

function parseCoordinateString(coordinate_string) {
  var result = /*#__PURE__*/_wrapRegExp(/^(\x2D?[0-9]+(\.[0-9]+)?)[ ,](\x2D?[0-9]+(\.[0-9]+)?)$/, {
    latitude: 1,
    longitude: 3
  }).exec(coordinate_string);

  var lat = 0,
      lon = 0;

  if (result) {
    lat = parseFloat(result.groups.latitude);
    lon = parseFloat(result.groups.longitude);
  } // According to OpenLayers the format is [x, y] or [longitude, latitude]


  return [lon, lat];
}

/***/ }),

/***/ "./frontend/bundle/src/index.js":
/*!**************************************!*\
  !*** ./frontend/bundle/src/index.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./frontend/bundle/src/components/App.jsx");



var bundle = JSON.parse(document.getElementById('bundle-app-data').innerHTML);
Object(react_dom__WEBPACK_IMPORTED_MODULE_1__["render"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_App__WEBPACK_IMPORTED_MODULE_2__["App"], {
  bundle: bundle
}), document.getElementById('bundle-app'));

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css":
/*!****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./frontend/bundle/src/components/DetailPage/styles.css ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "element.style {\n    position: relative;\n}\n.🌍 {\n    position: relative;\n}\n\n.🌍 > #map{\n    width: 100%;\n    height: calc(100% - 37px - 96px - 33.5px - 0px);\n    position: fixed;\n }\n\n.⚙ {\n    position: absolute;\n    top: 1%;\n    right: 70px;\n    bottom: 150px;\n    padding-top: 1rem;\n    padding-bottom: 1rem;\n    overflow-y: auto;\n    background-color: white;\n    -webkit-box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    -moz-box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    box-shadow: 0px 0px 21px 7px rgba(0,0,0,0.65);\n    opacity: 1;\n\n\n}\n.⚙.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .1s linear, visibility 0s linear .1s;\n}\n\n.⚙-toggle{\n    position: absolute;\n    top: 7px;\n    right: 12px;\n    width: 50px;\n    height: 50px;\n    background-color: rgba(0,60,136,0.5);\n    border-radius: 4px;\n    padding: 2px;\n}\n.⚙-toggle:hover{\n    background-color: rgba(0,60,136,0.7);\n}\n.⚙-toggle:focus{\n    background-color: rgba(0,60,136,0.7);\n\n}\n\n\n.⚙-toggle a{\n    position: absolute;\n    top: -6px;\n    right: -7px;\n    width: 50px;\n    height: 50px;\n\n}\n.fa-lg{\n    font-size: 40px;\n    color: white;\n    line-height: unset;\n}\n.суурь-давхаргууд{\n    right: .5rem;\n    bottom: 70px;\n    position: fixed;\n}\n.суурь-давхаргууд > .суурь-давхарга{\n    display: block;\n    width: 8rem;\n    height: 4.5rem;\n    overflow: hidden;\n    margin: 1px;\n    border-radius: 2px;\n    float: right;\n    transition: opacity .15s ease-out;\n}\n.суурь-давхаргууд > .суурь-давхарга.active,\n.суурь-давхаргууд:hover > .суурь-давхарга.active:hover,\n.суурь-давхаргууд > .суурь-давхарга:hover {\n    opacity: 1;\n}\n.суурь-давхаргууд > .суурь-давхарга,\n.суурь-давхаргууд:hover > .суурь-давхарга.active {\n    opacity: .7;\n}\n\n\n.ol-full-screen {\n    right: .5rem;\n    top: 58px;\n    width: 57px;\n    height: 57px;\n\n}\n.ol-full-screen .ol-full-screen-false{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-full-screen .ol-full-screen-true{\n    width: 50px;\n    height: 50px;\n    font-size: 40px;\n\n}\n.ol-zoom {\n    width: 57px;\n    height: 107px;\n    left: unset;\n    right: .5rem;\n    top: 110px;\n}\n.ol-zoom  .ol-zoom-out{\n    width: 50px;\n    height: 50px;\n    font-size: 55px;\n\n}\n.ol-zoom .ol-zoom-in{\n    width: 50px;\n    height: 50px;\n    font-size: 55px;\n}\n\n.ol-mouse-position {\n    right: 4rem;\n    background: rgba(0,60,136,0.3);\n    border-radius: 4px;\n    padding: 2px .2rem;\n    font-size: smaller;\n    color: #eee;\n    text-align: center;\n    width: 8.8rem;\n    min-height: 1rem;\n}\n\n.coordinate-copy-control {\n    width: 10rem;\n    left: 2%;\n    top: 0.5rem;\n    opacity: 1;\n}\n.coordinate-copy-control.ol-hidden {\n    opacity: 0;\n    visibility: hidden;\n    transition: opacity .25s linear, visibility 0s linear .25s;\n}\n\n.ol-scale-line{\n    position: fixed;\n    bottom: 70px;\n}\n\n\n.draw-button {\n    position: absolute;\n    top: 300px;\n    right: 12px;\n    width: 50px;\n    height: 50px;\n    background-color: rgba(0,60,136,0.5);\n    border-radius: 4px;\n    padding: 2px 5px;\n}\n.draw-button:active{\n    background-color: rgba(0,60,136,0.9);\n\n}\n\n.draw-button .fa-object-ungroup{\n    font-size: 30px;\n    color: white;\n    line-height: unset;\n}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 1:
/*!***********************************************************!*\
  !*** multi babel-polyfill ./frontend/bundle/src/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! babel-polyfill */"./node_modules/babel-polyfill/lib/index.js");
module.exports = __webpack_require__(/*! /home/togoldor/geoWork/geoWMS/frontend/bundle/src/index.js */"./frontend/bundle/src/index.js");


/***/ })

},[[1,"manifest","libs"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvQXBwLmpzeCIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvRGV0YWlsUGFnZS9CdW5kbGVNYXAuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1NpZGViYXIuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1NpZGViYXJCdXR0b24uanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1dNU0l0ZW0uanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL1dNU0xheWVySXRlbS5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvV01TTGF5ZXJJdGVtcy5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvY29udHJvbHMvQ29vcmRpbmF0ZUNvcHkuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL2NvbnRyb2xzL0RyYXcuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL2NvbnRyb2xzL0RyYXdQYXlNb2RhbC5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2UvY29udHJvbHMvTW9kYWwuanN4Iiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvY29tcG9uZW50cy9EZXRhaWxQYWdlL2NvbnRyb2xzL9Ch0YPRg9GA0YzQlNCw0LLRhdCw0YDQs9CwLmpzeCIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvRGV0YWlsUGFnZS9pbmRleC5qc3giLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2Uvc2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9idW5kbGUvc3JjL2NvbXBvbmVudHMvRGV0YWlsUGFnZS9zdHlsZXMuY3NzPzIwYzciLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9oZWxwZXJzLmpzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2J1bmRsZS9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvYnVuZGxlL3NyYy9jb21wb25lbnRzL0RldGFpbFBhZ2Uvc3R5bGVzLmNzcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsImJ1bmRsZSIsIkNvbXBvbmVudCIsIkJ1bmRsZU1hcCIsInN0YXRlIiwicHJvamVjdGlvbiIsInByb2plY3Rpb25fZGlzcGxheSIsIm1hcF93bXNfbGlzdCIsImlzX3NpZGViYXJfb3BlbiIsImNvb3JkaW5hdGVfY2xpY2tlZCIsInZlY3Rvcl9sYXllciIsImlzX2RyYXdfb3BlbiIsImRyYXdfbGF5ZXIiLCJkcmF3Iiwic291cmNlX2RyYXciLCJjb250cm9scyIsImNvb3JkaW5hdGVDb3B5IiwiQ29vcmRpbmF0ZUNvcHkiLCJtb2RhbCIsIk1vZGFsIiwiZHJhd01vZGFsIiwiRHJhd1BheU1vZGFsIiwic2lkZWJhciIsIlNpZGViYXIiLCJtYXJrZXIiLCJpbml0TWFya2VyIiwiaGFuZGxlVG9nZ2xlIiwiYmluZCIsImhhbmRsZU1hcERhdGFMb2FkZWQiLCJoYW5kbGVNYXBDbGljayIsImhhbmRsZVNldENlbnRlciIsInRvZ2dsZVNpZGViYXIiLCJsb2FkTWFwRGF0YSIsInNob3dGZWF0dXJlc0F0IiwidG9nZ2xlRHJhdyIsInRvZ2dsZURyYXdlZCIsInRvZ2dsZURyYXdSZW1vdmUiLCJzdHlsZSIsIlN0eWxlIiwiaW1hZ2UiLCJJY29uIiwiYW5jaG9yIiwiYW5jaG9yWFVuaXRzIiwiYW5jaG9yWVVuaXRzIiwic2NhbGUiLCJzcmMiLCJwb2ludCIsIlBvaW50IiwiZmVhdHVyZSIsIkZlYXR1cmUiLCJnZW9tZXRyeSIsInNldFN0eWxlIiwiaWQiLCJwcmV2UHJvcHMiLCJwcmV2U3RhdGUiLCJzZXRDb29yZGluYXRlIiwic2V0U3RhdGUiLCJidW5kbGVfaWQiLCJQcm9taXNlIiwiYWxsIiwic2VydmljZSIsImxvYWRCYXNlTGF5ZXJzIiwibG9hZFdNU0xheWVycyIsInRoZW4iLCJiYXNlX2xheWVyX2xpc3QiLCJ3bXNfbGlzdCIsIm1hcCIsIm5hbWUiLCJ1cmwiLCJsYXllcnMiLCJsYXllciIsInRpbGUiLCJUaWxlIiwic291cmNlIiwiVGlsZVdNUyIsInBhcmFtcyIsImNvZGUiLCJyZWR1Y2UiLCJhY2MiLCJiYXNlX2xheWVyX2luZm8iLCJpZHgiLCJ0aWxlbmFtZSIsIlRpbGVJbWFnZSIsImNyb3NzT3JpZ2luIiwiYmFzZV9sYXllcnMiLCJwdXNoIiwiYmFzZV9sYXllcl9jb250cm9scyIsImlzX2FjdGl2ZSIsInRodW1ibmFpbF8xeCIsInRodW1ibmFpbF8yeCIsIlZlY3RvckxheWVyIiwiVmVjdG9yU291cmNlIiwic3Ryb2tlIiwiU3Ryb2tlIiwiY29sb3IiLCJ3aWR0aCIsImZpbGwiLCJGaWxsIiwibWFya2VyX2xheWVyIiwiZmVhdHVyZXMiLCJNYXAiLCJ0YXJnZXQiLCJkZWZhdWx0Q29udHJvbHMiLCJleHRlbmQiLCJGdWxsU2NyZWVuIiwiTW91c2VQb3NpdGlvbiIsImNvb3JkaW5hdGVGb3JtYXQiLCJjb29yZCIsInVuZGVmaW5lZEhUTUwiLCLQodGD0YPRgNGM0JTQsNCy0YXQsNGA0LPQsCIsIlNpZGViYXJCdXR0b24iLCJEcmF3QnV0dG9uIiwiU2NhbGVMaW5lIiwiYWNjX21haW4iLCJ3bXMiLCJ0aWxlcyIsInZpZXciLCJWaWV3IiwiY2VudGVyIiwiem9vbSIsIm9uIiwiZXZlbnQiLCJzZXRDb29yZGluYXRlcyIsImNvb3JkaW5hdGUiLCJnZXRWaWV3IiwiZ2V0UHJvamVjdGlvbiIsIm1hcF9jb29yZCIsInRyYW5zZm9ybUNvb3JkaW5hdGUiLCJyZXNvbHV0aW9uIiwiZ2V0UmVzb2x1dGlvbiIsImZvckVhY2giLCJ3bXNfc291cmNlIiwiZ2V0U291cmNlIiwiZ2V0RmVhdHVyZUluZm9VcmwiLCJzaG93TW9kYWwiLCJmZXRjaCIsInJlc3BvbnNlIiwidGV4dCIsInBhcnNlciIsIldNU0dldEZlYXR1cmVJbmZvIiwicmVhZEZlYXR1cmVzIiwic2V0U291cmNlIiwiZmVhdHVyZV9pbmZvIiwiZ2VvbWV0cnlfbmFtZSIsImdldEdlb21ldHJ5TmFtZSIsInZhbHVlcyIsImdldEtleXMiLCJmaWx0ZXIiLCJrZXkiLCJnZXQiLCJnZXRJZCIsImNvbnNvbGUiLCJsb2ciLCJzZXRWaXNpYmxlIiwiZ2V0VmlzaWJsZSIsIm1hcF9wcm9qZWN0aW9uIiwic2V0Q2VudGVyIiwic2hvd1NpZGVCYXIiLCJjb29yZGluYXQiLCJnZXRHZW9tZXRyeSIsImdldENvb3JkaW5hdGVzIiwiY29vZHJpbmF0TGVmdFRvcCIsImNvb2RyaW5hdExlZnRUb3BfbWFwX2Nvb3JkIiwiY29vZHJpbmF0TGVmdFRvcEZvcm1hdCIsImNvb2RyaW5hdFJpZ2h0Qm90dG9tIiwiY29vZHJpbmF0UmlnaHRCb3R0b21fbWFwX2Nvb3JkIiwiY29vZHJpbmF0UmlnaHRCb3R0b21Gb3JtYXQiLCJnZXRGZWF0dXJlcyIsImxlbmd0aCIsImxhc3RGZWF0dXJlIiwicmVtb3ZlRmVhdHVyZSIsIkRyYXciLCJ0eXBlIiwiZ2VvbWV0cnlGdW5jdGlvbiIsImNyZWF0ZUJveCIsImFkZExheWVyIiwiYWRkSW50ZXJhY3Rpb24iLCJyZW1vdmVJbnRlcmFjdGlvbiIsIlNpZGViYXJDb21wb25lbnQiLCJoYW5kbGVTdWJtaXRDb29yZGluYXRlIiwicHJldmVudERlZmF1bHQiLCJoZWxwZXJzIiwicGFyc2VDb29yZGluYXRlU3RyaW5nIiwiZSIsInZhbHVlIiwib3B0X29wdGlvbnMiLCJvcHRpb25zIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlzX2NvbXBvbmVudF9pbml0aWFsaXplZCIsImNzc0NsYXNzZXMiLCJDTEFTU19ISURERU4iLCJjbGFzc05hbWUiLCJyZW5kZXJDb21wb25lbnQiLCJ0b2dnbGVDb250cm9sIiwiaXNfdmlzaWJsZSIsImNsYXNzTGlzdCIsInRvZ2dsZSIsIlJlYWN0RE9NIiwicmVuZGVyIiwiaHlkcmF0ZSIsImlzbGFvZCIsIkNvbnRyb2wiLCJlbGVtZW50YSIsInNldEF0dHJpYnV0ZSIsImVsZW1lbnRpIiwiYXBwZW5kQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwiV01TSXRlbSIsImNoZWNrZWQiLCJXTVNMYXllckl0ZW0iLCJkZWZhdWx0Q2hlY2siLCJsZWdlbmRVUkwiLCJXTVNMYXllckl0ZW1zIiwibGlzdFN0eWxlIiwiQ29weUlucHV0IiwiaGFuZGxlQ29vcmRpbmF0ZVNldCIsImlucHV0IiwiZmluZERPTU5vZGUiLCJmb2N1cyIsInNlbGVjdCIsImhhbmRsZUJsdXIiLCJDTEFTU19DT05UUk9MIiwiTW9kYWxDb21wb25lbnQiLCJwcmljZSIsImRlc2NyaXB0aW9uIiwicGF5TG9hZCIsInBheW1lbnREcmF3IiwicGF5bWVudF9pZCIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJ6SW5kZXgiLCJoYW5kbGVDbG9zZSIsImhhbmRsZVBheW1lbnQiLCJwYXlsb2FkIiwiZGF0YV9pZCIsInBheW1lbnQiLCJjb250ZW50IiwiaXNfY29tcGxldGUiLCJsYXllcl9uYW1lIiwidmFsX2lkeCIsImZpZWxkIiwiQ0xBU1NfQUNUSVZFIiwidG9nZ2xlTGF5ZXIiLCJpbml0TGF5ZXIiLCJoYW5kbGVDbGljayIsImxhc3RfYWN0aXZlIiwiQ0xBU1NfVU5TRUxFQ1RBQkxFIiwibCIsImVsIiwiaW1nIiwic3Jjc2V0IiwiRGV0YWlsUGFnZSIsImdldENvb2tpZSIsImNvb2tpZVZhbHVlIiwiY29va2llIiwiY29va2llcyIsInNwbGl0IiwiaSIsInRyaW0iLCJzdWJzdHJpbmciLCJkZWNvZGVVUklDb21wb25lbnQiLCJoYW5kbGVSZXNwb25zZSIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJvayIsImluZGV4T2YiLCJzdGF0dXMiLCJyZWxvYWQiLCJlcnJvciIsIm1lc3NhZ2UiLCJzdGF0dXNUZXh0IiwicmVqZWN0IiwiX2dldEdldE9wdGlvbnMiLCJtZXRob2QiLCJoZWFkZXJzIiwiX2dldFBvc3RPcHRpb25zIiwicmVxdWVzdE9wdGlvbnMiLCJib2R5Iiwic3RyaW5naWZ5IiwiY29vcmRpbmF0ZV9zdHJpbmciLCJyZXN1bHQiLCJleGVjIiwibGF0IiwibG9uIiwicGFyc2VGbG9hdCIsImdyb3VwcyIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJpbm5lckhUTUwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUVBO0FBR08sSUFBTUEsR0FBYjtBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUEsNkJBRWE7QUFFTCwwQkFDSSwyREFBQyxzREFBRDtBQUFZLGNBQU0sRUFBRSxLQUFLQyxLQUFMLENBQVdDO0FBQS9CLFFBREo7QUFJSDtBQVJMOztBQUFBO0FBQUEsRUFBeUJDLCtDQUF6QixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNMQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFFcUJDLFM7Ozs7O0FBRWpCLHFCQUFZSCxLQUFaLEVB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QUFTLHNCQUFzQixtQkFBbUIseUJBQXlCLEdBQUcsb0JBQW9CLG1CQUFtQixtQkFBbUIsc0JBQXNCLEdBQUcsc0NBQXNDLHFCQUFxQixrQkFBa0IscUJBQXFCLHVCQUF1QixrQkFBa0IseUJBQXlCLG1CQUFtQix3Q0FBd0MsR0FBRyxtSkFBbUosaUJBQWlCLEdBQUcsMEZBQTBGLGtCQUFrQixHQUFHLHVCQUF1QixtQkFBbUIsZ0JBQWdCLGtCQUFrQixtQkFBbUIsS0FBSyx3Q0FBd0Msa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyx1Q0FBdUMsa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyxZQUFZLGtCQUFrQixvQkFBb0Isa0JBQWtCLG1CQUFtQixpQkFBaUIsR0FBRyx5QkFBeUIsa0JBQWtCLG1CQUFtQixzQkFBc0IsS0FBSyx1QkFBdUIsa0JBQWtCLG1CQUFtQixzQkFBc0IsR0FBRyx3QkFBd0Isa0JBQWtCLHFDQUFxQyx5QkFBeUIseUJBQXlCLHlCQUF5QixrQkFBa0IseUJBQXlCLG9CQUFvQix1QkFBdUIsR0FBRyw4QkFBOEIsbUJBQW1CLGVBQWUsa0JBQWtCLGlCQUFpQixHQUFHLHNDQUFzQyxpQkFBaUIseUJBQXlCLGlFQUFpRSxHQUFHLG1CQUFtQixzQkFBc0IsbUJBQW1CLEdBQUcsb0JBQW9CLHlCQUF5QixpQkFBaUIsa0JBQWtCLGtCQUFrQixtQkFBbUIsMkNBQTJDLHlCQUF5Qix1QkFBdUIsR0FBRyxzQkFBc0IsMkNBQTJDLEtBQUssb0NBQW9DLHNCQUFzQixtQkFBbUIseUJBQXlCLEdBQUc7QUFDdHlHO0FBQ0EiLCJmaWxlIjoic3RhdGljL2Rpc3RfZGV2L2Zyb250ZW5kL2J1bmRsZS83ODIzOTg2NmFkMmZjN2MyYjk5Zi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnXG5cbmltcG9ydCB7RGV0YWlsUGFnZX0gZnJvbSAnLi9EZXRhaWxQYWdlJ1xuXG5cbmV4cG9ydCBjbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RGV0YWlsUGFnZSBidW5kbGU9e3RoaXMucHJvcHMuYnVuZGxlfS8+XG4gICAgICAgIClcblxuICAgIH1cblxufSIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIEZyYWdtZW50IH0gZnJvbSBcInJlYWN0XCJcblxuaW1wb3J0ICdvbC9vbC5jc3MnXG5pbXBvcnQge01hcCwgVmlldywgRmVhdHVyZX0gZnJvbSAnb2wnXG5pbXBvcnQge3RyYW5zZm9ybSBhcyB0cmFuc2Zvcm1Db29yZGluYXRlfSBmcm9tICdvbC9wcm9qJ1xuaW1wb3J0IFdNU0dldEZlYXR1cmVJbmZvIGZyb20gJ29sL2Zvcm1hdC9XTVNHZXRGZWF0dXJlSW5mbydcbmltcG9ydCBUaWxlIGZyb20gJ29sL2xheWVyL1RpbGUnXG5pbXBvcnQge1ZlY3RvciBhcyBWZWN0b3JMYXllcn0gZnJvbSAnb2wvbGF5ZXInXG5pbXBvcnQge1ZlY3RvciBhcyBWZWN0b3JTb3VyY2V9IGZyb20gJ29sL3NvdXJjZSdcbmltcG9ydCB7SWNvbiwgU3R5bGUsIFN0cm9rZSwgRmlsbCwgVGV4dH0gZnJvbSAnb2wvc3R5bGUnXG5pbXBvcnQge1BvaW50fSBmcm9tICdvbC9nZW9tJ1xuaW1wb3J0IFRpbGVJbWFnZSBmcm9tICdvbC9zb3VyY2UvVGlsZUltYWdlJ1xuaW1wb3J0IFRpbGVXTVMgZnJvbSAnb2wvc291cmNlL1RpbGVXTVMnXG5pbXBvcnQgT1NNIGZyb20gJ29sL3NvdXJjZS9PU00nXG5pbXBvcnQge2Zvcm1hdCBhcyBjb29yZGluYXRlRm9ybWF0fSBmcm9tICdvbC9jb29yZGluYXRlJztcbmltcG9ydCB7ZGVmYXVsdHMgYXMgZGVmYXVsdENvbnRyb2xzLCBGdWxsU2NyZWVuLCBNb3VzZVBvc2l0aW9uLCBTY2FsZUxpbmV9IGZyb20gJ29sL2NvbnRyb2wnXG5cbmltcG9ydCB70KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LB9IGZyb20gJy4vY29udHJvbHMv0KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LAnXG5pbXBvcnQge0Nvb3JkaW5hdGVDb3B5fSBmcm9tICcuL2NvbnRyb2xzL0Nvb3JkaW5hdGVDb3B5J1xuaW1wb3J0IHtNb2RhbH0gZnJvbSAnLi9jb250cm9scy9Nb2RhbCdcbmltcG9ydCB7RHJhd1BheU1vZGFsfSBmcm9tICcuL2NvbnRyb2xzL0RyYXdQYXlNb2RhbCdcbmltcG9ydCBcIi4vc3R5bGVzLmNzc1wiXG5pbXBvcnQge3NlcnZpY2V9IGZyb20gJy4vc2VydmljZSdcbmltcG9ydCB7U2lkZWJhckJ1dHRvbn0gZnJvbSAnLi9TaWRlYmFyQnV0dG9uJ1xuaW1wb3J0IHtTaWRlYmFyfSBmcm9tICcuL1NpZGViYXInXG5pbXBvcnQge0RyYXdCdXR0b259IGZyb20gJy4vY29udHJvbHMvRHJhdydcbmltcG9ydCBEcmF3LCB7IGNyZWF0ZUJveCwgY3JlYXRlUmVndWxhclBvbHlnb24sIH0gZnJvbSAnb2wvaW50ZXJhY3Rpb24vRHJhdyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1bmRsZU1hcCBleHRlbmRzIENvbXBvbmVudCB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcylcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcHJvamVjdGlvbjogJ0VQU0c6Mzg1NycsXG4gICAgICAgICAgICBwcm9qZWN0aW9uX2Rpc3BsYXk6ICdFUFNHOjQzMjYnLFxuICAgICAgICAgICAgYnVuZGxlOiBwcm9wcy5idW5kbGUsXG4gICAgICAgICAgICBtYXBfd21zX2xpc3Q6IFtdLFxuICAgICAgICAgICAgaXNfc2lkZWJhcl9vcGVuOiB0cnVlLFxuICAgICAgICAgICAgY29vcmRpbmF0ZV9jbGlja2VkOiBudWxsLFxuICAgICAgICAgICAgdmVjdG9yX2xheWVyOiBudWxsLFxuICAgICAgICAgICAgaXNfZHJhd19vcGVuOiBmYWxzZSxcbiAgICAgICAgICAgIGRyYXdfbGF5ZXI6IG51bGwsXG4gICAgICAgICAgICBkcmF3OiBudWxsLFxuICAgICAgICAgICAgc291cmNlX2RyYXc6IG51bGwsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRyb2xzID0ge1xuICAgICAgICAgICAgY29vcmRpbmF0ZUNvcHk6IG5ldyBDb29yZGluYXRlQ29weSgpLFxuICAgICAgICAgICAgbW9kYWw6IG5ldyBNb2RhbCgpLFxuICAgICAgICAgICAgZHJhd01vZGFsOiBuZXcgRHJhd1BheU1vZGFsKCksXG4gICAgICAgICAgICBzaWRlYmFyOiBuZXcgU2lkZWJhcigpLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmluaXRNYXJrZXIoKVxuXG4gICAgICAgIHRoaXMuaGFuZGxlVG9nZ2xlID0gdGhpcy5oYW5kbGVUb2dnbGUuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmhhbmRsZU1hcERhdGFMb2FkZWQgPSB0aGlzLmhhbmRsZU1hcERhdGFMb2FkZWQuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmhhbmRsZU1hcENsaWNrID0gdGhpcy5oYW5kbGVNYXBDbGljay5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuaGFuZGxlU2V0Q2VudGVyID0gdGhpcy5oYW5kbGVTZXRDZW50ZXIuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLnRvZ2dsZVNpZGViYXIgPSB0aGlzLnRvZ2dsZVNpZGViYXIuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLmxvYWRNYXBEYXRhID0gdGhpcy5sb2FkTWFwRGF0YS5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuc2hvd0ZlYXR1cmVzQXQgPSB0aGlzLnNob3dGZWF0dXJlc0F0LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVEcmF3ID0gdGhpcy50b2dnbGVEcmF3LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVEcmF3ZWQgPSB0aGlzLnRvZ2dsZURyYXdlZC5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMudG9nZ2xlRHJhd1JlbW92ZSA9IHRoaXMudG9nZ2xlRHJhd1JlbW92ZS5iaW5kKHRoaXMpXG4gICAgfVxuXG4gICAgaW5pdE1hcmtlcigpIHtcblxuICAgICAgICBjb25zdCBzdHlsZSA9IG5ldyBTdHlsZSh7XG4gICAgICAgICAgICBpbWFnZTogbmV3IEljb24oe1xuICAgICAgICAgICAgICAgIGFuY2hvcjogWzAuNSwgODZdLFxuICAgICAgICAgICAgICAgIGFuY2hvclhVbml0czogJ2ZyYWN0aW9uJyxcbiAgICAgICAgICAgICAgICBhbmNob3JZVW5pdHM6ICdwaXhlbHMnLFxuICAgICAgICAgICAgICAgIHNjYWxlOiAwLjQsXG4gICAgICAgICAgICAgICAgc3JjOiAnL3N0YXRpYy9hc3NldHMvaW1hZ2UvbWFya2VyLnBuZydcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgcG9pbnQgPSBuZXcgUG9pbnQoWzAsIDBdKVxuXG4gICAgICAgIGNvbnN0IGZlYXR1cmUgPSBuZXcgRmVhdHVyZSh7Z2VvbWV0cnk6IHBvaW50fSlcbiAgICAgICAgZmVhdHVyZS5zZXRTdHlsZShzdHlsZSlcblxuICAgICAgICByZXR1cm4ge2ZlYXR1cmU6IGZlYXR1cmUsIHBvaW50OiBwb2ludH1cblxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmxvYWRNYXBEYXRhKHRoaXMuc3RhdGUuYnVuZGxlLmlkKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuXG4gICAgICAgIGlmIChwcmV2U3RhdGUuY29vcmRpbmF0ZV9jbGlja2VkICE9PSB0aGlzLnN0YXRlLmNvb3JkaW5hdGVfY2xpY2tlZCkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9scy5jb29yZGluYXRlQ29weS5zZXRDb29yZGluYXRlKHRoaXMuc3RhdGUuY29vcmRpbmF0ZV9jbGlja2VkKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMuYnVuZGxlLmlkID09PSBwcmV2UHJvcHMuYnVuZGxlLmlkKSByZXR1cm5cblxuICAgICAgICBjb25zdCB7YnVuZGxlfSA9IHRoaXMucHJvcHNcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YnVuZGxlfSlcblxuICAgICAgICB0aGlzLmxvYWRNYXBEYXRhKGJ1bmRsZS5pZClcblxuICAgIH1cblxuICAgIGxvYWRNYXBEYXRhKGJ1bmRsZV9pZCkge1xuXG4gICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgIHNlcnZpY2UubG9hZEJhc2VMYXllcnMoKSxcbiAgICAgICAgICAgIHNlcnZpY2UubG9hZFdNU0xheWVycyhidW5kbGVfaWQpLFxuICAgICAgICBdKS50aGVuKChbe2Jhc2VfbGF5ZXJfbGlzdH0sIHt3bXNfbGlzdH1dKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZU1hcERhdGFMb2FkZWQoYmFzZV9sYXllcl9saXN0LCB3bXNfbGlzdClcbiAgICAgICAgfSlcblxuICAgIH1cblxuICAgIGhhbmRsZU1hcERhdGFMb2FkZWQoYmFzZV9sYXllcl9saXN0LCB3bXNfbGlzdCkge1xuXG4gICAgICAgIGNvbnN0IG1hcF93bXNfbGlzdCA9IHdtc19saXN0Lm1hcCgoe25hbWUsIHVybCwgbGF5ZXJzfSkgPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgbGF5ZXJzOiBsYXllcnMubWFwKChsYXllcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5sYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGU6IG5ldyBUaWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG5ldyBUaWxlV01TKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbjogdGhpcy5zdGF0ZS5wcm9qZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnTEFZRVJTJzogbGF5ZXIuY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJ0ZPUk1BVCc6ICdpbWFnZS9zdmcreG1sJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGT1JNQVQnOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe21hcF93bXNfbGlzdH0pXG5cbiAgICAgICAgY29uc3Qge2Jhc2VfbGF5ZXJzLCBiYXNlX2xheWVyX2NvbnRyb2xzfSA9XG4gICAgICAgICAgICBiYXNlX2xheWVyX2xpc3QucmVkdWNlKFxuICAgICAgICAgICAgICAgIChhY2MsIGJhc2VfbGF5ZXJfaW5mbywgaWR4KSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGxheWVyXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhc2VfbGF5ZXJfaW5mby50aWxlbmFtZSA9PSBcInh5elwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllciA9IG5ldyBUaWxlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IG5ldyBUaWxlSW1hZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcm9zc09yaWdpbjogJ0Fub255bW91cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogYmFzZV9sYXllcl9pbmZvLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoYmFzZV9sYXllcl9pbmZvLnRpbGVuYW1lID09IFwid21zXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyID0gbmV3IFRpbGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbmV3IFRpbGVXTVMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VfbGF5ZXJfaW5mby51cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0xBWUVSUyc6IGJhc2VfbGF5ZXJfaW5mby5sYXllcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRk9STUFUJzogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhY2MuYmFzZV9sYXllcnMucHVzaChsYXllcilcbiAgICAgICAgICAgICAgICAgICAgYWNjLmJhc2VfbGF5ZXJfY29udHJvbHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc19hY3RpdmU6IGlkeCA9PSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsXzF4OiBiYXNlX2xheWVyX2luZm8udGh1bWJuYWlsXzF4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGh1bWJuYWlsXzJ4OiBiYXNlX2xheWVyX2luZm8udGh1bWJuYWlsXzJ4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXI6IGxheWVyLFxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhY2NcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBiYXNlX2xheWVyczogW10sXG4gICAgICAgICAgICAgICAgICAgIGJhc2VfbGF5ZXJfY29udHJvbHM6IFtdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuXG4gICAgICAgIGNvbnN0IHZlY3Rvcl9sYXllciA9IG5ldyBWZWN0b3JMYXllcih7XG4gICAgICAgICAgICBzb3VyY2U6IG5ldyBWZWN0b3JTb3VyY2UoKSxcbiAgICAgICAgICAgIHN0eWxlOiBuZXcgU3R5bGUoe1xuICAgICAgICAgICAgICAgIHN0cm9rZTogbmV3IFN0cm9rZSh7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAncmdiYSgxMDAsIDI1NSwgMCwgMSknLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGZpbGw6IG5ldyBGaWxsKHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdyZ2JhKDEwMCwgMjU1LCAwLCAwLjMpJ1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHt2ZWN0b3JfbGF5ZXJ9KVxuXG4gICAgICAgIGNvbnN0IG1hcmtlcl9sYXllciA9IG5ldyBWZWN0b3JMYXllcih7XG4gICAgICAgICAgICBzb3VyY2U6IG5ldyBWZWN0b3JTb3VyY2Uoe1xuICAgICAgICAgICAgICAgIGZlYXR1cmVzOiBbdGhpcy5tYXJrZXIuZmVhdHVyZV0sXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoe1xuICAgICAgICAgICAgdGFyZ2V0OiAnbWFwJyxcbiAgICAgICAgICAgIGNvbnRyb2xzOiBkZWZhdWx0Q29udHJvbHMoKS5leHRlbmQoW1xuICAgICAgICAgICAgICAgIG5ldyBGdWxsU2NyZWVuKCksXG4gICAgICAgICAgICAgICAgbmV3IE1vdXNlUG9zaXRpb24oe1xuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0aW9uOiB0aGlzLnN0YXRlLnByb2plY3Rpb25fZGlzcGxheSxcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZUZvcm1hdDogKGNvb3JkKSA9PiBjb29yZGluYXRlRm9ybWF0KGNvb3JkLCAne3l9LHt4fScsIDYpLFxuICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWRIVE1MOiAnJyxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcg0KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LAoe2xheWVyczogYmFzZV9sYXllcl9jb250cm9sc30pLFxuICAgICAgICAgICAgICAgIG5ldyBTaWRlYmFyQnV0dG9uKHt0b2dnbGVTaWRlYmFyOiB0aGlzLnRvZ2dsZVNpZGViYXJ9KSxcbiAgICAgICAgICAgICAgICBuZXcgRHJhd0J1dHRvbih7dG9nZ2xlRHJhdzogdGhpcy50b2dnbGVEcmF3fSksXG4gICAgICAgICAgICAgICAgbmV3IFNjYWxlTGluZSgpLFxuICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbHMubW9kYWwsXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5kcmF3TW9kYWwsXG4gICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5jb29yZGluYXRlQ29weSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLnNpZGViYXIsXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIGxheWVyczogW1xuICAgICAgICAgICAgICAgIC4uLmJhc2VfbGF5ZXJzLFxuICAgICAgICAgICAgICAgIC4uLm1hcF93bXNfbGlzdC5yZWR1Y2UoKGFjY19tYWluLCB3bXMpID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZXMgPSB3bXMubGF5ZXJzLm1hcCgobGF5ZXIpID0+IGxheWVyLnRpbGUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFjY19tYWluLCAuLi50aWxlc11cbiAgICAgICAgICAgICAgICB9LCBbXSksXG4gICAgICAgICAgICAgICAgdmVjdG9yX2xheWVyLFxuICAgICAgICAgICAgICAgIG1hcmtlcl9sYXllcixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB2aWV3OiBuZXcgVmlldyh7XG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbjogdGhpcy5zdGF0ZS5wcm9qZWN0aW9uLFxuICAgICAgICAgICAgICAgIGNlbnRlcjogWzExNDYxNjEzLjYzMDgxNTQ5NywgNTg3ODY1Ni4wMjI4MzcwMDY1XSxcbiAgICAgICAgICAgICAgICB6b29tOiA1LjA0MTMwMTU2MjI0Njk3MSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgbWFwLm9uKCdjbGljaycsIHRoaXMuaGFuZGxlTWFwQ2xpY2spXG5cbiAgICAgICAgdGhpcy5tYXAgPSBtYXBcblxuICAgIH1cblxuICAgIGhhbmRsZU1hcENsaWNrKGV2ZW50KSB7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIucG9pbnQuc2V0Q29vcmRpbmF0ZXMoZXZlbnQuY29vcmRpbmF0ZSlcblxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uID0gZXZlbnQubWFwLmdldFZpZXcoKS5nZXRQcm9qZWN0aW9uKClcbiAgICAgICAgY29uc3QgbWFwX2Nvb3JkID0gdHJhbnNmb3JtQ29vcmRpbmF0ZShldmVudC5jb29yZGluYXRlLCBwcm9qZWN0aW9uLCB0aGlzLnN0YXRlLnByb2plY3Rpb25fZGlzcGxheSlcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZV9jbGlja2VkID0gY29vcmRpbmF0ZUZvcm1hdChtYXBfY29vcmQsICd7eX0se3h9JywgNilcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtjb29yZGluYXRlX2NsaWNrZWR9KVxuXG4gICAgICAgIHRoaXMuc2hvd0ZlYXR1cmVzQXQoZXZlbnQuY29vcmRpbmF0ZSlcblxuICAgIH1cblxuICAgIHNob3dGZWF0dXJlc0F0KGNvb3JkaW5hdGUpIHtcblxuICAgICAgICBjb25zdCB2aWV3ID0gdGhpcy5tYXAuZ2V0VmlldygpXG4gICAgICAgIGNvbnN0IHByb2plY3Rpb24gPSB2aWV3LmdldFByb2plY3Rpb24oKVxuICAgICAgICBjb25zdCByZXNvbHV0aW9uID0gdmlldy5nZXRSZXNvbHV0aW9uKClcblxuICAgICAgICB0aGlzLnN0YXRlLm1hcF93bXNfbGlzdC5mb3JFYWNoKCh7bGF5ZXJzfSkgPT4ge1xuICAgICAgICAgICAgbGF5ZXJzLmZvckVhY2goKHt0aWxlfSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd21zX3NvdXJjZSA9IHRpbGUuZ2V0U291cmNlKClcblxuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHdtc19zb3VyY2UuZ2V0RmVhdHVyZUluZm9VcmwoXG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGUsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdXRpb24sXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vJ0lORk9fRk9STUFUJzogJ3RleHQveG1sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8nSU5GT19GT1JNQVQnOiAndGV4dC9odG1sJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0lORk9fRk9STUFUJzogJ2FwcGxpY2F0aW9uL3ZuZC5vZ2MuZ21sJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgICAgIGlmICh1cmwpIHtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xzLm1vZGFsLnNob3dNb2RhbChudWxsLCBmYWxzZSlcblxuICAgICAgICAgICAgICAgICAgICBmZXRjaCh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IFdNU0dldEZlYXR1cmVJbmZvKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlcyA9IHBhcnNlci5yZWFkRmVhdHVyZXModGV4dClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzb3VyY2UgPSBuZXcgVmVjdG9yU291cmNlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZXM6IGZlYXR1cmVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS52ZWN0b3JfbGF5ZXIuc2V0U291cmNlKHNvdXJjZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZlYXR1cmVfaW5mbyA9IGZlYXR1cmVzLm1hcCgoZmVhdHVyZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnZW9tZXRyeV9uYW1lID0gZmVhdHVyZS5nZXRHZW9tZXRyeU5hbWUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZS5nZXRLZXlzKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKGtleSkgPT4ga2V5ICE9IGdlb21ldHJ5X25hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChrZXkpID0+IFtrZXksIGZlYXR1cmUuZ2V0KGtleSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW2ZlYXR1cmUuZ2V0SWQoKSwgdmFsdWVzXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250cm9scy5tb2RhbC5zaG93TW9kYWwoZmVhdHVyZV9pbmZvLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBUT0RPICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdubyBmZWF0dXJlIHVybCcsIHdtc19zb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBoYW5kbGVUb2dnbGUoaWR4KSB7XG4gICAgICAgIGNvbnN0IGxheWVyID0gdGhpcy5zdGF0ZS5sYXllcnNbaWR4XVxuICAgICAgICBsYXllci5zZXRWaXNpYmxlKCFsYXllci5nZXRWaXNpYmxlKCkpXG4gICAgfVxuXG4gICAgaGFuZGxlU2V0Q2VudGVyKGNvb3JkKSB7XG5cbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMubWFwLmdldFZpZXcoKVxuICAgICAgICBjb25zdCBtYXBfcHJvamVjdGlvbiA9IHZpZXcuZ2V0UHJvamVjdGlvbigpXG4gICAgICAgIGNvbnN0IG1hcF9jb29yZCA9IHRyYW5zZm9ybUNvb3JkaW5hdGUoY29vcmQsIHRoaXMuc3RhdGUucHJvamVjdGlvbl9kaXNwbGF5LCBtYXBfcHJvamVjdGlvbilcbiAgICAgICAgdGhpcy5tYXJrZXIucG9pbnQuc2V0Q29vcmRpbmF0ZXMobWFwX2Nvb3JkKVxuICAgICAgICB2aWV3LnNldENlbnRlcihtYXBfY29vcmQpXG4gICAgfVxuXG4gICAgdG9nZ2xlU2lkZWJhcihldmVudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgaXNfc2lkZWJhcl9vcGVuOiAhcHJldlN0YXRlLmlzX3NpZGViYXJfb3BlbixcbiAgICAgICAgfSkpXG4gICAgICAgIGlmKHRoaXMuc3RhdGUuaXNfc2lkZWJhcl9vcGVuKXtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMuc2lkZWJhci5zaG93U2lkZUJhcihudWxsLCBudWxsLCB0cnVlKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbHMuc2lkZWJhci5zaG93U2lkZUJhcih0aGlzLnN0YXRlLm1hcF93bXNfbGlzdCwgdGhpcy5oYW5kbGVTZXRDZW50ZXIsIGZhbHNlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlRHJhd2VkKGV2ZW50KXtcbiAgICAgICAgY29uc3QgcHJvamVjdGlvbiA9IHRoaXMubWFwLmdldFZpZXcoKS5nZXRQcm9qZWN0aW9uKClcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ID0gZXZlbnQuZmVhdHVyZS5nZXRHZW9tZXRyeSgpLmdldENvb3JkaW5hdGVzKClcblxuICAgICAgICBjb25zdCBjb29kcmluYXRMZWZ0VG9wID0gY29vcmRpbmF0WzBdWzNdXG4gICAgICAgIGNvbnN0IGNvb2RyaW5hdExlZnRUb3BfbWFwX2Nvb3JkID0gdHJhbnNmb3JtQ29vcmRpbmF0ZShjb29kcmluYXRMZWZ0VG9wLCBwcm9qZWN0aW9uLCB0aGlzLnN0YXRlLnByb2plY3Rpb25fZGlzcGxheSlcbiAgICAgICAgY29uc3QgY29vZHJpbmF0TGVmdFRvcEZvcm1hdCA9IGNvb3JkaW5hdGVGb3JtYXQoY29vZHJpbmF0TGVmdFRvcF9tYXBfY29vcmQsICd7eX0se3h9JywgNilcblxuICAgICAgICBjb25zdCBjb29kcmluYXRSaWdodEJvdHRvbSA9IGNvb3JkaW5hdFswXVsxXVxuICAgICAgICBjb25zdCBjb29kcmluYXRSaWdodEJvdHRvbV9tYXBfY29vcmQgPSB0cmFuc2Zvcm1Db29yZGluYXRlKGNvb2RyaW5hdFJpZ2h0Qm90dG9tLCBwcm9qZWN0aW9uLCB0aGlzLnN0YXRlLnByb2plY3Rpb25fZGlzcGxheSlcbiAgICAgICAgY29uc3QgY29vZHJpbmF0UmlnaHRCb3R0b21Gb3JtYXQgPSBjb29yZGluYXRlRm9ybWF0KGNvb2RyaW5hdFJpZ2h0Qm90dG9tX21hcF9jb29yZCwgJ3t5fSx7eH0nLCA2KVxuXG4gICAgICAgIHRoaXMuY29udHJvbHMuZHJhd01vZGFsLnNob3dNb2RhbChjb29kcmluYXRMZWZ0VG9wX21hcF9jb29yZCwgY29vZHJpbmF0UmlnaHRCb3R0b21fbWFwX2Nvb3JkKVxuICAgIH1cblxuICAgIHRvZ2dsZURyYXdSZW1vdmUoKXtcbiAgICAgICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLnN0YXRlLnNvdXJjZV9kcmF3LmdldEZlYXR1cmVzKCk7XG4gICAgICAgIGlmKGZlYXR1cmVzLmxlbmd0aCA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IGxhc3RGZWF0dXJlID0gZmVhdHVyZXNbZmVhdHVyZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNvdXJjZV9kcmF3LnJlbW92ZUZlYXR1cmUobGFzdEZlYXR1cmUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlRHJhdygpIHtcblxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgICAgaXNfZHJhd19vcGVuOiAhcHJldlN0YXRlLmlzX2RyYXdfb3BlbixcbiAgICAgICAgfSkpXG5cbiAgICAgICAgaWYodGhpcy5zdGF0ZS5pc19kcmF3X29wZW4pe1xuICAgICAgICAgICAgY29uc3Qgc291cmNlX2RyYXcgPSBuZXcgVmVjdG9yU291cmNlKClcblxuICAgICAgICAgICAgY29uc3QgZHJhd19sYXllciA9IG5ldyBWZWN0b3JMYXllcih7XG4gICAgICAgICAgICAgICAgc291cmNlOiBzb3VyY2VfZHJhd1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c291cmNlX2RyYXd9KVxuXG4gICAgICAgICAgICBjb25zdCBkcmF3ID0gbmV3IERyYXcoe1xuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zdGF0ZS5zb3VyY2VfZHJhdyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnQ2lyY2xlJyxcbiAgICAgICAgICAgICAgICBnZW9tZXRyeUZ1bmN0aW9uOiBjcmVhdGVCb3goKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhdywgZHJhd19sYXllcn0pXG4gICAgICAgICAgICB0aGlzLm1hcC5hZGRMYXllcihkcmF3X2xheWVyKTtcbiAgICAgICAgICAgIHRoaXMubWFwLmFkZEludGVyYWN0aW9uKGRyYXcpO1xuICAgICAgICAgICAgZHJhdy5vbignZHJhd2VuZCcsIHRoaXMudG9nZ2xlRHJhd2VkKVxuICAgICAgICAgICAgZHJhdy5vbignZHJhd3N0YXJ0JywgdGhpcy50b2dnbGVEcmF3UmVtb3ZlKVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB0aGlzLm1hcC5yZW1vdmVJbnRlcmFjdGlvbih0aGlzLnN0YXRlLmRyYXcpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVEcmF3UmVtb3ZlKClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtMTJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwi8J+MjVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJtYXBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgRnJhZ21lbnQgfSBmcm9tIFwicmVhY3RcIlxuXG5pbXBvcnQge2hlbHBlcnN9IGZyb20gJy4uLy4uL2hlbHBlcnMnXG5pbXBvcnQgV01TSXRlbSBmcm9tICcuL1dNU0l0ZW0nXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHtDb250cm9sfSBmcm9tICdvbC9jb250cm9sJ1xuaW1wb3J0IHtDTEFTU19DT05UUk9MLCBDTEFTU19ISURERU59IGZyb20gJ29sL2Nzcy5qcydcblxuXG5jbGFzcyBTaWRlYmFyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG5cbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGU6ICcnLFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oYW5kbGVTdWJtaXRDb29yZGluYXRlID0gdGhpcy5oYW5kbGVTdWJtaXRDb29yZGluYXRlLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICBoYW5kbGVTdWJtaXRDb29yZGluYXRlKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgY29uc3QgY29vcmQgPSBoZWxwZXJzLnBhcnNlQ29vcmRpbmF0ZVN0cmluZyh0aGlzLnN0YXRlLmNvb3JkaW5hdGUpXG4gICAgICAgIHRoaXMucHJvcHMuaGFuZGxlU2V0Q2VudGVyKGNvb3JkKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJmb250LXdlaWdodC1ib2xkXCIgaHRtbEZvcj1cImZvcm1Hcm91cElucHV0XCI+0J3RjdGA0Y3Qu9Cx0Y3RgNGN0Y3RgCDRhdCw0LnRhTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgbWItM1wiPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cItGF0LDQudGFINGD0YLQs9CwXCIgYXJpYS1sYWJlbD1cIlwiIGFyaWEtZGVzY3JpYmVkYnk9XCJcIi8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGdwLW91dGxpbmUtcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIj48aSBjbGFzc05hbWU9XCJmYSBmYS1zZWFyY2ggbXItMVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT7QpdCw0LnRhTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGZvcm0gb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0Q29vcmRpbmF0ZX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZvbnQtd2VpZ2h0LWJvbGRcIiBodG1sRm9yPVwiZm9ybUdyb3VwSW5wdXRcIj7QkdCw0LnRgNC70LDQu9Cw0LDRgCDRhdCw0LnRhTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIG1iLTNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiBwbGFjZWhvbGRlcj1cItOp0YDQs9Op0YDTqdCzLCDRg9GA0YLRgNCw0LNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwiY29vcmRpbmF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5zZXRTdGF0ZSh7Y29vcmRpbmF0ZTogZS50YXJnZXQudmFsdWV9KSB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmNvb3JkaW5hdGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFwcGVuZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBncC1vdXRsaW5lLXByaW1hcnlcIiB0eXBlPVwic3VibWl0XCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtc2VhcmNoIG1yLTFcIj48L2k+0KXQsNC50YU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Zvcm0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMubWFwX3dtc19saXN0Lm1hcCgod21zLCBpZHgpID0+XG4gICAgICAgICAgICAgICAgICAgIDxXTVNJdGVtIHdtcz17d21zfSBrZXk9e2lkeH0vPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9XG5cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gZmFsc2VcbiAgICAgICAgY29uc3QgY3NzQ2xhc3NlcyA9IGBjb2wtbWQtMiDimpkgICR7Q0xBU1NfSElEREVOfWBcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudCA9IHRoaXMucmVuZGVyQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sID0gdGhpcy50b2dnbGVDb250cm9sLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0b2dnbGVDb250cm9sKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfSElEREVOLCBpc192aXNpYmxlKVxuXG4gICAgfVxuXG4gICAgcmVuZGVyQ29tcG9uZW50KHByb3BzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcig8U2lkZWJhckNvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgUmVhY3RET00uaHlkcmF0ZSg8U2lkZWJhckNvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICB9XG5cbiAgICBzaG93U2lkZUJhcihtYXBfd21zX2xpc3QsIGhhbmRsZVNldENlbnRlciwgaXNsYW9kKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbChpc2xhb2QpXG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHttYXBfd21zX2xpc3QsIGhhbmRsZVNldENlbnRlcn0pXG4gICAgfVxuXG59XG4iLCJpbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5cblxuZXhwb3J0IGNsYXNzIFNpZGViYXJCdXR0b24gZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9XG5cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG5cbiAgICAgICAgY29uc3QgY3NzQ2xhc3NlcyA9ICfimpktdG9nZ2xlJ1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICBjb25zdCBlbGVtZW50YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICBlbGVtZW50YS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpXG5cbiAgICAgICAgY29uc3QgZWxlbWVudGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgICAgICAgZWxlbWVudGkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgICAgZWxlbWVudGkuY2xhc3NOYW1lID0gJ2ZhIGZhLWJhcnMgZmEtbGcnXG4gICAgICAgIGVsZW1lbnRhLmFwcGVuZENoaWxkKGVsZW1lbnRpKVxuXG4gICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIG9wdGlvbnMudG9nZ2xlU2lkZWJhcigpXG4gICAgICAgIH0pXG4gICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudGEpXG5cbiAgICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5cbmltcG9ydCBXTVNMYXllckl0ZW1zIGZyb20gXCIuL1dNU0xheWVySXRlbXNcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdNU0l0ZW0gZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLndtcy5uYW1lLFxuICAgICAgICAgICAgdGlsZXM6IHByb3BzLndtcy50aWxlcyxcbiAgICAgICAgICAgIGxheWVyczogcHJvcHMud21zLmxheWVycyxcbiAgICAgICAgICAgIGlzX3Zpc2libGU6IHRydWUsXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRvZ2dsZSA9IHRoaXMudG9nZ2xlLmJpbmQodGhpcylcblxuICAgIH1cblxuICAgIHRvZ2dsZShlKSB7XG4gICAgICAgIGNvbnN0IGlzX3Zpc2libGUgPSBlLnRhcmdldC5jaGVja2VkXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzX3Zpc2libGV9KVxuICAgICAgICB0aGlzLnN0YXRlLnRpbGUuc2V0VmlzaWJsZShpc192aXNpYmxlKVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcblxuICAgICAgICBjb25zdCB7dGlsZXMsIG5hbWUsIGxheWVycywgaXNfdmlzaWJsZX0gPSB0aGlzLnN0YXRlXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RnJhZ21lbnQ+XG5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJteS0xXCI+XG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb250LXdlaWdodC1ib2xkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnRvZ2dsZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkPXtpc192aXNpYmxlfVxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZvbnQtd2VpZ2h0LWJvbGRcIiBodG1sRm9yPVwiZm9ybUdyb3VwSW5wdXRcIj4mbmJzcDt7bmFtZX08L2xhYmVsPlxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8V01TTGF5ZXJJdGVtc1xuICAgICAgICAgICAgICAgICAgICBsYXllcnM9e2xheWVyc31cbiAgICAgICAgICAgICAgICAgICAgdGlsZVdNUz17dGlsZXN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgIClcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV01TTGF5ZXJJdGVtIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wcy5sYXllci5uYW1lLFxuICAgICAgICAgICAgY29kZTogcHJvcHMubGF5ZXIuY29kZSxcbiAgICAgICAgICAgIHRpbGU6IHByb3BzLmxheWVyLnRpbGUsXG4gICAgICAgICAgICBpc192aXNpYmxlOiBwcm9wcy5sYXllci5kZWZhdWx0Q2hlY2ssXG4gICAgICAgICAgICBsZWdlbmRVUkw6IHByb3BzLmxheWVyLmxlZ2VuZFVSTCxcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9nZ2xlID0gdGhpcy50b2dnbGUuYmluZCh0aGlzKVxuICAgIH1cbiAgICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgICAgICB0aGlzLnN0YXRlLnRpbGUuc2V0VmlzaWJsZSh0aGlzLnByb3BzLmxheWVyLmRlZmF1bHRDaGVjaylcbiAgICB9XG4gICAgdG9nZ2xlKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZS50aWxlLnNldFZpc2libGUoaXNfdmlzaWJsZSlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNfdmlzaWJsZX0pXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgY29kZSwgaXNfdmlzaWJsZSwgbGVnZW5kVVJMIH0gPSB0aGlzLnN0YXRlXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMudG9nZ2xlKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17aXNfdmlzaWJsZX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGE+IHtuYW1lfTwvYT5cbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgIHtsZWdlbmRVUkwgIT0gXCJudWxsXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nXCIgc3JjPXtsZWdlbmRVUkx9Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgKVxuICAgIH1cbn1cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IFdNU0xheWVySXRlbSBmcm9tIFwiLi9XTVNMYXllckl0ZW1cIlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdNU0xheWVySXRlbXMgZXh0ZW5kcyBDb21wb25lbnQge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgc3VwZXIocHJvcHMpXG5cbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgICAgIGxheWVyczogcHJvcHMubGF5ZXJzLFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsIHN0eWxlPXt7bGlzdFN0eWxlOiAnbm9uZSd9fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5sYXllcnMubWFwKChsYXllciwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICA8V01TTGF5ZXJJdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e2lkeH1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7Q29udHJvbH0gZnJvbSAnb2wvY29udHJvbCdcbmltcG9ydCB7Q0xBU1NfQ09OVFJPTCwgQ0xBU1NfSElEREVOfSBmcm9tICdvbC9jc3MuanMnXG5cblxuY2xhc3MgQ29weUlucHV0IGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuICAgICAgICB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQgPSB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQuYmluZCh0aGlzKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICB0aGlzLmhhbmRsZUNvb3JkaW5hdGVTZXQoKVxuICAgIH1cblxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDb29yZGluYXRlU2V0KClcbiAgICB9XG5cbiAgICBoYW5kbGVDb29yZGluYXRlU2V0KCkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpXG4gICAgICAgIGlucHV0LmZvY3VzKClcbiAgICAgICAgaW5wdXQuc2VsZWN0KClcbiAgICB9XG5cbiAgICByZW5kZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KCkgPT4ge319XG4gICAgICAgICAgICAgICAgb25CbHVyPXt0aGlzLnByb3BzLmhhbmRsZUJsdXJ9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3RoaXMucHJvcHMuY29vcmRpbmF0ZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIClcblxuICAgIH1cblxufVxuXG5cbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlQ29weSBleHRlbmRzIENvbnRyb2wge1xuXG4gICAgY29uc3RydWN0b3Iob3B0X29wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gb3B0X29wdGlvbnMgfHwge31cblxuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHRhcmdldDogb3B0aW9ucy50YXJnZXQsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICAgICAgIGNvbnN0IGNzc0NsYXNzZXMgPSBgY29vcmRpbmF0ZS1jb3B5LWNvbnRyb2wgJHtDTEFTU19DT05UUk9MfSAke0NMQVNTX0hJRERFTn1gXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSBjc3NDbGFzc2VzXG5cbiAgICAgICAgdGhpcy5yZW5kZXJDb21wb25lbnQgPSB0aGlzLnJlbmRlckNvbXBvbmVudC5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMudG9nZ2xlQ29udHJvbCA9IHRoaXMudG9nZ2xlQ29udHJvbC5iaW5kKHRoaXMpXG5cbiAgICB9XG5cbiAgICB0b2dnbGVDb250cm9sKGlzX3Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfSElEREVOLCAhaXNfdmlzaWJsZSlcbiAgICB9XG5cbiAgICByZW5kZXJDb21wb25lbnQocHJvcHMpIHtcblxuICAgICAgICBwcm9wcy5oYW5kbGVCbHVyID0gKCkgPT4gdGhpcy50b2dnbGVDb250cm9sKGZhbHNlKVxuXG4gICAgICAgIGlmICghdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcig8Q29weUlucHV0IHsuLi5wcm9wc30vPiwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBSZWFjdERPTS5oeWRyYXRlKDxDb3B5SW5wdXQgey4uLnByb3BzfS8+LCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuXG4gICAgc2V0Q29vcmRpbmF0ZShjb29yZGluYXRlKSB7XG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHtjb29yZGluYXRlfSlcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sKHRydWUpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gXCJyZWFjdFwiXG5pbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHtDTEFTU19DT05UUk9MLCBDTEFTU19ISURERU59IGZyb20gJ29sL2Nzcy5qcydcblxuXG5cblxuXG5leHBvcnQgY2xhc3MgRHJhd0J1dHRvbiBleHRlbmRzIENvbnRyb2wge1xuXG4gICAgY29uc3RydWN0b3Iob3B0X29wdGlvbnMpIHtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gb3B0X29wdGlvbnMgfHwge31cblxuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHRhcmdldDogb3B0aW9ucy50YXJnZXQsXG4gICAgICAgIH0pXG5cblxuICAgICAgICBjb25zdCBjc3NDbGFzc2VzID0gJ2RyYXctYnV0dG9uJ1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICBjb25zdCBlbGVtZW50YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICBlbGVtZW50YS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpXG5cbiAgICAgICAgY29uc3QgZWxlbWVudGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgICAgICAgZWxlbWVudGkuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJylcbiAgICAgICAgZWxlbWVudGkuY2xhc3NOYW1lID0gJ2ZhIGZhLW9iamVjdC11bmdyb3VwJ1xuICAgICAgICBlbGVtZW50YS5hcHBlbmRDaGlsZChlbGVtZW50aSlcblxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICBvcHRpb25zLnRvZ2dsZURyYXcoKVxuICAgICAgICB9KVxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGVsZW1lbnRhKVxuXG4gICAgfVxuXG5cbn1cbiIsImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSBcInJlYWN0XCJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5pbXBvcnQge3NlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2UnXG5cbmNsYXNzIE1vZGFsQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50e1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcylcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcHJpY2U6IDMwMDAsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ9CT0LDQt9GA0YvQvSDQsdKv0YDRhdGN0LLRhywg0LPQsNC30LDRgCDQsNGI0LjQs9C70LDQu9GCJyxcbiAgICAgICAgICAgIHBheUxvYWQ6IGZhbHNlLFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYW5kbGVQYXltZW50KCl7XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7cGF5TG9hZDogdHJ1ZX0pXG4gICAgICAgIGNvbnN0IHtwcmljZSwgZGVzY3JpcHRpb259ID0gdGhpcy5zdGF0ZVxuICAgICAgICBjb25zdCB7Y29vZHJpbmF0TGVmdFRvcCwgY29vZHJpbmF0UmlnaHRCb3R0b219ID0gdGhpcy5wcm9wc1xuICAgICAgICBzZXJ2aWNlLnBheW1lbnREcmF3KHByaWNlLCBkZXNjcmlwdGlvbiwgY29vZHJpbmF0TGVmdFRvcCwgY29vZHJpbmF0UmlnaHRCb3R0b20pLnRoZW4oKHsgcGF5bWVudF9pZCB9KSA9PiB7XG4gICAgICAgICAgICBpZihwYXltZW50X2lkKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9YC9wYXltZW50L3B1cmNoYXNlLyR7cGF5bWVudF9pZH0vYDtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge3BheUxvYWR9ID0gdGhpcy5zdGF0ZVxuICAgICAgICBjb25zdCB7IGNvb2RyaW5hdExlZnRUb3AsIGNvb2RyaW5hdFJpZ2h0Qm90dG9tfSA9IHRoaXMucHJvcHNcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlXCIgc3R5bGU9e3t6SW5kZXg6XCI1XCJ9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhhbmRsZUNsb3NlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPtCU0Y3Qu9Cz0Y3RgNGN0L3Qs9Kv0Lkg0LzRjdC00Y3RjdC70Y3QuzwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5uZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlggPSB7Y29vZHJpbmF0TGVmdFRvcFswXX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlkgPSB7Y29vZHJpbmF0TGVmdFRvcFsxXX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlggPSB7Y29vZHJpbmF0UmlnaHRCb3R0b21bMF19PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5ZID0ge2Nvb2RyaW5hdFJpZ2h0Qm90dG9tWzFdfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5oYW5kbGVDbG9zZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPtCR0YPRhtCw0YU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlUGF5bWVudCgpfSBjbGFzc05hbWU9XCJidG4gYnRuLXNlY29uZGFyeVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+0KXRg9C00LDQu9C00LDQtiDQsNCy0LDRhTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgRHJhd1BheU1vZGFsIGV4dGVuZHMgQ29udHJvbCB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRfb3B0aW9ucykge1xuXG4gICAgICBjb25zdCBvcHRpb25zID0gb3B0X29wdGlvbnMgfHwge31cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmxvZyhvcHRpb25zKVxuXG4gICAgICAgIHRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkID0gZmFsc2VcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gJ21vZGFsIGZhZGUgc2hvdydcblxuICAgICAgICB0aGlzLnJlbmRlckNvbXBvbmVudCA9IHRoaXMucmVuZGVyQ29tcG9uZW50LmJpbmQodGhpcylcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sID0gdGhpcy50b2dnbGVDb250cm9sLmJpbmQodGhpcylcbiAgICB9XG5cbiAgICB0b2dnbGVDb250cm9sKGlzX3Zpc2libGUpIHtcblxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZC1ibG9jaycsIGlzX3Zpc2libGUpXG5cbiAgICB9XG5cbiAgICByZW5kZXJDb21wb25lbnQocHJvcHMpIHtcblxuICAgICAgICBwcm9wcy5oYW5kbGVDbG9zZSA9ICgpID0+IHRoaXMudG9nZ2xlQ29udHJvbChmYWxzZSlcblxuICAgICAgICBpZiAoIXRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoPE1vZGFsQ29tcG9uZW50IHsuLi5wcm9wc30vPiwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBSZWFjdERPTS5oeWRyYXRlKDxNb2RhbENvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICB9XG5cbiAgICBzaG93TW9kYWwoY29vZHJpbmF0TGVmdFRvcCwgY29vZHJpbmF0UmlnaHRCb3R0b20pIHtcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sKHRydWUpXG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHtjb29kcmluYXRMZWZ0VG9wLCBjb29kcmluYXRSaWdodEJvdHRvbX0pXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSBcInJlYWN0XCJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQge0NvbnRyb2x9IGZyb20gJ29sL2NvbnRyb2wnXG5pbXBvcnQge3NlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2UnXG5cbmNsYXNzIE1vZGFsQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50e1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcylcblxuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgcHJpY2U6IDMwMDAsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ9CT0LDQt9GA0YvQvSDQsdKv0YDRhdGN0LLRhywg0LPQsNC30LDRgCDQsNGI0LjQs9C70LDQu9GCJyxcbiAgICAgICAgICAgIHBheWxvYWQ6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YV9pZDogMixcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFuZGxlUGF5bWVudCgpe1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtwYXlsb2FkOiB0cnVlfSlcbiAgICAgICAgY29uc3Qge3ByaWNlLCBkZXNjcmlwdGlvbiwgZGF0YV9pZH0gPSB0aGlzLnN0YXRlXG4gICAgICAgIHNlcnZpY2UucGF5bWVudChwcmljZSwgZGVzY3JpcHRpb24sIGRhdGFfaWQpLnRoZW4oKHsgcGF5bWVudF9pZCB9KSA9PiB7XG4gICAgICAgICAgICBpZihwYXltZW50X2lkKXtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9YC9wYXltZW50L3B1cmNoYXNlLyR7cGF5bWVudF9pZH0vYDtcbiAgICAgICAgICAgICAgICB9LCAxMDAwKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHsgY29udGVudCwgaXNfY29tcGxldGUgfSA9IHRoaXMucHJvcHNcbiAgICAgICAgY29uc3QgeyBwYXlsb2FkIH0gPSB0aGlzLnN0YXRlXG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZGlhbG9nIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlXCIgc3R5bGU9e3t6SW5kZXg6XCI1XCJ9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1oZWFkZXJcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmhhbmRsZUNsb3NlfT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJtb2RhbC10aXRsZVwiPtCU0Y3Qu9Cz0Y3RgNGN0L3Qs9Kv0Lkg0LzRjdC00Y3RjdC70Y3QuzwvaDU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7IWlzX2NvbXBsZXRlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkLWZsZXggYWxpZ24taXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzdHJvbmc+0KLSr9GAINGF0q/Qu9GN0Y3QvdGNINKv0q8uLi48L3N0cm9uZz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGlubmVyLWJvcmRlciBtbC1hdXRvXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAge2lzX2NvbXBsZXRlICYmIGNvbnRlbnQubWFwKChbbGF5ZXJfbmFtZSwgdmFsdWVzXSwgaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpZHh9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDY+e2xheWVyX25hbWV9PC9oNj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInRhYmxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3ZhbHVlcy5tYXAoKFtmaWVsZCwgdmFsdWVdLCB2YWxfaWR4KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXt2YWxfaWR4fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD57ZmllbGR9PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57dmFsdWV9PC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWZvb3RlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5wcm9wcy5oYW5kbGVDbG9zZX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPtCR0YPRhtCw0YU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtwYXlsb2FkID9cbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tc2Vjb25kYXJ5XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICDQkNGH0LDQsNC70LvQsNC2INCx0LDQudC90LAuLi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHRleHQtbGlnaHRcIiByb2xlPVwic3RhdHVzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiPkxvYWRpbmcuLi48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVBheW1lbnQoKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPtCl0YPQtNCw0LvQtNCw0LYg0LDQstCw0YU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApXG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW9kYWwgZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBvcHRfb3B0aW9ucyB8fCB7fVxuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICBlbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgICAgICAgIHRhcmdldDogb3B0aW9ucy50YXJnZXQsXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSBmYWxzZVxuXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSAnbW9kYWwgZmFkZSBzaG93J1xuXG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50ID0gdGhpcy5yZW5kZXJDb21wb25lbnQuYmluZCh0aGlzKVxuICAgICAgICB0aGlzLnRvZ2dsZUNvbnRyb2wgPSB0aGlzLnRvZ2dsZUNvbnRyb2wuYmluZCh0aGlzKVxuXG4gICAgfVxuXG4gICAgdG9nZ2xlQ29udHJvbChpc192aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdkLWJsb2NrJywgaXNfdmlzaWJsZSlcbiAgICB9XG5cbiAgICByZW5kZXJDb21wb25lbnQocHJvcHMpIHtcblxuICAgICAgICBwcm9wcy5oYW5kbGVDbG9zZSA9ICgpID0+IHRoaXMudG9nZ2xlQ29udHJvbChmYWxzZSlcblxuICAgICAgICBpZiAoIXRoaXMuaXNfY29tcG9uZW50X2luaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoPE1vZGFsQ29tcG9uZW50IHsuLi5wcm9wc30vPiwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5pc19jb21wb25lbnRfaW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICBSZWFjdERPTS5oeWRyYXRlKDxNb2RhbENvbXBvbmVudCB7Li4ucHJvcHN9Lz4sIHRoaXMuZWxlbWVudClcbiAgICB9XG5cbiAgICBzaG93TW9kYWwoY29udGVudCwgaXNfY29tcGxldGUpIHtcbiAgICAgICAgdGhpcy50b2dnbGVDb250cm9sKHRydWUpXG4gICAgICAgIHRoaXMucmVuZGVyQ29tcG9uZW50KHtjb250ZW50LCBpc19jb21wbGV0ZX0pXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSBcInJlYWN0XCJcbmltcG9ydCB7Q29udHJvbH0gZnJvbSAnb2wvY29udHJvbCdcbmltcG9ydCB7Q0xBU1NfQ09OVFJPTCwgQ0xBU1NfVU5TRUxFQ1RBQkxFfSBmcm9tICdvbC9jc3MuanMnXG5cblxuY29uc3QgQ0xBU1NfQUNUSVZFID0gJ2FjdGl2ZSdcblxuXG5leHBvcnQgY2xhc3Mg0KHRg9GD0YDRjNCU0LDQstGF0LDRgNCz0LAgZXh0ZW5kcyBDb250cm9sIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdF9vcHRpb25zKSB7XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9XG5cbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICB0YXJnZXQ6IG9wdGlvbnMudGFyZ2V0LFxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMudG9nZ2xlTGF5ZXIgPSB0aGlzLnRvZ2dsZUxheWVyLmJpbmQodGhpcylcbiAgICAgICAgdGhpcy5pbml0TGF5ZXIgPSB0aGlzLmluaXRMYXllci5iaW5kKHRoaXMpXG4gICAgICAgIHRoaXMuaGFuZGxlQ2xpY2sgPSB0aGlzLmhhbmRsZUNsaWNrLmJpbmQodGhpcylcblxuICAgICAgICB0aGlzLmxhc3RfYWN0aXZlID0gbnVsbFxuXG4gICAgICAgIGNvbnN0IGJhc2VfbGF5ZXJzID0gb3B0aW9ucy5sYXllcnMubWFwKHRoaXMuaW5pdExheWVyKVxuXG4gICAgICAgIGNvbnN0IGNzc0NsYXNzZXMgPSBg0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9GD0YPQtCAke0NMQVNTX1VOU0VMRUNUQUJMRX0gJHtDTEFTU19DT05UUk9MfWBcblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50XG4gICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY3NzQ2xhc3Nlc1xuICAgICAgICBiYXNlX2xheWVycy5mb3JFYWNoKChsKSA9PiBlbGVtZW50LmFwcGVuZENoaWxkKGwpKVxuXG4gICAgfVxuXG4gICAgaW5pdExheWVyKHt0aHVtYm5haWxfMXgsIHRodW1ibmFpbF8yeCwgbGF5ZXIsIGlzX2FjdGl2ZX0pIHtcblxuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnIycpXG4gICAgICAgIGVsLmNsYXNzTmFtZSA9ICfRgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LAnICsgKGlzX2FjdGl2ZSA/ICcgJyArIENMQVNTX0FDVElWRSA6ICcnKVxuXG4gICAgICAgIGNvbnN0IGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICAgIGltZy5zcmNzZXQgPSBgJHt0aHVtYm5haWxfMXh9IDF4LCAke3RodW1ibmFpbF8yeH0gMnhgXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGltZylcblxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDbGljayhlbCwgbGF5ZXIpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy50b2dnbGVMYXllcihpc19hY3RpdmUgPT09IHRydWUsIGVsLCBsYXllcilcblxuICAgICAgICByZXR1cm4gZWxcblxuICAgIH1cblxuICAgIHRvZ2dsZUxheWVyKGlzX2FjdGl2ZSwgZWwsIGxheWVyKSB7XG5cbiAgICAgICAgaWYgKHRoaXMubGFzdF9hY3RpdmUgJiYgaXNfYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RfYWN0aXZlLmxheWVyLnNldFZpc2libGUoZmFsc2UpXG4gICAgICAgICAgICB0aGlzLmxhc3RfYWN0aXZlLmVsLmNsYXNzTGlzdC50b2dnbGUoQ0xBU1NfQUNUSVZFLCBmYWxzZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGxheWVyLnNldFZpc2libGUoaXNfYWN0aXZlKVxuICAgICAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKENMQVNTX0FDVElWRSwgaXNfYWN0aXZlKVxuXG4gICAgICAgIGlmIChpc19hY3RpdmUpXG4gICAgICAgICAgICB0aGlzLmxhc3RfYWN0aXZlID0ge2VsLCBsYXllcn1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayhlbCwgbGF5ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdF9hY3RpdmUgJiYgdGhpcy5sYXN0X2FjdGl2ZS5lbCA9PT0gZWwpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdGhpcy50b2dnbGVMYXllcih0cnVlLCBlbCwgbGF5ZXIpXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSBcInJlYWN0XCJcblxuaW1wb3J0IHtzZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2UnXG5pbXBvcnQgQnVuZGxlTWFwIGZyb20gJy4vQnVuZGxlTWFwJ1xuXG5cbmV4cG9ydCBjbGFzcyBEZXRhaWxQYWdlIGV4dGVuZHMgQ29tcG9uZW50IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgIHN1cGVyKHByb3BzKVxuXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBidW5kbGU6IHByb3BzLmJ1bmRsZSxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVNlbGVjdEJ1bmRsZShlLCBidW5kbGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2J1bmRsZX0pXG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEJ1bmRsZU1hcCBidW5kbGU9e3RoaXMuc3RhdGUuYnVuZGxlfS8+XG4gICAgICAgIClcbiAgICB9XG59XG4iLCJleHBvcnQgY29uc3Qgc2VydmljZSA9IHtcbiAgICBsb2FkV01TTGF5ZXJzLFxuICAgIGxvYWRCYXNlTGF5ZXJzLFxuICAgIHBheW1lbnQsXG4gICAgcGF5bWVudERyYXdcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBjb29raWVzW2ldLnRyaW0oKTtcbiAgICAgICAgICAgIC8vIERvZXMgdGhpcyBjb29raWUgc3RyaW5nIGJlZ2luIHdpdGggdGhlIG5hbWUgd2Ugd2FudD9cbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVSZXNwb25zZShyZXNwb25zZSkge1xuICAgIHJldHVybiByZXNwb25zZS50ZXh0KCkudGhlbih0ZXh0ID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRleHQgJiYgSlNPTi5wYXJzZSh0ZXh0KVxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICBpZiAoWzQwMSwgNDAzXS5pbmRleE9mKHJlc3BvbnNlLnN0YXR1cykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBhdXRvIGxvZ291dCBpZiA0MDEgVW5hdXRob3JpemVkIG9yIDQwMyBGb3JiaWRkZW4gcmVzcG9uc2UgcmV0dXJuZWQgZnJvbSBhcGlcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQodHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gKGRhdGEgJiYgZGF0YS5tZXNzYWdlKSB8fCByZXNwb25zZS5zdGF0dXNUZXh0XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIF9nZXRHZXRPcHRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdYLVJlcXVlc3RlZC1XaXRoJzogJ1hNTEh0dHBSZXF1ZXN0JyxcbiAgICAgICAgfSxcbiAgICB9XG59XG5cbmZ1bmN0aW9uIF9nZXRQb3N0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ1gtUmVxdWVzdGVkLVdpdGgnOiAnWE1MSHR0cFJlcXVlc3QnLFxuICAgICAgICAgICAgJ1gtQ1NSRlRva2VuJzogZ2V0Q29va2llKCdjc3JmdG9rZW4nKSxcbiAgICAgICAgfSxcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvYWRXTVNMYXllcnMoaWQpIHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgLi4uX2dldEdldE9wdGlvbnMoKSxcbiAgICB9XG4gICAgcmV0dXJuIGZldGNoKGAv0LTRjdC0LdGB0LDQvS8ke2lkfS/QtNCw0LLRhdCw0YDQs9GD0YPQtC9gLCByZXF1ZXN0T3B0aW9ucykudGhlbihoYW5kbGVSZXNwb25zZSlcbn1cblxuZnVuY3Rpb24gbG9hZEJhc2VMYXllcnMoKSB7XG4gICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgIC4uLl9nZXRHZXRPcHRpb25zKCksXG4gICAgfVxuICAgIHJldHVybiBmZXRjaCgnL9GB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPQsC8nLCByZXF1ZXN0T3B0aW9ucykudGhlbihoYW5kbGVSZXNwb25zZSlcbn1cblxuZnVuY3Rpb24gcGF5bWVudChwcmljZSwgZGVzY3JpcHRpb24sIGRhdGFfaWQpIHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgLi4uX2dldFBvc3RPcHRpb25zKCksXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtwcmljZSwgZGVzY3JpcHRpb24sIGRhdGFfaWR9KVxuICAgIH1cbiAgICByZXR1cm4gZmV0Y2goJy9iYWNrL3BheW1lbnQvcHVyY2hhc2UvJywgcmVxdWVzdE9wdGlvbnMpLnRoZW4oaGFuZGxlUmVzcG9uc2UpXG59XG5cbmZ1bmN0aW9uIHBheW1lbnREcmF3KHByaWNlLCBkZXNjcmlwdGlvbiwgY29vZHJpbmF0TGVmdFRvcCwgY29vZHJpbmF0UmlnaHRCb3R0b20pIHtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgICAgLi4uX2dldFBvc3RPcHRpb25zKCksXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtwcmljZSwgZGVzY3JpcHRpb24sIGNvb2RyaW5hdExlZnRUb3AsIGNvb2RyaW5hdFJpZ2h0Qm90dG9tfSlcbiAgICB9XG4gICAgcmV0dXJuIGZldGNoKCcvYmFjay9wYXltZW50L3B1cmNoYXNlLWRyYXcvJywgcmVxdWVzdE9wdGlvbnMpLnRoZW4oaGFuZGxlUmVzcG9uc2UpXG59IiwidmFyIGFwaSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCIpO1xuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIik7XG5cbiAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50Ll9fZXNNb2R1bGUgPyBjb250ZW50LmRlZmF1bHQgOiBjb250ZW50O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbiAgICAgICAgICAgIH1cblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5pbnNlcnQgPSBcImhlYWRcIjtcbm9wdGlvbnMuc2luZ2xldG9uID0gZmFsc2U7XG5cbnZhciB1cGRhdGUgPSBhcGkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsImV4cG9ydCBjb25zdCBoZWxwZXJzID0ge1xuICAgIHBhcnNlQ29vcmRpbmF0ZVN0cmluZyxcbn1cblxuXG5mdW5jdGlvbiBwYXJzZUNvb3JkaW5hdGVTdHJpbmcoY29vcmRpbmF0ZV9zdHJpbmcpIHtcblxuICAgIGNvbnN0IHJlc3VsdCA9IC9eKD88bGF0aXR1ZGU+LT9cXGQrKFxcLlxcZCspPylbLCBdKD88bG9uZ2l0dWRlPi0/XFxkKyhcXC5cXGQrKT8pJC8uZXhlYyhjb29yZGluYXRlX3N0cmluZylcbiAgICBsZXQgW2xhdCwgbG9uXSA9IFswLCAwXVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBsYXQgPSBwYXJzZUZsb2F0KHJlc3VsdC5ncm91cHMubGF0aXR1ZGUpXG4gICAgICAgIGxvbiA9IHBhcnNlRmxvYXQocmVzdWx0Lmdyb3Vwcy5sb25naXR1ZGUpXG4gICAgfVxuXG4gICAgLy8gQWNjb3JkaW5nIHRvIE9wZW5MYXllcnMgdGhlIGZvcm1hdCBpcyBbeCwgeV0gb3IgW2xvbmdpdHVkZSwgbGF0aXR1ZGVdXG4gICAgcmV0dXJuIFtsb24sIGxhdF1cbn1cbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7cmVuZGVyfSBmcm9tICdyZWFjdC1kb20nXG5cbmltcG9ydCB7QXBwfSBmcm9tICcuL2NvbXBvbmVudHMvQXBwJ1xuXG5jb25zdCBidW5kbGUgPSBKU09OLnBhcnNlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidW5kbGUtYXBwLWRhdGEnKS5pbm5lckhUTUwpXG5cbnJlbmRlcig8QXBwIGJ1bmRsZT17YnVuZGxlfS8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnVuZGxlLWFwcCcpKVxuIiwiLy8gSW1wb3J0c1xudmFyIF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpO1xuZXhwb3J0cyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhmYWxzZSk7XG4vLyBNb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImVsZW1lbnQuc3R5bGUge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi7wn4yNIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4u8J+MjSA+ICNtYXB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDM3cHggLSA5NnB4IC0gMzMuNXB4IC0gMHB4KTtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbiB9XFxuXFxuLuKamSB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAxJTtcXG4gICAgcmlnaHQ6IDcwcHg7XFxuICAgIGJvdHRvbTogMTUwcHg7XFxuICAgIHBhZGRpbmctdG9wOiAxcmVtO1xcbiAgICBwYWRkaW5nLWJvdHRvbTogMXJlbTtcXG4gICAgb3ZlcmZsb3cteTogYXV0bztcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IDdweCByZ2JhKDAsMCwwLDAuNjUpO1xcbiAgICAtbW96LWJveC1zaGFkb3c6IDBweCAwcHggMjFweCA3cHggcmdiYSgwLDAsMCwwLjY1KTtcXG4gICAgYm94LXNoYWRvdzogMHB4IDBweCAyMXB4IDdweCByZ2JhKDAsMCwwLDAuNjUpO1xcbiAgICBvcGFjaXR5OiAxO1xcblxcblxcbn1cXG4u4pqZLm9sLWhpZGRlbiB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMXMgbGluZWFyLCB2aXNpYmlsaXR5IDBzIGxpbmVhciAuMXM7XFxufVxcblxcbi7impktdG9nZ2xle1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogN3B4O1xcbiAgICByaWdodDogMTJweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIGhlaWdodDogNTBweDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDYwLDEzNiwwLjUpO1xcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICAgIHBhZGRpbmc6IDJweDtcXG59XFxuLuKamS10b2dnbGU6aG92ZXJ7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCw2MCwxMzYsMC43KTtcXG59XFxuLuKamS10b2dnbGU6Zm9jdXN7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCw2MCwxMzYsMC43KTtcXG5cXG59XFxuXFxuXFxuLuKamS10b2dnbGUgYXtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IC02cHg7XFxuICAgIHJpZ2h0OiAtN3B4O1xcbiAgICB3aWR0aDogNTBweDtcXG4gICAgaGVpZ2h0OiA1MHB4O1xcblxcbn1cXG4uZmEtbGd7XFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXG4gICAgY29sb3I6IHdoaXRlO1xcbiAgICBsaW5lLWhlaWdodDogdW5zZXQ7XFxufVxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0e1xcbiAgICByaWdodDogLjVyZW07XFxuICAgIGJvdHRvbTogNzBweDtcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcbn1cXG4u0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9GD0YPQtCA+IC7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LB7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICB3aWR0aDogOHJlbTtcXG4gICAgaGVpZ2h0OiA0LjVyZW07XFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxuICAgIG1hcmdpbjogMXB4O1xcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XFxuICAgIGZsb2F0OiByaWdodDtcXG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAuMTVzIGVhc2Utb3V0O1xcbn1cXG4u0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9GD0YPQtCA+IC7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0LAuYWN0aXZlLFxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0OmhvdmVyID4gLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPQsC5hY3RpdmU6aG92ZXIsXFxuLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPRg9GD0LQgPiAu0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9CwOmhvdmVyIHtcXG4gICAgb3BhY2l0eTogMTtcXG59XFxuLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPRg9GD0LQgPiAu0YHRg9GD0YDRjC3QtNCw0LLRhdCw0YDQs9CwLFxcbi7RgdGD0YPRgNGMLdC00LDQstGF0LDRgNCz0YPRg9C0OmhvdmVyID4gLtGB0YPRg9GA0Ywt0LTQsNCy0YXQsNGA0LPQsC5hY3RpdmUge1xcbiAgICBvcGFjaXR5OiAuNztcXG59XFxuXFxuXFxuLm9sLWZ1bGwtc2NyZWVuIHtcXG4gICAgcmlnaHQ6IC41cmVtO1xcbiAgICB0b3A6IDU4cHg7XFxuICAgIHdpZHRoOiA1N3B4O1xcbiAgICBoZWlnaHQ6IDU3cHg7XFxuXFxufVxcbi5vbC1mdWxsLXNjcmVlbiAub2wtZnVsbC1zY3JlZW4tZmFsc2V7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXG5cXG59XFxuLm9sLWZ1bGwtc2NyZWVuIC5vbC1mdWxsLXNjcmVlbi10cnVle1xcbiAgICB3aWR0aDogNTBweDtcXG4gICAgaGVpZ2h0OiA1MHB4O1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuXFxufVxcbi5vbC16b29tIHtcXG4gICAgd2lkdGg6IDU3cHg7XFxuICAgIGhlaWdodDogMTA3cHg7XFxuICAgIGxlZnQ6IHVuc2V0O1xcbiAgICByaWdodDogLjVyZW07XFxuICAgIHRvcDogMTEwcHg7XFxufVxcbi5vbC16b29tICAub2wtem9vbS1vdXR7XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNTVweDtcXG5cXG59XFxuLm9sLXpvb20gLm9sLXpvb20taW57XFxuICAgIHdpZHRoOiA1MHB4O1xcbiAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIGZvbnQtc2l6ZTogNTVweDtcXG59XFxuXFxuLm9sLW1vdXNlLXBvc2l0aW9uIHtcXG4gICAgcmlnaHQ6IDRyZW07XFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCw2MCwxMzYsMC4zKTtcXG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xcbiAgICBwYWRkaW5nOiAycHggLjJyZW07XFxuICAgIGZvbnQtc2l6ZTogc21hbGxlcjtcXG4gICAgY29sb3I6ICNlZWU7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gICAgd2lkdGg6IDguOHJlbTtcXG4gICAgbWluLWhlaWdodDogMXJlbTtcXG59XFxuXFxuLmNvb3JkaW5hdGUtY29weS1jb250cm9sIHtcXG4gICAgd2lkdGg6IDEwcmVtO1xcbiAgICBsZWZ0OiAyJTtcXG4gICAgdG9wOiAwLjVyZW07XFxuICAgIG9wYWNpdHk6IDE7XFxufVxcbi5jb29yZGluYXRlLWNvcHktY29udHJvbC5vbC1oaWRkZW4ge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XFxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjI1cyBsaW5lYXIsIHZpc2liaWxpdHkgMHMgbGluZWFyIC4yNXM7XFxufVxcblxcbi5vbC1zY2FsZS1saW5le1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIGJvdHRvbTogNzBweDtcXG59XFxuXFxuXFxuLmRyYXctYnV0dG9uIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB0b3A6IDMwMHB4O1xcbiAgICByaWdodDogMTJweDtcXG4gICAgd2lkdGg6IDUwcHg7XFxuICAgIGhlaWdodDogNTBweDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDYwLDEzNiwwLjUpO1xcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxuICAgIHBhZGRpbmc6IDJweCA1cHg7XFxufVxcbi5kcmF3LWJ1dHRvbjphY3RpdmV7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCw2MCwxMzYsMC45KTtcXG5cXG59XFxuXFxuLmRyYXctYnV0dG9uIC5mYS1vYmplY3QtdW5ncm91cHtcXG4gICAgZm9udC1zaXplOiAzMHB4O1xcbiAgICBjb2xvcjogd2hpdGU7XFxuICAgIGxpbmUtaGVpZ2h0OiB1bnNldDtcXG59XCIsIFwiXCJdKTtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiJdLCJzb3VyY2VSb290IjoiIn0=