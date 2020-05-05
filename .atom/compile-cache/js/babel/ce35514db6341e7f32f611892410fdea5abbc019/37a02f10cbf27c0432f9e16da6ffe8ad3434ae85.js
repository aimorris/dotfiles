function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _validateEditor = require('./validate/editor');

// Internal variables
'use babel';var idleCallbacks = new Set();

// Dependencies
// NOTE: We are not directly requiring these in order to reduce the time it
// takes to require this file as that causes delays in Atom loading this package
var path = undefined;
var helpers = undefined;
var workerHelpers = undefined;
var isConfigAtHomeRoot = undefined;
var migrateConfigOptions = undefined;

var loadDeps = function loadDeps() {
  if (!path) {
    path = require('path');
  }
  if (!helpers) {
    helpers = require('./helpers');
  }
  if (!workerHelpers) {
    workerHelpers = require('./worker-helpers');
  }
  if (!isConfigAtHomeRoot) {
    isConfigAtHomeRoot = require('./is-config-at-home-root');
  }
};

var makeIdleCallback = function makeIdleCallback(work) {
  var callbackId = undefined;
  var callBack = function callBack() {
    idleCallbacks['delete'](callbackId);
    work();
  };
  callbackId = window.requestIdleCallback(callBack);
  idleCallbacks.add(callbackId);
};

var scheduleIdleTasks = function scheduleIdleTasks() {
  var linterEslintInstallPeerPackages = function linterEslintInstallPeerPackages() {
    require('atom-package-deps').install('linter-eslint');
  };
  var linterEslintLoadDependencies = loadDeps;
  var linterEslintStartWorker = function linterEslintStartWorker() {
    loadDeps();
    helpers.startWorker();
  };

  if (!atom.inSpecMode()) {
    makeIdleCallback(linterEslintInstallPeerPackages);
    makeIdleCallback(linterEslintLoadDependencies);
    makeIdleCallback(linterEslintStartWorker);
  }
};

// Configuration
var scopes = [];
var showRule = undefined;
var lintHtmlFiles = undefined;
var ignoredRulesWhenModified = undefined;
var ignoredRulesWhenFixing = undefined;
var disableWhenNoEslintConfig = undefined;
var ignoreFixableRulesWhileTyping = undefined;

// Internal functions
/**
 * Given an Array or iterable containing a list of Rule IDs, return an Object
 * to be sent to ESLint's configuration that disables those rules.
 * @param  {[iterable]} ruleIds Iterable containing ruleIds to ignore
 * @return {Object}             Object containing properties for each rule to ignore
 */
var idsToIgnoredRules = function idsToIgnoredRules(ruleIds) {
  return Array.from(ruleIds).reduce(
  // 0 is the severity to turn off a rule
  function (ids, id) {
    return Object.assign(ids, _defineProperty({}, id, 0));
  }, {});
};

module.exports = {
  activate: function activate() {
    var _this = this;

    this.subscriptions = new _atom.CompositeDisposable();

    if (!migrateConfigOptions) {
      migrateConfigOptions = require('./migrate-config-options');
    }
    migrateConfigOptions();

    var embeddedScope = 'source.js.embedded.html';
    this.subscriptions.add(atom.config.observe('linter-eslint.lintHtmlFiles', function (value) {
      lintHtmlFiles = value;
      if (lintHtmlFiles) {
        scopes.push(embeddedScope);
      } else if (scopes.indexOf(embeddedScope) !== -1) {
        scopes.splice(scopes.indexOf(embeddedScope), 1);
      }
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.scopes', function (value) {
      // Remove any old scopes
      scopes.splice(0, scopes.length);
      // Add the current scopes
      Array.prototype.push.apply(scopes, value);
      // Ensure HTML linting still works if the setting is updated
      if (lintHtmlFiles && !scopes.includes(embeddedScope)) {
        scopes.push(embeddedScope);
      }
    }));

    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(_asyncToGenerator(function* () {
        if ((0, _validateEditor.hasValidScope)(editor, scopes) && atom.config.get('linter-eslint.autofix.fixOnSave')) {
          yield _this.fixJob(true);
        }
      }));
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-eslint:debug': _asyncToGenerator(function* () {
        loadDeps();
        var debugString = yield helpers.generateDebugString();
        var notificationOptions = { detail: debugString, dismissable: true };
        atom.notifications.addInfo('linter-eslint debugging information', notificationOptions);
      })
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'linter-eslint:fix-file': _asyncToGenerator(function* () {
        yield _this.fixJob();
      })
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.advanced.showRuleIdInMessage', function (value) {
      showRule = value;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.disabling.disableWhenNoEslintConfig', function (value) {
      disableWhenNoEslintConfig = value;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.disabling.rulesToSilenceWhileTyping', function (ids) {
      ignoredRulesWhenModified = ids;
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.autofix.rulesToDisableWhileFixing', function (ids) {
      ignoredRulesWhenFixing = idsToIgnoredRules(ids);
    }));

    this.subscriptions.add(atom.config.observe('linter-eslint.autofix.ignoreFixableRulesWhileTyping', function (value) {
      ignoreFixableRulesWhileTyping = value;
    }));

    this.subscriptions.add(atom.contextMenu.add({
      'atom-text-editor:not(.mini), .overlayer': [{
        label: 'ESLint Fix',
        command: 'linter-eslint:fix-file',
        shouldDisplay: function shouldDisplay(evt) {
          var activeEditor = atom.workspace.getActiveTextEditor();
          if (!activeEditor) {
            return false;
          }
          // Black magic!
          // Compares the private component property of the active TextEditor
          //   against the components of the elements
          var evtIsActiveEditor = evt.path.some(function (elem) {
            return(
              // Atom v1.19.0+
              elem.component && activeEditor.component && elem.component === activeEditor.component
            );
          });
          // Only show if it was the active editor and it is a valid scope
          return evtIsActiveEditor && (0, _validateEditor.hasValidScope)(activeEditor, scopes);
        }
      }]
    }));

    scheduleIdleTasks();
  },

  deactivate: function deactivate() {
    idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    idleCallbacks.clear();
    if (helpers) {
      // If the helpers module hasn't been loaded then there was no chance a
      // worker was started anyway.
      helpers.killWorker();
    }
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      name: 'ESLint',
      grammarScopes: scopes,
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (textEditor) {
        if (!atom.workspace.isTextEditor(textEditor)) {
          // If we somehow get fed an invalid TextEditor just immediately return
          return null;
        }

        var filePath = textEditor.getPath();
        if (!filePath) {
          // The editor currently has no path, we can't report messages back to
          // Linter so just return null
          return null;
        }

        loadDeps();

        if (filePath.includes('://')) {
          // If the path is a URL (Nuclide remote file) return a message
          // telling the user we are unable to work on remote files.
          return helpers.generateUserMessage(textEditor, {
            severity: 'warning',
            excerpt: 'Remote file open, linter-eslint is disabled for this file.'
          });
        }

        var text = textEditor.getText();

        var rules = {};
        if (textEditor.isModified()) {
          if (ignoreFixableRulesWhileTyping) {
            (function () {
              // Note that the fixable rules will only have values after the first lint job
              var ignoredRules = new Set(helpers.rules.getFixableRules());
              ignoredRulesWhenModified.forEach(function (ruleId) {
                return ignoredRules.add(ruleId);
              });
              rules = idsToIgnoredRules(ignoredRules);
            })();
          } else {
            rules = idsToIgnoredRules(ignoredRulesWhenModified);
          }
        }

        try {
          var response = yield helpers.sendJob({
            type: 'lint',
            contents: text,
            config: atom.config.get('linter-eslint'),
            rules: rules,
            filePath: filePath,
            projectPath: atom.project.relativizePath(filePath)[0] || ''
          });
          if (textEditor.getText() !== text) {
            /*
            The editor text has been modified since the lint was triggered,
            as we can't be sure that the results will map properly back to
            the new contents, simply return `null` to tell the
            `provideLinter` consumer not to update the saved results.
            */
            return null;
          }
          return helpers.processJobResponse(response, textEditor, showRule);
        } catch (error) {
          return helpers.handleError(textEditor, error);
        }
      })
    };
  },

  fixJob: _asyncToGenerator(function* () {
    var isSave = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var textEditor = atom.workspace.getActiveTextEditor();

    if (!textEditor || !atom.workspace.isTextEditor(textEditor)) {
      // Silently return if the TextEditor is invalid
      return;
    }

    loadDeps();

    if (textEditor.isModified()) {
      // Abort for invalid or unsaved text editors
      var message = 'Linter-ESLint: Please save before fixing';
      atom.notifications.addError(message);
    }

    var filePath = textEditor.getPath();
    var fileDir = path.dirname(filePath);
    var projectPath = atom.project.relativizePath(filePath)[0];

    // Get the text from the editor, so we can use executeOnText
    var text = textEditor.getText();
    // Do not try to make fixes on an empty file
    if (text.length === 0) {
      return;
    }

    // Do not try to fix if linting should be disabled
    var configPath = workerHelpers.getConfigPath(fileDir);
    var noProjectConfig = configPath === null || isConfigAtHomeRoot(configPath);
    if (noProjectConfig && disableWhenNoEslintConfig) {
      return;
    }

    var rules = {};
    if (Object.keys(ignoredRulesWhenFixing).length > 0) {
      rules = ignoredRulesWhenFixing;
    }

    try {
      var response = yield helpers.sendJob({
        type: 'fix',
        config: atom.config.get('linter-eslint'),
        contents: text,
        rules: rules,
        filePath: filePath,
        projectPath: projectPath
      });
      if (!isSave) {
        atom.notifications.addSuccess(response);
      }
    } catch (err) {
      atom.notifications.addWarning(err.message);
    }
  })
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUdvQyxNQUFNOzs4QkFDWixtQkFBbUI7OztBQUpqRCxXQUFXLENBQUEsQUFPWCxJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOzs7OztBQUsvQixJQUFJLElBQUksWUFBQSxDQUFBO0FBQ1IsSUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLElBQUksYUFBYSxZQUFBLENBQUE7QUFDakIsSUFBSSxrQkFBa0IsWUFBQSxDQUFBO0FBQ3RCLElBQUksb0JBQW9CLFlBQUEsQ0FBQTs7QUFFeEIsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFRLEdBQVM7QUFDckIsTUFBSSxDQUFDLElBQUksRUFBRTtBQUNULFFBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDdkI7QUFDRCxNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtHQUMvQjtBQUNELE1BQUksQ0FBQyxhQUFhLEVBQUU7QUFDbEIsaUJBQWEsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtHQUM1QztBQUNELE1BQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUN2QixzQkFBa0IsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtHQUN6RDtDQUNGLENBQUE7O0FBRUQsSUFBTSxnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxJQUFJLEVBQUs7QUFDakMsTUFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLE1BQU0sUUFBUSxHQUFHLFNBQVgsUUFBUSxHQUFTO0FBQ3JCLGlCQUFhLFVBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNoQyxRQUFJLEVBQUUsQ0FBQTtHQUNQLENBQUE7QUFDRCxZQUFVLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FB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LGFBQU07S0FDUDs7O0FBR0QsUUFBTSxVQUFVLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUN2RCxRQUFNLGVBQWUsR0FBSSxVQUFVLEtBQUssSUFBSSxJQUFJLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxBQUFDLENBQUE7QUFDL0UsUUFBSSxlQUFlLElBQUkseUJBQXlCLEVBQUU7QUFDaEQsYUFBTTtLQUNQOztBQUVELFFBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTtBQUNkLFFBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbEQsV0FBSyxHQUFHLHNCQUFzQixDQUFBO0tBQy9COztBQUVELFFBQUk7QUFDRixVQUFNLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDckMsWUFBSSxFQUFFLEtBQUs7QUFDWCxjQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0FBQ3hDLGdCQUFRLEVBQUUsSUFBSTtBQUNkLGFBQUssRUFBTCxLQUFLO0FBQ0wsZ0JBQVEsRUFBUixRQUFRO0FBQ1IsbUJBQVcsRUFBWCxXQUFXO09BQ1osQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFlBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ3hDO0tBQ0YsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLFVBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUMzQztHQUNGLENBQUE7Q0FDRixDQUFBIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLCBpbXBvcnQvZXh0ZW5zaW9uc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBoYXNWYWxpZFNjb3BlIH0gZnJvbSAnLi92YWxpZGF0ZS9lZGl0b3InXG5cbi8vIEludGVybmFsIHZhcmlhYmxlc1xuY29uc3QgaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuXG4vLyBEZXBlbmRlbmNpZXNcbi8vIE5PVEU6IFdlIGFyZSBub3QgZGlyZWN0bHkgcmVxdWlyaW5nIHRoZXNlIGluIG9yZGVyIHRvIHJlZHVjZSB0aGUgdGltZSBpdFxuLy8gdGFrZXMgdG8gcmVxdWlyZSB0aGlzIGZpbGUgYXMgdGhhdCBjYXVzZXMgZGVsYXlzIGluIEF0b20gbG9hZGluZyB0aGlzIHBhY2thZ2VcbmxldCBwYXRoXG5sZXQgaGVscGVyc1xubGV0IHdvcmtlckhlbHBlcnNcbmxldCBpc0NvbmZpZ0F0SG9tZVJvb3RcbmxldCBtaWdyYXRlQ29uZmlnT3B0aW9uc1xuXG5jb25zdCBsb2FkRGVwcyA9ICgpID0+IHtcbiAgaWYgKCFwYXRoKSB7XG4gICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICB9XG4gIGlmICghaGVscGVycykge1xuICAgIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuICB9XG4gIGlmICghd29ya2VySGVscGVycykge1xuICAgIHdvcmtlckhlbHBlcnMgPSByZXF1aXJlKCcuL3dvcmtlci1oZWxwZXJzJylcbiAgfVxuICBpZiAoIWlzQ29uZmlnQXRIb21lUm9vdCkge1xuICAgIGlzQ29uZmlnQXRIb21lUm9vdCA9IHJlcXVpcmUoJy4vaXMtY29uZmlnLWF0LWhvbWUtcm9vdCcpXG4gIH1cbn1cblxuY29uc3QgbWFrZUlkbGVDYWxsYmFjayA9ICh3b3JrKSA9PiB7XG4gIGxldCBjYWxsYmFja0lkXG4gIGNvbnN0IGNhbGxCYWNrID0gKCkgPT4ge1xuICAgIGlkbGVDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrSWQpXG4gICAgd29yaygpXG4gIH1cbiAgY2FsbGJhY2tJZCA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGNhbGxCYWNrKVxuICBpZGxlQ2FsbGJhY2tzLmFkZChjYWxsYmFja0lkKVxufVxuXG5jb25zdCBzY2hlZHVsZUlkbGVUYXNrcyA9ICgpID0+IHtcbiAgY29uc3QgbGludGVyRXNsaW50SW5zdGFsbFBlZXJQYWNrYWdlcyA9ICgpID0+IHtcbiAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1lc2xpbnQnKVxuICB9XG4gIGNvbnN0IGxpbnRlckVzbGludExvYWREZXBlbmRlbmNpZXMgPSBsb2FkRGVwc1xuICBjb25zdCBsaW50ZXJFc2xpbnRTdGFydFdvcmtlciA9ICgpID0+IHtcbiAgICBsb2FkRGVwcygpXG4gICAgaGVscGVycy5zdGFydFdvcmtlcigpXG4gIH1cblxuICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgbWFrZUlkbGVDYWxsYmFjayhsaW50ZXJFc2xpbnRJbnN0YWxsUGVlclBhY2thZ2VzKVxuICAgIG1ha2VJZGxlQ2FsbGJhY2sobGludGVyRXNsaW50TG9hZERlcGVuZGVuY2llcylcbiAgICBtYWtlSWRsZUNhbGxiYWNrKGxpbnRlckVzbGludFN0YXJ0V29ya2VyKVxuICB9XG59XG5cbi8vIENvbmZpZ3VyYXRpb25cbmNvbnN0IHNjb3BlcyA9IFtdXG5sZXQgc2hvd1J1bGVcbmxldCBsaW50SHRtbEZpbGVzXG5sZXQgaWdub3JlZFJ1bGVzV2hlbk1vZGlmaWVkXG5sZXQgaWdub3JlZFJ1bGVzV2hlbkZpeGluZ1xubGV0IGRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWdcbmxldCBpZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZ1xuXG4vLyBJbnRlcm5hbCBmdW5jdGlvbnNcbi8qKlxuICogR2l2ZW4gYW4gQXJyYXkgb3IgaXRlcmFibGUgY29udGFpbmluZyBhIGxpc3Qgb2YgUnVsZSBJRHMsIHJldHVybiBhbiBPYmplY3RcbiAqIHRvIGJlIHNlbnQgdG8gRVNMaW50J3MgY29uZmlndXJhdGlvbiB0aGF0IGRpc2FibGVzIHRob3NlIHJ1bGVzLlxuICogQHBhcmFtICB7W2l0ZXJhYmxlXX0gcnVsZUlkcyBJdGVyYWJsZSBjb250YWluaW5nIHJ1bGVJZHMgdG8gaWdub3JlXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgIE9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgZm9yIGVhY2ggcnVsZSB0byBpZ25vcmVcbiAqL1xuY29uc3QgaWRzVG9JZ25vcmVkUnVsZXMgPSBydWxlSWRzID0+IChcbiAgQXJyYXkuZnJvbShydWxlSWRzKS5yZWR1Y2UoXG4gICAgLy8gMCBpcyB0aGUgc2V2ZXJpdHkgdG8gdHVybiBvZmYgYSBydWxlXG4gICAgKGlkcywgaWQpID0+IE9iamVjdC5hc3NpZ24oaWRzLCB7IFtpZF06IDAgfSksXG4gICAge31cbiAgKSlcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgaWYgKCFtaWdyYXRlQ29uZmlnT3B0aW9ucykge1xuICAgICAgbWlncmF0ZUNvbmZpZ09wdGlvbnMgPSByZXF1aXJlKCcuL21pZ3JhdGUtY29uZmlnLW9wdGlvbnMnKVxuICAgIH1cbiAgICBtaWdyYXRlQ29uZmlnT3B0aW9ucygpXG5cbiAgICBjb25zdCBlbWJlZGRlZFNjb3BlID0gJ3NvdXJjZS5qcy5lbWJlZGRlZC5odG1sJ1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdsaW50ZXItZXNsaW50LmxpbnRIdG1sRmlsZXMnLFxuICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgIGxpbnRIdG1sRmlsZXMgPSB2YWx1ZVxuICAgICAgICBpZiAobGludEh0bWxGaWxlcykge1xuICAgICAgICAgIHNjb3Blcy5wdXNoKGVtYmVkZGVkU2NvcGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc2NvcGVzLmluZGV4T2YoZW1iZWRkZWRTY29wZSkgIT09IC0xKSB7XG4gICAgICAgICAgc2NvcGVzLnNwbGljZShzY29wZXMuaW5kZXhPZihlbWJlZGRlZFNjb3BlKSwgMSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5zY29wZXMnLFxuICAgICAgKHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIFJlbW92ZSBhbnkgb2xkIHNjb3Blc1xuICAgICAgICBzY29wZXMuc3BsaWNlKDAsIHNjb3Blcy5sZW5ndGgpXG4gICAgICAgIC8vIEFkZCB0aGUgY3VycmVudCBzY29wZXNcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoc2NvcGVzLCB2YWx1ZSlcbiAgICAgICAgLy8gRW5zdXJlIEhUTUwgbGludGluZyBzdGlsbCB3b3JrcyBpZiB0aGUgc2V0dGluZyBpcyB1cGRhdGVkXG4gICAgICAgIGlmIChsaW50SHRtbEZpbGVzICYmICFzY29wZXMuaW5jbHVkZXMoZW1iZWRkZWRTY29wZSkpIHtcbiAgICAgICAgICBzY29wZXMucHVzaChlbWJlZGRlZFNjb3BlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5vbkRpZFNhdmUoYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAoaGFzVmFsaWRTY29wZShlZGl0b3IsIHNjb3BlcylcbiAgICAgICAgICAmJiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQuYXV0b2ZpeC5maXhPblNhdmUnKVxuICAgICAgICApIHtcbiAgICAgICAgICBhd2FpdCB0aGlzLmZpeEpvYih0cnVlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcbiAgICAgICdsaW50ZXItZXNsaW50OmRlYnVnJzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBsb2FkRGVwcygpXG4gICAgICAgIGNvbnN0IGRlYnVnU3RyaW5nID0gYXdhaXQgaGVscGVycy5nZW5lcmF0ZURlYnVnU3RyaW5nKClcbiAgICAgICAgY29uc3Qgbm90aWZpY2F0aW9uT3B0aW9ucyA9IHsgZGV0YWlsOiBkZWJ1Z1N0cmluZywgZGlzbWlzc2FibGU6IHRydWUgfVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnbGludGVyLWVzbGludCBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24nLCBub3RpZmljYXRpb25PcHRpb25zKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsIHtcbiAgICAgICdsaW50ZXItZXNsaW50OmZpeC1maWxlJzogYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB0aGlzLmZpeEpvYigpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5hZHZhbmNlZC5zaG93UnVsZUlkSW5NZXNzYWdlJyxcbiAgICAgICh2YWx1ZSkgPT4geyBzaG93UnVsZSA9IHZhbHVlIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2xpbnRlci1lc2xpbnQuZGlzYWJsaW5nLmRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcnLFxuICAgICAgKHZhbHVlKSA9PiB7IGRpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcgPSB2YWx1ZSB9XG4gICAgKSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICdsaW50ZXItZXNsaW50LmRpc2FibGluZy5ydWxlc1RvU2lsZW5jZVdoaWxlVHlwaW5nJyxcbiAgICAgIChpZHMpID0+IHsgaWdub3JlZFJ1bGVzV2hlbk1vZGlmaWVkID0gaWRzIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ2xpbnRlci1lc2xpbnQuYXV0b2ZpeC5ydWxlc1RvRGlzYWJsZVdoaWxlRml4aW5nJyxcbiAgICAgIChpZHMpID0+IHsgaWdub3JlZFJ1bGVzV2hlbkZpeGluZyA9IGlkc1RvSWdub3JlZFJ1bGVzKGlkcykgfVxuICAgICkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoXG4gICAgICAnbGludGVyLWVzbGludC5hdXRvZml4Lmlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nJyxcbiAgICAgICh2YWx1ZSkgPT4geyBpZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZyA9IHZhbHVlIH1cbiAgICApKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbnRleHRNZW51LmFkZCh7XG4gICAgICAnYXRvbS10ZXh0LWVkaXRvcjpub3QoLm1pbmkpLCAub3ZlcmxheWVyJzogW3tcbiAgICAgICAgbGFiZWw6ICdFU0xpbnQgRml4JyxcbiAgICAgICAgY29tbWFuZDogJ2xpbnRlci1lc2xpbnQ6Zml4LWZpbGUnLFxuICAgICAgICBzaG91bGREaXNwbGF5OiAoZXZ0KSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgaWYgKCFhY3RpdmVFZGl0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBCbGFjayBtYWdpYyFcbiAgICAgICAgICAvLyBDb21wYXJlcyB0aGUgcHJpdmF0ZSBjb21wb25lbnQgcHJvcGVydHkgb2YgdGhlIGFjdGl2ZSBUZXh0RWRpdG9yXG4gICAgICAgICAgLy8gICBhZ2FpbnN0IHRoZSBjb21wb25lbnRzIG9mIHRoZSBlbGVtZW50c1xuICAgICAgICAgIGNvbnN0IGV2dElzQWN0aXZlRWRpdG9yID0gZXZ0LnBhdGguc29tZShlbGVtID0+IChcbiAgICAgICAgICAgIC8vIEF0b20gdjEuMTkuMCtcbiAgICAgICAgICAgIGVsZW0uY29tcG9uZW50ICYmIGFjdGl2ZUVkaXRvci5jb21wb25lbnRcbiAgICAgICAgICAgICAgJiYgZWxlbS5jb21wb25lbnQgPT09IGFjdGl2ZUVkaXRvci5jb21wb25lbnQpKVxuICAgICAgICAgIC8vIE9ubHkgc2hvdyBpZiBpdCB3YXMgdGhlIGFjdGl2ZSBlZGl0b3IgYW5kIGl0IGlzIGEgdmFsaWQgc2NvcGVcbiAgICAgICAgICByZXR1cm4gZXZ0SXNBY3RpdmVFZGl0b3IgJiYgaGFzVmFsaWRTY29wZShhY3RpdmVFZGl0b3IsIHNjb3BlcylcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9KSlcblxuICAgIHNjaGVkdWxlSWRsZVRhc2tzKClcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpXG4gICAgaWRsZUNhbGxiYWNrcy5jbGVhcigpXG4gICAgaWYgKGhlbHBlcnMpIHtcbiAgICAgIC8vIElmIHRoZSBoZWxwZXJzIG1vZHVsZSBoYXNuJ3QgYmVlbiBsb2FkZWQgdGhlbiB0aGVyZSB3YXMgbm8gY2hhbmNlIGFcbiAgICAgIC8vIHdvcmtlciB3YXMgc3RhcnRlZCBhbnl3YXkuXG4gICAgICBoZWxwZXJzLmtpbGxXb3JrZXIoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0VTTGludCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBzY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICAgIGlmICghYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHRleHRFZGl0b3IpKSB7XG4gICAgICAgICAgLy8gSWYgd2Ugc29tZWhvdyBnZXQgZmVkIGFuIGludmFsaWQgVGV4dEVkaXRvciBqdXN0IGltbWVkaWF0ZWx5IHJldHVyblxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgICAvLyBUaGUgZWRpdG9yIGN1cnJlbnRseSBoYXMgbm8gcGF0aCwgd2UgY2FuJ3QgcmVwb3J0IG1lc3NhZ2VzIGJhY2sgdG9cbiAgICAgICAgICAvLyBMaW50ZXIgc28ganVzdCByZXR1cm4gbnVsbFxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBsb2FkRGVwcygpXG5cbiAgICAgICAgaWYgKGZpbGVQYXRoLmluY2x1ZGVzKCc6Ly8nKSkge1xuICAgICAgICAgIC8vIElmIHRoZSBwYXRoIGlzIGEgVVJMIChOdWNsaWRlIHJlbW90ZSBmaWxlKSByZXR1cm4gYSBtZXNzYWdlXG4gICAgICAgICAgLy8gdGVsbGluZyB0aGUgdXNlciB3ZSBhcmUgdW5hYmxlIHRvIHdvcmsgb24gcmVtb3RlIGZpbGVzLlxuICAgICAgICAgIHJldHVybiBoZWxwZXJzLmdlbmVyYXRlVXNlck1lc3NhZ2UodGV4dEVkaXRvciwge1xuICAgICAgICAgICAgc2V2ZXJpdHk6ICd3YXJuaW5nJyxcbiAgICAgICAgICAgIGV4Y2VycHQ6ICdSZW1vdGUgZmlsZSBvcGVuLCBsaW50ZXItZXNsaW50IGlzIGRpc2FibGVkIGZvciB0aGlzIGZpbGUuJyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICAgICAgbGV0IHJ1bGVzID0ge31cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICAgICAgaWYgKGlnbm9yZUZpeGFibGVSdWxlc1doaWxlVHlwaW5nKSB7XG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgdGhlIGZpeGFibGUgcnVsZXMgd2lsbCBvbmx5IGhhdmUgdmFsdWVzIGFmdGVyIHRoZSBmaXJzdCBsaW50IGpvYlxuICAgICAgICAgICAgY29uc3QgaWdub3JlZFJ1bGVzID0gbmV3IFNldChoZWxwZXJzLnJ1bGVzLmdldEZpeGFibGVSdWxlcygpKVxuICAgICAgICAgICAgaWdub3JlZFJ1bGVzV2hlbk1vZGlmaWVkLmZvckVhY2gocnVsZUlkID0+IGlnbm9yZWRSdWxlcy5hZGQocnVsZUlkKSlcbiAgICAgICAgICAgIHJ1bGVzID0gaWRzVG9JZ25vcmVkUnVsZXMoaWdub3JlZFJ1bGVzKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBydWxlcyA9IGlkc1RvSWdub3JlZFJ1bGVzKGlnbm9yZWRSdWxlc1doZW5Nb2RpZmllZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaGVscGVycy5zZW5kSm9iKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW50JyxcbiAgICAgICAgICAgIGNvbnRlbnRzOiB0ZXh0LFxuICAgICAgICAgICAgY29uZmlnOiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQnKSxcbiAgICAgICAgICAgIHJ1bGVzLFxuICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICBwcm9qZWN0UGF0aDogYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXSB8fCAnJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSB0ZXh0KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgVGhlIGVkaXRvciB0ZXh0IGhhcyBiZWVuIG1vZGlmaWVkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsXG4gICAgICAgICAgICBhcyB3ZSBjYW4ndCBiZSBzdXJlIHRoYXQgdGhlIHJlc3VsdHMgd2lsbCBtYXAgcHJvcGVybHkgYmFjayB0b1xuICAgICAgICAgICAgdGhlIG5ldyBjb250ZW50cywgc2ltcGx5IHJldHVybiBgbnVsbGAgdG8gdGVsbCB0aGVcbiAgICAgICAgICAgIGBwcm92aWRlTGludGVyYCBjb25zdW1lciBub3QgdG8gdXBkYXRlIHRoZSBzYXZlZCByZXN1bHRzLlxuICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBoZWxwZXJzLnByb2Nlc3NKb2JSZXNwb25zZShyZXNwb25zZSwgdGV4dEVkaXRvciwgc2hvd1J1bGUpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIGhlbHBlcnMuaGFuZGxlRXJyb3IodGV4dEVkaXRvciwgZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYXN5bmMgZml4Sm9iKGlzU2F2ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgKCF0ZXh0RWRpdG9yIHx8ICFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IodGV4dEVkaXRvcikpIHtcbiAgICAgIC8vIFNpbGVudGx5IHJldHVybiBpZiB0aGUgVGV4dEVkaXRvciBpcyBpbnZhbGlkXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsb2FkRGVwcygpXG5cbiAgICBpZiAodGV4dEVkaXRvci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIC8vIEFib3J0IGZvciBpbnZhbGlkIG9yIHVuc2F2ZWQgdGV4dCBlZGl0b3JzXG4gICAgICBjb25zdCBtZXNzYWdlID0gJ0xpbnRlci1FU0xpbnQ6IFBsZWFzZSBzYXZlIGJlZm9yZSBmaXhpbmcnXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobWVzc2FnZSlcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgZmlsZURpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aClcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICAgIC8vIEdldCB0aGUgdGV4dCBmcm9tIHRoZSBlZGl0b3IsIHNvIHdlIGNhbiB1c2UgZXhlY3V0ZU9uVGV4dFxuICAgIGNvbnN0IHRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgIC8vIERvIG5vdCB0cnkgdG8gbWFrZSBmaXhlcyBvbiBhbiBlbXB0eSBmaWxlXG4gICAgaWYgKHRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBEbyBub3QgdHJ5IHRvIGZpeCBpZiBsaW50aW5nIHNob3VsZCBiZSBkaXNhYmxlZFxuICAgIGNvbnN0IGNvbmZpZ1BhdGggPSB3b3JrZXJIZWxwZXJzLmdldENvbmZpZ1BhdGgoZmlsZURpcilcbiAgICBjb25zdCBub1Byb2plY3RDb25maWcgPSAoY29uZmlnUGF0aCA9PT0gbnVsbCB8fCBpc0NvbmZpZ0F0SG9tZVJvb3QoY29uZmlnUGF0aCkpXG4gICAgaWYgKG5vUHJvamVjdENvbmZpZyAmJiBkaXNhYmxlV2hlbk5vRXNsaW50Q29uZmlnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBsZXQgcnVsZXMgPSB7fVxuICAgIGlmIChPYmplY3Qua2V5cyhpZ25vcmVkUnVsZXNXaGVuRml4aW5nKS5sZW5ndGggPiAwKSB7XG4gICAgICBydWxlcyA9IGlnbm9yZWRSdWxlc1doZW5GaXhpbmdcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoZWxwZXJzLnNlbmRKb2Ioe1xuICAgICAgICB0eXBlOiAnZml4JyxcbiAgICAgICAgY29uZmlnOiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQnKSxcbiAgICAgICAgY29udGVudHM6IHRleHQsXG4gICAgICAgIHJ1bGVzLFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgcHJvamVjdFBhdGhcbiAgICAgIH0pXG4gICAgICBpZiAoIWlzU2F2ZSkge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKGVyci5tZXNzYWdlKVxuICAgIH1cbiAgfSxcbn1cbiJdfQ==