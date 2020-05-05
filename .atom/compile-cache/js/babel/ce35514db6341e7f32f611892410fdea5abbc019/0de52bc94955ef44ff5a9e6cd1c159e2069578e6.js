Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

'use babel';

var logger = new _logger2['default']();

logger.log = function (obj) {
  console.log(obj);
};

logger.logTag = function (tag) {
  this.log(tag.kind + ' of <' + tag.tagName + '> in ' + tag.range.toString());
};

logger.logTaggedElement = function (taggedElement) {
  this.log('<' + taggedElement.tagName + '> in ' + taggedElement.range.toString());
};

exports['default'] = logger;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvbG9nZ2Vycy9jb25zb2xlLWxvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7c0JBRW1CLFVBQVU7Ozs7QUFGN0IsV0FBVyxDQUFDOztBQUlaLElBQU0sTUFBTSxHQUFHLHlCQUFZLENBQUM7O0FBRTVCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsVUFBUyxHQUFHLEVBQUU7QUFDekIsU0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNsQixDQUFDOztBQUVGLE1BQU0sQ0FBQyxNQUFNLEdBQUcsVUFBUyxHQUFHLEVBQUU7QUFDNUIsTUFBSSxDQUFDLEdBQUcsQ0FBSSxHQUFHLENBQUMsSUFBSSxhQUFRLEdBQUcsQ0FBQyxPQUFPLGFBQVEsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBRyxDQUFDO0NBQ3hFLENBQUM7O0FBRUYsTUFBTSxDQUFDLGdCQUFnQixHQUFHLFVBQVMsYUFBYSxFQUFFO0FBQ2hELE1BQUksQ0FBQyxHQUFHLE9BQUssYUFBYSxDQUFDLE9BQU8sYUFBUSxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFHLENBQUM7Q0FDN0UsQ0FBQzs7cUJBRWEsTUFBTSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9zZWxlY3QtdGV4dC1iZXR3ZWVuLXRhZ3MvbGliL2xvZ2dlcnMvY29uc29sZS1sb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IExvZ2dlciBmcm9tICcuL2xvZ2dlcic7XG5cbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxubG9nZ2VyLmxvZyA9IGZ1bmN0aW9uKG9iaikge1xuICBjb25zb2xlLmxvZyhvYmopO1xufTtcblxubG9nZ2VyLmxvZ1RhZyA9IGZ1bmN0aW9uKHRhZykge1xuICB0aGlzLmxvZyhgJHt0YWcua2luZH0gb2YgPCR7dGFnLnRhZ05hbWV9PiBpbiAke3RhZy5yYW5nZS50b1N0cmluZygpfWApO1xufTtcblxubG9nZ2VyLmxvZ1RhZ2dlZEVsZW1lbnQgPSBmdW5jdGlvbih0YWdnZWRFbGVtZW50KSB7XG4gIHRoaXMubG9nKGA8JHt0YWdnZWRFbGVtZW50LnRhZ05hbWV9PiBpbiAke3RhZ2dlZEVsZW1lbnQucmFuZ2UudG9TdHJpbmcoKX1gKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==