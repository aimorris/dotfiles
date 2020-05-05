Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getChunks = getChunks;
exports.getChunksByProjects = getChunksByProjects;
exports.mergeChange = mergeChange;
exports.calculateDecorations = calculateDecorations;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('../helpers');

function getChunks(filePath, projectPath) {
  var toReturn = [];
  var chunks = filePath.split(_path2['default'].sep);
  while (chunks.length) {
    var currentPath = chunks.join(_path2['default'].sep);
    if (currentPath) {
      // This is required for when you open files outside of project window
      // and the last entry is '' because unix paths start with /
      toReturn.push(currentPath);
      if (currentPath === projectPath) {
        break;
      }
    }
    chunks.pop();
  }
  return toReturn;
}

function getChunksByProjects(filePath, projectPaths) {
  var matchingProjectPath = projectPaths.find(function (p) {
    return filePath.startsWith(p);
  });
  if (!matchingProjectPath) {
    return [filePath];
  }
  return getChunks(filePath, matchingProjectPath);
}

function mergeChange(change, filePath, severity) {
  if (!change[filePath]) {
    change[filePath] = {
      info: false,
      error: false,
      warning: false
    };
  }
  change[filePath][severity] = true;
}

function calculateDecorations(decorateOnTreeView, messages) {
  var toReturn = {};
  var projectPaths = atom.project.getPaths();
  messages.forEach(function (message) {
    var filePath = (0, _helpers.$file)(message);
    if (filePath) {
      var chunks = decorateOnTreeView === 'Files' ? [filePath] : getChunksByProjects(filePath, projectPaths);
      chunks.forEach(function (chunk) {
        return mergeChange(toReturn, chunk, message.severity);
      });
    }
  });
  return toReturn;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90cmVlLXZpZXcvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3VCQUNELFlBQVk7O0FBRzNCLFNBQVMsU0FBUyxDQUFDLFFBQWdCLEVBQUUsV0FBbUIsRUFBaUI7QUFDOUUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsa0JBQUssR0FBRyxDQUFDLENBQUE7QUFDdkMsU0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3BCLFFBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQUssR0FBRyxDQUFDLENBQUE7QUFDekMsUUFBSSxXQUFXLEVBQUU7OztBQUdmLGNBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDMUIsVUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO0FBQy9CLGNBQUs7T0FDTjtLQUNGO0FBQ0QsVUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFBO0dBQ2I7QUFDRCxTQUFPLFFBQVEsQ0FBQTtDQUNoQjs7QUFFTSxTQUFTLG1CQUFtQixDQUFDLFFBQWdCLEVBQUUsWUFBMkIsRUFBaUI7QUFDaEcsTUFBTSxtQkFBbUIsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQztXQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0dBQUEsQ0FBQyxDQUFBO0FBQzFFLE1BQUksQ0FBQyxtQkFBbUIsRUFBRTtBQUN4QixXQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDbEI7QUFDRCxTQUFPLFNBQVMsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtDQUNoRDs7QUFFTSxTQUFTLFdBQVcsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQixFQUFRO0FBQ3BGLE1BQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDckIsVUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHO0FBQ2pCLFVBQUksRUFBRSxLQUFLO0FBQ1gsV0FBSyxFQUFFLEtBQUs7QUFDWixhQUFPLEVBQUUsS0FBSztLQUNmLENBQUE7R0FDRjtBQUNELFFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUE7Q0FDbEM7O0FBRU0sU0FBUyxvQkFBb0IsQ0FDbEMsa0JBQXFELEVBQ3JELFFBQThCLEVBQ3RCO0FBQ1IsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLE1BQU0sWUFBMkIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQzNELFVBQVEsQ0FBQyxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUU7QUFDakMsUUFBTSxRQUFRLEdBQUcsb0JBQU0sT0FBTyxDQUFDLENBQUE7QUFDL0IsUUFBSSxRQUFRLEVBQUU7QUFDWixVQUFNLE1BQU0sR0FBRyxrQkFBa0IsS0FBSyxPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDeEcsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7ZUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDO09BQUEsQ0FBQyxDQUFBO0tBQ3hFO0dBQ0YsQ0FBQyxDQUFBO0FBQ0YsU0FBTyxRQUFRLENBQUE7Q0FDaEIiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3RyZWUtdmlldy9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7ICRmaWxlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2h1bmtzKGZpbGVQYXRoOiBzdHJpbmcsIHByb2plY3RQYXRoOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcbiAgY29uc3QgdG9SZXR1cm4gPSBbXVxuICBjb25zdCBjaHVua3MgPSBmaWxlUGF0aC5zcGxpdChQYXRoLnNlcClcbiAgd2hpbGUgKGNodW5rcy5sZW5ndGgpIHtcbiAgICBjb25zdCBjdXJyZW50UGF0aCA9IGNodW5rcy5qb2luKFBhdGguc2VwKVxuICAgIGlmIChjdXJyZW50UGF0aCkge1xuICAgICAgLy8gVGhpcyBpcyByZXF1aXJlZCBmb3Igd2hlbiB5b3Ugb3BlbiBmaWxlcyBvdXRzaWRlIG9mIHByb2plY3Qgd2luZG93XG4gICAgICAvLyBhbmQgdGhlIGxhc3QgZW50cnkgaXMgJycgYmVjYXVzZSB1bml4IHBhdGhzIHN0YXJ0IHdpdGggL1xuICAgICAgdG9SZXR1cm4ucHVzaChjdXJyZW50UGF0aClcbiAgICAgIGlmIChjdXJyZW50UGF0aCA9PT0gcHJvamVjdFBhdGgpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgY2h1bmtzLnBvcCgpXG4gIH1cbiAgcmV0dXJuIHRvUmV0dXJuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDaHVua3NCeVByb2plY3RzKGZpbGVQYXRoOiBzdHJpbmcsIHByb2plY3RQYXRoczogQXJyYXk8c3RyaW5nPik6IEFycmF5PHN0cmluZz4ge1xuICBjb25zdCBtYXRjaGluZ1Byb2plY3RQYXRoID0gcHJvamVjdFBhdGhzLmZpbmQocCA9PiBmaWxlUGF0aC5zdGFydHNXaXRoKHApKVxuICBpZiAoIW1hdGNoaW5nUHJvamVjdFBhdGgpIHtcbiAgICByZXR1cm4gW2ZpbGVQYXRoXVxuICB9XG4gIHJldHVybiBnZXRDaHVua3MoZmlsZVBhdGgsIG1hdGNoaW5nUHJvamVjdFBhdGgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUNoYW5nZShjaGFuZ2U6IE9iamVjdCwgZmlsZVBhdGg6IHN0cmluZywgc2V2ZXJpdHk6IHN0cmluZyk6IHZvaWQge1xuICBpZiAoIWNoYW5nZVtmaWxlUGF0aF0pIHtcbiAgICBjaGFuZ2VbZmlsZVBhdGhdID0ge1xuICAgICAgaW5mbzogZmFsc2UsXG4gICAgICBlcnJvcjogZmFsc2UsXG4gICAgICB3YXJuaW5nOiBmYWxzZSxcbiAgICB9XG4gIH1cbiAgY2hhbmdlW2ZpbGVQYXRoXVtzZXZlcml0eV0gPSB0cnVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVEZWNvcmF0aW9ucyhcbiAgZGVjb3JhdGVPblRyZWVWaWV3OiAnRmlsZXMgYW5kIERpcmVjdG9yaWVzJyB8ICdGaWxlcycsXG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPixcbik6IE9iamVjdCB7XG4gIGNvbnN0IHRvUmV0dXJuID0ge31cbiAgY29uc3QgcHJvamVjdFBhdGhzOiBBcnJheTxzdHJpbmc+ID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZmlsZVBhdGggPSAkZmlsZShtZXNzYWdlKVxuICAgIGlmIChmaWxlUGF0aCkge1xuICAgICAgY29uc3QgY2h1bmtzID0gZGVjb3JhdGVPblRyZWVWaWV3ID09PSAnRmlsZXMnID8gW2ZpbGVQYXRoXSA6IGdldENodW5rc0J5UHJvamVjdHMoZmlsZVBhdGgsIHByb2plY3RQYXRocylcbiAgICAgIGNodW5rcy5mb3JFYWNoKGNodW5rID0+IG1lcmdlQ2hhbmdlKHRvUmV0dXJuLCBjaHVuaywgbWVzc2FnZS5zZXZlcml0eSkpXG4gICAgfVxuICB9KVxuICByZXR1cm4gdG9SZXR1cm5cbn1cbiJdfQ==