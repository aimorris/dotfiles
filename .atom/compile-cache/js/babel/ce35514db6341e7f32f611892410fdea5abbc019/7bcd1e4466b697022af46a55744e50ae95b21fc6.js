Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isValidEditor = isValidEditor;
exports.focusEditor = focusEditor;
exports.replaceTag = replaceTag;
exports.replaceTags = replaceTags;
exports.formatType = formatType;
exports.prepareType = prepareType;
exports.prepareInlineDocs = prepareInlineDocs;
exports.buildDisplayText = buildDisplayText;
exports.buildSnippet = buildSnippet;
exports.extractParams = extractParams;
exports.formatTypeCompletion = formatTypeCompletion;
exports.disposeAll = disposeAll;
exports.openFileAndGoToPosition = openFileAndGoToPosition;
exports.openFileAndGoTo = openFileAndGoTo;
exports.updateTernFile = updateTernFile;
exports.writeFile = writeFile;
exports.isDirectory = isDirectory;
exports.fileExists = fileExists;
exports.getFileContent = getFileContent;
exports.readFile = readFile;
exports.markDefinitionBufferRange = markDefinitionBufferRange;
exports.getPackagePath = getPackagePath;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _servicesNavigation = require('./services/navigation');

var _servicesNavigation2 = _interopRequireDefault(_servicesNavigation);

'use babel';

var tags = {

  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

var grammars = ['JavaScript', 'JavaScript (JSX)', 'Babel ES6 JavaScript', 'Vue Component'];

function isValidEditor(editor) {

  var isTextEditor = atom.workspace.isTextEditor(editor);

  if (!isTextEditor || editor.isMini()) {

    return false;
  }

  var grammar = editor.getGrammar();

  if (!grammars.includes(grammar.name)) {

    return false;
  }

  return true;
}

function focusEditor() {

  var editor = atom.workspace.getActiveTextEditor();

  if (!editor) {

    return;
  }

  var view = atom.views.getView(editor);

  view && view.focus && view.focus();
}

function replaceTag(tag) {

  return tags[tag];
}

function replaceTags(str) {

  if (!str) {

    return '';
  }

  return str.replace(/[&<>]/g, replaceTag);
}

function formatType(data) {

  if (!data.type) {

    return '';
  }

  data.type = data.type.replace(/->/g, ':').replace('<top>', 'window');

  if (!data.exprName) {

    return data.type;
  }

  data.type = data.type.replace(/^fn/, data.exprName);

  return data.type;
}

function prepareType(data) {

  if (!data.type) {

    return;
  }

  return data.type.replace(/->/g, ':').replace('<top>', 'window');
}

function prepareInlineDocs(data) {

  return data.replace(/@param/, '<span class="doc-param-first">@param</span>').replace(/@param/g, '<span class="text-info doc-param">@param</span>').replace(/@return/, '<span class="text-info doc-return">@return</span>');
}

function buildDisplayText(params, name) {

  if (params.length === 0) {

    return name + '()';
  }

  var suggestionParams = params.map(function (param) {

    param = param.replace('}', '\\}');
    param = param.replace(/'"/g, '');

    return param;
  });

  return name + '(' + suggestionParams.join(',') + ')';
}

function buildSnippet(params, name) {

  var suggestionParams = params.map(function (param, i) {

    param = param.replace('}', '\\}');

    return '${' + (i + 1) + ':' + param + '}';
  });

  return name + '(' + suggestionParams.join(',') + ')';
}

function extractParams(type) {

  if (!type || type.startsWith('fn()')) {

    return [];
  }

  var params = [];
  var start = type.indexOf('(') + 1;
  var inside = 0;

  for (var i = start; i < type.length; i++) {

    if (type[i] === ':' && inside === -1) {

      params.push(type.substring(start, i - 2));

      break;
    }

    if (i === type.length - 1) {

      var param = type.substring(start, i);

      if (param.length) {

        params.push(param);
      }

      break;
    }

    if (type[i] === ',' && inside === 0) {

      params.push(type.substring(start, i));
      start = i + 1;

      continue;
    }

    if (type[i].match(/[{\[\(]/)) {

      inside++;

      continue;
    }

    if (type[i].match(/[}\]\)]/)) {

      inside--;
    }
  }

  return params;
}

function formatTypeCompletion(obj, isProperty, isObjectKey, isInFunDef) {

  if (obj.isKeyword) {

    obj._typeSelf = 'keyword';
  }

  if (obj.type === 'string') {

    obj.name = obj.name ? obj.name.replace(/(^"|"$)/g, '') : null;
  } else {

    obj.name = obj.name ? obj.name.replace(/["']/g, '') : null;
  }

  obj.name = obj.name ? obj.name.replace(/^..?\//, '') : null;

  if (!obj.type) {

    obj._displayText = obj.name;
    obj._snippet = obj.name;

    return obj;
  }

  if (!obj.type.startsWith('fn')) {

    if (isProperty) {

      obj._typeSelf = 'property';
    } else {

      obj._typeSelf = 'variable';
    }
  }

  obj.type = obj.rightLabel = prepareType(obj);

  if (obj.type.replace(/fn\(.+\)/, '').length === 0) {

    obj.leftLabel = '';
  } else {

    if (obj.type.indexOf('fn') === -1) {

      obj.leftLabel = obj.type;
    } else {

      obj.leftLabel = obj.type.replace(/fn\(.{0,}\)/, '').replace(' : ', '');
    }
  }

  if (obj.rightLabel.startsWith('fn')) {

    var params = extractParams(obj.rightLabel);
    var editor = atom.workspace.getActiveTextEditor();
    var cursor = editor.getLastCursor();
    var bufferPosition = cursor.getBufferPosition();
    var bufferPositionFollowing = [bufferPosition.row, bufferPosition.column + 1];
    var charFollowing = editor.getTextInBufferRange([bufferPosition, bufferPositionFollowing]);
    var shouldAddParenthesesToSnippet = charFollowing !== '(';

    if (_atomTernjsPackageConfig2['default'].options.useSnippets || _atomTernjsPackageConfig2['default'].options.useSnippetsAndFunction) {

      if (!isInFunDef) {

        if (params.length === 0) {

          obj._snippet = '' + obj.name + (shouldAddParenthesesToSnippet ? '()' : '');
        } else {

          obj._snippet = buildSnippet(params, obj.name);
        }
      }

      obj._hasParams = params.length ? true : false;
    } else {

      if (!isInFunDef) {

        obj._snippet = params.length ? obj.name + '(${' + 0 + ':${}})' : '' + obj.name + (shouldAddParenthesesToSnippet ? '()' : '');
      }

      obj._displayText = buildDisplayText(params, obj.name);
    }

    obj._typeSelf = 'function';
  }

  if (obj.name) {

    if (obj.leftLabel === obj.name) {

      obj.leftLabel = null;
      obj.rightLabel = null;
    }
  }

  if (obj.leftLabel === obj.rightLabel) {

    obj.rightLabel = null;
  }

  return obj;
}

function disposeAll(disposables) {

  disposables.forEach(function (disposable) {
    return disposable.dispose();
  });
}

function openFileAndGoToPosition(position, file) {

  atom.workspace.open(file).then(function (textEditor) {

    var cursor = textEditor.getLastCursor();

    if (!cursor) {

      return;
    }

    cursor.setBufferPosition(position);
  });
}

function openFileAndGoTo(start, file) {

  atom.workspace.open(file).then(function (textEditor) {

    var buffer = textEditor.getBuffer();
    var cursor = textEditor.getLastCursor();

    if (!buffer || !cursor) {

      return;
    }

    var bufferPosition = buffer.positionForCharacterIndex(start);

    cursor.setBufferPosition(buffer.positionForCharacterIndex(start));

    _servicesNavigation2['default'].append(textEditor, buffer, bufferPosition);

    markDefinitionBufferRange(cursor, textEditor);
  });
}

function updateTernFile(content) {

  var projectRoot = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

  if (!projectRoot) {

    return;
  }

  writeFile(_path2['default'].resolve(__dirname, projectRoot + '/.tern-project'), content);
}

function writeFile(filePath, content) {

  _fs2['default'].writeFile(filePath, content, function (error) {

    atom.workspace.open(filePath);

    if (!error) {

      var server = _atomTernjsManager2['default'].server;
      server && server.restart();

      return;
    }

    var message = 'Could not create/update .tern-project file. Use the README to manually create a .tern-project file.';

    atom.notifications.addInfo(message, {

      dismissable: true
    });
  });
}

function isDirectory(dir) {

  try {

    return _fs2['default'].statSync(dir).isDirectory();
  } catch (error) {

    return false;
  }
}

function fileExists(path) {

  try {

    _fs2['default'].accessSync(path, _fs2['default'].F_OK, function (error) {

      console.error(error);
    });
  } catch (error) {

    return false;
  }
}

function getFileContent(filePath, root) {

  var _filePath = root + filePath;
  var resolvedPath = _path2['default'].resolve(__dirname, _filePath);

  if (fileExists(resolvedPath) !== undefined) {

    return false;
  }

  return readFile(resolvedPath);
}

function readFile(path) {

  try {

    return _fs2['default'].readFileSync(path, 'utf8');
  } catch (err) {

    return undefined;
  }
}

function markDefinitionBufferRange(cursor, editor) {

  var range = cursor.getCurrentWordBufferRange();
  var marker = editor.markBufferRange(range, { invalidate: 'touch' });

  var decoration = editor.decorateMarker(marker, {

    type: 'highlight',
    'class': 'atom-ternjs-definition-marker',
    invalidate: 'touch'
  });

  if (!decoration) {

    return;
  }

  setTimeout(function () {

    decoration.setProperties({

      type: 'highlight',
      'class': 'atom-ternjs-definition-marker active',
      invalidate: 'touch'
    });
  }, 1);

  setTimeout(function () {

    decoration.setProperties({

      type: 'highlight',
      'class': 'atom-ternjs-definition-marker',
      invalidate: 'touch'
    });
  }, 1501);

  setTimeout(function () {

    marker.destroy();
  }, 2500);
}

function getPackagePath() {

  var packagPath = atom.packages.resolvePackagePath('atom-ternjs');

  return packagPath;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1oZWxwZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztpQ0FFb0IsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7b0JBQ3ZDLE1BQU07Ozs7a0JBQ1IsSUFBSTs7OztrQ0FDSSx1QkFBdUI7Ozs7QUFOOUMsV0FBVyxDQUFDOztBQVFaLElBQU0sSUFBSSxHQUFHOztBQUVYLEtBQUcsRUFBRSxPQUFPO0FBQ1osS0FBRyxFQUFFLE1BQU07QUFDWCxLQUFHLEVBQUUsTUFBTTtDQUNaLENBQUM7O0FBRUYsSUFBTSxRQUFRLEdBQUcsQ0FFZixZQUFZLEVBQ1osa0JBQWtCLEVBQ2xCLHNCQUFzQixFQUN0QixlQUFlLENBQ2hCLENBQUM7O0FBRUssU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFOztBQUVwQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekQsTUFBSSxDQUFDLFlBQVksSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7O0FBRXBDLFdBQU8sS0FBSyxDQUFDO0dBQ2Q7O0FBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDOztBQUVwQyxNQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBRXBDLFdBQU8sS0FBSyxDQUFDO0dBQ2Q7O0FBRUQsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFFTSxTQUFTLFdBQVcsR0FBRzs7QUFFNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxNQUFJLENBQUMsTUFBTSxFQUFFOztBQUVYLFdBQU87R0FDUjs7QUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENB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LEdBQUcsTUFBTSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxVQUFVLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQzs7QUFFcEUsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7O0FBRS9DLFFBQUksRUFBRSxXQUFXO0FBQ2pCLGFBQU8sK0JBQStCO0FBQ3RDLGNBQVUsRUFBRSxPQUFPO0dBQ3BCLENBQUMsQ0FBQzs7QUFFSCxNQUFJLENBQUMsVUFBVSxFQUFFOztBQUVmLFdBQU87R0FDUjs7QUFFRCxZQUFVLENBQUMsWUFBTTs7QUFFZixjQUFVLENBQUMsYUFBYSxDQUFDOztBQUV2QixVQUFJLEVBQUUsV0FBVztBQUNqQixlQUFPLHNDQUFzQztBQUM3QyxnQkFBVSxFQUFFLE9BQU87S0FDcEIsQ0FBQyxDQUFDO0dBRUosRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFTixZQUFVLENBQUMsWUFBTTs7QUFFZixjQUFVLENBQUMsYUFBYSxDQUFDOztBQUV2QixVQUFJLEVBQUUsV0FBVztBQUNqQixlQUFPLCtCQUErQjtBQUN0QyxnQkFBVSxFQUFFLE9BQU87S0FDcEIsQ0FBQyxDQUFDO0dBRUosRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFVCxZQUFVLENBQUMsWUFBTTs7QUFFZixVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7R0FFbEIsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUNWOztBQUVNLFNBQVMsY0FBYyxHQUFHOztBQUUvQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVuRSxTQUFPLFVBQVUsQ0FBQztDQUNuQiIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBuYXZpZ2F0aW9uIGZyb20gJy4vc2VydmljZXMvbmF2aWdhdGlvbic7XG5cbmNvbnN0IHRhZ3MgPSB7XG5cbiAgJyYnOiAnJmFtcDsnLFxuICAnPCc6ICcmbHQ7JyxcbiAgJz4nOiAnJmd0Oydcbn07XG5cbmNvbnN0IGdyYW1tYXJzID0gW1xuXG4gICdKYXZhU2NyaXB0JyxcbiAgJ0phdmFTY3JpcHQgKEpTWCknLFxuICAnQmFiZWwgRVM2IEphdmFTY3JpcHQnLFxuICAnVnVlIENvbXBvbmVudCdcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRWRpdG9yKGVkaXRvcikge1xuXG4gIGNvbnN0IGlzVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihlZGl0b3IpO1xuXG4gIGlmICghaXNUZXh0RWRpdG9yIHx8IGVkaXRvci5pc01pbmkoKSkge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCk7XG5cbiAgaWYgKCFncmFtbWFycy5pbmNsdWRlcyhncmFtbWFyLm5hbWUpKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvY3VzRWRpdG9yKCkge1xuXG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICBpZiAoIWVkaXRvcikge1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpO1xuXG4gIHZpZXcgJiYgdmlldy5mb2N1cyAmJiB2aWV3LmZvY3VzKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlVGFnKHRhZykge1xuXG4gIHJldHVybiB0YWdzW3RhZ107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlVGFncyhzdHIpIHtcblxuICBpZiAoIXN0cikge1xuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bJjw+XS9nLCByZXBsYWNlVGFnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFR5cGUoZGF0YSkge1xuXG4gIGlmICghZGF0YS50eXBlKSB7XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICBkYXRhLnR5cGUgPSBkYXRhLnR5cGUucmVwbGFjZSgvLT4vZywgJzonKS5yZXBsYWNlKCc8dG9wPicsICd3aW5kb3cnKTtcblxuICBpZiAoIWRhdGEuZXhwck5hbWUpIHtcblxuICAgIHJldHVybiBkYXRhLnR5cGU7XG4gIH1cblxuICBkYXRhLnR5cGUgPSBkYXRhLnR5cGUucmVwbGFjZSgvXmZuLywgZGF0YS5leHByTmFtZSk7XG5cbiAgcmV0dXJuIGRhdGEudHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVUeXBlKGRhdGEpIHtcblxuICBpZiAoIWRhdGEudHlwZSkge1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIGRhdGEudHlwZS5yZXBsYWNlKC8tPi9nLCAnOicpLnJlcGxhY2UoJzx0b3A+JywgJ3dpbmRvdycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZUlubGluZURvY3MoZGF0YSkge1xuXG4gIHJldHVybiBkYXRhXG4gICAgLnJlcGxhY2UoL0BwYXJhbS8sICc8c3BhbiBjbGFzcz1cImRvYy1wYXJhbS1maXJzdFwiPkBwYXJhbTwvc3Bhbj4nKVxuICAgIC5yZXBsYWNlKC9AcGFyYW0vZywgJzxzcGFuIGNsYXNzPVwidGV4dC1pbmZvIGRvYy1wYXJhbVwiPkBwYXJhbTwvc3Bhbj4nKVxuICAgIC5yZXBsYWNlKC9AcmV0dXJuLywgJzxzcGFuIGNsYXNzPVwidGV4dC1pbmZvIGRvYy1yZXR1cm5cIj5AcmV0dXJuPC9zcGFuPicpXG4gICAgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGREaXNwbGF5VGV4dChwYXJhbXMsIG5hbWUpIHtcblxuICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgcmV0dXJuIGAke25hbWV9KClgO1xuICB9XG5cbiAgY29uc3Qgc3VnZ2VzdGlvblBhcmFtcyA9IHBhcmFtcy5tYXAocGFyYW0gPT4ge1xuXG4gICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKCd9JywgJ1xcXFx9Jyk7XG4gICAgcGFyYW0gPSBwYXJhbS5yZXBsYWNlKC8nXCIvZywgJycpO1xuXG4gICAgcmV0dXJuIHBhcmFtO1xuICB9KTtcblxuICByZXR1cm4gYCR7bmFtZX0oJHtzdWdnZXN0aW9uUGFyYW1zLmpvaW4oJywnKX0pYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkU25pcHBldChwYXJhbXMsIG5hbWUpIHtcblxuICBjb25zdCBzdWdnZXN0aW9uUGFyYW1zID0gcGFyYW1zLm1hcCgocGFyYW0sIGkpID0+IHtcblxuICAgIHBhcmFtID0gcGFyYW0ucmVwbGFjZSgnfScsICdcXFxcfScpO1xuXG4gICAgcmV0dXJuIGBcXCR7JHtpICsgMX06JHtwYXJhbX19YDtcbiAgfSk7XG5cbiAgcmV0dXJuIGAke25hbWV9KCR7c3VnZ2VzdGlvblBhcmFtcy5qb2luKCcsJyl9KWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UGFyYW1zKHR5cGUpIHtcblxuICBpZiAoIXR5cGUgfHwgdHlwZS5zdGFydHNXaXRoKCdmbigpJykpIHtcblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IHBhcmFtcyA9IFtdO1xuICBsZXQgc3RhcnQgPSB0eXBlLmluZGV4T2YoJygnKSArIDE7XG4gIGxldCBpbnNpZGUgPSAwO1xuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IHR5cGUubGVuZ3RoOyBpKyspIHtcblxuICAgIGlmICh0eXBlW2ldID09PSAnOicgJiYgaW5zaWRlID09PSAtMSkge1xuXG4gICAgICBwYXJhbXMucHVzaCh0eXBlLnN1YnN0cmluZyhzdGFydCwgaSAtIDIpKTtcblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGkgPT09IHR5cGUubGVuZ3RoIC0gMSkge1xuXG4gICAgICBjb25zdCBwYXJhbSA9IHR5cGUuc3Vic3RyaW5nKHN0YXJ0LCBpKTtcblxuICAgICAgaWYgKHBhcmFtLmxlbmd0aCkge1xuXG4gICAgICAgIHBhcmFtcy5wdXNoKHBhcmFtKTtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVbaV0gPT09ICcsJyAmJiBpbnNpZGUgPT09IDApIHtcblxuICAgICAgcGFyYW1zLnB1c2godHlwZS5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcbiAgICAgIHN0YXJ0ID0gaSArIDE7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh0eXBlW2ldLm1hdGNoKC9be1xcW1xcKF0vKSkge1xuXG4gICAgICBpbnNpZGUrKztcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVbaV0ubWF0Y2goL1t9XFxdXFwpXS8pKSB7XG5cbiAgICAgIGluc2lkZS0tO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUeXBlQ29tcGxldGlvbihvYmosIGlzUHJvcGVydHksIGlzT2JqZWN0S2V5LCBpc0luRnVuRGVmKSB7XG5cbiAgaWYgKG9iai5pc0tleXdvcmQpIHtcblxuICAgIG9iai5fdHlwZVNlbGYgPSAna2V5d29yZCc7XG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdzdHJpbmcnKSB7XG5cbiAgICBvYmoubmFtZSA9IG9iai5uYW1lID8gb2JqLm5hbWUucmVwbGFjZSgvKF5cInxcIiQpL2csICcnKSA6IG51bGw7XG5cbiAgfSBlbHNlIHtcblxuICAgIG9iai5uYW1lID0gb2JqLm5hbWUgPyBvYmoubmFtZS5yZXBsYWNlKC9bXCInXS9nLCAnJykgOiBudWxsO1xuICB9XG5cbiAgb2JqLm5hbWUgPSBvYmoubmFtZSA/IG9iai5uYW1lLnJlcGxhY2UoL14uLj9cXC8vLCAnJykgOiBudWxsO1xuXG4gIGlmICghb2JqLnR5cGUpIHtcblxuICAgIG9iai5fZGlzcGxheVRleHQgPSBvYmoubmFtZTtcbiAgICBvYmouX3NuaXBwZXQgPSBvYmoubmFtZTtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBpZiAoIW9iai50eXBlLnN0YXJ0c1dpdGgoJ2ZuJykpIHtcblxuICAgIGlmIChpc1Byb3BlcnR5KSB7XG5cbiAgICAgIG9iai5fdHlwZVNlbGYgPSAncHJvcGVydHknO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgb2JqLl90eXBlU2VsZiA9ICd2YXJpYWJsZSc7XG4gICAgfVxuICB9XG5cbiAgb2JqLnR5cGUgPSBvYmoucmlnaHRMYWJlbCA9IHByZXBhcmVUeXBlKG9iaik7XG5cbiAgaWYgKG9iai50eXBlLnJlcGxhY2UoL2ZuXFwoLitcXCkvLCAnJykubGVuZ3RoID09PSAwKSB7XG5cbiAgICBvYmoubGVmdExhYmVsID0gJyc7XG5cbiAgfSBlbHNlIHtcblxuICAgIGlmIChvYmoudHlwZS5pbmRleE9mKCdmbicpID09PSAtMSkge1xuXG4gICAgICBvYmoubGVmdExhYmVsID0gb2JqLnR5cGU7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBvYmoubGVmdExhYmVsID0gb2JqLnR5cGUucmVwbGFjZSgvZm5cXCguezAsfVxcKS8sICcnKS5yZXBsYWNlKCcgOiAnLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iai5yaWdodExhYmVsLnN0YXJ0c1dpdGgoJ2ZuJykpIHtcblxuICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RQYXJhbXMob2JqLnJpZ2h0TGFiZWwpO1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgIGNvbnN0IGJ1ZmZlclBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG4gICAgY29uc3QgYnVmZmVyUG9zaXRpb25Gb2xsb3dpbmcgPSBbYnVmZmVyUG9zaXRpb24ucm93LCBidWZmZXJQb3NpdGlvbi5jb2x1bW4gKyAxXTtcbiAgICBjb25zdCBjaGFyRm9sbG93aW5nID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKFtidWZmZXJQb3NpdGlvbiwgYnVmZmVyUG9zaXRpb25Gb2xsb3dpbmddKTtcbiAgICBjb25zdCBzaG91bGRBZGRQYXJlbnRoZXNlc1RvU25pcHBldCA9IGNoYXJGb2xsb3dpbmcgIT09ICcoJztcblxuICAgIGlmIChcbiAgICAgIHBhY2thZ2VDb25maWcub3B0aW9ucy51c2VTbmlwcGV0cyB8fFxuICAgICAgcGFja2FnZUNvbmZpZy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb25cbiAgICApIHtcblxuICAgICAgaWYgKCFpc0luRnVuRGVmKSB7XG5cbiAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcblxuICAgICAgICAgIG9iai5fc25pcHBldCA9IGAke29iai5uYW1lfSR7c2hvdWxkQWRkUGFyZW50aGVzZXNUb1NuaXBwZXQgPyAnKCknIDogJyd9YDtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgb2JqLl9zbmlwcGV0ID0gYnVpbGRTbmlwcGV0KHBhcmFtcywgb2JqLm5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9iai5faGFzUGFyYW1zID0gcGFyYW1zLmxlbmd0aCA/IHRydWUgOiBmYWxzZTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmICghaXNJbkZ1bkRlZikge1xuXG4gICAgICAgIG9iai5fc25pcHBldCA9IHBhcmFtcy5sZW5ndGggPyBgJHtvYmoubmFtZX0oXFwkeyR7MH06XFwke319KWAgOiBgJHtvYmoubmFtZX0ke3Nob3VsZEFkZFBhcmVudGhlc2VzVG9TbmlwcGV0ID8gJygpJyA6ICcnfWA7XG4gICAgICB9XG5cbiAgICAgIG9iai5fZGlzcGxheVRleHQgPSBidWlsZERpc3BsYXlUZXh0KHBhcmFtcywgb2JqLm5hbWUpO1xuICAgIH1cblxuICAgIG9iai5fdHlwZVNlbGYgPSAnZnVuY3Rpb24nO1xuICB9XG5cbiAgaWYgKG9iai5uYW1lKSB7XG5cbiAgICBpZiAob2JqLmxlZnRMYWJlbCA9PT0gb2JqLm5hbWUpIHtcblxuICAgICAgb2JqLmxlZnRMYWJlbCA9IG51bGw7XG4gICAgICBvYmoucmlnaHRMYWJlbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iai5sZWZ0TGFiZWwgPT09IG9iai5yaWdodExhYmVsKSB7XG5cbiAgICBvYmoucmlnaHRMYWJlbCA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcG9zZUFsbChkaXNwb3NhYmxlcykge1xuXG4gIGRpc3Bvc2FibGVzLmZvckVhY2goZGlzcG9zYWJsZSA9PiBkaXNwb3NhYmxlLmRpc3Bvc2UoKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuRmlsZUFuZEdvVG9Qb3NpdGlvbihwb3NpdGlvbiwgZmlsZSkge1xuXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZSkudGhlbigodGV4dEVkaXRvcikgPT4ge1xuXG4gICAgY29uc3QgY3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBpZiAoIWN1cnNvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuRmlsZUFuZEdvVG8oc3RhcnQsIGZpbGUpIHtcblxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUpLnRoZW4oKHRleHRFZGl0b3IpID0+IHtcblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgY29uc3QgY3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBpZiAoXG4gICAgICAhYnVmZmVyIHx8XG4gICAgICAhY3Vyc29yXG4gICAgKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXJQb3NpdGlvbiA9IGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN0YXJ0KTtcblxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdGFydCkpO1xuXG4gICAgbmF2aWdhdGlvbi5hcHBlbmQodGV4dEVkaXRvciwgYnVmZmVyLCBidWZmZXJQb3NpdGlvbik7XG5cbiAgICBtYXJrRGVmaW5pdGlvbkJ1ZmZlclJhbmdlKGN1cnNvciwgdGV4dEVkaXRvcik7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVGVybkZpbGUoY29udGVudCkge1xuXG4gIGNvbnN0IHByb2plY3RSb290ID0gbWFuYWdlci5zZXJ2ZXIgJiYgbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcblxuICBpZiAoIXByb2plY3RSb290KSB7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICB3cml0ZUZpbGUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvamVjdFJvb3QgKyAnLy50ZXJuLXByb2plY3QnKSwgY29udGVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3cml0ZUZpbGUoZmlsZVBhdGgsIGNvbnRlbnQpIHtcblxuICBmcy53cml0ZUZpbGUoZmlsZVBhdGgsIGNvbnRlbnQsIChlcnJvcikgPT4ge1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aCk7XG5cbiAgICBpZiAoIWVycm9yKSB7XG5cbiAgICAgIGNvbnN0IHNlcnZlciA9IG1hbmFnZXIuc2VydmVyO1xuICAgICAgc2VydmVyICYmIHNlcnZlci5yZXN0YXJ0KCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gJ0NvdWxkIG5vdCBjcmVhdGUvdXBkYXRlIC50ZXJuLXByb2plY3QgZmlsZS4gVXNlIHRoZSBSRUFETUUgdG8gbWFudWFsbHkgY3JlYXRlIGEgLnRlcm4tcHJvamVjdCBmaWxlLic7XG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhtZXNzYWdlLCB7XG5cbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEaXJlY3RvcnkoZGlyKSB7XG5cbiAgdHJ5IHtcblxuICAgIHJldHVybiBmcy5zdGF0U3luYyhkaXIpLmlzRGlyZWN0b3J5KCk7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZUV4aXN0cyhwYXRoKSB7XG5cbiAgdHJ5IHtcblxuICAgIGZzLmFjY2Vzc1N5bmMocGF0aCwgZnMuRl9PSywgKGVycm9yKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVDb250ZW50KGZpbGVQYXRoLCByb290KSB7XG5cbiAgY29uc3QgX2ZpbGVQYXRoID0gcm9vdCArIGZpbGVQYXRoO1xuICBjb25zdCByZXNvbHZlZFBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBfZmlsZVBhdGgpO1xuXG4gIGlmIChmaWxlRXhpc3RzKHJlc29sdmVkUGF0aCkgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJlYWRGaWxlKHJlc29sdmVkUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWFkRmlsZShwYXRoKSB7XG5cbiAgdHJ5IHtcblxuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0ZjgnKTtcblxuICB9IGNhdGNoIChlcnIpIHtcblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcmtEZWZpbml0aW9uQnVmZmVyUmFuZ2UoY3Vyc29yLCBlZGl0b3IpIHtcblxuICBjb25zdCByYW5nZSA9IGN1cnNvci5nZXRDdXJyZW50V29yZEJ1ZmZlclJhbmdlKCk7XG4gIGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UocmFuZ2UsIHtpbnZhbGlkYXRlOiAndG91Y2gnfSk7XG5cbiAgY29uc3QgZGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcblxuICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZGVmaW5pdGlvbi1tYXJrZXInLFxuICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgfSk7XG5cbiAgaWYgKCFkZWNvcmF0aW9uKSB7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgIGRlY29yYXRpb24uc2V0UHJvcGVydGllcyh7XG5cbiAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgY2xhc3M6ICdhdG9tLXRlcm5qcy1kZWZpbml0aW9uLW1hcmtlciBhY3RpdmUnLFxuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIH0pO1xuXG4gIH0sIDEpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgZGVjb3JhdGlvbi5zZXRQcm9wZXJ0aWVzKHtcblxuICAgICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRlZmluaXRpb24tbWFya2VyJyxcbiAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICB9KTtcblxuICB9LCAxNTAxKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgIG1hcmtlci5kZXN0cm95KCk7XG5cbiAgfSwgMjUwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlUGF0aCgpIHtcblxuICBjb25zdCBwYWNrYWdQYXRoID0gYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ2F0b20tdGVybmpzJyk7XG5cbiAgcmV0dXJuIHBhY2thZ1BhdGg7XG59XG4iXX0=