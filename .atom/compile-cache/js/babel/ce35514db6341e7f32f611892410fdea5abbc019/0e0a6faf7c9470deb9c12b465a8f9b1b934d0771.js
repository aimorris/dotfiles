Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Utility helper to copy a file into the OS temp directory.
 *
 * @param  {string} fileToCopyPath  Path of the file to be copied
 * @return {string}                 Full path of the file in copy destination
 */
// eslint-disable-next-line import/prefer-default-export

var copyFileToTempDir = _asyncToGenerator(function* (fileToCopyPath) {
  var tempFixtureDir = fs.mkdtempSync((0, _os.tmpdir)() + path.sep);
  return copyFileToDir(fileToCopyPath, tempFixtureDir);
});

exports.copyFileToTempDir = copyFileToTempDir;

var getNotification = _asyncToGenerator(function* (expectedMessage) {
  return new Promise(function (resolve) {
    var notificationSub = undefined;
    var newNotification = function newNotification(notification) {
      if (notification.getMessage() !== expectedMessage) {
        // As the specs execute asynchronously, it's possible a notification
        // from a different spec was grabbed, if the message doesn't match what
        // is expected simply return and keep waiting for the next message.
        return;
      }
      // Dispose of the notification subscription
      notificationSub.dispose();
      resolve(notification);
    };
    // Subscribe to Atom's notifications
    notificationSub = atom.notifications.onDidAddNotification(newNotification);
  });
});

var makeFixes = _asyncToGenerator(function* (textEditor) {
  var editorReloadPromise = new Promise(function (resolve) {
    // Subscribe to file reload events
    var editorReloadSubscription = textEditor.getBuffer().onDidReload(function () {
      editorReloadSubscription.dispose();
      resolve();
    });
  });

  var expectedMessage = 'Linter-ESLint: Fix complete.';
  // Subscribe to notification events
  var notificationPromise = getNotification(expectedMessage);

  // Subscriptions now active for Editor Reload and Message Notification
  // Send off a fix request.
  atom.commands.dispatch(atom.views.getView(textEditor), 'linter-eslint:fix-file');

  var notification = yield notificationPromise;
  expect(notification.getMessage()).toBe(expectedMessage);
  expect(notification.getType()).toBe('success');

  // After editor reloads, it should be safe for consuming test to resume.
  return editorReloadPromise;
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _os = require('os');

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

// eslint-disable-next-line no-unused-vars

var _jasmineFix = require('jasmine-fix');

var _srcMain = require('../src/main');

var _srcMain2 = _interopRequireDefault(_srcMain);

var _srcHelpers = require('../src/helpers');

'use babel';

var fixturesDir = path.join(__dirname, 'fixtures');

var fixtures = {
  good: ['files', 'good.js'],
  bad: ['files', 'bad.js'],
  badInline: ['files', 'badInline.js'],
  empty: ['files', 'empty.js'],
  fix: ['files', 'fix.js'],
  cache: ['files', '.eslintcache'],
  config: ['configs', '.eslintrc.yml'],
  ignored: ['eslintignore', 'ignored.js'],
  endRange: ['end-range', 'no-unreachable.js'],
  badCache: ['badCache'],
  modifiedIgnore: ['modified-ignore-rule', 'foo.js'],
  modifiedIgnoreSpace: ['modified-ignore-rule', 'foo-space.js'],
  importing: ['import-resolution', 'nested', 'importing.js'],
  badImport: ['import-resolution', 'nested', 'badImport.js'],
  fixablePlugin: ['plugin-import', 'life.js'],
  eslintignoreDir: ['eslintignore'],
  eslintIgnoreKeyDir: ['configs', 'eslintignorekey']
};

var paths = Object.keys(fixtures).reduce(function (accumulator, fixture) {
  var acc = accumulator;
  acc[fixture] = path.join.apply(path, [fixturesDir].concat(_toConsumableArray(fixtures[fixture])));
  return acc;
}, {});

/**
 * Async helper to copy a file from one place to another on the filesystem.
 * @param  {string} fileToCopyPath  Path of the file to be copied
 * @param  {string} destinationDir  Directory to paste the file into
 * @return {string}                 Full path of the file in copy destination
 */
function copyFileToDir(fileToCopyPath, destinationDir) {
  return new Promise(function (resolve) {
    var destinationPath = path.join(destinationDir, path.basename(fileToCopyPath));
    var ws = fs.createWriteStream(destinationPath);
    ws.on('close', function () {
      return resolve(destinationPath);
    });
    fs.createReadStream(fileToCopyPath).pipe(ws);
  });
}

describe('The eslint provider for Linter', function () {
  var linterProvider = _srcMain2['default'].provideLinter();
  var lint = linterProvider.lint;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.config.set('linter-eslint.advanced.disableFSCache', false);
    atom.config.set('linter-eslint.advanced.disableEslintIgnore', true);

    // Activate the JavaScript language so Atom knows what the files are
    yield atom.packages.activatePackage('language-javascript');
    // Activate the provider
    yield atom.packages.activatePackage('linter-eslint');
  }));

  describe('checks bad.js and', function () {
    var editor = null;
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(paths.bad);
    }));

    (0, _jasmineFix.it)('verifies the messages', _asyncToGenerator(function* () {
      var messages = yield lint(editor);
      expect(messages.length).toBe(2);

      var expected0 = "'foo' is not defined. (no-undef)";
      var expected0Url = 'https://eslint.org/docs/rules/no-undef';
      var expected1 = 'Extra semicolon. (semi)';
      var expected1Url = 'https://eslint.org/docs/rules/semi';

      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected0);
      expect(messages[0].url).toBe(expected0Url);
      expect(messages[0].location.file).toBe(paths.bad);
      expect(messages[0].location.position).toEqual([[0, 0], [0, 3]]);
      expect(messages[0].solutions).not.toBeDefined();

      expect(messages[1].severity).toBe('error');
      expect(messages[1].excerpt).toBe(expected1);
      expect(messages[1].url).toBe(expected1Url);
      expect(messages[1].location.file).toBe(paths.bad);
      expect(messages[1].location.position).toEqual([[0, 8], [0, 9]]);
      expect(messages[1].solutions.length).toBe(1);
      expect(messages[1].solutions[0].position).toEqual([[0, 6], [0, 9]]);
      expect(messages[1].solutions[0].replaceWith).toBe('42');
    }));
  });

  (0, _jasmineFix.it)('finds nothing wrong with an empty file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.empty);
    var messages = yield lint(editor);

    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.good);
    var messages = yield lint(editor);

    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('reports the fixes for fixable errors', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.fix);
    var messages = yield lint(editor);

    expect(messages[0].solutions[0].position).toEqual([[0, 10], [1, 8]]);
    expect(messages[0].solutions[0].replaceWith).toBe('6\nfunction');

    expect(messages[1].solutions[0].position).toEqual([[2, 0], [2, 1]]);
    expect(messages[1].solutions[0].replaceWith).toBe('  ');
  }));

  describe('when resolving import paths using eslint-plugin-import', function () {
    (0, _jasmineFix.it)('correctly resolves imports from parent', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.importing);
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('shows a message for an invalid import', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'. (import/no-unresolved)";
      var expectedUrlRegEx = /https[\S]+eslint-plugin-import[\S]+no-unresolved.md/;

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toMatch(expectedUrlRegEx);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));
  });

  describe('when a file is specified in an .eslintignore file', function () {
    (0, _jasmineFix.beforeEach)(function () {
      atom.config.set('linter-eslint.advanced.disableEslintIgnore', false);
    });

    (0, _jasmineFix.it)('will not give warnings when linting the file', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.ignored);
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));

    (0, _jasmineFix.it)('will not give warnings when autofixing the file', _asyncToGenerator(function* () {
      var editor = yield atom.workspace.open(paths.ignored);
      var expectedMessage = 'Linter-ESLint: Fix complete.';
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:fix-file');
      var notification = yield notificationPromise;

      expect(notification.getMessage()).toBe(expectedMessage);
    }));
  });

  describe('when a file is not specified in .eslintignore file', _asyncToGenerator(function* () {
    (0, _jasmineFix.it)('will give warnings when linting the file', _asyncToGenerator(function* () {
      var tempPath = yield copyFileToTempDir(path.join(paths.eslintignoreDir, 'ignored.js'));
      var tempDir = path.dirname(tempPath);

      var editor = yield atom.workspace.open(tempPath);
      atom.config.set('linter-eslint.advanced.disableEslintIgnore', false);
      yield copyFileToDir(path.join(paths.eslintignoreDir, '.eslintrc.yaml'), tempDir);

      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      _rimraf2['default'].sync(tempDir);
    }));
  }));

  describe('when a file is specified in an eslintIgnore key in package.json', function () {
    (0, _jasmineFix.it)('will still lint the file if an .eslintignore file is present', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.advanced.disableEslintIgnore', false);
      var editor = yield atom.workspace.open(path.join(paths.eslintIgnoreKeyDir, 'ignored.js'));
      var messages = yield lint(editor);

      expect(messages.length).toBe(1);
    }));

    (0, _jasmineFix.it)('will not give warnings when linting the file', _asyncToGenerator(function* () {
      var tempPath = yield copyFileToTempDir(path.join(paths.eslintIgnoreKeyDir, 'ignored.js'));
      var tempDir = path.dirname(tempPath);

      var editor = yield atom.workspace.open(tempPath);
      atom.config.set('linter-eslint.advanced.disableEslintIgnore', false);
      yield copyFileToDir(path.join(paths.eslintIgnoreKeyDir, 'package.json'), tempDir);

      var messages = yield lint(editor);
      expect(messages.length).toBe(0);
      _rimraf2['default'].sync(tempDir);
    }));
  });

  describe('fixes errors', function () {
    var firstLint = _asyncToGenerator(function* (textEditor) {
      var messages = yield lint(textEditor);
      // The original file has two errors
      expect(messages.length).toBe(2);
    });

    var editor = undefined;
    var tempDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      // Copy the file to a temporary folder
      var tempFixturePath = yield copyFileToTempDir(paths.fix);
      editor = yield atom.workspace.open(tempFixturePath);
      tempDir = path.dirname(tempFixturePath);
      // Copy the config to the same temporary directory
      yield copyFileToDir(paths.config, tempDir);
    }));

    afterEach(function () {
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    });

    (0, _jasmineFix.it)('should fix linting errors', _asyncToGenerator(function* () {
      yield firstLint(editor);
      yield makeFixes(editor);
      var messagesAfterFixing = yield lint(editor);

      expect(messagesAfterFixing.length).toBe(0);
    }));

    (0, _jasmineFix.it)('should not fix linting errors for rules that are disabled with rulesToDisableWhileFixing', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.autofix.rulesToDisableWhileFixing', ['semi']);

      yield firstLint(editor);
      yield makeFixes(editor);
      var messagesAfterFixing = yield lint(editor);
      var expected = 'Extra semicolon. (semi)';
      var expectedUrl = 'https://eslint.org/docs/rules/semi';

      expect(messagesAfterFixing.length).toBe(1);
      expect(messagesAfterFixing[0].excerpt).toBe(expected);
      expect(messagesAfterFixing[0].url).toBe(expectedUrl);
    }));
  });

  describe('when an eslint cache file is present', function () {
    var editor = undefined;
    var tempDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      // Copy the file to a temporary folder
      var tempFixturePath = yield copyFileToTempDir(paths.fix);
      editor = yield atom.workspace.open(tempFixturePath);
      tempDir = path.dirname(tempFixturePath);
      // Copy the config to the same temporary directory
      yield copyFileToDir(paths.config, tempDir);
    }));

    afterEach(function () {
      // Remove the temporary directory
      _rimraf2['default'].sync(tempDir);
    });

    (0, _jasmineFix.it)('does not delete the cache file when performing fixes', _asyncToGenerator(function* () {
      var tempCacheFile = yield copyFileToDir(paths.cache, tempDir);
      var checkCachefileExists = function checkCachefileExists() {
        fs.statSync(tempCacheFile);
      };
      expect(checkCachefileExists).not.toThrow();
      yield makeFixes(editor);
      expect(checkCachefileExists).not.toThrow();
    }));
  });

  describe('Ignores specified rules when editing', function () {
    var expectedPath = undefined;

    var checkNoConsole = function checkNoConsole(message) {
      var text = 'Unexpected console statement. (no-console)';
      var url = 'https://eslint.org/docs/rules/no-console';
      expect(message.severity).toBe('error');
      expect(message.excerpt).toBe(text);
      expect(message.url).toBe(url);
      expect(message.location.file).toBe(expectedPath);
      expect(message.location.position).toEqual([[0, 0], [0, 11]]);
    };

    var checkNoTrailingSpace = function checkNoTrailingSpace(message) {
      var text = 'Trailing spaces not allowed. (no-trailing-spaces)';
      var url = 'https://eslint.org/docs/rules/no-trailing-spaces';

      expect(message.severity).toBe('error');
      expect(message.excerpt).toBe(text);
      expect(message.url).toBe(url);
      expect(message.location.file).toBe(expectedPath);
      expect(message.location.position).toEqual([[1, 9], [1, 10]]);
    };

    var checkBefore = function checkBefore(messages) {
      expect(messages.length).toBe(1);
      checkNoConsole(messages[0]);
    };

    var checkNew = function checkNew(messages) {
      expect(messages.length).toBe(2);
      checkNoConsole(messages[0]);
      checkNoTrailingSpace(messages[1]);
    };

    var checkAfter = function checkAfter(messages) {
      expect(messages.length).toBe(1);
      checkNoConsole(messages[0]);
    };

    (0, _jasmineFix.it)('does nothing on saved files', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disabling.rulesToSilenceWhileTyping', ['no-trailing-spaces']);
      atom.config.set('linter-eslint.autofix.ignoreFixableRulesWhileTyping', true);
      expectedPath = paths.modifiedIgnoreSpace;
      var editor = yield atom.workspace.open(expectedPath);
      // Run once to populate the fixable rules list
      yield lint(editor);
      // Run again for the testable results
      var messages = yield lint(editor);
      checkNew(messages);
    }));

    (0, _jasmineFix.it)('allows ignoring a specific list of rules when modified', _asyncToGenerator(function* () {
      expectedPath = paths.modifiedIgnore;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify expected error before
      var firstMessages = yield lint(editor);
      checkBefore(firstMessages);

      // Insert a space into the editor
      editor.getBuffer().insert([1, 9], ' ');

      // Verify the space is showing an error
      var messages = yield lint(editor);
      checkNew(messages);

      // Enable the option under test
      atom.config.set('linter-eslint.disabling.rulesToSilenceWhileTyping', ['no-trailing-spaces']);

      // Check the lint results
      var newMessages = yield lint(editor);
      checkAfter(newMessages);
    }));

    (0, _jasmineFix.it)('allows ignoring all fixable rules while typing', _asyncToGenerator(function* () {
      expectedPath = paths.modifiedIgnore;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify no error before
      var firstMessages = yield lint(editor);
      checkBefore(firstMessages);

      // Insert a space into the editor
      editor.getBuffer().insert([1, 9], ' ');

      // Verify the space is showing an error
      var messages = yield lint(editor);
      checkNew(messages);

      // Enable the option under test
      // NOTE: Depends on no-trailing-spaces being marked as fixable by ESLint
      atom.config.set('linter-eslint.autofix.ignoreFixableRulesWhileTyping', true);

      // Check the lint results
      var newMessages = yield lint(editor);
      checkAfter(newMessages);
    }));

    (0, _jasmineFix.it)('allows ignoring fixible rules from plugins while typing', _asyncToGenerator(function* () {
      expectedPath = paths.fixablePlugin;
      var editor = yield atom.workspace.open(expectedPath);

      // Verify no error before the editor is modified
      var firstMessages = yield lint(editor);
      expect(firstMessages.length).toBe(0);

      // Remove the newline between the import and console log
      editor.getBuffer().deleteRow(1);

      // Verify there is an error for the fixable import/newline-after-import rule
      var messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe('Expected 1 empty line after import ' + 'statement not followed by another import. (import/newline-after-import)');

      // Enable the option under test
      // NOTE: Depends on mport/newline-after-import rule being marked as fixable
      atom.config.set('linter-eslint.autofix.ignoreFixableRulesWhileTyping', true);

      // Check the lint results
      var newMessages = yield lint(editor);
      expect(newMessages.length).toBe(0);
    }));
  });

  describe('prints debugging information with the `debug` command', function () {
    var editor = undefined;
    var expectedMessage = 'linter-eslint debugging information';
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(paths.good);
    }));

    (0, _jasmineFix.it)('shows an info notification', _asyncToGenerator(function* () {
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:debug');
      var notification = yield notificationPromise;

      expect(notification.getMessage()).toBe(expectedMessage);
      expect(notification.getType()).toEqual('info');
    }));

    (0, _jasmineFix.it)('includes debugging information in the details', _asyncToGenerator(function* () {
      var notificationPromise = getNotification(expectedMessage);
      atom.commands.dispatch(atom.views.getView(editor), 'linter-eslint:debug');
      var notification = yield notificationPromise;
      var detail = notification.getDetail();

      expect(detail.includes('Atom version: ' + atom.getVersion())).toBe(true);
      expect(detail.includes('linter-eslint version:')).toBe(true);
      expect(detail.includes('Platform: ' + process.platform)).toBe(true);
      expect(detail.includes('linter-eslint configuration:')).toBe(true);
      expect(detail.includes('Using local project ESLint')).toBe(true);
    }));
  });

  (0, _jasmineFix.it)('handles ranges in messages', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(paths.endRange);
    var messages = yield lint(editor);
    var expected = 'Unreachable code. (no-unreachable)';
    var expectedUrl = 'https://eslint.org/docs/rules/no-unreachable';

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(expected);
    expect(messages[0].url).toBe(expectedUrl);
    expect(messages[0].location.file).toBe(paths.endRange);
    expect(messages[0].location.position).toEqual([[5, 2], [6, 15]]);
  }));

  describe('when setting `disableWhenNoEslintConfig` is false', function () {
    var editor = undefined;
    var tempFilePath = undefined;
    var tempFixtureDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disabling.disableWhenNoEslintConfig', false);

      tempFilePath = yield copyFileToTempDir(paths.badInline);
      editor = yield atom.workspace.open(tempFilePath);
      tempFixtureDir = path.dirname(tempFilePath);
    }));

    afterEach(function () {
      _rimraf2['default'].sync(tempFixtureDir);
    });

    (0, _jasmineFix.it)('errors when no config file is found', _asyncToGenerator(function* () {
      var messages = yield lint(editor);
      var expected = 'Error while running ESLint: No ESLint configuration found..';
      var description = '<div style="white-space: pre-wrap">No ESLint configuration found.\n<hr />Error: No ESLint configuration found.\n    at Config.getLocalConfigHierarchy';
      // The rest of the description includes paths specific to the computer running it
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].description.startsWith(description)).toBe(true);
      expect(messages[0].url).not.toBeDefined();
      expect(messages[0].location.file).toBe(tempFilePath);
      expect(messages[0].location.position).toEqual([[0, 0], [0, 28]]);
    }));
  });

  describe('when `disableWhenNoEslintConfig` is true', function () {
    var editor = undefined;
    var tempFixtureDir = undefined;

    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      atom.config.set('linter-eslint.disabling.disableWhenNoEslintConfig', true);

      var tempFilePath = yield copyFileToTempDir(paths.badInline);
      editor = yield atom.workspace.open(tempFilePath);
      tempFixtureDir = path.dirname(tempFilePath);
    }));

    afterEach(function () {
      _rimraf2['default'].sync(tempFixtureDir);
    });

    (0, _jasmineFix.it)('does not report errors when no config file is found', _asyncToGenerator(function* () {
      var messages = yield lint(editor);

      expect(messages.length).toBe(0);
    }));
  });

  describe('lets ESLint handle configuration', function () {
    (0, _jasmineFix.it)('works when the cache fails', _asyncToGenerator(function* () {
      // Ensure the cache is enabled, since we will be taking advantage of
      // a failing in it's operation
      atom.config.set('linter-eslint.advanced.disableFSCache', false);
      var fooPath = path.join(paths.badCache, 'temp', 'foo.js');
      var newConfigPath = path.join(paths.badCache, 'temp', '.eslintrc.js');
      var editor = yield atom.workspace.open(fooPath);
      function undefMsg(varName) {
        return '\'' + varName + '\' is not defined. (no-undef)';
      }
      var expectedUrl = 'https://eslint.org/docs/rules/no-undef';

      // Trigger a first lint to warm up the cache with the first config result
      var messages = yield lint(editor);
      expect(messages.length).toBe(2);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(undefMsg('console'));
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(fooPath);
      expect(messages[0].location.position).toEqual([[1, 2], [1, 9]]);
      expect(messages[1].severity).toBe('error');
      expect(messages[1].excerpt).toBe(undefMsg('bar'));
      expect(messages[1].url).toBe(expectedUrl);
      expect(messages[1].location.file).toBe(fooPath);
      expect(messages[1].location.position).toEqual([[1, 14], [1, 17]]);

      // Write the new configuration file
      var newConfig = {
        env: {
          browser: true
        }
      };
      var configContents = 'module.exports = ' + JSON.stringify(newConfig, null, 2) + '\n';
      fs.writeFileSync(newConfigPath, configContents);

      // Lint again, ESLint should recognise the new configuration
      // The cached config results are still pointing at the _parent_ file. ESLint
      // would partially handle this situation if the config file was specified
      // from the cache.
      messages = yield lint(editor);
      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(undefMsg('bar'));
      expect(messages[0].url).toBe(expectedUrl);
      expect(messages[0].location.file).toBe(fooPath);
      expect(messages[0].location.position).toEqual([[1, 14], [1, 17]]);

      // Update the configuration
      newConfig.rules = {
        'no-undef': 'off'
      };
      configContents = 'module.exports = ' + JSON.stringify(newConfig, null, 2) + '\n';
      fs.writeFileSync(newConfigPath, configContents);

      // Lint again, if the cache was specifying the file ESLint at this point
      // would fail to update the configuration fully, and would still report a
      // no-undef error.
      messages = yield lint(editor);
      expect(messages.length).toBe(0);

      // Delete the temporary configuration file
      fs.unlinkSync(newConfigPath);
    }));
  });

  describe('works with HTML files', function () {
    var embeddedScope = 'source.js.embedded.html';
    var scopes = linterProvider.grammarScopes;

    (0, _jasmineFix.it)('adds the HTML scope when the setting is enabled', function () {
      expect(scopes.includes(embeddedScope)).toBe(false);
      atom.config.set('linter-eslint.lintHtmlFiles', true);
      expect(scopes.includes(embeddedScope)).toBe(true);
      atom.config.set('linter-eslint.lintHtmlFiles', false);
      expect(scopes.includes(embeddedScope)).toBe(false);
    });

    (0, _jasmineFix.it)('keeps the HTML scope with custom scopes', function () {
      expect(scopes.includes(embeddedScope)).toBe(false);
      atom.config.set('linter-eslint.lintHtmlFiles', true);
      expect(scopes.includes(embeddedScope)).toBe(true);
      atom.config.set('linter-eslint.scopes', ['foo.bar']);
      expect(scopes.includes(embeddedScope)).toBe(true);
    });
  });

  describe('handles the Show Rule ID in Messages option', function () {
    var expectedUrlRegEx = /https[\S]+eslint-plugin-import[\S]+no-unresolved.md/;

    (0, _jasmineFix.it)('shows the rule ID when enabled', _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.advanced.showRuleIdInMessage', true);
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'. (import/no-unresolved)";

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toMatch(expectedUrlRegEx);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));

    (0, _jasmineFix.it)("doesn't show the rule ID when disabled", _asyncToGenerator(function* () {
      atom.config.set('linter-eslint.advanced.showRuleIdInMessage', false);
      var editor = yield atom.workspace.open(paths.badImport);
      var messages = yield lint(editor);
      var expected = "Unable to resolve path to module '../nonexistent'.";

      expect(messages.length).toBe(1);
      expect(messages[0].severity).toBe('error');
      expect(messages[0].excerpt).toBe(expected);
      expect(messages[0].url).toMatch(expectedUrlRegEx);
      expect(messages[0].location.file).toBe(paths.badImport);
      expect(messages[0].location.position).toEqual([[0, 24], [0, 40]]);
      expect(messages[0].solutions).not.toBeDefined();
    }));
  });

  describe("registers an 'ESLint Fix' right click menu command", function () {
    // NOTE: Reaches into the private data of the ContextMenuManager, there is
    // no public method to check this though so...
    expect(atom.contextMenu.itemSets.some(function (itemSet) {
      return(
        // Matching selector...
        itemSet.selector === 'atom-text-editor:not(.mini), .overlayer' && itemSet.items.some(function (item) {
          return(
            // Matching command...
            item.command === 'linter-eslint:fix-file'
            // Matching label
             && item.label === 'ESLint Fix'
            // And has a function controlling display
             && typeof item.shouldDisplay === 'function'
          );
        })
      );
    }));
  });
});

describe('processESLintMessages', function () {
  (0, _jasmineFix.it)('handles messages with null endColumn', _asyncToGenerator(function* () {
    // Get a editor instance with at least a single line
    var editor = yield atom.workspace.open(paths.good);

    var result = yield (0, _srcHelpers.processESLintMessages)([{
      column: null,
      endColumn: null,
      line: 1,
      endLine: null,
      message: 'Test Null endColumn',
      nodeType: 'Block',
      ruleId: 'test-null-endcolumn',
      severity: 2
    }], editor, false);

    expect(result[0].excerpt).toBe('Test Null endColumn');
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy9saW50ZXItZXNsaW50LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBK0RzQixpQkFBaUIscUJBQWhDLFdBQWlDLGNBQWMsRUFBRTtBQUN0RCxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLGlCQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQzFELFNBQU8sYUFBYSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQTtDQUNyRDs7OztJQUVjLGVBQWUscUJBQTlCLFdBQStCLGVBQWUsRUFBRTtBQUM5QyxTQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzlCLFFBQUksZUFBZSxZQUFBLENBQUE7QUFDbkIsUUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLFlBQVksRUFBSztBQUN4QyxVQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxlQUFlLEVBQUU7Ozs7QUFJakQsZUFBTTtPQUNQOztBQUVELHFCQUFlLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDekIsYUFBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0tBQ3RCLENBQUE7O0FBRUQsbUJBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFBO0dBQzNFLENBQUMsQ0FBQTtDQUNIOztJQUVjLFNBQVMscUJBQXhCLFdBQXlCLFVBQVUsRUFBRTtBQUNuQyxNQUFNLG1CQUFtQixHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLOztBQUVuRCxRQUFNLHdCQUF3QixHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUN4RSw4QkFBd0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQyxhQUFPLEVBQUUsQ0FBQTtLQUNWLENBQUMsQ0FBQTtHQUNILENB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QUFTLENBQUMsQ0FBQTtBQUMzQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMxQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2pELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ25FLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN4RCxFQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsc0JBQUcsd0NBQXdDLG9CQUFFLGFBQVk7QUFDdkQsUUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDckQsUUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLENB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LFdBQVcsR0FBRyx3Q0FBd0MsQ0FBQTs7O0FBRzVELFVBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pDLFlBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0FBQ3JELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3pDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMvQyxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0QsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDMUMsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDakQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7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QyxVQUFBLElBQUk7OztBQUV4QixnQkFBSSxDQUFDLE9BQU8sS0FBSyx3QkFBd0I7O2dCQUV0QyxJQUFJLENBQUMsS0FBSyxLQUFLLFlBQVk7O2dCQUUzQixPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssVUFBVTs7U0FDNUMsQ0FBQzs7S0FDSCxDQUFDLENBQUMsQ0FBQTtHQUNKLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQTs7QUFFRixRQUFRLENBQUMsdUJBQXVCLEVBQUUsWUFBTTtBQUN0QyxzQkFBRyxzQ0FBc0Msb0JBQUUsYUFBWTs7QUFFckQsUUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBELFFBQU0sTUFBTSxHQUFHLE1BQU0sdUNBQXNCLENBQUM7QUFDMUMsWUFBTSxFQUFFLElBQUk7QUFDWixlQUFTLEVBQUUsSUFBSTtBQUNmLFVBQUksRUFBRSxDQUFDO0FBQ1AsYUFBTyxFQUFFLElBQUk7QUFDYixhQUFPLEVBQUUscUJBQXFCO0FBQzlCLGNBQVEsRUFBRSxPQUFPO0FBQ2pCLFlBQU0sRUFBRSxxQkFBcUI7QUFDN0IsY0FBUSxFQUFFLENBQUM7S0FDWixDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVsQixVQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0dBQ3RELEVBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvbGludGVyLWVzbGludC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnXG5pbXBvcnQgeyB0bXBkaXIgfSBmcm9tICdvcydcbmltcG9ydCByaW1yYWYgZnJvbSAncmltcmFmJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBpdCwgZml0IH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgbGludGVyRXNsaW50IGZyb20gJy4uL3NyYy9tYWluJ1xuXG5pbXBvcnQgeyBwcm9jZXNzRVNMaW50TWVzc2FnZXMgfSBmcm9tICcuLi9zcmMvaGVscGVycydcblxuY29uc3QgZml4dHVyZXNEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnKVxuXG5jb25zdCBmaXh0dXJlcyA9IHtcbiAgZ29vZDogWydmaWxlcycsICdnb29kLmpzJ10sXG4gIGJhZDogWydmaWxlcycsICdiYWQuanMnXSxcbiAgYmFkSW5saW5lOiBbJ2ZpbGVzJywgJ2JhZElubGluZS5qcyddLFxuICBlbXB0eTogWydmaWxlcycsICdlbXB0eS5qcyddLFxuICBmaXg6IFsnZmlsZXMnLCAnZml4LmpzJ10sXG4gIGNhY2hlOiBbJ2ZpbGVzJywgJy5lc2xpbnRjYWNoZSddLFxuICBjb25maWc6IFsnY29uZmlncycsICcuZXNsaW50cmMueW1sJ10sXG4gIGlnbm9yZWQ6IFsnZXNsaW50aWdub3JlJywgJ2lnbm9yZWQuanMnXSxcbiAgZW5kUmFuZ2U6IFsnZW5kLXJhbmdlJywgJ25vLXVucmVhY2hhYmxlLmpzJ10sXG4gIGJhZENhY2hlOiBbJ2JhZENhY2hlJ10sXG4gIG1vZGlmaWVkSWdub3JlOiBbJ21vZGlmaWVkLWlnbm9yZS1ydWxlJywgJ2Zvby5qcyddLFxuICBtb2RpZmllZElnbm9yZVNwYWNlOiBbJ21vZGlmaWVkLWlnbm9yZS1ydWxlJywgJ2Zvby1zcGFjZS5qcyddLFxuICBpbXBvcnRpbmc6IFsnaW1wb3J0LXJlc29sdXRpb24nLCAnbmVzdGVkJywgJ2ltcG9ydGluZy5qcyddLFxuICBiYWRJbXBvcnQ6IFsnaW1wb3J0LXJlc29sdXRpb24nLCAnbmVzdGVkJywgJ2JhZEltcG9ydC5qcyddLFxuICBmaXhhYmxlUGx1Z2luOiBbJ3BsdWdpbi1pbXBvcnQnLCAnbGlmZS5qcyddLFxuICBlc2xpbnRpZ25vcmVEaXI6IFsnZXNsaW50aWdub3JlJ10sXG4gIGVzbGludElnbm9yZUtleURpcjogWydjb25maWdzJywgJ2VzbGludGlnbm9yZWtleSddXG59XG5cbmNvbnN0IHBhdGhzID0gT2JqZWN0LmtleXMoZml4dHVyZXMpXG4gIC5yZWR1Y2UoKGFjY3VtdWxhdG9yLCBmaXh0dXJlKSA9PiB7XG4gICAgY29uc3QgYWNjID0gYWNjdW11bGF0b3JcbiAgICBhY2NbZml4dHVyZV0gPSBwYXRoLmpvaW4oZml4dHVyZXNEaXIsIC4uLihmaXh0dXJlc1tmaXh0dXJlXSkpXG4gICAgcmV0dXJuIGFjY1xuICB9LCB7fSlcblxuLyoqXG4gKiBBc3luYyBoZWxwZXIgdG8gY29weSBhIGZpbGUgZnJvbSBvbmUgcGxhY2UgdG8gYW5vdGhlciBvbiB0aGUgZmlsZXN5c3RlbS5cbiAqIEBwYXJhbSAge3N0cmluZ30gZmlsZVRvQ29weVBhdGggIFBhdGggb2YgdGhlIGZpbGUgdG8gYmUgY29waWVkXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRlc3RpbmF0aW9uRGlyICBEaXJlY3RvcnkgdG8gcGFzdGUgdGhlIGZpbGUgaW50b1xuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgRnVsbCBwYXRoIG9mIHRoZSBmaWxlIGluIGNvcHkgZGVzdGluYXRpb25cbiAqL1xuZnVuY3Rpb24gY29weUZpbGVUb0RpcihmaWxlVG9Db3B5UGF0aCwgZGVzdGluYXRpb25EaXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgY29uc3QgZGVzdGluYXRpb25QYXRoID0gcGF0aC5qb2luKGRlc3RpbmF0aW9uRGlyLCBwYXRoLmJhc2VuYW1lKGZpbGVUb0NvcHlQYXRoKSlcbiAgICBjb25zdCB3cyA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRlc3RpbmF0aW9uUGF0aClcbiAgICB3cy5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKGRlc3RpbmF0aW9uUGF0aCkpXG4gICAgZnMuY3JlYXRlUmVhZFN0cmVhbShmaWxlVG9Db3B5UGF0aCkucGlwZSh3cylcbiAgfSlcbn1cblxuLyoqXG4gKiBVdGlsaXR5IGhlbHBlciB0byBjb3B5IGEgZmlsZSBpbnRvIHRoZSBPUyB0ZW1wIGRpcmVjdG9yeS5cbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVUb0NvcHlQYXRoICBQYXRoIG9mIHRoZSBmaWxlIHRvIGJlIGNvcGllZFxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgRnVsbCBwYXRoIG9mIHRoZSBmaWxlIGluIGNvcHkgZGVzdGluYXRpb25cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb3B5RmlsZVRvVGVtcERpcihmaWxlVG9Db3B5UGF0aCkge1xuICBjb25zdCB0ZW1wRml4dHVyZURpciA9IGZzLm1rZHRlbXBTeW5jKHRtcGRpcigpICsgcGF0aC5zZXApXG4gIHJldHVybiBjb3B5RmlsZVRvRGlyKGZpbGVUb0NvcHlQYXRoLCB0ZW1wRml4dHVyZURpcilcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0Tm90aWZpY2F0aW9uKGV4cGVjdGVkTWVzc2FnZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBsZXQgbm90aWZpY2F0aW9uU3ViXG4gICAgY29uc3QgbmV3Tm90aWZpY2F0aW9uID0gKG5vdGlmaWNhdGlvbikgPT4ge1xuICAgICAgaWYgKG5vdGlmaWNhdGlvbi5nZXRNZXNzYWdlKCkgIT09IGV4cGVjdGVkTWVzc2FnZSkge1xuICAgICAgICAvLyBBcyB0aGUgc3BlY3MgZXhlY3V0ZSBhc3luY2hyb25vdXNseSwgaXQncyBwb3NzaWJsZSBhIG5vdGlmaWNhdGlvblxuICAgICAgICAvLyBmcm9tIGEgZGlmZmVyZW50IHNwZWMgd2FzIGdyYWJiZWQsIGlmIHRoZSBtZXNzYWdlIGRvZXNuJ3QgbWF0Y2ggd2hhdFxuICAgICAgICAvLyBpcyBleHBlY3RlZCBzaW1wbHkgcmV0dXJuIGFuZCBrZWVwIHdhaXRpbmcgZm9yIHRoZSBuZXh0IG1lc3NhZ2UuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gRGlzcG9zZSBvZiB0aGUgbm90aWZpY2F0aW9uIHN1YnNjcmlwdGlvblxuICAgICAgbm90aWZpY2F0aW9uU3ViLmRpc3Bvc2UoKVxuICAgICAgcmVzb2x2ZShub3RpZmljYXRpb24pXG4gICAgfVxuICAgIC8vIFN1YnNjcmliZSB0byBBdG9tJ3Mgbm90aWZpY2F0aW9uc1xuICAgIG5vdGlmaWNhdGlvblN1YiA9IGF0b20ubm90aWZpY2F0aW9ucy5vbkRpZEFkZE5vdGlmaWNhdGlvbihuZXdOb3RpZmljYXRpb24pXG4gIH0pXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1ha2VGaXhlcyh0ZXh0RWRpdG9yKSB7XG4gIGNvbnN0IGVkaXRvclJlbG9hZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIC8vIFN1YnNjcmliZSB0byBmaWxlIHJlbG9hZCBldmVudHNcbiAgICBjb25zdCBlZGl0b3JSZWxvYWRTdWJzY3JpcHRpb24gPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkUmVsb2FkKCgpID0+IHtcbiAgICAgIGVkaXRvclJlbG9hZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIHJlc29sdmUoKVxuICAgIH0pXG4gIH0pXG5cbiAgY29uc3QgZXhwZWN0ZWRNZXNzYWdlID0gJ0xpbnRlci1FU0xpbnQ6IEZpeCBjb21wbGV0ZS4nXG4gIC8vIFN1YnNjcmliZSB0byBub3RpZmljYXRpb24gZXZlbnRzXG4gIGNvbnN0IG5vdGlmaWNhdGlvblByb21pc2UgPSBnZXROb3RpZmljYXRpb24oZXhwZWN0ZWRNZXNzYWdlKVxuXG4gIC8vIFN1YnNjcmlwdGlvbnMgbm93IGFjdGl2ZSBmb3IgRWRpdG9yIFJlbG9hZCBhbmQgTWVzc2FnZSBOb3RpZmljYXRpb25cbiAgLy8gU2VuZCBvZmYgYSBmaXggcmVxdWVzdC5cbiAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcodGV4dEVkaXRvciksICdsaW50ZXItZXNsaW50OmZpeC1maWxlJylcblxuICBjb25zdCBub3RpZmljYXRpb24gPSBhd2FpdCBub3RpZmljYXRpb25Qcm9taXNlXG4gIGV4cGVjdChub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpKS50b0JlKGV4cGVjdGVkTWVzc2FnZSlcbiAgZXhwZWN0KG5vdGlmaWNhdGlvbi5nZXRUeXBlKCkpLnRvQmUoJ3N1Y2Nlc3MnKVxuXG4gIC8vIEFmdGVyIGVkaXRvciByZWxvYWRzLCBpdCBzaG91bGQgYmUgc2FmZSBmb3IgY29uc3VtaW5nIHRlc3QgdG8gcmVzdW1lLlxuICByZXR1cm4gZWRpdG9yUmVsb2FkUHJvbWlzZVxufVxuXG5kZXNjcmliZSgnVGhlIGVzbGludCBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBjb25zdCBsaW50ZXJQcm92aWRlciA9IGxpbnRlckVzbGludC5wcm92aWRlTGludGVyKClcbiAgY29uc3QgeyBsaW50IH0gPSBsaW50ZXJQcm92aWRlclxuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5hZHZhbmNlZC5kaXNhYmxlRlNDYWNoZScsIGZhbHNlKVxuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5hZHZhbmNlZC5kaXNhYmxlRXNsaW50SWdub3JlJywgdHJ1ZSlcblxuICAgIC8vIEFjdGl2YXRlIHRoZSBKYXZhU2NyaXB0IGxhbmd1YWdlIHNvIEF0b20ga25vd3Mgd2hhdCB0aGUgZmlsZXMgYXJlXG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuICAgIC8vIEFjdGl2YXRlIHRoZSBwcm92aWRlclxuICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsaW50ZXItZXNsaW50JylcbiAgfSlcblxuICBkZXNjcmliZSgnY2hlY2tzIGJhZC5qcyBhbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvciA9IG51bGxcbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuYmFkKVxuICAgIH0pXG5cbiAgICBpdCgndmVyaWZpZXMgdGhlIG1lc3NhZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMilcblxuICAgICAgY29uc3QgZXhwZWN0ZWQwID0gXCInZm9vJyBpcyBub3QgZGVmaW5lZC4gKG5vLXVuZGVmKVwiXG4gICAgICBjb25zdCBleHBlY3RlZDBVcmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tdW5kZWYnXG4gICAgICBjb25zdCBleHBlY3RlZDEgPSAnRXh0cmEgc2VtaWNvbG9uLiAoc2VtaSknXG4gICAgICBjb25zdCBleHBlY3RlZDFVcmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvc2VtaSdcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShleHBlY3RlZDApXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b0JlKGV4cGVjdGVkMFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHBhdGhzLmJhZClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDBdLCBbMCwgM11dKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNvbHV0aW9ucykubm90LnRvQmVEZWZpbmVkKClcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0uZXhjZXJwdCkudG9CZShleHBlY3RlZDEpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0udXJsKS50b0JlKGV4cGVjdGVkMVVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5sb2NhdGlvbi5maWxlKS50b0JlKHBhdGhzLmJhZClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDhdLCBbMCwgOV1dKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNvbHV0aW9ucy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5zb2x1dGlvbnNbMF0ucG9zaXRpb24pLnRvRXF1YWwoW1swLCA2XSwgWzAsIDldXSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5zb2x1dGlvbnNbMF0ucmVwbGFjZVdpdGgpLnRvQmUoJzQyJylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYW4gZW1wdHkgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmVtcHR5KVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG5cbiAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gIH0pXG5cbiAgaXQoJ2ZpbmRzIG5vdGhpbmcgd3Jvbmcgd2l0aCBhIHZhbGlkIGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5nb29kKVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG5cbiAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gIH0pXG5cbiAgaXQoJ3JlcG9ydHMgdGhlIGZpeGVzIGZvciBmaXhhYmxlIGVycm9ycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmZpeClcbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNvbHV0aW9uc1swXS5wb3NpdGlvbikudG9FcXVhbChbWzAsIDEwXSwgWzEsIDhdXSlcbiAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zWzBdLnJlcGxhY2VXaXRoKS50b0JlKCc2XFxuZnVuY3Rpb24nKVxuXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnNvbHV0aW9uc1swXS5wb3NpdGlvbikudG9FcXVhbChbWzIsIDBdLCBbMiwgMV1dKVxuICAgIGV4cGVjdChtZXNzYWdlc1sxXS5zb2x1dGlvbnNbMF0ucmVwbGFjZVdpdGgpLnRvQmUoJyAgJylcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiByZXNvbHZpbmcgaW1wb3J0IHBhdGhzIHVzaW5nIGVzbGludC1wbHVnaW4taW1wb3J0JywgKCkgPT4ge1xuICAgIGl0KCdjb3JyZWN0bHkgcmVzb2x2ZXMgaW1wb3J0cyBmcm9tIHBhcmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuaW1wb3J0aW5nKVxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvd3MgYSBtZXNzYWdlIGZvciBhbiBpbnZhbGlkIGltcG9ydCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuYmFkSW1wb3J0KVxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gXCJVbmFibGUgdG8gcmVzb2x2ZSBwYXRoIHRvIG1vZHVsZSAnLi4vbm9uZXhpc3RlbnQnLiAoaW1wb3J0L25vLXVucmVzb2x2ZWQpXCJcbiAgICAgIGNvbnN0IGV4cGVjdGVkVXJsUmVnRXggPSAvaHR0cHNbXFxTXStlc2xpbnQtcGx1Z2luLWltcG9ydFtcXFNdK25vLXVucmVzb2x2ZWQubWQvXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhwZWN0ZWQpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b01hdGNoKGV4cGVjdGVkVXJsUmVnRXgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24uZmlsZSkudG9CZShwYXRocy5iYWRJbXBvcnQpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1swLCAyNF0sIFswLCA0MF1dKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNvbHV0aW9ucykubm90LnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGEgZmlsZSBpcyBzcGVjaWZpZWQgaW4gYW4gLmVzbGludGlnbm9yZSBmaWxlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmFkdmFuY2VkLmRpc2FibGVFc2xpbnRJZ25vcmUnLCBmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3dpbGwgbm90IGdpdmUgd2FybmluZ3Mgd2hlbiBsaW50aW5nIHRoZSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5pZ25vcmVkKVxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnd2lsbCBub3QgZ2l2ZSB3YXJuaW5ncyB3aGVuIGF1dG9maXhpbmcgdGhlIGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmlnbm9yZWQpXG4gICAgICBjb25zdCBleHBlY3RlZE1lc3NhZ2UgPSAnTGludGVyLUVTTGludDogRml4IGNvbXBsZXRlLidcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvblByb21pc2UgPSBnZXROb3RpZmljYXRpb24oZXhwZWN0ZWRNZXNzYWdlKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2xpbnRlci1lc2xpbnQ6Zml4LWZpbGUnKVxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXdhaXQgbm90aWZpY2F0aW9uUHJvbWlzZVxuXG4gICAgICBleHBlY3Qobm90aWZpY2F0aW9uLmdldE1lc3NhZ2UoKSkudG9CZShleHBlY3RlZE1lc3NhZ2UpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhIGZpbGUgaXMgbm90IHNwZWNpZmllZCBpbiAuZXNsaW50aWdub3JlIGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgaXQoJ3dpbGwgZ2l2ZSB3YXJuaW5ncyB3aGVuIGxpbnRpbmcgdGhlIGZpbGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wUGF0aCA9IGF3YWl0IGNvcHlGaWxlVG9UZW1wRGlyKHBhdGguam9pbihwYXRocy5lc2xpbnRpZ25vcmVEaXIsICdpZ25vcmVkLmpzJykpXG4gICAgICBjb25zdCB0ZW1wRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBQYXRoKVxuXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBQYXRoKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmFkdmFuY2VkLmRpc2FibGVFc2xpbnRJZ25vcmUnLCBmYWxzZSlcbiAgICAgIGF3YWl0IGNvcHlGaWxlVG9EaXIocGF0aC5qb2luKHBhdGhzLmVzbGludGlnbm9yZURpciwgJy5lc2xpbnRyYy55YW1sJyksIHRlbXBEaXIpXG5cbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICByaW1yYWYuc3luYyh0ZW1wRGlyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYSBmaWxlIGlzIHNwZWNpZmllZCBpbiBhbiBlc2xpbnRJZ25vcmUga2V5IGluIHBhY2thZ2UuanNvbicsICgpID0+IHtcbiAgICBpdCgnd2lsbCBzdGlsbCBsaW50IHRoZSBmaWxlIGlmIGFuIC5lc2xpbnRpZ25vcmUgZmlsZSBpcyBwcmVzZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmFkdmFuY2VkLmRpc2FibGVFc2xpbnRJZ25vcmUnLCBmYWxzZSlcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKHBhdGhzLmVzbGludElnbm9yZUtleURpciwgJ2lnbm9yZWQuanMnKSlcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3dpbGwgbm90IGdpdmUgd2FybmluZ3Mgd2hlbiBsaW50aW5nIHRoZSBmaWxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdGVtcFBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRoLmpvaW4ocGF0aHMuZXNsaW50SWdub3JlS2V5RGlyLCAnaWdub3JlZC5qcycpKVxuICAgICAgY29uc3QgdGVtcERpciA9IHBhdGguZGlybmFtZSh0ZW1wUGF0aClcblxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wUGF0aClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5hZHZhbmNlZC5kaXNhYmxlRXNsaW50SWdub3JlJywgZmFsc2UpXG4gICAgICBhd2FpdCBjb3B5RmlsZVRvRGlyKHBhdGguam9pbihwYXRocy5lc2xpbnRJZ25vcmVLZXlEaXIsICdwYWNrYWdlLmpzb24nKSwgdGVtcERpcilcblxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgICAgIHJpbXJhZi5zeW5jKHRlbXBEaXIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZml4ZXMgZXJyb3JzJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JcbiAgICBsZXQgdGVtcERpclxuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAvLyBDb3B5IHRoZSBmaWxlIHRvIGEgdGVtcG9yYXJ5IGZvbGRlclxuICAgICAgY29uc3QgdGVtcEZpeHR1cmVQYXRoID0gYXdhaXQgY29weUZpbGVUb1RlbXBEaXIocGF0aHMuZml4KVxuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wRml4dHVyZVBhdGgpXG4gICAgICB0ZW1wRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBGaXh0dXJlUGF0aClcbiAgICAgIC8vIENvcHkgdGhlIGNvbmZpZyB0byB0aGUgc2FtZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICBhd2FpdCBjb3B5RmlsZVRvRGlyKHBhdGhzLmNvbmZpZywgdGVtcERpcilcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgICAgcmltcmFmLnN5bmModGVtcERpcilcbiAgICB9KVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gZmlyc3RMaW50KHRleHRFZGl0b3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludCh0ZXh0RWRpdG9yKVxuICAgICAgLy8gVGhlIG9yaWdpbmFsIGZpbGUgaGFzIHR3byBlcnJvcnNcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMilcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIGZpeCBsaW50aW5nIGVycm9ycycsIGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IGZpcnN0TGludChlZGl0b3IpXG4gICAgICBhd2FpdCBtYWtlRml4ZXMoZWRpdG9yKVxuICAgICAgY29uc3QgbWVzc2FnZXNBZnRlckZpeGluZyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuXG4gICAgICBleHBlY3QobWVzc2FnZXNBZnRlckZpeGluZy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgZml4IGxpbnRpbmcgZXJyb3JzIGZvciBydWxlcyB0aGF0IGFyZSBkaXNhYmxlZCB3aXRoIHJ1bGVzVG9EaXNhYmxlV2hpbGVGaXhpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuYXV0b2ZpeC5ydWxlc1RvRGlzYWJsZVdoaWxlRml4aW5nJywgWydzZW1pJ10pXG5cbiAgICAgIGF3YWl0IGZpcnN0TGludChlZGl0b3IpXG4gICAgICBhd2FpdCBtYWtlRml4ZXMoZWRpdG9yKVxuICAgICAgY29uc3QgbWVzc2FnZXNBZnRlckZpeGluZyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSAnRXh0cmEgc2VtaWNvbG9uLiAoc2VtaSknXG4gICAgICBjb25zdCBleHBlY3RlZFVybCA9ICdodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9zZW1pJ1xuXG4gICAgICBleHBlY3QobWVzc2FnZXNBZnRlckZpeGluZy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc0FmdGVyRml4aW5nWzBdLmV4Y2VycHQpLnRvQmUoZXhwZWN0ZWQpXG4gICAgICBleHBlY3QobWVzc2FnZXNBZnRlckZpeGluZ1swXS51cmwpLnRvQmUoZXhwZWN0ZWRVcmwpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBhbiBlc2xpbnQgY2FjaGUgZmlsZSBpcyBwcmVzZW50JywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JcbiAgICBsZXQgdGVtcERpclxuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICAvLyBDb3B5IHRoZSBmaWxlIHRvIGEgdGVtcG9yYXJ5IGZvbGRlclxuICAgICAgY29uc3QgdGVtcEZpeHR1cmVQYXRoID0gYXdhaXQgY29weUZpbGVUb1RlbXBEaXIocGF0aHMuZml4KVxuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3Blbih0ZW1wRml4dHVyZVBhdGgpXG4gICAgICB0ZW1wRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBGaXh0dXJlUGF0aClcbiAgICAgIC8vIENvcHkgdGhlIGNvbmZpZyB0byB0aGUgc2FtZSB0ZW1wb3JhcnkgZGlyZWN0b3J5XG4gICAgICBhd2FpdCBjb3B5RmlsZVRvRGlyKHBhdGhzLmNvbmZpZywgdGVtcERpcilcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgdGVtcG9yYXJ5IGRpcmVjdG9yeVxuICAgICAgcmltcmFmLnN5bmModGVtcERpcilcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IGRlbGV0ZSB0aGUgY2FjaGUgZmlsZSB3aGVuIHBlcmZvcm1pbmcgZml4ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB0ZW1wQ2FjaGVGaWxlID0gYXdhaXQgY29weUZpbGVUb0RpcihwYXRocy5jYWNoZSwgdGVtcERpcilcbiAgICAgIGNvbnN0IGNoZWNrQ2FjaGVmaWxlRXhpc3RzID0gKCkgPT4ge1xuICAgICAgICBmcy5zdGF0U3luYyh0ZW1wQ2FjaGVGaWxlKVxuICAgICAgfVxuICAgICAgZXhwZWN0KGNoZWNrQ2FjaGVmaWxlRXhpc3RzKS5ub3QudG9UaHJvdygpXG4gICAgICBhd2FpdCBtYWtlRml4ZXMoZWRpdG9yKVxuICAgICAgZXhwZWN0KGNoZWNrQ2FjaGVmaWxlRXhpc3RzKS5ub3QudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnSWdub3JlcyBzcGVjaWZpZWQgcnVsZXMgd2hlbiBlZGl0aW5nJywgKCkgPT4ge1xuICAgIGxldCBleHBlY3RlZFBhdGhcblxuICAgIGNvbnN0IGNoZWNrTm9Db25zb2xlID0gKG1lc3NhZ2UpID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSAnVW5leHBlY3RlZCBjb25zb2xlIHN0YXRlbWVudC4gKG5vLWNvbnNvbGUpJ1xuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3J1bGVzL25vLWNvbnNvbGUnXG4gICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UuZXhjZXJwdCkudG9CZSh0ZXh0KVxuICAgICAgZXhwZWN0KG1lc3NhZ2UudXJsKS50b0JlKHVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlLmxvY2F0aW9uLmZpbGUpLnRvQmUoZXhwZWN0ZWRQYXRoKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1swLCAwXSwgWzAsIDExXV0pXG4gICAgfVxuXG4gICAgY29uc3QgY2hlY2tOb1RyYWlsaW5nU3BhY2UgPSAobWVzc2FnZSkgPT4ge1xuICAgICAgY29uc3QgdGV4dCA9ICdUcmFpbGluZyBzcGFjZXMgbm90IGFsbG93ZWQuIChuby10cmFpbGluZy1zcGFjZXMpJ1xuICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vZXNsaW50Lm9yZy9kb2NzL3J1bGVzL25vLXRyYWlsaW5nLXNwYWNlcydcblxuICAgICAgZXhwZWN0KG1lc3NhZ2Uuc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlLmV4Y2VycHQpLnRvQmUodGV4dClcbiAgICAgIGV4cGVjdChtZXNzYWdlLnVybCkudG9CZSh1cmwpXG4gICAgICBleHBlY3QobWVzc2FnZS5sb2NhdGlvbi5maWxlKS50b0JlKGV4cGVjdGVkUGF0aClcbiAgICAgIGV4cGVjdChtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMSwgOV0sIFsxLCAxMF1dKVxuICAgIH1cblxuICAgIGNvbnN0IGNoZWNrQmVmb3JlID0gKG1lc3NhZ2VzKSA9PiB7XG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBjaGVja05vQ29uc29sZShtZXNzYWdlc1swXSlcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja05ldyA9IChtZXNzYWdlcykgPT4ge1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgY2hlY2tOb0NvbnNvbGUobWVzc2FnZXNbMF0pXG4gICAgICBjaGVja05vVHJhaWxpbmdTcGFjZShtZXNzYWdlc1sxXSlcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0FmdGVyID0gKG1lc3NhZ2VzKSA9PiB7XG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBjaGVja05vQ29uc29sZShtZXNzYWdlc1swXSlcbiAgICB9XG5cbiAgICBpdCgnZG9lcyBub3RoaW5nIG9uIHNhdmVkIGZpbGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmRpc2FibGluZy5ydWxlc1RvU2lsZW5jZVdoaWxlVHlwaW5nJywgWyduby10cmFpbGluZy1zcGFjZXMnXSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5hdXRvZml4Lmlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nJywgdHJ1ZSlcbiAgICAgIGV4cGVjdGVkUGF0aCA9IHBhdGhzLm1vZGlmaWVkSWdub3JlU3BhY2VcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZXhwZWN0ZWRQYXRoKVxuICAgICAgLy8gUnVuIG9uY2UgdG8gcG9wdWxhdGUgdGhlIGZpeGFibGUgcnVsZXMgbGlzdFxuICAgICAgYXdhaXQgbGludChlZGl0b3IpXG4gICAgICAvLyBSdW4gYWdhaW4gZm9yIHRoZSB0ZXN0YWJsZSByZXN1bHRzXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tOZXcobWVzc2FnZXMpXG4gICAgfSlcblxuICAgIGl0KCdhbGxvd3MgaWdub3JpbmcgYSBzcGVjaWZpYyBsaXN0IG9mIHJ1bGVzIHdoZW4gbW9kaWZpZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBleHBlY3RlZFBhdGggPSBwYXRocy5tb2RpZmllZElnbm9yZVxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihleHBlY3RlZFBhdGgpXG5cbiAgICAgIC8vIFZlcmlmeSBleHBlY3RlZCBlcnJvciBiZWZvcmVcbiAgICAgIGNvbnN0IGZpcnN0TWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGNoZWNrQmVmb3JlKGZpcnN0TWVzc2FnZXMpXG5cbiAgICAgIC8vIEluc2VydCBhIHNwYWNlIGludG8gdGhlIGVkaXRvclxuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmluc2VydChbMSwgOV0sICcgJylcblxuICAgICAgLy8gVmVyaWZ5IHRoZSBzcGFjZSBpcyBzaG93aW5nIGFuIGVycm9yXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tOZXcobWVzc2FnZXMpXG5cbiAgICAgIC8vIEVuYWJsZSB0aGUgb3B0aW9uIHVuZGVyIHRlc3RcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxpbmcucnVsZXNUb1NpbGVuY2VXaGlsZVR5cGluZycsIFsnbm8tdHJhaWxpbmctc3BhY2VzJ10pXG5cbiAgICAgIC8vIENoZWNrIHRoZSBsaW50IHJlc3VsdHNcbiAgICAgIGNvbnN0IG5ld01lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjaGVja0FmdGVyKG5ld01lc3NhZ2VzKVxuICAgIH0pXG5cbiAgICBpdCgnYWxsb3dzIGlnbm9yaW5nIGFsbCBmaXhhYmxlIHJ1bGVzIHdoaWxlIHR5cGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdGVkUGF0aCA9IHBhdGhzLm1vZGlmaWVkSWdub3JlXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGV4cGVjdGVkUGF0aClcblxuICAgICAgLy8gVmVyaWZ5IG5vIGVycm9yIGJlZm9yZVxuICAgICAgY29uc3QgZmlyc3RNZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY2hlY2tCZWZvcmUoZmlyc3RNZXNzYWdlcylcblxuICAgICAgLy8gSW5zZXJ0IGEgc3BhY2UgaW50byB0aGUgZWRpdG9yXG4gICAgICBlZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsxLCA5XSwgJyAnKVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIHNwYWNlIGlzIHNob3dpbmcgYW4gZXJyb3JcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjaGVja05ldyhtZXNzYWdlcylcblxuICAgICAgLy8gRW5hYmxlIHRoZSBvcHRpb24gdW5kZXIgdGVzdFxuICAgICAgLy8gTk9URTogRGVwZW5kcyBvbiBuby10cmFpbGluZy1zcGFjZXMgYmVpbmcgbWFya2VkIGFzIGZpeGFibGUgYnkgRVNMaW50XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuYXV0b2ZpeC5pZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZycsIHRydWUpXG5cbiAgICAgIC8vIENoZWNrIHRoZSBsaW50IHJlc3VsdHNcbiAgICAgIGNvbnN0IG5ld01lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjaGVja0FmdGVyKG5ld01lc3NhZ2VzKVxuICAgIH0pXG5cbiAgICBpdCgnYWxsb3dzIGlnbm9yaW5nIGZpeGlibGUgcnVsZXMgZnJvbSBwbHVnaW5zIHdoaWxlIHR5cGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGV4cGVjdGVkUGF0aCA9IHBhdGhzLmZpeGFibGVQbHVnaW5cbiAgICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZXhwZWN0ZWRQYXRoKVxuXG4gICAgICAvLyBWZXJpZnkgbm8gZXJyb3IgYmVmb3JlIHRoZSBlZGl0b3IgaXMgbW9kaWZpZWRcbiAgICAgIGNvbnN0IGZpcnN0TWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcbiAgICAgIGV4cGVjdChmaXJzdE1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuXG4gICAgICAvLyBSZW1vdmUgdGhlIG5ld2xpbmUgYmV0d2VlbiB0aGUgaW1wb3J0IGFuZCBjb25zb2xlIGxvZ1xuICAgICAgZWRpdG9yLmdldEJ1ZmZlcigpLmRlbGV0ZVJvdygxKVxuXG4gICAgICAvLyBWZXJpZnkgdGhlcmUgaXMgYW4gZXJyb3IgZm9yIHRoZSBmaXhhYmxlIGltcG9ydC9uZXdsaW5lLWFmdGVyLWltcG9ydCBydWxlXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZSgnRXhwZWN0ZWQgMSBlbXB0eSBsaW5lIGFmdGVyIGltcG9ydCAnXG4gICAgICAgICsgJ3N0YXRlbWVudCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuIChpbXBvcnQvbmV3bGluZS1hZnRlci1pbXBvcnQpJylcblxuICAgICAgLy8gRW5hYmxlIHRoZSBvcHRpb24gdW5kZXIgdGVzdFxuICAgICAgLy8gTk9URTogRGVwZW5kcyBvbiBtcG9ydC9uZXdsaW5lLWFmdGVyLWltcG9ydCBydWxlIGJlaW5nIG1hcmtlZCBhcyBmaXhhYmxlXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuYXV0b2ZpeC5pZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZycsIHRydWUpXG5cbiAgICAgIC8vIENoZWNrIHRoZSBsaW50IHJlc3VsdHNcbiAgICAgIGNvbnN0IG5ld01lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBleHBlY3QobmV3TWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncHJpbnRzIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiB3aXRoIHRoZSBgZGVidWdgIGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuICAgIGNvbnN0IGV4cGVjdGVkTWVzc2FnZSA9ICdsaW50ZXItZXNsaW50IGRlYnVnZ2luZyBpbmZvcm1hdGlvbidcbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aHMuZ29vZClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3dzIGFuIGluZm8gbm90aWZpY2F0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uUHJvbWlzZSA9IGdldE5vdGlmaWNhdGlvbihleHBlY3RlZE1lc3NhZ2UpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLCAnbGludGVyLWVzbGludDpkZWJ1ZycpXG4gICAgICBjb25zdCBub3RpZmljYXRpb24gPSBhd2FpdCBub3RpZmljYXRpb25Qcm9taXNlXG5cbiAgICAgIGV4cGVjdChub3RpZmljYXRpb24uZ2V0TWVzc2FnZSgpKS50b0JlKGV4cGVjdGVkTWVzc2FnZSlcbiAgICAgIGV4cGVjdChub3RpZmljYXRpb24uZ2V0VHlwZSgpKS50b0VxdWFsKCdpbmZvJylcbiAgICB9KVxuXG4gICAgaXQoJ2luY2x1ZGVzIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiBpbiB0aGUgZGV0YWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG5vdGlmaWNhdGlvblByb21pc2UgPSBnZXROb3RpZmljYXRpb24oZXhwZWN0ZWRNZXNzYWdlKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKSwgJ2xpbnRlci1lc2xpbnQ6ZGVidWcnKVxuICAgICAgY29uc3Qgbm90aWZpY2F0aW9uID0gYXdhaXQgbm90aWZpY2F0aW9uUHJvbWlzZVxuICAgICAgY29uc3QgZGV0YWlsID0gbm90aWZpY2F0aW9uLmdldERldGFpbCgpXG5cbiAgICAgIGV4cGVjdChkZXRhaWwuaW5jbHVkZXMoYEF0b20gdmVyc2lvbjogJHthdG9tLmdldFZlcnNpb24oKX1gKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGRldGFpbC5pbmNsdWRlcygnbGludGVyLWVzbGludCB2ZXJzaW9uOicpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKGBQbGF0Zm9ybTogJHtwcm9jZXNzLnBsYXRmb3JtfWApKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoZGV0YWlsLmluY2x1ZGVzKCdsaW50ZXItZXNsaW50IGNvbmZpZ3VyYXRpb246JykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChkZXRhaWwuaW5jbHVkZXMoJ1VzaW5nIGxvY2FsIHByb2plY3QgRVNMaW50JykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdoYW5kbGVzIHJhbmdlcyBpbiBtZXNzYWdlcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmVuZFJhbmdlKVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgY29uc3QgZXhwZWN0ZWQgPSAnVW5yZWFjaGFibGUgY29kZS4gKG5vLXVucmVhY2hhYmxlKSdcbiAgICBjb25zdCBleHBlY3RlZFVybCA9ICdodHRwczovL2VzbGludC5vcmcvZG9jcy9ydWxlcy9uby11bnJlYWNoYWJsZSdcblxuICAgIGV4cGVjdChtZXNzYWdlc1swXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKVxuICAgIGV4cGVjdChtZXNzYWdlc1swXS51cmwpLnRvQmUoZXhwZWN0ZWRVcmwpXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUocGF0aHMuZW5kUmFuZ2UpXG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbNSwgMl0sIFs2LCAxNV1dKVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNldHRpbmcgYGRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWdgIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3JcbiAgICBsZXQgdGVtcEZpbGVQYXRoXG4gICAgbGV0IHRlbXBGaXh0dXJlRGlyXG5cbiAgICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5kaXNhYmxpbmcuZGlzYWJsZVdoZW5Ob0VzbGludENvbmZpZycsIGZhbHNlKVxuXG4gICAgICB0ZW1wRmlsZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRocy5iYWRJbmxpbmUpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBGaWxlUGF0aClcbiAgICAgIHRlbXBGaXh0dXJlRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBGaWxlUGF0aClcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHJpbXJhZi5zeW5jKHRlbXBGaXh0dXJlRGlyKVxuICAgIH0pXG5cbiAgICBpdCgnZXJyb3JzIHdoZW4gbm8gY29uZmlnIGZpbGUgaXMgZm91bmQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSAnRXJyb3Igd2hpbGUgcnVubmluZyBFU0xpbnQ6IE5vIEVTTGludCBjb25maWd1cmF0aW9uIGZvdW5kLi4nXG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGA8ZGl2IHN0eWxlPVwid2hpdGUtc3BhY2U6IHByZS13cmFwXCI+Tm8gRVNMaW50IGNvbmZpZ3VyYXRpb24gZm91bmQuXG48aHIgLz5FcnJvcjogTm8gRVNMaW50IGNvbmZpZ3VyYXRpb24gZm91bmQuXG4gICAgYXQgQ29uZmlnLmdldExvY2FsQ29uZmlnSGllcmFyY2h5YFxuICAgICAgLy8gVGhlIHJlc3Qgb2YgdGhlIGRlc2NyaXB0aW9uIGluY2x1ZGVzIHBhdGhzIHNwZWNpZmljIHRvIHRoZSBjb21wdXRlciBydW5uaW5nIGl0XG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJylcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKGV4cGVjdGVkKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmRlc2NyaXB0aW9uLnN0YXJ0c1dpdGgoZGVzY3JpcHRpb24pKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUodGVtcEZpbGVQYXRoKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMCwgMF0sIFswLCAyOF1dKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3doZW4gYGRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWdgIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgbGV0IGVkaXRvclxuICAgIGxldCB0ZW1wRml4dHVyZURpclxuXG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuZGlzYWJsaW5nLmRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcnLCB0cnVlKVxuXG4gICAgICBjb25zdCB0ZW1wRmlsZVBhdGggPSBhd2FpdCBjb3B5RmlsZVRvVGVtcERpcihwYXRocy5iYWRJbmxpbmUpXG4gICAgICBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRlbXBGaWxlUGF0aClcbiAgICAgIHRlbXBGaXh0dXJlRGlyID0gcGF0aC5kaXJuYW1lKHRlbXBGaWxlUGF0aClcbiAgICB9KVxuXG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHJpbXJhZi5zeW5jKHRlbXBGaXh0dXJlRGlyKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcmVwb3J0IGVycm9ycyB3aGVuIG5vIGNvbmZpZyBmaWxlIGlzIGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50KGVkaXRvcilcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2xldHMgRVNMaW50IGhhbmRsZSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcyB3aGVuIHRoZSBjYWNoZSBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEVuc3VyZSB0aGUgY2FjaGUgaXMgZW5hYmxlZCwgc2luY2Ugd2Ugd2lsbCBiZSB0YWtpbmcgYWR2YW50YWdlIG9mXG4gICAgICAvLyBhIGZhaWxpbmcgaW4gaXQncyBvcGVyYXRpb25cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5hZHZhbmNlZC5kaXNhYmxlRlNDYWNoZScsIGZhbHNlKVxuICAgICAgY29uc3QgZm9vUGF0aCA9IHBhdGguam9pbihwYXRocy5iYWRDYWNoZSwgJ3RlbXAnLCAnZm9vLmpzJylcbiAgICAgIGNvbnN0IG5ld0NvbmZpZ1BhdGggPSBwYXRoLmpvaW4ocGF0aHMuYmFkQ2FjaGUsICd0ZW1wJywgJy5lc2xpbnRyYy5qcycpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGZvb1BhdGgpXG4gICAgICBmdW5jdGlvbiB1bmRlZk1zZyh2YXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBgJyR7dmFyTmFtZX0nIGlzIG5vdCBkZWZpbmVkLiAobm8tdW5kZWYpYFxuICAgICAgfVxuICAgICAgY29uc3QgZXhwZWN0ZWRVcmwgPSAnaHR0cHM6Ly9lc2xpbnQub3JnL2RvY3MvcnVsZXMvbm8tdW5kZWYnXG5cbiAgICAgIC8vIFRyaWdnZXIgYSBmaXJzdCBsaW50IHRvIHdhcm0gdXAgdGhlIGNhY2hlIHdpdGggdGhlIGZpcnN0IGNvbmZpZyByZXN1bHRcbiAgICAgIGxldCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZSh1bmRlZk1zZygnY29uc29sZScpKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKGZvb1BhdGgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1sxLCAyXSwgWzEsIDldXSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLmV4Y2VycHQpLnRvQmUodW5kZWZNc2coJ2JhcicpKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdLnVybCkudG9CZShleHBlY3RlZFVybClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1sxXS5sb2NhdGlvbi5maWxlKS50b0JlKGZvb1BhdGgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMV0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1sxLCAxNF0sIFsxLCAxN11dKVxuXG4gICAgICAvLyBXcml0ZSB0aGUgbmV3IGNvbmZpZ3VyYXRpb24gZmlsZVxuICAgICAgY29uc3QgbmV3Q29uZmlnID0ge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICBicm93c2VyOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgbGV0IGNvbmZpZ0NvbnRlbnRzID0gYG1vZHVsZS5leHBvcnRzID0gJHtKU09OLnN0cmluZ2lmeShuZXdDb25maWcsIG51bGwsIDIpfVxcbmBcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3Q29uZmlnUGF0aCwgY29uZmlnQ29udGVudHMpXG5cbiAgICAgIC8vIExpbnQgYWdhaW4sIEVTTGludCBzaG91bGQgcmVjb2duaXNlIHRoZSBuZXcgY29uZmlndXJhdGlvblxuICAgICAgLy8gVGhlIGNhY2hlZCBjb25maWcgcmVzdWx0cyBhcmUgc3RpbGwgcG9pbnRpbmcgYXQgdGhlIF9wYXJlbnRfIGZpbGUuIEVTTGludFxuICAgICAgLy8gd291bGQgcGFydGlhbGx5IGhhbmRsZSB0aGlzIHNpdHVhdGlvbiBpZiB0aGUgY29uZmlnIGZpbGUgd2FzIHNwZWNpZmllZFxuICAgICAgLy8gZnJvbSB0aGUgY2FjaGUuXG4gICAgICBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZSh1bmRlZk1zZygnYmFyJykpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b0JlKGV4cGVjdGVkVXJsKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUoZm9vUGF0aClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzEsIDE0XSwgWzEsIDE3XV0pXG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29uZmlndXJhdGlvblxuICAgICAgbmV3Q29uZmlnLnJ1bGVzID0ge1xuICAgICAgICAnbm8tdW5kZWYnOiAnb2ZmJyxcbiAgICAgIH1cbiAgICAgIGNvbmZpZ0NvbnRlbnRzID0gYG1vZHVsZS5leHBvcnRzID0gJHtKU09OLnN0cmluZ2lmeShuZXdDb25maWcsIG51bGwsIDIpfVxcbmBcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3Q29uZmlnUGF0aCwgY29uZmlnQ29udGVudHMpXG5cbiAgICAgIC8vIExpbnQgYWdhaW4sIGlmIHRoZSBjYWNoZSB3YXMgc3BlY2lmeWluZyB0aGUgZmlsZSBFU0xpbnQgYXQgdGhpcyBwb2ludFxuICAgICAgLy8gd291bGQgZmFpbCB0byB1cGRhdGUgdGhlIGNvbmZpZ3VyYXRpb24gZnVsbHksIGFuZCB3b3VsZCBzdGlsbCByZXBvcnQgYVxuICAgICAgLy8gbm8tdW5kZWYgZXJyb3IuXG4gICAgICBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuXG4gICAgICAvLyBEZWxldGUgdGhlIHRlbXBvcmFyeSBjb25maWd1cmF0aW9uIGZpbGVcbiAgICAgIGZzLnVubGlua1N5bmMobmV3Q29uZmlnUGF0aClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3b3JrcyB3aXRoIEhUTUwgZmlsZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgZW1iZWRkZWRTY29wZSA9ICdzb3VyY2UuanMuZW1iZWRkZWQuaHRtbCdcbiAgICBjb25zdCBzY29wZXMgPSBsaW50ZXJQcm92aWRlci5ncmFtbWFyU2NvcGVzXG5cbiAgICBpdCgnYWRkcyB0aGUgSFRNTCBzY29wZSB3aGVuIHRoZSBzZXR0aW5nIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NvcGVzLmluY2x1ZGVzKGVtYmVkZGVkU2NvcGUpKS50b0JlKGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCB0cnVlKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCBmYWxzZSlcbiAgICAgIGV4cGVjdChzY29wZXMuaW5jbHVkZXMoZW1iZWRkZWRTY29wZSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdrZWVwcyB0aGUgSFRNTCBzY29wZSB3aXRoIGN1c3RvbSBzY29wZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NvcGVzLmluY2x1ZGVzKGVtYmVkZGVkU2NvcGUpKS50b0JlKGZhbHNlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLCB0cnVlKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LnNjb3BlcycsIFsnZm9vLmJhciddKVxuICAgICAgZXhwZWN0KHNjb3Blcy5pbmNsdWRlcyhlbWJlZGRlZFNjb3BlKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2hhbmRsZXMgdGhlIFNob3cgUnVsZSBJRCBpbiBNZXNzYWdlcyBvcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgZXhwZWN0ZWRVcmxSZWdFeCA9IC9odHRwc1tcXFNdK2VzbGludC1wbHVnaW4taW1wb3J0W1xcU10rbm8tdW5yZXNvbHZlZC5tZC9cblxuICAgIGl0KCdzaG93cyB0aGUgcnVsZSBJRCB3aGVuIGVuYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuYWR2YW5jZWQuc2hvd1J1bGVJZEluTWVzc2FnZScsIHRydWUpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGhzLmJhZEltcG9ydClcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpXG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiVW5hYmxlIHRvIHJlc29sdmUgcGF0aCB0byBtb2R1bGUgJy4uL25vbmV4aXN0ZW50Jy4gKGltcG9ydC9uby11bnJlc29sdmVkKVwiXG5cbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhwZWN0ZWQpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0udXJsKS50b01hdGNoKGV4cGVjdGVkVXJsUmVnRXgpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24uZmlsZSkudG9CZShwYXRocy5iYWRJbXBvcnQpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1swLCAyNF0sIFswLCA0MF1dKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNvbHV0aW9ucykubm90LnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoXCJkb2Vzbid0IHNob3cgdGhlIHJ1bGUgSUQgd2hlbiBkaXNhYmxlZFwiLCBhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQuYWR2YW5jZWQuc2hvd1J1bGVJZEluTWVzc2FnZScsIGZhbHNlKVxuICAgICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5iYWRJbXBvcnQpXG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKVxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBcIlVuYWJsZSB0byByZXNvbHZlIHBhdGggdG8gbW9kdWxlICcuLi9ub25leGlzdGVudCcuXCJcblxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCdlcnJvcicpXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uZXhjZXJwdCkudG9CZShleHBlY3RlZClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS51cmwpLnRvTWF0Y2goZXhwZWN0ZWRVcmxSZWdFeClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5maWxlKS50b0JlKHBhdGhzLmJhZEltcG9ydClcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5sb2NhdGlvbi5wb3NpdGlvbikudG9FcXVhbChbWzAsIDI0XSwgWzAsIDQwXV0pXG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0uc29sdXRpb25zKS5ub3QudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoXCJyZWdpc3RlcnMgYW4gJ0VTTGludCBGaXgnIHJpZ2h0IGNsaWNrIG1lbnUgY29tbWFuZFwiLCAoKSA9PiB7XG4gICAgLy8gTk9URTogUmVhY2hlcyBpbnRvIHRoZSBwcml2YXRlIGRhdGEgb2YgdGhlIENvbnRleHRNZW51TWFuYWdlciwgdGhlcmUgaXNcbiAgICAvLyBubyBwdWJsaWMgbWV0aG9kIHRvIGNoZWNrIHRoaXMgdGhvdWdoIHNvLi4uXG4gICAgZXhwZWN0KGF0b20uY29udGV4dE1lbnUuaXRlbVNldHMuc29tZShpdGVtU2V0ID0+IChcbiAgICAgIC8vIE1hdGNoaW5nIHNlbGVjdG9yLi4uXG4gICAgICBpdGVtU2V0LnNlbGVjdG9yID09PSAnYXRvbS10ZXh0LWVkaXRvcjpub3QoLm1pbmkpLCAub3ZlcmxheWVyJ1xuICAgICAgJiYgaXRlbVNldC5pdGVtcy5zb21lKGl0ZW0gPT4gKFxuICAgICAgICAvLyBNYXRjaGluZyBjb21tYW5kLi4uXG4gICAgICAgIGl0ZW0uY29tbWFuZCA9PT0gJ2xpbnRlci1lc2xpbnQ6Zml4LWZpbGUnXG4gICAgICAgIC8vIE1hdGNoaW5nIGxhYmVsXG4gICAgICAgICYmIGl0ZW0ubGFiZWwgPT09ICdFU0xpbnQgRml4J1xuICAgICAgICAvLyBBbmQgaGFzIGEgZnVuY3Rpb24gY29udHJvbGxpbmcgZGlzcGxheVxuICAgICAgICAmJiB0eXBlb2YgaXRlbS5zaG91bGREaXNwbGF5ID09PSAnZnVuY3Rpb24nXG4gICAgICApKVxuICAgICkpKVxuICB9KVxufSlcblxuZGVzY3JpYmUoJ3Byb2Nlc3NFU0xpbnRNZXNzYWdlcycsICgpID0+IHtcbiAgaXQoJ2hhbmRsZXMgbWVzc2FnZXMgd2l0aCBudWxsIGVuZENvbHVtbicsIGFzeW5jICgpID0+IHtcbiAgICAvLyBHZXQgYSBlZGl0b3IgaW5zdGFuY2Ugd2l0aCBhdCBsZWFzdCBhIHNpbmdsZSBsaW5lXG4gICAgY29uc3QgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRocy5nb29kKVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvY2Vzc0VTTGludE1lc3NhZ2VzKFt7XG4gICAgICBjb2x1bW46IG51bGwsXG4gICAgICBlbmRDb2x1bW46IG51bGwsXG4gICAgICBsaW5lOiAxLFxuICAgICAgZW5kTGluZTogbnVsbCxcbiAgICAgIG1lc3NhZ2U6ICdUZXN0IE51bGwgZW5kQ29sdW1uJyxcbiAgICAgIG5vZGVUeXBlOiAnQmxvY2snLFxuICAgICAgcnVsZUlkOiAndGVzdC1udWxsLWVuZGNvbHVtbicsXG4gICAgICBzZXZlcml0eTogMixcbiAgICB9XSwgZWRpdG9yLCBmYWxzZSlcblxuICAgIGV4cGVjdChyZXN1bHRbMF0uZXhjZXJwdCkudG9CZSgnVGVzdCBOdWxsIGVuZENvbHVtbicpXG4gIH0pXG59KVxuIl19