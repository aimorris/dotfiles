Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _scannersTaggedElementScanner = require('./scanners/tagged-element-scanner');

var _scannersTaggedElementScanner2 = _interopRequireDefault(_scannersTaggedElementScanner);

// For release.

var _loggersEmptyLogger = require('./loggers/empty-logger');

var _loggersEmptyLogger2 = _interopRequireDefault(_loggersEmptyLogger);

// For debug.
// import logger from './loggers/console-logger';

'use babel';

exports['default'] = {
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'select-text-between-tags:select': function selectTextBetweenTagsSelect() {
        return _this.select();
      }
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  serialize: function serialize() {
    return {};
  },

  select: function select() {
    var editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;

    var cursor = editor.getCursorBufferPosition();
    var scanner = new _scannersTaggedElementScanner2['default'](editor, _loggersEmptyLogger2['default']);
    scanner.scan(function (arg) {
      var element = arg.taggedElement;
      if (element.range && element.range.containsPoint(cursor)) {
        editor.setSelectedBufferRange(element.contentRange);
        arg.stopScan();
      }
    });
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFb0MsTUFBTTs7NENBQ1QsbUNBQW1DOzs7Ozs7a0NBR2pELHdCQUF3Qjs7Ozs7OztBQU4zQyxXQUFXLENBQUM7O3FCQVVHO0FBQ2IsZUFBYSxFQUFFLElBQUk7O0FBRW5CLFVBQVEsRUFBQSxrQkFBQyxLQUFLLEVBQUU7Ozs7QUFFZCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOzs7QUFHL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUU7QUFDM0QsdUNBQWlDLEVBQUU7ZUFBTSxNQUFLLE1BQU0sRUFBRTtPQUFBO0tBQ3ZELENBQUMsQ0FBQyxDQUFDO0dBQ0w7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM5Qjs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPLEVBQUUsQ0FBQztHQUNYOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwRCxRQUFJLENBQUMsTUFBTSxFQUFFLE9BQU87O0FBRXBCLFFBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0FBQ2hELFFBQU0sT0FBTyxHQUFHLDhDQUF5QixNQUFNLGtDQUFTLENBQUM7QUFDekQsV0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUNwQixVQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO0FBQ2xDLFVBQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN4RCxjQUFNLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BELFdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNoQjtLQUNGLENBQUMsQ0FBQztHQUNKOztDQUVGIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL3NlbGVjdC10ZXh0LWJldHdlZW4tdGFncy9saWIvc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBUYWdnZWRFbGVtZW50U2Nhbm5lciBmcm9tICcuL3NjYW5uZXJzL3RhZ2dlZC1lbGVtZW50LXNjYW5uZXInO1xuXG4vLyBGb3IgcmVsZWFzZS5cbmltcG9ydCBsb2dnZXIgZnJvbSAnLi9sb2dnZXJzL2VtcHR5LWxvZ2dlcic7XG4vLyBGb3IgZGVidWcuXG4vLyBpbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2Vycy9jb25zb2xlLWxvZ2dlcic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc3Vic2NyaXB0aW9uczogbnVsbCxcblxuICBhY3RpdmF0ZShzdGF0ZSkge1xuICAgIC8vIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCB7XG4gICAgICAnc2VsZWN0LXRleHQtYmV0d2Vlbi10YWdzOnNlbGVjdCc6ICgpID0+IHRoaXMuc2VsZWN0KClcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG5cbiAgc2VsZWN0KCkge1xuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuO1xuXG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCk7XG4gICAgY29uc3Qgc2Nhbm5lciA9IG5ldyBUYWdnZWRFbGVtZW50U2Nhbm5lcihlZGl0b3IsIGxvZ2dlcik7XG4gICAgc2Nhbm5lci5zY2FuKChhcmcpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBhcmcudGFnZ2VkRWxlbWVudDtcbiAgICAgIGlmIChlbGVtZW50LnJhbmdlICYmIGVsZW1lbnQucmFuZ2UuY29udGFpbnNQb2ludChjdXJzb3IpKSB7XG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKGVsZW1lbnQuY29udGVudFJhbmdlKTtcbiAgICAgICAgYXJnLnN0b3BTY2FuKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxufTtcbiJdfQ==