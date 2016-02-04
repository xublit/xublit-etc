const YAML_EXTENSION_REGEXP = /\.(yml|yaml)$/;

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export var name = 'xublitEtc';
export var inject = [];
export function bootstrap () {

    var options = this.options || {};

    var etcPath = 'etcPath' in options ? options.etcPath : '';
    var safeLoad = 'safeLoad' in options ? options.safeLoad : true;

    class XublitEtc {

        constructor () {

        }

        get safeLoad () {
            return safeLoad;
        }

        get etcPath () {
            return etcPath;
        }

        readConfigSync (etcFilePath) {
            return this.readFileSync(this.getFullPath(etcFilePath));
        }

        readFileSync (filePath) {

            var file = fs.readFileSync(filePath);

            return false === this.safeLoad ?
                yaml.load(file) :
                yaml.safeLoad(file);

        }

        readConfigDirSync (etcDirPath) {

            var configDirPath = this.getFullPath(etcDirPath);
            var fileNames = fs.readdirSync(configDirPath);

            var configs = {};

            fileNames.forEach((fileName) => {

                if (!YAML_EXTENSION_REGEXP.test(fileName)) {
                    return;
                }

                var filePath = this.getFullPath(
                    [etcDirPath, fileName].join(path.sep)
                );

                var name = fileName.replace(YAML_EXTENSION_REGEXP, '');
                var config = this.readFileSync(filePath);

                configs[name] = config;

            });

            return configs;

        }

        getFullPath (etcFilePath) {

            if (path.isAbsolute(etcFilePath)) {
                return etcFilePath;
            }

            if ('' !== this.etcPath) {
                return path.join(this.etcPath, path.normalize(etcFilePath));
            }

            return path.normalize(etcFilePath);

        }

    }

    return XublitEtc;

}
