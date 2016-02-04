/**
 * Electronic text configuration loader module for Xublit
 * @version v1.0.0-rc.1
 * @link https://github.com/xublit/xublit-etc#readme
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.inject = exports.name = undefined;
exports.bootstrap = bootstrap;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _jsYaml = require('js-yaml');

var yaml = _interopRequireWildcard(_jsYaml);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YAML_EXTENSION_REGEXP = /\.(yml|yaml)$/;

var name = exports.name = 'xublitEtc';
var inject = exports.inject = [];
function bootstrap() {

    var options = this.options || {};

    var etcPath = 'etcPath' in options ? options.etcPath : '';
    var safeLoad = 'safeLoad' in options ? options.safeLoad : true;

    var XublitEtc = function () {
        function XublitEtc() {
            _classCallCheck(this, XublitEtc);
        }

        _createClass(XublitEtc, [{
            key: 'readConfigSync',
            value: function readConfigSync(etcFilePath) {
                return this.readFileSync(this.getFullPath(etcFilePath));
            }
        }, {
            key: 'readFileSync',
            value: function readFileSync(filePath) {

                var file = fs.readFileSync(filePath);

                return false === this.safeLoad ? yaml.load(file) : yaml.safeLoad(file);
            }
        }, {
            key: 'readConfigDirSync',
            value: function readConfigDirSync(etcDirPath) {
                var _this = this;

                var configDirPath = this.getFullPath(etcDirPath);
                var fileNames = fs.readdirSync(configDirPath);

                var configs = {};

                fileNames.forEach(function (fileName) {

                    if (!YAML_EXTENSION_REGEXP.test(fileName)) {
                        return;
                    }

                    var filePath = _this.getFullPath([etcDirPath, fileName].join(path.sep));

                    var name = fileName.replace(YAML_EXTENSION_REGEXP, '');
                    var config = _this.readFileSync(filePath);

                    configs[name] = config;
                });

                return configs;
            }
        }, {
            key: 'getFullPath',
            value: function getFullPath(etcFilePath) {

                if (path.isAbsolute(etcFilePath)) {
                    return etcFilePath;
                }

                if ('' !== this.etcPath) {
                    return path.join(this.etcPath, path.normalize(etcFilePath));
                }

                return path.normalize(etcFilePath);
            }
        }, {
            key: 'safeLoad',
            get: function get() {
                return safeLoad;
            }
        }, {
            key: 'etcPath',
            get: function get() {
                return etcPath;
            }
        }]);

        return XublitEtc;
    }();

    return XublitEtc;
}
//# sourceMappingURL=xublit-etc.js.map
