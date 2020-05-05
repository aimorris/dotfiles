Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.startWorker = startWorker;
exports.killWorker = killWorker;

/**
 * Send a job to the worker and return the results
 * @param  {Object} config Configuration for the job to send to the worker
 * @return {Object|String|Error}        The data returned from the worker
 */

var sendJob = _asyncToGenerator(function* (config) {
  if (worker && !worker.childProcess.connected) {
    // Sometimes the worker dies and becomes disconnected
    // When that happens, it seems that there is no way to recover other
    // than to kill the worker and create a new one.
    killWorker();
  }

  // Ensure the worker is started
  startWorker();

  // Expand the config with a unique ID to emit on
  // NOTE: Jobs _must_ have a unique ID as they are completely async and results
  // can arrive back in any order.
  // eslint-disable-next-line no-param-reassign
  config.emitKey = (0, _cryptoRandomString2['default'])(10);

  return new Promise(function (resolve, reject) {
    // All worker errors are caught and re-emitted along with their associated
    // emitKey, so that we do not create multiple listeners for the same
    // 'task:error' event
    var errSub = worker.on('workerError:' + config.emitKey, function (_ref) {
      var msg = _ref.msg;
      var stack = _ref.stack;

      // Re-throw errors from the task
      var error = new Error(msg);
      // Set the stack to the one given to us by the worker
      error.stack = stack;
      errSub.dispose();
      // eslint-disable-next-line no-use-before-define
      responseSub.dispose();
      reject(error);
    });
    var responseSub = worker.on(config.emitKey, function (data) {
      errSub.dispose();
      responseSub.dispose();
      resolve(data);
    });
    // Send the job on to the worker
    try {
      worker.send(config);
    } catch (e) {
      errSub.dispose();
      responseSub.dispose();
      console.error(e);
    }
  });
});

exports.sendJob = sendJob;

var getDebugInfo = _asyncToGenerator(function* () {
  var textEditor = atom.workspace.getActiveTextEditor();
  var filePath = undefined;
  var editorScopes = undefined;
  if (atom.workspace.isTextEditor(textEditor)) {
    filePath = textEditor.getPath();
    editorScopes = textEditor.getLastCursor().getScopeDescriptor().getScopesArray();
  } else {
    // Somehow this can be called with no active TextEditor, impossible I know...
    filePath = 'unknown';
    editorScopes = ['unknown'];
  }
  var packagePath = atom.packages.resolvePackagePath('linter-eslint');
  var linterEslintMeta = undefined;
  if (packagePath === undefined) {
    // Apparently for some users the package path fails to resolve
    linterEslintMeta = { version: 'unknown!' };
  } else {
    // eslint-disable-next-line import/no-dynamic-require
    linterEslintMeta = require((0, _path.join)(packagePath, 'package.json'));
  }
  var config = atom.config.get('linter-eslint');
  var hoursSinceRestart = Math.round(process.uptime() / 3600 * 10) / 10;
  var returnVal = undefined;
  try {
    var response = yield sendJob({
      type: 'debug',
      config: config,
      filePath: filePath
    });
    returnVal = {
      atomVersion: atom.getVersion(),
      linterEslintVersion: linterEslintMeta.version,
      linterEslintConfig: config,
      // eslint-disable-next-line import/no-dynamic-require
      eslintVersion: require((0, _path.join)(response.path, 'package.json')).version,
      hoursSinceRestart: hoursSinceRestart,
      platform: process.platform,
      eslintType: response.type,
      eslintPath: response.path,
      editorScopes: editorScopes
    };
  } catch (error) {
    atom.notifications.addError('' + error);
  }
  return returnVal;
});

exports.getDebugInfo = getDebugInfo;

var generateDebugString = _asyncToGenerator(function* () {
  var debug = yield getDebugInfo();
  var details = ['Atom version: ' + debug.atomVersion, 'linter-eslint version: ' + debug.linterEslintVersion, 'ESLint version: ' + debug.eslintVersion, 'Hours since last Atom restart: ' + debug.hoursSinceRestart, 'Platform: ' + debug.platform, 'Using ' + debug.eslintType + ' ESLint from: ' + debug.eslintPath, 'Current file\'s scopes: ' + JSON.stringify(debug.editorScopes, null, 2), 'linter-eslint configuration: ' + JSON.stringify(debug.linterEslintConfig, null, 2)];
  return details.join('\n');
}

/**
 * Turn the given options into a Linter message array
 * @param  {TextEditor} textEditor The TextEditor to use to build the message
 * @param  {Object} options    The parameters used to fill in the message
 * @param  {string} [options.severity='error'] Can be one of: 'error', 'warning', 'info'
 * @param  {string} [options.excerpt=''] Short text to use in the message
 * @param  {string|Function} [options.description] Used to provide additional information
 * @return {Array}            Message to user generated from the parameters
 */
);

exports.generateDebugString = generateDebugString;
exports.generateUserMessage = generateUserMessage;
exports.handleError = handleError;

/**
 * Given a raw response from ESLint, this processes the messages into a format
 * compatible with the Linter API.
 * @param  {Object}     messages   The messages from ESLint's response
 * @param  {TextEditor} textEditor The Atom::TextEditor of the file the messages belong to
 * @param  {bool}       showRule   Whether to show the rule in the messages
 * @return {Promise}               The messages transformed into Linter messages
 */

var processESLintMessages = _asyncToGenerator(function* (messages, textEditor, showRule) {
  return Promise.all(messages.map(_asyncToGenerator(function* (_ref3) {
    var fatal = _ref3.fatal;
    var originalMessage = _ref3.message;
    var line = _ref3.line;
    var severity = _ref3.severity;
    var ruleId = _ref3.ruleId;
    var column = _ref3.column;
    var fix = _ref3.fix;
    var endLine = _ref3.endLine;
    var endColumn = _ref3.endColumn;

    var message = fatal ? originalMessage.split('\n')[0] : originalMessage;
    var filePath = textEditor.getPath();
    var textBuffer = textEditor.getBuffer();
    var linterFix = null;
    if (fix) {
      var fixRange = new _atom.Range(textBuffer.positionForCharacterIndex(fix.range[0]), textBuffer.positionForCharacterIndex(fix.range[1]));
      linterFix = {
        position: fixRange,
        replaceWith: fix.text
      };
    }
    var msgCol = undefined;
    var msgEndLine = undefined;
    var msgEndCol = undefined;
    var eslintFullRange = false;

    /*
     Note: ESLint positions are 1-indexed, while Atom expects 0-indexed,
     positions. We are subtracting 1 from these values here so we don't have to
     keep doing so in later uses.
     */
    var msgLine = line - 1;
    if (typeof endColumn === 'number' && typeof endLine === 'number') {
      eslintFullRange = true;
      // Here we always want the column to be a number
      msgCol = Math.max(0, column - 1);
      msgEndLine = endLine - 1;
      msgEndCol = endColumn - 1;
    } else {
      // We want msgCol to remain undefined if it was initially so
      // `generateRange` will give us a range over the entire line
      msgCol = typeof column === 'number' ? column - 1 : column;
    }

    var ret = {
      severity: severity === 1 ? 'warning' : 'error',
      location: {
        file: filePath
      }
    };

    if (ruleId) {
      ret.url = rules.getRuleUrl(ruleId);
    }

    var range = undefined;
    try {
      if (eslintFullRange) {
        var buffer = textEditor.getBuffer();
        (0, _validateEditor.throwIfInvalidPoint)(buffer, msgLine, msgCol);
        (0, _validateEditor.throwIfInvalidPoint)(buffer, msgEndLine, msgEndCol);
        range = [[msgLine, msgCol], [msgEndLine, msgEndCol]];
      } else {
        range = (0, _atomLinter.generateRange)(textEditor, msgLine, msgCol);
      }
      ret.location.position = range;

      var ruleAppendix = showRule ? ' (' + (ruleId || 'Fatal') + ')' : '';
      ret.excerpt = '' + message + ruleAppendix;

      if (linterFix) {
        ret.solutions = [linterFix];
      }
    } catch (err) {
      ret = yield generateInvalidTrace({
        msgLine: msgLine,
        msgCol: msgCol,
        msgEndLine: msgEndLine,
        msgEndCol: msgEndCol,
        eslintFullRange: eslintFullRange,
        filePath: filePath,
        textEditor: textEditor,
        ruleId: ruleId,
        message: message
      });
    }

    return ret;
  })));
}

/**
 * Processes the response from the lint job
 * @param  {Object}     response   The raw response from the job
 * @param  {TextEditor} textEditor The Atom::TextEditor of the file the messages belong to
 * @param  {bool}       showRule   Whether to show the rule in the messages
 * @return {Promise}               The messages transformed into Linter messages
 */
);

exports.processESLintMessages = processESLintMessages;

var processJobResponse = _asyncToGenerator(function* (response, textEditor, showRule) {
  if (Object.prototype.hasOwnProperty.call(response, 'updatedRules')) {
    rules.replaceRules(response.updatedRules);
  }
  return processESLintMessages(response.messages, textEditor, showRule);
});

exports.processJobResponse = processJobResponse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _atomLinter = require('atom-linter');

var _cryptoRandomString = require('crypto-random-string');

var _cryptoRandomString2 = _interopRequireDefault(_cryptoRandomString);

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _rules = require('./rules');

var _rules2 = _interopRequireDefault(_rules);

var _validateEditor = require('./validate/editor');

'use babel';

var rules = new _rules2['default']();
exports.rules = rules;
var worker = null;

/**
 * Start the worker process if it hasn't already been started
 */

function startWorker() {
  if (worker === null) {
    worker = new _atom.Task(require.resolve('./worker.js'));
  }

  if (worker.started) {
    // Worker start request has already been sent
    return;
  }
  // Send empty arguments as we don't use them in the worker
  worker.start([]);

  // NOTE: Modifies the Task of the worker, but it's the only clean way to track this
  worker.started = true;
}

/**
 * Forces the worker Task to kill itself
 */

function killWorker() {
  if (worker !== null) {
    worker.terminate();
    worker = null;
  }
}

function generateUserMessage(textEditor, options) {
  var _options$severity = options.severity;
  var severity = _options$severity === undefined ? 'error' : _options$severity;
  var _options$excerpt = options.excerpt;
  var excerpt = _options$excerpt === undefined ? '' : _options$excerpt;
  var description = options.description;

  return [{
    severity: severity,
    excerpt: excerpt,
    description: description,
    location: {
      file: textEditor.getPath(),
      position: (0, _atomLinter.generateRange)(textEditor)
    }
  }];
}

/**
 * Generates a message to the user in order to nicely display the Error being
 * thrown instead of depending on generic error handling.
 * @param  {TextEditor} textEditor The TextEditor to use to build the message
 * @param  {Error} error      Error to generate a message for
 * @return {Array}            Message to user generated from the Error
 */

function handleError(textEditor, error) {
  var stack = error.stack;
  var message = error.message;

  // Only show the first line of the message as the excerpt
  var excerpt = 'Error while running ESLint: ' + message.split('\n')[0] + '.';
  var description = '<div style="white-space: pre-wrap">' + message + '\n<hr />' + stack + '</div>';
  return generateUserMessage(textEditor, { severity: 'error', excerpt: excerpt, description: description });
}

var generateInvalidTrace = _asyncToGenerator(function* (_ref2) {
  var msgLine = _ref2.msgLine;
  var msgCol = _ref2.msgCol;
  var msgEndLine = _ref2.msgEndLine;
  var msgEndCol = _ref2.msgEndCol;
  var eslintFullRange = _ref2.eslintFullRange;
  var filePath = _ref2.filePath;
  var textEditor = _ref2.textEditor;
  var ruleId = _ref2.ruleId;
  var message = _ref2.message;

  var errMsgRange = msgLine + 1 + ':' + msgCol;
  if (eslintFullRange) {
    errMsgRange += ' - ' + (msgEndLine + 1) + ':' + (msgEndCol + 1);
  }
  var rangeText = 'Requested ' + (eslintFullRange ? 'start point' : 'range') + ': ' + errMsgRange;
  var issueURL = 'https://github.com/AtomLinter/linter-eslint/issues/new';
  var titleText = 'Invalid position given by \'' + ruleId + '\'';
  var title = encodeURIComponent(titleText);
  var body = encodeURIComponent(['ESLint returned a point that did not exist in the document being edited.', 'Rule: `' + ruleId + '`', rangeText, '', '', '<!-- If at all possible, please include code to reproduce this issue! -->', '', '', 'Debug information:', '```json', JSON.stringify((yield getDebugInfo()), null, 2), '```'].join('\n'));

  var location = {
    file: filePath,
    position: (0, _atomLinter.generateRange)(textEditor, 0)
  };
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;

  return {
    severity: 'error',
    excerpt: titleText + '. See the description for details. ' + 'Click the URL to open a new issue!',
    url: newIssueURL,
    location: location,
    description: rangeText + '\nOriginal message: ' + message
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBK0NzQixPQUFPLHFCQUF0QixXQUF1QixNQUFNLEVBQUU7QUFDcEMsTUFBSSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTs7OztBQUk1QyxjQUFVLEVBQUUsQ0FBQTtHQUNiOzs7QUFHRCxhQUFXLEVBQUUsQ0FBQTs7Ozs7O0FBTWIsUUFBTSxDQUFDLE9BQU8sR0FBRyxxQ0FBbUIsRUFBRSxDQUFDLENBQUE7O0FBRXZDLFNBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFLOzs7O0FBSXRDLFFBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLGtCQUFnQixNQUFNLENBQUMsT0FBTyxFQUFJLFVBQUMsSUFBYyxFQUFLO1VBQWpCLEdBQUcsR0FBTCxJQUFjLENBQVosR0FBRztVQUFFLEtBQUssR0FBWixJQUFjLENBQVAsS0FBSzs7O0FBRXJFLFVBQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUU1QixXQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNuQixZQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7O0FBRWhCLGlCQUFXLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckIsWUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ2QsQ0FBQyxDQUFBO0FBQ0YsUUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3RELFlBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNoQixpQkFBVyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3JCLGFBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNkLENBQUMsQ0FBQTs7QUFFRixR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QUFPO0FBQ2pCLFdBQU8sRUFBRSxBQUFHLFNBQVMsMkNBQ2pCLG9DQUFvQztBQUN4QyxPQUFHLEVBQUUsV0FBVztBQUNoQixZQUFRLEVBQVIsUUFBUTtBQUNSLGVBQVcsRUFBSyxTQUFTLDRCQUF1QixPQUFPLEFBQUU7R0FDMUQsQ0FBQTtDQUNGLENBQUEsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBnZW5lcmF0ZVJhbmdlIH0gZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgY3J5cHRvUmFuZG9tU3RyaW5nIGZyb20gJ2NyeXB0by1yYW5kb20tc3RyaW5nJ1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IFJhbmdlLCBUYXNrIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBSdWxlcyBmcm9tICcuL3J1bGVzJ1xuaW1wb3J0IHsgdGhyb3dJZkludmFsaWRQb2ludCB9IGZyb20gJy4vdmFsaWRhdGUvZWRpdG9yJ1xuXG5leHBvcnQgY29uc3QgcnVsZXMgPSBuZXcgUnVsZXMoKVxubGV0IHdvcmtlciA9IG51bGxcblxuLyoqXG4gKiBTdGFydCB0aGUgd29ya2VyIHByb2Nlc3MgaWYgaXQgaGFzbid0IGFscmVhZHkgYmVlbiBzdGFydGVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdvcmtlcigpIHtcbiAgaWYgKHdvcmtlciA9PT0gbnVsbCkge1xuICAgIHdvcmtlciA9IG5ldyBUYXNrKHJlcXVpcmUucmVzb2x2ZSgnLi93b3JrZXIuanMnKSlcbiAgfVxuXG4gIGlmICh3b3JrZXIuc3RhcnRlZCkge1xuICAgIC8vIFdvcmtlciBzdGFydCByZXF1ZXN0IGhhcyBhbHJlYWR5IGJlZW4gc2VudFxuICAgIHJldHVyblxuICB9XG4gIC8vIFNlbmQgZW1wdHkgYXJndW1lbnRzIGFzIHdlIGRvbid0IHVzZSB0aGVtIGluIHRoZSB3b3JrZXJcbiAgd29ya2VyLnN0YXJ0KFtdKVxuXG4gIC8vIE5PVEU6IE1vZGlmaWVzIHRoZSBUYXNrIG9mIHRoZSB3b3JrZXIsIGJ1dCBpdCdzIHRoZSBvbmx5IGNsZWFuIHdheSB0byB0cmFjayB0aGlzXG4gIHdvcmtlci5zdGFydGVkID0gdHJ1ZVxufVxuXG4vKipcbiAqIEZvcmNlcyB0aGUgd29ya2VyIFRhc2sgdG8ga2lsbCBpdHNlbGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtpbGxXb3JrZXIoKSB7XG4gIGlmICh3b3JrZXIgIT09IG51bGwpIHtcbiAgICB3b3JrZXIudGVybWluYXRlKClcbiAgICB3b3JrZXIgPSBudWxsXG4gIH1cbn1cblxuLyoqXG4gKiBTZW5kIGEgam9iIHRvIHRoZSB3b3JrZXIgYW5kIHJldHVybiB0aGUgcmVzdWx0c1xuICogQHBhcmFtICB7T2JqZWN0fSBjb25maWcgQ29uZmlndXJhdGlvbiBmb3IgdGhlIGpvYiB0byBzZW5kIHRvIHRoZSB3b3JrZXJcbiAqIEByZXR1cm4ge09iamVjdHxTdHJpbmd8RXJyb3J9ICAgICAgICBUaGUgZGF0YSByZXR1cm5lZCBmcm9tIHRoZSB3b3JrZXJcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRKb2IoY29uZmlnKSB7XG4gIGlmICh3b3JrZXIgJiYgIXdvcmtlci5jaGlsZFByb2Nlc3MuY29ubmVjdGVkKSB7XG4gICAgLy8gU29tZXRpbWVzIHRoZSB3b3JrZXIgZGllcyBhbmQgYmVjb21lcyBkaXNjb25uZWN0ZWRcbiAgICAvLyBXaGVuIHRoYXQgaGFwcGVucywgaXQgc2VlbXMgdGhhdCB0aGVyZSBpcyBubyB3YXkgdG8gcmVjb3ZlciBvdGhlclxuICAgIC8vIHRoYW4gdG8ga2lsbCB0aGUgd29ya2VyIGFuZCBjcmVhdGUgYSBuZXcgb25lLlxuICAgIGtpbGxXb3JrZXIoKVxuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSB3b3JrZXIgaXMgc3RhcnRlZFxuICBzdGFydFdvcmtlcigpXG5cbiAgLy8gRXhwYW5kIHRoZSBjb25maWcgd2l0aCBhIHVuaXF1ZSBJRCB0byBlbWl0IG9uXG4gIC8vIE5PVEU6IEpvYnMgX211c3RfIGhhdmUgYSB1bmlxdWUgSUQgYXMgdGhleSBhcmUgY29tcGxldGVseSBhc3luYyBhbmQgcmVzdWx0c1xuICAvLyBjYW4gYXJyaXZlIGJhY2sgaW4gYW55IG9yZGVyLlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgY29uZmlnLmVtaXRLZXkgPSBjcnlwdG9SYW5kb21TdHJpbmcoMTApXG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBBbGwgd29ya2VyIGVycm9ycyBhcmUgY2F1Z2h0IGFuZCByZS1lbWl0dGVkIGFsb25nIHdpdGggdGhlaXIgYXNzb2NpYXRlZFxuICAgIC8vIGVtaXRLZXksIHNvIHRoYXQgd2UgZG8gbm90IGNyZWF0ZSBtdWx0aXBsZSBsaXN0ZW5lcnMgZm9yIHRoZSBzYW1lXG4gICAgLy8gJ3Rhc2s6ZXJyb3InIGV2ZW50XG4gICAgY29uc3QgZXJyU3ViID0gd29ya2VyLm9uKGB3b3JrZXJFcnJvcjoke2NvbmZpZy5lbWl0S2V5fWAsICh7IG1zZywgc3RhY2sgfSkgPT4ge1xuICAgICAgLy8gUmUtdGhyb3cgZXJyb3JzIGZyb20gdGhlIHRhc2tcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1zZylcbiAgICAgIC8vIFNldCB0aGUgc3RhY2sgdG8gdGhlIG9uZSBnaXZlbiB0byB1cyBieSB0aGUgd29ya2VyXG4gICAgICBlcnJvci5zdGFjayA9IHN0YWNrXG4gICAgICBlcnJTdWIuZGlzcG9zZSgpXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlLWJlZm9yZS1kZWZpbmVcbiAgICAgIHJlc3BvbnNlU3ViLmRpc3Bvc2UoKVxuICAgICAgcmVqZWN0KGVycm9yKVxuICAgIH0pXG4gICAgY29uc3QgcmVzcG9uc2VTdWIgPSB3b3JrZXIub24oY29uZmlnLmVtaXRLZXksIChkYXRhKSA9PiB7XG4gICAgICBlcnJTdWIuZGlzcG9zZSgpXG4gICAgICByZXNwb25zZVN1Yi5kaXNwb3NlKClcbiAgICAgIHJlc29sdmUoZGF0YSlcbiAgICB9KVxuICAgIC8vIFNlbmQgdGhlIGpvYiBvbiB0byB0aGUgd29ya2VyXG4gICAgdHJ5IHtcbiAgICAgIHdvcmtlci5zZW5kKGNvbmZpZylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlcnJTdWIuZGlzcG9zZSgpXG4gICAgICByZXNwb25zZVN1Yi5kaXNwb3NlKClcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXREZWJ1Z0luZm8oKSB7XG4gIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgbGV0IGZpbGVQYXRoXG4gIGxldCBlZGl0b3JTY29wZXNcbiAgaWYgKGF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcih0ZXh0RWRpdG9yKSkge1xuICAgIGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICBlZGl0b3JTY29wZXMgPSB0ZXh0RWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRTY29wZURlc2NyaXB0b3IoKS5nZXRTY29wZXNBcnJheSgpXG4gIH0gZWxzZSB7XG4gICAgLy8gU29tZWhvdyB0aGlzIGNhbiBiZSBjYWxsZWQgd2l0aCBubyBhY3RpdmUgVGV4dEVkaXRvciwgaW1wb3NzaWJsZSBJIGtub3cuLi5cbiAgICBmaWxlUGF0aCA9ICd1bmtub3duJ1xuICAgIGVkaXRvclNjb3BlcyA9IFsndW5rbm93biddXG4gIH1cbiAgY29uc3QgcGFja2FnZVBhdGggPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aCgnbGludGVyLWVzbGludCcpXG4gIGxldCBsaW50ZXJFc2xpbnRNZXRhXG4gIGlmIChwYWNrYWdlUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gQXBwYXJlbnRseSBmb3Igc29tZSB1c2VycyB0aGUgcGFja2FnZSBwYXRoIGZhaWxzIHRvIHJlc29sdmVcbiAgICBsaW50ZXJFc2xpbnRNZXRhID0geyB2ZXJzaW9uOiAndW5rbm93biEnIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWR5bmFtaWMtcmVxdWlyZVxuICAgIGxpbnRlckVzbGludE1ldGEgPSByZXF1aXJlKGpvaW4ocGFja2FnZVBhdGgsICdwYWNrYWdlLmpzb24nKSlcbiAgfVxuICBjb25zdCBjb25maWcgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQnKVxuICBjb25zdCBob3Vyc1NpbmNlUmVzdGFydCA9IE1hdGgucm91bmQoKHByb2Nlc3MudXB0aW1lKCkgLyAzNjAwKSAqIDEwKSAvIDEwXG4gIGxldCByZXR1cm5WYWxcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRKb2Ioe1xuICAgICAgdHlwZTogJ2RlYnVnJyxcbiAgICAgIGNvbmZpZyxcbiAgICAgIGZpbGVQYXRoXG4gICAgfSlcbiAgICByZXR1cm5WYWwgPSB7XG4gICAgICBhdG9tVmVyc2lvbjogYXRvbS5nZXRWZXJzaW9uKCksXG4gICAgICBsaW50ZXJFc2xpbnRWZXJzaW9uOiBsaW50ZXJFc2xpbnRNZXRhLnZlcnNpb24sXG4gICAgICBsaW50ZXJFc2xpbnRDb25maWc6IGNvbmZpZyxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZHluYW1pYy1yZXF1aXJlXG4gICAgICBlc2xpbnRWZXJzaW9uOiByZXF1aXJlKGpvaW4ocmVzcG9uc2UucGF0aCwgJ3BhY2thZ2UuanNvbicpKS52ZXJzaW9uLFxuICAgICAgaG91cnNTaW5jZVJlc3RhcnQsXG4gICAgICBwbGF0Zm9ybTogcHJvY2Vzcy5wbGF0Zm9ybSxcbiAgICAgIGVzbGludFR5cGU6IHJlc3BvbnNlLnR5cGUsXG4gICAgICBlc2xpbnRQYXRoOiByZXNwb25zZS5wYXRoLFxuICAgICAgZWRpdG9yU2NvcGVzLFxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYCR7ZXJyb3J9YClcbiAgfVxuICByZXR1cm4gcmV0dXJuVmFsXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZURlYnVnU3RyaW5nKCkge1xuICBjb25zdCBkZWJ1ZyA9IGF3YWl0IGdldERlYnVnSW5mbygpXG4gIGNvbnN0IGRldGFpbHMgPSBbXG4gICAgYEF0b20gdmVyc2lvbjogJHtkZWJ1Zy5hdG9tVmVyc2lvbn1gLFxuICAgIGBsaW50ZXItZXNsaW50IHZlcnNpb246ICR7ZGVidWcubGludGVyRXNsaW50VmVyc2lvbn1gLFxuICAgIGBFU0xpbnQgdmVyc2lvbjogJHtkZWJ1Zy5lc2xpbnRWZXJzaW9ufWAsXG4gICAgYEhvdXJzIHNpbmNlIGxhc3QgQXRvbSByZXN0YXJ0OiAke2RlYnVnLmhvdXJzU2luY2VSZXN0YXJ0fWAsXG4gICAgYFBsYXRmb3JtOiAke2RlYnVnLnBsYXRmb3JtfWAsXG4gICAgYFVzaW5nICR7ZGVidWcuZXNsaW50VHlwZX0gRVNMaW50IGZyb206ICR7ZGVidWcuZXNsaW50UGF0aH1gLFxuICAgIGBDdXJyZW50IGZpbGUncyBzY29wZXM6ICR7SlNPTi5zdHJpbmdpZnkoZGVidWcuZWRpdG9yU2NvcGVzLCBudWxsLCAyKX1gLFxuICAgIGBsaW50ZXItZXNsaW50IGNvbmZpZ3VyYXRpb246ICR7SlNPTi5zdHJpbmdpZnkoZGVidWcubGludGVyRXNsaW50Q29uZmlnLCBudWxsLCAyKX1gXG4gIF1cbiAgcmV0dXJuIGRldGFpbHMuam9pbignXFxuJylcbn1cblxuLyoqXG4gKiBUdXJuIHRoZSBnaXZlbiBvcHRpb25zIGludG8gYSBMaW50ZXIgbWVzc2FnZSBhcnJheVxuICogQHBhcmFtICB7VGV4dEVkaXRvcn0gdGV4dEVkaXRvciBUaGUgVGV4dEVkaXRvciB0byB1c2UgdG8gYnVpbGQgdGhlIG1lc3NhZ2VcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyAgICBUaGUgcGFyYW1ldGVycyB1c2VkIHRvIGZpbGwgaW4gdGhlIG1lc3NhZ2VcbiAqIEBwYXJhbSAge3N0cmluZ30gW29wdGlvbnMuc2V2ZXJpdHk9J2Vycm9yJ10gQ2FuIGJlIG9uZSBvZjogJ2Vycm9yJywgJ3dhcm5pbmcnLCAnaW5mbydcbiAqIEBwYXJhbSAge3N0cmluZ30gW29wdGlvbnMuZXhjZXJwdD0nJ10gU2hvcnQgdGV4dCB0byB1c2UgaW4gdGhlIG1lc3NhZ2VcbiAqIEBwYXJhbSAge3N0cmluZ3xGdW5jdGlvbn0gW29wdGlvbnMuZGVzY3JpcHRpb25dIFVzZWQgdG8gcHJvdmlkZSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICBNZXNzYWdlIHRvIHVzZXIgZ2VuZXJhdGVkIGZyb20gdGhlIHBhcmFtZXRlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVXNlck1lc3NhZ2UodGV4dEVkaXRvciwgb3B0aW9ucykge1xuICBjb25zdCB7XG4gICAgc2V2ZXJpdHkgPSAnZXJyb3InLFxuICAgIGV4Y2VycHQgPSAnJyxcbiAgICBkZXNjcmlwdGlvbixcbiAgfSA9IG9wdGlvbnNcbiAgcmV0dXJuIFt7XG4gICAgc2V2ZXJpdHksXG4gICAgZXhjZXJwdCxcbiAgICBkZXNjcmlwdGlvbixcbiAgICBsb2NhdGlvbjoge1xuICAgICAgZmlsZTogdGV4dEVkaXRvci5nZXRQYXRoKCksXG4gICAgICBwb3NpdGlvbjogZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yKSxcbiAgICB9LFxuICB9XVxufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIG1lc3NhZ2UgdG8gdGhlIHVzZXIgaW4gb3JkZXIgdG8gbmljZWx5IGRpc3BsYXkgdGhlIEVycm9yIGJlaW5nXG4gKiB0aHJvd24gaW5zdGVhZCBvZiBkZXBlbmRpbmcgb24gZ2VuZXJpYyBlcnJvciBoYW5kbGluZy5cbiAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgVGhlIFRleHRFZGl0b3IgdG8gdXNlIHRvIGJ1aWxkIHRoZSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtFcnJvcn0gZXJyb3IgICAgICBFcnJvciB0byBnZW5lcmF0ZSBhIG1lc3NhZ2UgZm9yXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICBNZXNzYWdlIHRvIHVzZXIgZ2VuZXJhdGVkIGZyb20gdGhlIEVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVFcnJvcih0ZXh0RWRpdG9yLCBlcnJvcikge1xuICBjb25zdCB7IHN0YWNrLCBtZXNzYWdlIH0gPSBlcnJvclxuICAvLyBPbmx5IHNob3cgdGhlIGZpcnN0IGxpbmUgb2YgdGhlIG1lc3NhZ2UgYXMgdGhlIGV4Y2VycHRcbiAgY29uc3QgZXhjZXJwdCA9IGBFcnJvciB3aGlsZSBydW5uaW5nIEVTTGludDogJHttZXNzYWdlLnNwbGl0KCdcXG4nKVswXX0uYFxuICBjb25zdCBkZXNjcmlwdGlvbiA9IGA8ZGl2IHN0eWxlPVwid2hpdGUtc3BhY2U6IHByZS13cmFwXCI+JHttZXNzYWdlfVxcbjxociAvPiR7c3RhY2t9PC9kaXY+YFxuICByZXR1cm4gZ2VuZXJhdGVVc2VyTWVzc2FnZSh0ZXh0RWRpdG9yLCB7IHNldmVyaXR5OiAnZXJyb3InLCBleGNlcnB0LCBkZXNjcmlwdGlvbiB9KVxufVxuXG5jb25zdCBnZW5lcmF0ZUludmFsaWRUcmFjZSA9IGFzeW5jICh7XG4gIG1zZ0xpbmUsIG1zZ0NvbCwgbXNnRW5kTGluZSwgbXNnRW5kQ29sLFxuICBlc2xpbnRGdWxsUmFuZ2UsIGZpbGVQYXRoLCB0ZXh0RWRpdG9yLCBydWxlSWQsIG1lc3NhZ2Vcbn0pID0+IHtcbiAgbGV0IGVyck1zZ1JhbmdlID0gYCR7bXNnTGluZSArIDF9OiR7bXNnQ29sfWBcbiAgaWYgKGVzbGludEZ1bGxSYW5nZSkge1xuICAgIGVyck1zZ1JhbmdlICs9IGAgLSAke21zZ0VuZExpbmUgKyAxfToke21zZ0VuZENvbCArIDF9YFxuICB9XG4gIGNvbnN0IHJhbmdlVGV4dCA9IGBSZXF1ZXN0ZWQgJHtlc2xpbnRGdWxsUmFuZ2UgPyAnc3RhcnQgcG9pbnQnIDogJ3JhbmdlJ306ICR7ZXJyTXNnUmFuZ2V9YFxuICBjb25zdCBpc3N1ZVVSTCA9ICdodHRwczovL2dpdGh1Yi5jb20vQXRvbUxpbnRlci9saW50ZXItZXNsaW50L2lzc3Vlcy9uZXcnXG4gIGNvbnN0IHRpdGxlVGV4dCA9IGBJbnZhbGlkIHBvc2l0aW9uIGdpdmVuIGJ5ICcke3J1bGVJZH0nYFxuICBjb25zdCB0aXRsZSA9IGVuY29kZVVSSUNvbXBvbmVudCh0aXRsZVRleHQpXG4gIGNvbnN0IGJvZHkgPSBlbmNvZGVVUklDb21wb25lbnQoW1xuICAgICdFU0xpbnQgcmV0dXJuZWQgYSBwb2ludCB0aGF0IGRpZCBub3QgZXhpc3QgaW4gdGhlIGRvY3VtZW50IGJlaW5nIGVkaXRlZC4nLFxuICAgIGBSdWxlOiBcXGAke3J1bGVJZH1cXGBgLFxuICAgIHJhbmdlVGV4dCxcbiAgICAnJywgJycsXG4gICAgJzwhLS0gSWYgYXQgYWxsIHBvc3NpYmxlLCBwbGVhc2UgaW5jbHVkZSBjb2RlIHRvIHJlcHJvZHVjZSB0aGlzIGlzc3VlISAtLT4nLFxuICAgICcnLCAnJyxcbiAgICAnRGVidWcgaW5mb3JtYXRpb246JyxcbiAgICAnYGBganNvbicsXG4gICAgSlNPTi5zdHJpbmdpZnkoYXdhaXQgZ2V0RGVidWdJbmZvKCksIG51bGwsIDIpLFxuICAgICdgYGAnXG4gIF0uam9pbignXFxuJykpXG5cbiAgY29uc3QgbG9jYXRpb24gPSB7XG4gICAgZmlsZTogZmlsZVBhdGgsXG4gICAgcG9zaXRpb246IGdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgMCksXG4gIH1cbiAgY29uc3QgbmV3SXNzdWVVUkwgPSBgJHtpc3N1ZVVSTH0/dGl0bGU9JHt0aXRsZX0mYm9keT0ke2JvZHl9YFxuXG4gIHJldHVybiB7XG4gICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgZXhjZXJwdDogYCR7dGl0bGVUZXh0fS4gU2VlIHRoZSBkZXNjcmlwdGlvbiBmb3IgZGV0YWlscy4gYFxuICAgICAgKyAnQ2xpY2sgdGhlIFVSTCB0byBvcGVuIGEgbmV3IGlzc3VlIScsXG4gICAgdXJsOiBuZXdJc3N1ZVVSTCxcbiAgICBsb2NhdGlvbixcbiAgICBkZXNjcmlwdGlvbjogYCR7cmFuZ2VUZXh0fVxcbk9yaWdpbmFsIG1lc3NhZ2U6ICR7bWVzc2FnZX1gXG4gIH1cbn1cblxuLyoqXG4gKiBHaXZlbiBhIHJhdyByZXNwb25zZSBmcm9tIEVTTGludCwgdGhpcyBwcm9jZXNzZXMgdGhlIG1lc3NhZ2VzIGludG8gYSBmb3JtYXRcbiAqIGNvbXBhdGlibGUgd2l0aCB0aGUgTGludGVyIEFQSS5cbiAqIEBwYXJhbSAge09iamVjdH0gICAgIG1lc3NhZ2VzICAgVGhlIG1lc3NhZ2VzIGZyb20gRVNMaW50J3MgcmVzcG9uc2VcbiAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgVGhlIEF0b206OlRleHRFZGl0b3Igb2YgdGhlIGZpbGUgdGhlIG1lc3NhZ2VzIGJlbG9uZyB0b1xuICogQHBhcmFtICB7Ym9vbH0gICAgICAgc2hvd1J1bGUgICBXaGV0aGVyIHRvIHNob3cgdGhlIHJ1bGUgaW4gdGhlIG1lc3NhZ2VzXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgIFRoZSBtZXNzYWdlcyB0cmFuc2Zvcm1lZCBpbnRvIExpbnRlciBtZXNzYWdlc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0VTTGludE1lc3NhZ2VzKG1lc3NhZ2VzLCB0ZXh0RWRpdG9yLCBzaG93UnVsZSkge1xuICByZXR1cm4gUHJvbWlzZS5hbGwobWVzc2FnZXMubWFwKGFzeW5jICh7XG4gICAgZmF0YWwsIG1lc3NhZ2U6IG9yaWdpbmFsTWVzc2FnZSwgbGluZSwgc2V2ZXJpdHksIHJ1bGVJZCwgY29sdW1uLCBmaXgsIGVuZExpbmUsIGVuZENvbHVtblxuICB9KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IGZhdGFsID8gb3JpZ2luYWxNZXNzYWdlLnNwbGl0KCdcXG4nKVswXSA6IG9yaWdpbmFsTWVzc2FnZVxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICBjb25zdCB0ZXh0QnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGxldCBsaW50ZXJGaXggPSBudWxsXG4gICAgaWYgKGZpeCkge1xuICAgICAgY29uc3QgZml4UmFuZ2UgPSBuZXcgUmFuZ2UoXG4gICAgICAgIHRleHRCdWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChmaXgucmFuZ2VbMF0pLFxuICAgICAgICB0ZXh0QnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoZml4LnJhbmdlWzFdKVxuICAgICAgKVxuICAgICAgbGludGVyRml4ID0ge1xuICAgICAgICBwb3NpdGlvbjogZml4UmFuZ2UsXG4gICAgICAgIHJlcGxhY2VXaXRoOiBmaXgudGV4dFxuICAgICAgfVxuICAgIH1cbiAgICBsZXQgbXNnQ29sXG4gICAgbGV0IG1zZ0VuZExpbmVcbiAgICBsZXQgbXNnRW5kQ29sXG4gICAgbGV0IGVzbGludEZ1bGxSYW5nZSA9IGZhbHNlXG5cbiAgICAvKlxuICAgICBOb3RlOiBFU0xpbnQgcG9zaXRpb25zIGFyZSAxLWluZGV4ZWQsIHdoaWxlIEF0b20gZXhwZWN0cyAwLWluZGV4ZWQsXG4gICAgIHBvc2l0aW9ucy4gV2UgYXJlIHN1YnRyYWN0aW5nIDEgZnJvbSB0aGVzZSB2YWx1ZXMgaGVyZSBzbyB3ZSBkb24ndCBoYXZlIHRvXG4gICAgIGtlZXAgZG9pbmcgc28gaW4gbGF0ZXIgdXNlcy5cbiAgICAgKi9cbiAgICBjb25zdCBtc2dMaW5lID0gbGluZSAtIDFcbiAgICBpZiAodHlwZW9mIGVuZENvbHVtbiA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGVuZExpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICBlc2xpbnRGdWxsUmFuZ2UgPSB0cnVlXG4gICAgICAvLyBIZXJlIHdlIGFsd2F5cyB3YW50IHRoZSBjb2x1bW4gdG8gYmUgYSBudW1iZXJcbiAgICAgIG1zZ0NvbCA9IE1hdGgubWF4KDAsIGNvbHVtbiAtIDEpXG4gICAgICBtc2dFbmRMaW5lID0gZW5kTGluZSAtIDFcbiAgICAgIG1zZ0VuZENvbCA9IGVuZENvbHVtbiAtIDFcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2Ugd2FudCBtc2dDb2wgdG8gcmVtYWluIHVuZGVmaW5lZCBpZiBpdCB3YXMgaW5pdGlhbGx5IHNvXG4gICAgICAvLyBgZ2VuZXJhdGVSYW5nZWAgd2lsbCBnaXZlIHVzIGEgcmFuZ2Ugb3ZlciB0aGUgZW50aXJlIGxpbmVcbiAgICAgIG1zZ0NvbCA9IHR5cGVvZiBjb2x1bW4gPT09ICdudW1iZXInID8gY29sdW1uIC0gMSA6IGNvbHVtblxuICAgIH1cblxuICAgIGxldCByZXQgPSB7XG4gICAgICBzZXZlcml0eTogc2V2ZXJpdHkgPT09IDEgPyAnd2FybmluZycgOiAnZXJyb3InLFxuICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgZmlsZTogZmlsZVBhdGgsXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJ1bGVJZCkge1xuICAgICAgcmV0LnVybCA9IHJ1bGVzLmdldFJ1bGVVcmwocnVsZUlkKVxuICAgIH1cblxuICAgIGxldCByYW5nZVxuICAgIHRyeSB7XG4gICAgICBpZiAoZXNsaW50RnVsbFJhbmdlKSB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgICAgdGhyb3dJZkludmFsaWRQb2ludChidWZmZXIsIG1zZ0xpbmUsIG1zZ0NvbClcbiAgICAgICAgdGhyb3dJZkludmFsaWRQb2ludChidWZmZXIsIG1zZ0VuZExpbmUsIG1zZ0VuZENvbClcbiAgICAgICAgcmFuZ2UgPSBbW21zZ0xpbmUsIG1zZ0NvbF0sIFttc2dFbmRMaW5lLCBtc2dFbmRDb2xdXVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmFuZ2UgPSBnZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIG1zZ0xpbmUsIG1zZ0NvbClcbiAgICAgIH1cbiAgICAgIHJldC5sb2NhdGlvbi5wb3NpdGlvbiA9IHJhbmdlXG5cbiAgICAgIGNvbnN0IHJ1bGVBcHBlbmRpeCA9IHNob3dSdWxlID8gYCAoJHtydWxlSWQgfHwgJ0ZhdGFsJ30pYCA6ICcnXG4gICAgICByZXQuZXhjZXJwdCA9IGAke21lc3NhZ2V9JHtydWxlQXBwZW5kaXh9YFxuXG4gICAgICBpZiAobGludGVyRml4KSB7XG4gICAgICAgIHJldC5zb2x1dGlvbnMgPSBbbGludGVyRml4XVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0ID0gYXdhaXQgZ2VuZXJhdGVJbnZhbGlkVHJhY2Uoe1xuICAgICAgICBtc2dMaW5lLFxuICAgICAgICBtc2dDb2wsXG4gICAgICAgIG1zZ0VuZExpbmUsXG4gICAgICAgIG1zZ0VuZENvbCxcbiAgICAgICAgZXNsaW50RnVsbFJhbmdlLFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgdGV4dEVkaXRvcixcbiAgICAgICAgcnVsZUlkLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0XG4gIH0pKVxufVxuXG4vKipcbiAqIFByb2Nlc3NlcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgbGludCBqb2JcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIHJlc3BvbnNlICAgVGhlIHJhdyByZXNwb25zZSBmcm9tIHRoZSBqb2JcbiAqIEBwYXJhbSAge1RleHRFZGl0b3J9IHRleHRFZGl0b3IgVGhlIEF0b206OlRleHRFZGl0b3Igb2YgdGhlIGZpbGUgdGhlIG1lc3NhZ2VzIGJlbG9uZyB0b1xuICogQHBhcmFtICB7Ym9vbH0gICAgICAgc2hvd1J1bGUgICBXaGV0aGVyIHRvIHNob3cgdGhlIHJ1bGUgaW4gdGhlIG1lc3NhZ2VzXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgIFRoZSBtZXNzYWdlcyB0cmFuc2Zvcm1lZCBpbnRvIExpbnRlciBtZXNzYWdlc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0pvYlJlc3BvbnNlKHJlc3BvbnNlLCB0ZXh0RWRpdG9yLCBzaG93UnVsZSkge1xuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3BvbnNlLCAndXBkYXRlZFJ1bGVzJykpIHtcbiAgICBydWxlcy5yZXBsYWNlUnVsZXMocmVzcG9uc2UudXBkYXRlZFJ1bGVzKVxuICB9XG4gIHJldHVybiBwcm9jZXNzRVNMaW50TWVzc2FnZXMocmVzcG9uc2UubWVzc2FnZXMsIHRleHRFZGl0b3IsIHNob3dSdWxlKVxufVxuIl19