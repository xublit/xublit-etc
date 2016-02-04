import * as path from 'path';

import * as XublitEtcModule from '../../src/xublit-etc';

const FAKE_ETC_PATH = path.resolve('./test/fake/etc/');

describe('Xublit Electronic Text Configuration Module', () => {

    var XublitEtc;
    var xublitEtc;

    describe('default options', () => {

        beforeEach(() => {
            XublitEtc = XublitEtcModule.bootstrap();
            xublitEtc = new XublitEtc();
        });

        it('should include safeLoad === true', () => {
            expect(xublitEtc.safeLoad).toBe(true);
        });

        it('should include etcPath === \'\'', () => {
            expect(xublitEtc.etcPath).toBe('');
        });

    });

    describe('load file(s) behavior', () => {

        beforeEach(() => {

            XublitEtc = XublitEtcModule.bootstrap.call({
                options: {
                    etcPath: FAKE_ETC_PATH,
                },
            });

            xublitEtc = new XublitEtc();

        });

        describe('readConfigSync(etcFilePath)', () => {

            var result;

            beforeEach(() => {
                result = xublitEtc.readConfigSync('env/someEnv.yaml');
            });

            it('should return an object with key/value pairs from the config file when the config file exists', () => {
                expect(result).toEqual(jasmine.objectContaining({
                    fooVar: 'Bar val',
                    barVar: 'Quux val',
                    quuxVar: jasmine.objectContaining({
                        quintVar: jasmine.arrayContaining([
                            'Woof',
                            'Meow',
                            'Wut',
                            'Lol',
                        ]),
                        uWotM8: 'nothing bro',
                        sozM8: 'all g bro',
                    }),
                }));
            });

        });

        describe('readConfigDirSync(etcDirPath)', () => {

            var result;

            beforeEach(() => {
                result = xublitEtc.readConfigDirSync('apiRoutes');
            });

            it('should return an object with keys for each file name in the target dir', () => {
                expect(result).toEqual(jasmine.objectContaining({
                    appleRoutes: jasmine.any(Object),
                    busRoutes: jasmine.any(Object),
                }));
            });

            it('should return an object having keys for each file name (excluding extension) with values as the parsed yaml objects', () => {
                expect(result).toEqual(jasmine.objectContaining({
                    appleRoutes: jasmine.objectContaining({
                        pickApples: jasmine.objectContaining({
                            method: 'PICK',
                            endPoint: '/apples',
                            controller: 'AppleController:pick',
                            requires: jasmine.arrayContaining([
                                'Hands',
                            ]),
                        }),
                        plantAppleTree: jasmine.objectContaining({
                            method: 'PLANT',
                            endPoint: '/seeds',
                            controller: 'OrchardController:plantSeeds',
                            requires: jasmine.arrayContaining([
                                'AppleSeeds',
                            ]),
                        }),
                        throwApples: jasmine.objectContaining({
                            method: 'THROW',
                            endPoint: '/myApples',
                            controller: 'ArmController:launchApples',
                            requires: jasmine.arrayContaining([
                                'Apples',
                                'Arms',
                            ]),
                        }),
                    }),
                    busRoutes: jasmine.objectContaining({
                        schoolRoute: jasmine.objectContaining({
                            method: 'DRIVE',
                            endPoint: '/school/:schoolId',
                            controller: 'BusController:goForADrive',
                            requires: jasmine.arrayContaining([
                                'UnimagineablePatience',
                            ]),
                        }),
                        morningPeakRoute: jasmine.objectContaining({
                            method: 'DRIVE',
                            endPoint: '/city/:addressId',
                            controller: 'BusController:goForADrive',
                            requires: jasmine.arrayContaining([
                                'Horn',
                                'Guts',
                                'Subbornness',
                            ]),
                        }),
                    }),
                }));
            });

        });

    });

    describe('path resolution behavior', () => {

        beforeEach(() => {

            XublitEtc = XublitEtcModule.bootstrap.call({
                options: {
                    etcPath: FAKE_ETC_PATH,
                },
            });

            xublitEtc = new XublitEtc();

        });

        it('should leave absolute paths unchanged', () => {

            expect(xublitEtc.getFullPath('/foo/bar/path'))
                .toBe('/foo/bar/path');
                
            expect(xublitEtc.getFullPath('//foo/bar/path'))
                .toBe('//foo/bar/path');

        });

        it('should prefix non-absolute paths with the etcPath', () => {

            expect(xublitEtc.getFullPath('foo/bar/path'))
                .toBe(path.join(FAKE_ETC_PATH, 'foo/bar/path'));

        });

    });

});