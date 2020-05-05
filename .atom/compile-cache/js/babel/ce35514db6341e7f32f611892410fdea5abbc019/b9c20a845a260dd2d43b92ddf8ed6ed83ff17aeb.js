var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var Path = _interopRequireWildcard(_path);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _srcWorkerHelpers = require('../src/worker-helpers');

var Helpers = _interopRequireWildcard(_srcWorkerHelpers);

var _linterEslintSpec = require('./linter-eslint-spec');

'use babel';

var getFixturesPath = function getFixturesPath(path) {
  return Path.join(__dirname, 'fixtures', path);
};

var globalNodePath = process.platform === 'win32' ? Path.join(getFixturesPath('global-eslint'), 'lib') : getFixturesPath('global-eslint');

function createConfig() {
  var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return Object.assign({}, overrides, { global: Object.assign({}, overrides.global) }, { autofix: Object.assign({}, overrides.autofix) }, { disabling: Object.assign({}, overrides.disabling) }, { advanced: Object.assign({}, overrides.advanced) });
}

describe('Worker Helpers', function () {
  describe('findESLintDirectory', function () {
    it('returns an object with path and type keys', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var foundEslint = Helpers.findESLintDirectory(modulesDir, createConfig());
      expect(typeof foundEslint === 'object').toBe(true);
      expect(foundEslint.path).toBeDefined();
      expect(foundEslint.type).toBeDefined();
    });

    it('finds a local eslint when useGlobalEslint is false', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var config = createConfig({ global: { useGlobalEslint: false } });
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedEslintPath = Path.join(getFixturesPath('local-eslint'), 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedEslintPath);
      expect(foundEslint.type).toEqual('local project');
    });

    it('does not find a local eslint when useGlobalEslint is true', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var config = createConfig({ global: { useGlobalEslint: true, globalNodePath: globalNodePath } });
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedEslintPath = Path.join(getFixturesPath('local-eslint'), 'node_modules', 'eslint');
      expect(foundEslint.path).not.toEqual(expectedEslintPath);
      expect(foundEslint.type).not.toEqual('local project');
    });

    it('finds a global eslint when useGlobalEslint is true and a valid globalNodePath is provided', function () {
      var modulesDir = Path.join(getFixturesPath('local-eslint'), 'node_modules');
      var config = createConfig({ global: { useGlobalEslint: true, globalNodePath: globalNodePath } });
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedEslintPath = process.platform === 'win32' ? Path.join(globalNodePath, 'node_modules', 'eslint') : Path.join(globalNodePath, 'lib', 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedEslintPath);
      expect(foundEslint.type).toEqual('global');
    });

    it('falls back to the packaged eslint when no local eslint is found', function () {
      var modulesDir = 'not/a/real/path';
      var config = createConfig({ global: { useGlobalEslint: false } });
      var foundEslint = Helpers.findESLintDirectory(modulesDir, config);
      var expectedBundledPath = Path.join(__dirname, '..', 'node_modules', 'eslint');
      expect(foundEslint.path).toEqual(expectedBundledPath);
      expect(foundEslint.type).toEqual('bundled fallback');
    });
  });

  describe('getESLintInstance && getESLintFromDirectory', function () {
    var pathPart = Path.join('testing', 'eslint', 'node_modules');

    it('tries to find an indirect local eslint using an absolute path', function () {
      var path = Path.join(getFixturesPath('indirect-local-eslint'), pathPart);
      var config = createConfig({
        global: { useGlobalEslint: false },
        advanced: { localNodeModules: path }
      });
      var eslint = Helpers.getESLintInstance('', config);
      expect(eslint).toBe('located');
    });

    it('tries to find an indirect local eslint using a relative path', function () {
      var path = Path.join(getFixturesPath('indirect-local-eslint'), pathPart);

      var _atom$project$relativizePath = atom.project.relativizePath(path);

      var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

      var projectPath = _atom$project$relativizePath2[0];
      var relativePath = _atom$project$relativizePath2[1];

      var config = createConfig({
        global: { useGlobalEslint: false },
        advanced: { localNodeModules: relativePath }
      });
      var eslint = Helpers.getESLintInstance('', config, projectPath);

      expect(eslint).toBe('located');
    });

    it('tries to find a local eslint', function () {
      var config = createConfig();
      var eslint = Helpers.getESLintInstance(getFixturesPath('local-eslint'), config);
      expect(eslint).toBe('located');
    });

    it('cries if local eslint is not found', function () {
      expect(function () {
        var config = createConfig();
        Helpers.getESLintInstance(getFixturesPath('files', config));
      }).toThrow();
    });

    it('tries to find a global eslint if config is specified', function () {
      var config = createConfig({
        global: { useGlobalEslint: true, globalNodePath: globalNodePath }
      });
      console.log({ config: config });
      var eslint = Helpers.getESLintInstance(getFixturesPath('local-eslint'), config);
      expect(eslint).toBe('located');
    });

    it('cries if global eslint is not found', function () {
      expect(function () {
        var config = createConfig({
          global: { useGlobalEslint: true, globalNodePath: getFixturesPath('files') }
        });
        Helpers.getESLintInstance(getFixturesPath('local-eslint'), config);
      }).toThrow();
    });

    it('tries to find a local eslint with nested node_modules', function () {
      var fileDir = Path.join(getFixturesPath('local-eslint'), 'lib', 'foo.js');
      var config = createConfig();
      var eslint = Helpers.getESLintInstance(fileDir, config);
      expect(eslint).toBe('located');
    });
  });

  describe('getConfigPath', function () {
    it('finds .eslintrc', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'no-ext'));
      var expectedPath = Path.join(fileDir, '.eslintrc');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.yaml', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'yaml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yaml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.yml', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'yml'));
      var expectedPath = Path.join(fileDir, '.eslintrc.yml');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.js', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'js'));
      var expectedPath = Path.join(fileDir, '.eslintrc.js');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds .eslintrc.json', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'json'));
      var expectedPath = Path.join(fileDir, '.eslintrc.json');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('finds package.json with an eslintConfig property', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'package-json'));
      var expectedPath = Path.join(fileDir, 'package.json');
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });

    it('ignores package.json with no eslintConfig property', function () {
      var fileDir = getFixturesPath(Path.join('configs', 'package-json', 'nested'));
      var expectedPath = getFixturesPath(Path.join('configs', 'package-json', 'package.json'));
      expect(Helpers.getConfigPath(fileDir)).toBe(expectedPath);
    });
  });

  describe('getRelativePath', function () {
    it('return path relative of ignore file if found', function () {
      var fixtureDir = getFixturesPath('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var config = createConfig();
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, config);
      var expectedPath = Path.relative(Path.join(__dirname, '..'), fixtureFile);
      expect(relativePath).toBe(expectedPath);
    });

    it('does not return path relative to ignore file if config overrides it', function () {
      var fixtureDir = getFixturesPath('eslintignore');
      var fixtureFile = Path.join(fixtureDir, 'ignored.js');
      var config = createConfig({
        advanced: { disableEslintIgnore: true }
      });
      var relativePath = Helpers.getRelativePath(fixtureDir, fixtureFile, config);
      expect(relativePath).toBe('ignored.js');
    });

    it('returns the path relative to the project dir if provided when no ignore file is found', _asyncToGenerator(function* () {
      var fixtureFile = getFixturesPath(Path.join('files', 'good.js'));
      // Copy the file to a temporary folder
      var tempFixturePath = yield (0, _linterEslintSpec.copyFileToTempDir)(fixtureFile);
      var tempDir = Path.dirname(tempFixturePath);
      var filepath = Path.join(tempDir, 'good.js');
      var tempDirParent = Path.dirname(tempDir);
      var config = createConfig();

      var relativePath = Helpers.getRelativePath(tempDir, filepath, config, tempDirParent);
      // Since the project is the parent of the temp dir, the relative path should be
      // the dir containing the file, plus the file. (e.g. asgln3/good.js)
      var expectedPath = Path.join(Path.basename(tempDir), 'good.js');
      expect(relativePath).toBe(expectedPath);
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    }));

    it('returns just the file being linted if no ignore file is found and no project dir is provided', _asyncToGenerator(function* () {
      var fixtureFile = getFixturesPath(Path.join('files', 'good.js'));
      // Copy the file to a temporary folder
      var tempFixturePath = yield (0, _linterEslintSpec.copyFileToTempDir)(fixtureFile);
      var tempDir = Path.dirname(tempFixturePath);
      var filepath = Path.join(tempDir, 'good.js');
      var config = createConfig();

      var relativePath = Helpers.getRelativePath(tempDir, filepath, config, null);
      expect(relativePath).toBe('good.js');

      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    }));
  });

  describe('getRules', function () {
    it('works with the getRules function introduced in ESLint v4.15.0', function () {
      var cliEngine = {
        getRules: function getRules() {
          return 'foo';
        }
      };
      expect(Helpers.getRules(cliEngine)).toBe('foo');
    });

    it('works with the hidden linter in ESLint v4 before v4.15.0', function () {
      var cliEngine = {
        linter: {
          getRules: function getRules() {
            return 'foo';
          }
        }
      };
      expect(Helpers.getRules(cliEngine)).toBe('foo');
    });

    it('returns an empty Map for old ESLint versions', function () {
      var cliEngine = {};
      expect(Helpers.getRules(cliEngine)).toEqual(new Map());
    });
  });

  describe('didRulesChange', function () {
    var emptyRules = new Map();
    var rules1 = new Map([['rule1', {}]]);
    var rules2 = new Map([['rule1', {}], ['rule2', {}]]);

    it('returns false for empty Maps', function () {
      var newRules = new Map();
      expect(Helpers.didRulesChange(emptyRules, newRules)).toBe(false);
    });

    it('returns false when they are the same', function () {
      expect(Helpers.didRulesChange(rules1, rules1)).toBe(false);
    });

    it('returns true when a new rule is added to an empty list', function () {
      expect(Helpers.didRulesChange(emptyRules, rules1)).toBe(true);
    });

    it('returns true when the last rule is removed', function () {
      expect(Helpers.didRulesChange(rules1, emptyRules)).toBe(true);
    });

    it('returns true when a new rule is added to an existing list', function () {
      expect(Helpers.didRulesChange(rules1, rules2)).toBe(true);
    });

    it('returns true when a rule is removed from an existing list', function () {
      expect(Helpers.didRulesChange(rules2, rules1)).toBe(true);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy93b3JrZXItaGVscGVycy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVzQixNQUFNOztJQUFoQixJQUFJOztzQkFDRyxRQUFROzs7O2dDQUNGLHVCQUF1Qjs7SUFBcEMsT0FBTzs7Z0NBQ2Usc0JBQXNCOztBQUx4RCxXQUFXLENBQUE7O0FBT1gsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFHLElBQUk7U0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDO0NBQUEsQ0FBQTs7QUFHdEUsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUNsRCxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUE7O0FBRXBDLFNBQVMsWUFBWSxHQUFpQjtNQUFoQixTQUFTLHlEQUFHLEVBQUU7O0FBQ2xDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FDbEIsRUFBRSxFQUNGLFNBQVMsRUFDVCxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFDL0MsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQ2pELEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUNyRCxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDcEQsQ0FBQTtDQUNGOztBQUVELFFBQVEsQ0FBQyxn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QTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvd29ya2VyLWhlbHBlcnMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJ1xuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuLi9zcmMvd29ya2VyLWhlbHBlcnMnXG5pbXBvcnQgeyBjb3B5RmlsZVRvVGVtcERpciB9IGZyb20gJy4vbGludGVyLWVzbGludC1zcGVjJ1xuXG5jb25zdCBnZXRGaXh0dXJlc1BhdGggPSBwYXRoID0+IFBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsIHBhdGgpXG5cblxuY29uc3QgZ2xvYmFsTm9kZVBhdGggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInXG4gID8gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnZ2xvYmFsLWVzbGludCcpLCAnbGliJylcbiAgOiBnZXRGaXh0dXJlc1BhdGgoJ2dsb2JhbC1lc2xpbnQnKVxuXG5mdW5jdGlvbiBjcmVhdGVDb25maWcob3ZlcnJpZGVzID0ge30pIHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAge30sXG4gICAgb3ZlcnJpZGVzLFxuICAgIHsgZ2xvYmFsOiBPYmplY3QuYXNzaWduKHt9LCBvdmVycmlkZXMuZ2xvYmFsKSB9LFxuICAgIHsgYXV0b2ZpeDogT2JqZWN0LmFzc2lnbih7fSwgb3ZlcnJpZGVzLmF1dG9maXgpIH0sXG4gICAgeyBkaXNhYmxpbmc6IE9iamVjdC5hc3NpZ24oe30sIG92ZXJyaWRlcy5kaXNhYmxpbmcpIH0sXG4gICAgeyBhZHZhbmNlZDogT2JqZWN0LmFzc2lnbih7fSwgb3ZlcnJpZGVzLmFkdmFuY2VkKSB9LFxuICApXG59XG5cbmRlc2NyaWJlKCdXb3JrZXIgSGVscGVycycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2ZpbmRFU0xpbnREaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgYW4gb2JqZWN0IHdpdGggcGF0aCBhbmQgdHlwZSBrZXlzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlc0RpciA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCAnbm9kZV9tb2R1bGVzJylcbiAgICAgIGNvbnN0IGZvdW5kRXNsaW50ID0gSGVscGVycy5maW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNyZWF0ZUNvbmZpZygpKVxuICAgICAgZXhwZWN0KHR5cGVvZiBmb3VuZEVzbGludCA9PT0gJ29iamVjdCcpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC5wYXRoKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQudHlwZSkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgYSBsb2NhbCBlc2xpbnQgd2hlbiB1c2VHbG9iYWxFc2xpbnQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2R1bGVzRGlyID0gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnbG9jYWwtZXNsaW50JyksICdub2RlX21vZHVsZXMnKVxuICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlQ29uZmlnKHsgZ2xvYmFsOiB7IHVzZUdsb2JhbEVzbGludDogZmFsc2UgfSB9KVxuICAgICAgY29uc3QgZm91bmRFc2xpbnQgPSBIZWxwZXJzLmZpbmRFU0xpbnREaXJlY3RvcnkobW9kdWxlc0RpciwgY29uZmlnKVxuICAgICAgY29uc3QgZXhwZWN0ZWRFc2xpbnRQYXRoID0gUGF0aC5qb2luKGdldEZpeHR1cmVzUGF0aCgnbG9jYWwtZXNsaW50JyksICdub2RlX21vZHVsZXMnLCAnZXNsaW50JylcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC5wYXRoKS50b0VxdWFsKGV4cGVjdGVkRXNsaW50UGF0aClcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC50eXBlKS50b0VxdWFsKCdsb2NhbCBwcm9qZWN0JylcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IGZpbmQgYSBsb2NhbCBlc2xpbnQgd2hlbiB1c2VHbG9iYWxFc2xpbnQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgJ25vZGVfbW9kdWxlcycpXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoeyBnbG9iYWw6IHsgdXNlR2xvYmFsRXNsaW50OiB0cnVlLCBnbG9iYWxOb2RlUGF0aCB9IH0pXG4gICAgICBjb25zdCBmb3VuZEVzbGludCA9IEhlbHBlcnMuZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcpXG4gICAgICBjb25zdCBleHBlY3RlZEVzbGludFBhdGggPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnBhdGgpLm5vdC50b0VxdWFsKGV4cGVjdGVkRXNsaW50UGF0aClcbiAgICAgIGV4cGVjdChmb3VuZEVzbGludC50eXBlKS5ub3QudG9FcXVhbCgnbG9jYWwgcHJvamVjdCcpXG4gICAgfSlcblxuICAgIGl0KCdmaW5kcyBhIGdsb2JhbCBlc2xpbnQgd2hlbiB1c2VHbG9iYWxFc2xpbnQgaXMgdHJ1ZSBhbmQgYSB2YWxpZCBnbG9iYWxOb2RlUGF0aCBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZHVsZXNEaXIgPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgJ25vZGVfbW9kdWxlcycpXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoeyBnbG9iYWw6IHsgdXNlR2xvYmFsRXNsaW50OiB0cnVlLCBnbG9iYWxOb2RlUGF0aCB9IH0pXG4gICAgICBjb25zdCBmb3VuZEVzbGludCA9IEhlbHBlcnMuZmluZEVTTGludERpcmVjdG9yeShtb2R1bGVzRGlyLCBjb25maWcpXG4gICAgICBjb25zdCBleHBlY3RlZEVzbGludFBhdGggPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInXG4gICAgICAgID8gUGF0aC5qb2luKGdsb2JhbE5vZGVQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICAgIDogUGF0aC5qb2luKGdsb2JhbE5vZGVQYXRoLCAnbGliJywgJ25vZGVfbW9kdWxlcycsICdlc2xpbnQnKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnBhdGgpLnRvRXF1YWwoZXhwZWN0ZWRFc2xpbnRQYXRoKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnR5cGUpLnRvRXF1YWwoJ2dsb2JhbCcpXG4gICAgfSlcblxuICAgIGl0KCdmYWxscyBiYWNrIHRvIHRoZSBwYWNrYWdlZCBlc2xpbnQgd2hlbiBubyBsb2NhbCBlc2xpbnQgaXMgZm91bmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2R1bGVzRGlyID0gJ25vdC9hL3JlYWwvcGF0aCdcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZyh7IGdsb2JhbDogeyB1c2VHbG9iYWxFc2xpbnQ6IGZhbHNlIH0gfSlcbiAgICAgIGNvbnN0IGZvdW5kRXNsaW50ID0gSGVscGVycy5maW5kRVNMaW50RGlyZWN0b3J5KG1vZHVsZXNEaXIsIGNvbmZpZylcbiAgICAgIGNvbnN0IGV4cGVjdGVkQnVuZGxlZFBhdGggPSBQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbm9kZV9tb2R1bGVzJywgJ2VzbGludCcpXG4gICAgICBleHBlY3QoZm91bmRFc2xpbnQucGF0aCkudG9FcXVhbChleHBlY3RlZEJ1bmRsZWRQYXRoKVxuICAgICAgZXhwZWN0KGZvdW5kRXNsaW50LnR5cGUpLnRvRXF1YWwoJ2J1bmRsZWQgZmFsbGJhY2snKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldEVTTGludEluc3RhbmNlICYmIGdldEVTTGludEZyb21EaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgY29uc3QgcGF0aFBhcnQgPSBQYXRoLmpvaW4oJ3Rlc3RpbmcnLCAnZXNsaW50JywgJ25vZGVfbW9kdWxlcycpXG5cbiAgICBpdCgndHJpZXMgdG8gZmluZCBhbiBpbmRpcmVjdCBsb2NhbCBlc2xpbnQgdXNpbmcgYW4gYWJzb2x1dGUgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdpbmRpcmVjdC1sb2NhbC1lc2xpbnQnKSwgcGF0aFBhcnQpXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoe1xuICAgICAgICBnbG9iYWw6IHsgdXNlR2xvYmFsRXNsaW50OiBmYWxzZSB9LFxuICAgICAgICBhZHZhbmNlZDogeyBsb2NhbE5vZGVNb2R1bGVzOiBwYXRoIH1cbiAgICAgIH0pXG4gICAgICBjb25zdCBlc2xpbnQgPSBIZWxwZXJzLmdldEVTTGludEluc3RhbmNlKCcnLCBjb25maWcpXG4gICAgICBleHBlY3QoZXNsaW50KS50b0JlKCdsb2NhdGVkJylcbiAgICB9KVxuXG4gICAgaXQoJ3RyaWVzIHRvIGZpbmQgYW4gaW5kaXJlY3QgbG9jYWwgZXNsaW50IHVzaW5nIGEgcmVsYXRpdmUgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBQYXRoLmpvaW4oZ2V0Rml4dHVyZXNQYXRoKCdpbmRpcmVjdC1sb2NhbC1lc2xpbnQnKSwgcGF0aFBhcnQpXG4gICAgICBjb25zdCBbcHJvamVjdFBhdGgsIHJlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aClcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZyh7XG4gICAgICAgIGdsb2JhbDogeyB1c2VHbG9iYWxFc2xpbnQ6IGZhbHNlIH0sXG4gICAgICAgIGFkdmFuY2VkOiB7IGxvY2FsTm9kZU1vZHVsZXM6IHJlbGF0aXZlUGF0aCB9XG4gICAgICB9KVxuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZSgnJywgY29uZmlnLCBwcm9qZWN0UGF0aClcblxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcblxuICAgIGl0KCd0cmllcyB0byBmaW5kIGEgbG9jYWwgZXNsaW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlQ29uZmlnKClcbiAgICAgIGNvbnN0IGVzbGludCA9IEhlbHBlcnMuZ2V0RVNMaW50SW5zdGFuY2UoZ2V0Rml4dHVyZXNQYXRoKCdsb2NhbC1lc2xpbnQnKSwgY29uZmlnKVxuICAgICAgZXhwZWN0KGVzbGludCkudG9CZSgnbG9jYXRlZCcpXG4gICAgfSlcblxuICAgIGl0KCdjcmllcyBpZiBsb2NhbCBlc2xpbnQgaXMgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlQ29uZmlnKClcbiAgICAgICAgSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2ZpbGVzJywgY29uZmlnKSlcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgndHJpZXMgdG8gZmluZCBhIGdsb2JhbCBlc2xpbnQgaWYgY29uZmlnIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZyh7XG4gICAgICAgIGdsb2JhbDogeyB1c2VHbG9iYWxFc2xpbnQ6IHRydWUsIGdsb2JhbE5vZGVQYXRoIH1cbiAgICAgIH0pXG4gICAgICBjb25zb2xlLmxvZyh7IGNvbmZpZyB9KVxuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCBjb25maWcpXG4gICAgICBleHBlY3QoZXNsaW50KS50b0JlKCdsb2NhdGVkJylcbiAgICB9KVxuXG4gICAgaXQoJ2NyaWVzIGlmIGdsb2JhbCBlc2xpbnQgaXMgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlQ29uZmlnKHtcbiAgICAgICAgICBnbG9iYWw6IHsgdXNlR2xvYmFsRXNsaW50OiB0cnVlLCBnbG9iYWxOb2RlUGF0aDogZ2V0Rml4dHVyZXNQYXRoKCdmaWxlcycpIH1cbiAgICAgICAgfSlcbiAgICAgICAgSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCBjb25maWcpXG4gICAgICB9KS50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3RyaWVzIHRvIGZpbmQgYSBsb2NhbCBlc2xpbnQgd2l0aCBuZXN0ZWQgbm9kZV9tb2R1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IFBhdGguam9pbihnZXRGaXh0dXJlc1BhdGgoJ2xvY2FsLWVzbGludCcpLCAnbGliJywgJ2Zvby5qcycpXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoKVxuICAgICAgY29uc3QgZXNsaW50ID0gSGVscGVycy5nZXRFU0xpbnRJbnN0YW5jZShmaWxlRGlyLCBjb25maWcpXG4gICAgICBleHBlY3QoZXNsaW50KS50b0JlKCdsb2NhdGVkJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRDb25maWdQYXRoJywgKCkgPT4ge1xuICAgIGl0KCdmaW5kcyAuZXNsaW50cmMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignY29uZmlncycsICduby1leHQnKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihmaWxlRGlyLCAnLmVzbGludHJjJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgLmVzbGludHJjLnlhbWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignY29uZmlncycsICd5YW1sJykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYy55YW1sJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgLmVzbGludHJjLnltbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVEaXIgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdjb25maWdzJywgJ3ltbCcpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5qb2luKGZpbGVEaXIsICcuZXNsaW50cmMueW1sJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgLmVzbGludHJjLmpzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAnanMnKSlcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihmaWxlRGlyLCAnLmVzbGludHJjLmpzJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgLmVzbGludHJjLmpzb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignY29uZmlncycsICdqc29uJykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJy5lc2xpbnRyYy5qc29uJylcbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcikpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgIH0pXG5cbiAgICBpdCgnZmluZHMgcGFja2FnZS5qc29uIHdpdGggYW4gZXNsaW50Q29uZmlnIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAncGFja2FnZS1qc29uJykpXG4gICAgICBjb25zdCBleHBlY3RlZFBhdGggPSBQYXRoLmpvaW4oZmlsZURpciwgJ3BhY2thZ2UuanNvbicpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2lnbm9yZXMgcGFja2FnZS5qc29uIHdpdGggbm8gZXNsaW50Q29uZmlnIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZURpciA9IGdldEZpeHR1cmVzUGF0aChQYXRoLmpvaW4oJ2NvbmZpZ3MnLCAncGFja2FnZS1qc29uJywgJ25lc3RlZCcpKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignY29uZmlncycsICdwYWNrYWdlLWpzb24nLCAncGFja2FnZS5qc29uJykpXG4gICAgICBleHBlY3QoSGVscGVycy5nZXRDb25maWdQYXRoKGZpbGVEaXIpKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRSZWxhdGl2ZVBhdGgnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybiBwYXRoIHJlbGF0aXZlIG9mIGlnbm9yZSBmaWxlIGlmIGZvdW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZml4dHVyZURpciA9IGdldEZpeHR1cmVzUGF0aCgnZXNsaW50aWdub3JlJylcbiAgICAgIGNvbnN0IGZpeHR1cmVGaWxlID0gUGF0aC5qb2luKGZpeHR1cmVEaXIsICdpZ25vcmVkLmpzJylcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZygpXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aChmaXh0dXJlRGlyLCBmaXh0dXJlRmlsZSwgY29uZmlnKVxuICAgICAgY29uc3QgZXhwZWN0ZWRQYXRoID0gUGF0aC5yZWxhdGl2ZShQYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nKSwgZml4dHVyZUZpbGUpXG4gICAgICBleHBlY3QocmVsYXRpdmVQYXRoKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IHJldHVybiBwYXRoIHJlbGF0aXZlIHRvIGlnbm9yZSBmaWxlIGlmIGNvbmZpZyBvdmVycmlkZXMgaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaXh0dXJlRGlyID0gZ2V0Rml4dHVyZXNQYXRoKCdlc2xpbnRpZ25vcmUnKVxuICAgICAgY29uc3QgZml4dHVyZUZpbGUgPSBQYXRoLmpvaW4oZml4dHVyZURpciwgJ2lnbm9yZWQuanMnKVxuICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlQ29uZmlnKHtcbiAgICAgICAgYWR2YW5jZWQ6IHsgZGlzYWJsZUVzbGludElnbm9yZTogdHJ1ZSB9XG4gICAgICB9KVxuICAgICAgY29uc3QgcmVsYXRpdmVQYXRoID0gSGVscGVycy5nZXRSZWxhdGl2ZVBhdGgoZml4dHVyZURpciwgZml4dHVyZUZpbGUsIGNvbmZpZylcbiAgICAgIGV4cGVjdChyZWxhdGl2ZVBhdGgpLnRvQmUoJ2lnbm9yZWQuanMnKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyB0aGUgcGF0aCByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCBkaXIgaWYgcHJvdmlkZWQgd2hlbiBubyBpZ25vcmUgZmlsZSBpcyBmb3VuZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGZpeHR1cmVGaWxlID0gZ2V0Rml4dHVyZXNQYXRoKFBhdGguam9pbignZmlsZXMnLCAnZ29vZC5qcycpKVxuICAgICAgLy8gQ29weSB0aGUgZmlsZSB0byBhIHRlbXBvcmFyeSBmb2xkZXJcbiAgICAgIGNvbnN0IHRlbXBGaXh0dXJlUGF0aCA9IGF3YWl0IGNvcHlGaWxlVG9UZW1wRGlyKGZpeHR1cmVGaWxlKVxuICAgICAgY29uc3QgdGVtcERpciA9IFBhdGguZGlybmFtZSh0ZW1wRml4dHVyZVBhdGgpXG4gICAgICBjb25zdCBmaWxlcGF0aCA9IFBhdGguam9pbih0ZW1wRGlyLCAnZ29vZC5qcycpXG4gICAgICBjb25zdCB0ZW1wRGlyUGFyZW50ID0gUGF0aC5kaXJuYW1lKHRlbXBEaXIpXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVDb25maWcoKVxuXG4gICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBIZWxwZXJzLmdldFJlbGF0aXZlUGF0aCh0ZW1wRGlyLCBmaWxlcGF0aCwgY29uZmlnLCB0ZW1wRGlyUGFyZW50KVxuICAgICAgLy8gU2luY2UgdGhlIHByb2plY3QgaXMgdGhlIHBhcmVudCBvZiB0aGUgdGVtcCBkaXIsIHRoZSByZWxhdGl2ZSBwYXRoIHNob3VsZCBiZVxuICAgICAgLy8gdGhlIGRpciBjb250YWluaW5nIHRoZSBmaWxlLCBwbHVzIHRoZSBmaWxlLiAoZS5nLiBhc2dsbjMvZ29vZC5qcylcbiAgICAgIGNvbnN0IGV4cGVjdGVkUGF0aCA9IFBhdGguam9pbihQYXRoLmJhc2VuYW1lKHRlbXBEaXIpLCAnZ29vZC5qcycpXG4gICAgICBleHBlY3QocmVsYXRpdmVQYXRoKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICAgIC8vIFJlbW92ZSB0aGUgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgICAgcmltcmFmLnN5bmModGVtcERpcilcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMganVzdCB0aGUgZmlsZSBiZWluZyBsaW50ZWQgaWYgbm8gaWdub3JlIGZpbGUgaXMgZm91bmQgYW5kIG5vIHByb2plY3QgZGlyIGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZml4dHVyZUZpbGUgPSBnZXRGaXh0dXJlc1BhdGgoUGF0aC5qb2luKCdmaWxlcycsICdnb29kLmpzJykpXG4gICAgICAvLyBDb3B5IHRoZSBmaWxlIHRvIGEgdGVtcG9yYXJ5IGZvbGRlclxuICAgICAgY29uc3QgdGVtcEZpeHR1cmVQYXRoID0gYXdhaXQgY29weUZpbGVUb1RlbXBEaXIoZml4dHVyZUZpbGUpXG4gICAgICBjb25zdCB0ZW1wRGlyID0gUGF0aC5kaXJuYW1lKHRlbXBGaXh0dXJlUGF0aClcbiAgICAgIGNvbnN0IGZpbGVwYXRoID0gUGF0aC5qb2luKHRlbXBEaXIsICdnb29kLmpzJylcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZUNvbmZpZygpXG5cbiAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IEhlbHBlcnMuZ2V0UmVsYXRpdmVQYXRoKHRlbXBEaXIsIGZpbGVwYXRoLCBjb25maWcsIG51bGwpXG4gICAgICBleHBlY3QocmVsYXRpdmVQYXRoKS50b0JlKCdnb29kLmpzJylcblxuICAgICAgLy8gUmVtb3ZlIHRoZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dldFJ1bGVzJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcyB3aXRoIHRoZSBnZXRSdWxlcyBmdW5jdGlvbiBpbnRyb2R1Y2VkIGluIEVTTGludCB2NC4xNS4wJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2xpRW5naW5lID0ge1xuICAgICAgICBnZXRSdWxlczogKCkgPT4gJ2ZvbydcbiAgICAgIH1cbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldFJ1bGVzKGNsaUVuZ2luZSkpLnRvQmUoJ2ZvbycpXG4gICAgfSlcblxuICAgIGl0KCd3b3JrcyB3aXRoIHRoZSBoaWRkZW4gbGludGVyIGluIEVTTGludCB2NCBiZWZvcmUgdjQuMTUuMCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNsaUVuZ2luZSA9IHtcbiAgICAgICAgbGludGVyOiB7XG4gICAgICAgICAgZ2V0UnVsZXM6ICgpID0+ICdmb28nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGV4cGVjdChIZWxwZXJzLmdldFJ1bGVzKGNsaUVuZ2luZSkpLnRvQmUoJ2ZvbycpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IE1hcCBmb3Igb2xkIEVTTGludCB2ZXJzaW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNsaUVuZ2luZSA9IHt9XG4gICAgICBleHBlY3QoSGVscGVycy5nZXRSdWxlcyhjbGlFbmdpbmUpKS50b0VxdWFsKG5ldyBNYXAoKSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkaWRSdWxlc0NoYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBlbXB0eVJ1bGVzID0gbmV3IE1hcCgpXG4gICAgY29uc3QgcnVsZXMxID0gbmV3IE1hcChbWydydWxlMScsIHt9XV0pXG4gICAgY29uc3QgcnVsZXMyID0gbmV3IE1hcChbWydydWxlMScsIHt9XSwgWydydWxlMicsIHt9XV0pXG5cbiAgICBpdCgncmV0dXJucyBmYWxzZSBmb3IgZW1wdHkgTWFwcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG5ld1J1bGVzID0gbmV3IE1hcCgpXG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShlbXB0eVJ1bGVzLCBuZXdSdWxlcykpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIHdoZW4gdGhleSBhcmUgdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIHJ1bGVzMSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBhIG5ldyBydWxlIGlzIGFkZGVkIHRvIGFuIGVtcHR5IGxpc3QnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShlbXB0eVJ1bGVzLCBydWxlczEpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiB0aGUgbGFzdCBydWxlIGlzIHJlbW92ZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIGVtcHR5UnVsZXMpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIHRydWUgd2hlbiBhIG5ldyBydWxlIGlzIGFkZGVkIHRvIGFuIGV4aXN0aW5nIGxpc3QnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSGVscGVycy5kaWRSdWxlc0NoYW5nZShydWxlczEsIHJ1bGVzMikpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSB3aGVuIGEgcnVsZSBpcyByZW1vdmVkIGZyb20gYW4gZXhpc3RpbmcgbGlzdCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChIZWxwZXJzLmRpZFJ1bGVzQ2hhbmdlKHJ1bGVzMiwgcnVsZXMxKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuIl19