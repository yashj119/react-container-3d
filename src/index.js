"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _three = require("three");

var THREE = _interopRequireWildcard(_three);

var _reactSizeme = require("react-sizeme");

var _reactSizeme2 = _interopRequireDefault(_reactSizeme);

var _CSS3DRenderer = require("./CSS3DRenderer");

var CSS3DRenderer = _interopRequireWildcard(_CSS3DRenderer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import OBJLoader from 'three-react-obj-loader';


var OrbitControls = require("react-cubeview/lib/OrbitControls")(THREE);

var renderer = void 0,
    scene = void 0,
    camera = void 0,
    mainSphere = void 0,
    windowSize = {
    width: 0,
    height: 0
},
    animation = void 0,
    controls = void 0;

// for interactive hovering
var mouse = new THREE.Vector2(),
    raycaster = void 0,
    INTERSECTED = void 0;

//for css rendering
var scene2d = void 0,
    canvas2d = void 0;

var Container3d = function (_Component) {
    _inherits(Container3d, _Component);

    function Container3d(props) {
        _classCallCheck(this, Container3d);

        var _this2 = _possibleConstructorReturn(this, (Container3d.__proto__ || Object.getPrototypeOf(Container3d)).call(this, props));

        _this2.onHoverStart = _this2.onHoverStart.bind(_this2);
        _this2.onHoverEnd = _this2.onHoverEnd.bind(_this2);

        _this2.onError = _this2.onError.bind(_this2);
        _this2.onDocumentMouseMove = _this2.onDocumentMouseMove.bind(_this2);
        _this2.clearScene = _this2.clearScene.bind(_this2);
        return _this2;
    }

    _createClass(Container3d, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            if (this.props.relatedCanvas) this.relatedCanvas = this.props.relatedCanvas();

            if (this.props.onUpdateAngles) this.updateAngles = this.props.onUpdateAngles;

            this.init();
            this.updateDimensions();
            window.addEventListener("resize", this.updateDimensions.bind(this));
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            renderer = null;
            scene = null;
            camera = null;
            controls = null;
            window.removeEventListener("mousemove", this.onDocumentMouseMove, false)
            window.removeEventListener("resize", this.updateDimensions.bind(this));
            window.cancelAnimationFrame(animation)
        }

        /**
         * Defines the angles - useful when using OrbitControls from react-cubeview
         * @param {*} phi
         * @param {*} theta
         */

    }, {
        key: "setAngles",
        value: function setAngles(phi, theta) {
            if (controls) {
                controls.setPolarAngle(phi);
                controls.setAzimuthalAngle(theta);
            }
        }
    }, {
        key: "getSize",
        value: function getSize() {
            var _props = this.props,
                width = _props.width,
                percentageWidth = _props.percentageWidth,
                aspect = _props.aspect;

            if (percentageWidth) width = window.innerWidth * parseFloat(percentageWidth) / 100;

            var height = width / aspect;

            height = 200;
            console.log("size", width, height);
            return {
                width: width,
                height: height
            };
        }
    }, {
        key: "getScene",
        value: function getScene() {
            return scene;
        }
    }, {
        key: "getCamera",
        value: function getCamera() {
            return camera;
        }
    }, {
        key: "getRenderer",
        value: function getRenderer() {
            return renderer;
        }
    }, {
        key: "clearScene",
        value: function clearScene() {
            if (scene != undefined) scene.traverse(function (object) {
                scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
                //object.dispose();
            });

            var canvas = this.refs.threeCanvas;
            scene = new THREE.Scene();
            //this._createScene(canvas);
            this.reloadScene();
        }
    }, {
        key: "updateDimensions",
        value: function updateDimensions() {
            //Get the proportions from screen

            var _props2 = this.props,
                width = _props2.width,
                percentageWidth = _props2.percentageWidth,
                aspect = _props2.aspect,
                fitScreen = _props2.fitScreen,
                marginLeft = _props2.marginLeft,
                marginTop = _props2.marginTop,
                marginBottom = _props2.marginBottom,
                height = _props2.height;


            if (percentageWidth) {
                width = parseInt(window.innerWidth * parseInt(percentageWidth) / 100.0);
            }

            if (aspect) {
                height = width / aspect;
            }

            if (fitScreen) {
                height = window.innerHeight;
                if (marginTop) {
                    height = height - marginTop;
                }

                if (marginBottom) {
                    height = height - marginBottom;
                }
            }

            var canvas = this.refs.threeCanvas;

            canvas.height = height;

            renderer.setSize(width, height);

            camera.aspect = width / height;

            camera.updateProjectionMatrix();
        }
    }, {
        key: "init",
        value: function init() {
            //this.props.onHover("hello");
            var _getSize = this.getSize(),
                width = _getSize.width,
                height = _getSize.height;

            var canvas = this.refs.threeCanvas;
            //const canvas2d = this.refs.cssCanvas;

            canvas.height = height;
            var marginTop = this.props.marginTop;

            raycaster = new THREE.Raycaster();
            window.addEventListener("mousemove", this.onDocumentMouseMove, false);

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
            camera.position.set(0, 20, 20);
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: this.props.antialias ? this.props.antialias : true,
                alpha: true,
                opacity: 0.5,
		        preserveDrawingBuffer: true
            });

            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this._createScene(canvas);
            var _this = this;

            this._render = function () {
                //animation = requestAnimationFrame(_this._render);
                setTimeout(function () {
                    animation = requestAnimationFrame(_this._render);
                }, 1000 / 30); //running @ 30FPS

                var _this$props = _this.props,
                    phi = _this$props.phi,
                    theta = _this$props.theta;


                if (phi && theta && controls) {
                    controls.setPolarAngle(phi);
                    controls.setAzimuthalAngle(theta);
                }

                if (_this.props.update) {
                    try {
                        _this.props.update(scene, camera, renderer);
                    } catch (error) {
                        this.onError(error);
                    }
                }

                // find intersections

                if ((_this.props.onHoverStart || _this.props.onHoverEnd) && camera != null) {
                    //console.log("camera is", camera);
                    camera.updateMatrixWorld();

                    raycaster.setFromCamera(mouse, camera);

                    var intersects = raycaster.intersectObjects(scene.children, true);

                    if (intersects.length > 0) {
                        if (INTERSECTED != intersects[0].object) {
                            if (INTERSECTED) {
                                _this.onHoverEnd(INTERSECTED, scene, camera, renderer);
                                INTERSECTED = intersects[0].object;
                                _this.onHoverStart(INTERSECTED, scene, camera, renderer);
                            } else {
                                INTERSECTED = intersects[0].object;
                                _this.onHoverStart(INTERSECTED, scene, camera, renderer);
                            }
                        }
                    } else {
                        if (INTERSECTED) {
                            _this.onHoverEnd(INTERSECTED, scene, camera, renderer);
                            INTERSECTED = null;
                        }
                        INTERSECTED = null;
                    }
                }
                renderer && renderer.render(scene, camera);
            };

            this._render();
        }
    }, {
        key: "getIntersectedObject",
        value: function getIntersectedObject() {
            return INTERSECTED;
        }
    }, {
        key: "onHoverStart",
        value: function onHoverStart(object, scene, camera, renderer) {
            if (this.props) if (this.props.onHoverStart) {
                this.props.onHoverStart(object, scene, camera, renderer);
            }
        }
    }, {
        key: "onHoverEnd",
        value: function onHoverEnd(object, scene, camera, renderer) {
            if (this.props) if (this.props.onHoverEnd) {
                this.props.onHoverEnd(object, scene, camera, renderer);
            }
        }
    }, {
        key: "onHover",
        value: function onHover(object) {
            if (this.props) if (this.props.onHover) {
                this.props.onHover(object);
            }
        }
    }, {
        key: "setAngles",
        value: function setAngles(phi, theta) {
            //console.log(phi, theta);
            if (controls) {
                controls.setPolarAngle(phi);
                controls.setAzimuthalAngle(theta);
            }
        }
    }, {
        key: "reloadScene",
        value: function reloadScene(newScene) {
            if (newScene) scene = newScene;else scene = new THREE.Scene();

            var _props3 = this.props,
                addControls = _props3.addControls,
                addGrid = _props3.addGrid,
                addLight = _props3.addLight,
                enableZoom = _props3.enableZoom,
                enableKeys = _props3.enableKeys,
                enablePan = _props3.enablePan;


            if (addGrid ? addGrid : false) {
                var gridXZ = new THREE.GridHelper(20, 20);
                gridXZ.name = "grid";
                scene.add(gridXZ);

                var planeGeometry = new THREE.PlaneGeometry(20, 20);
                planeGeometry.rotateX(-Math.PI / 2);
                var planeMaterial = new THREE.ShadowMaterial({
                    opacity: 0.4
                });
                var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true;
                scene.add(plane);
            }

            if (addLight != undefined ? addLight : false) {
                scene.add(new THREE.AmbientLight(0xf0f0f0));
                var light = new THREE.SpotLight(0xffffff, 1.5);
                light.position.set(50, 50, 50);
                light.castShadow = true;
                light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 10, 1000));

                light.shadow.bias = -0.000222;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                scene.add(light);
            }

            if (addControls) {
                var rootDiv = this.refs.rootthree;

                //if (this.relatedCanvas) rootDiv = this.relatedCanvas;

                if (this.updateAngles) {
                    controls = new OrbitControls(camera, rootDiv, this.updateAngles);
                } else {
                    controls = new OrbitControls(camera, rootDiv);
                }

                controls.enablePan = enablePan != undefined ? enablePan : true;
                controls.enableZoom = enableZoom != undefined ? enableZoom : true;
                controls.enableKeys = enableKeys != undefined ? enableKeys : true;
            }

            if (this.props.setup) {
                try {
                    this.props.setup(scene, camera, renderer);
                } catch (error) {
                    this.onError(error);
                }
            }
            this.updateDimensions();
        }

        //Insert all 3D elements here

    }, {
        key: "_createScene",
        value: function _createScene(canvas) {
            //console.log(this.props);
            var _props4 = this.props,
                addControls = _props4.addControls,
                addGrid = _props4.addGrid,
                addLight = _props4.addLight,
                enableZoom = _props4.enableZoom,
                enableKeys = _props4.enableKeys,
                enablePan = _props4.enablePan;


            if (addGrid != undefined ? addGrid : true) {
                var gridXZ = new THREE.GridHelper(20, 20);
                gridXZ.name = "grid";
                scene.add(gridXZ);

                var planeGeometry = new THREE.PlaneGeometry(20, 20);
                planeGeometry.rotateX(-Math.PI / 2);
                var planeMaterial = new THREE.ShadowMaterial({
                    opacity: 0.4
                });
                var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.receiveShadow = true;
                scene.add(plane);
            }

            if (addControls) {
                var rootDiv = this.refs.rootthree;

                if (this.relatedCanvas) rootDiv = this.relatedCanvas;

                if (addControls) {
                    var rootDiv = this.refs.rootthree;

                    //if (this.relatedCanvas) rootDiv = this.relatedCanvas;

                    if (this.updateAngles) {
                        controls = new OrbitControls(camera, rootDiv, this.updateAngles);
                    } else {
                        controls = new OrbitControls(camera, rootDiv);
                    }

                    controls.enablePan = enablePan != undefined ? enablePan : true;
                    controls.enableZoom = enableZoom != undefined ? enableZoom : true;
                    controls.enableKeys = enableKeys != undefined ? enableKeys : true;
                }
            }

            if (addLight != undefined ? addLight : true) {
                scene.add(new THREE.AmbientLight(0x777));
                var light = new THREE.SpotLight(0xffffff, 1.0);
                light.position.set(50, 50, 50);
                light.castShadow = true;
                light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 10, 1000));
                light.shadow.bias = -0.0001;
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024;
                scene.add(light);
            }

            var _this = this;

            if (this.props.setup) {
                try {
                    this.props.setup(scene, camera, renderer);
                } catch (error) {
                    this.onError(error);
                }
            }
        }
    }, {
        key: "onError",
        value: function onError(error) {
            if (this.props.onError) {
                this.props.onError(error);
            }
        }
    }, {
        key: "onDocumentMouseMove",
        value: function onDocumentMouseMove(event) {
            event.preventDefault();
            var canvas = this.refs.threeCanvas;
            var canvasDOM = _reactDom2.default.findDOMNode(canvas);

            var rect = canvasDOM && canvasDOM.getBoundingClientRect();

            mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }
    }, {
        key: "render",
        value: function render() {
            var style = {
                top: 0,
                position: "absolute"
            };
            var style1 = {
                zIndex: 5
            };
            return _react2.default.createElement(
                "div",
                { ref: "rootthree" },
                _react2.default.createElement("canvas", { ref: "threeCanvas",
                    style: style1
                }),
                _react2.default.createElement("div", { ref: "cssCanvas" })
            );
        }
    }]);

    return Container3d;
}(_react.Component);

exports.default = Container3d;