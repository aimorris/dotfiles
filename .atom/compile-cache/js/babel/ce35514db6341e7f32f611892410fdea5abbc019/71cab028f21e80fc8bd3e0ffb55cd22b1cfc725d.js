'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (returnValue) {
  // This will be a 2d array: list of param lists
  // for each time it was called.
  var calledWith = [];

  var call = function call() {
    for (var _len = arguments.length, passedArgs = Array(_len), _key = 0; _key < _len; _key++) {
      passedArgs[_key] = arguments[_key];
    }

    // Save all the params received to exposed local var
    calledWith.push(passedArgs);
    // Return value provided on spy init
    return returnValue === undefined ? 'called spy' : returnValue;
  };

  return {
    call: call,
    calledWith: calledWith,
    called: function called() {
      return Boolean(calledWith.length);
    }
  };
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy9tYWtlLXNweS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7OztxQkFFSSxVQUFDLFdBQVcsRUFBSzs7O0FBRzlCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTs7QUFFckIsTUFBTSxJQUFJLEdBQUcsU0FBUCxJQUFJLEdBQXNCO3NDQUFmLFVBQVU7QUFBVixnQkFBVTs7OztBQUV6QixjQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUUzQixXQUFPLFdBQVcsS0FBSyxTQUFTLEdBQzVCLFlBQVksR0FDWixXQUFXLENBQUE7R0FDaEIsQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsUUFBSSxFQUFKLElBQUk7QUFDSixjQUFVLEVBQVYsVUFBVTtBQUNWLFVBQU0sRUFBRTthQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0tBQUE7R0FDekMsQ0FBQTtDQUNGIiwiZmlsZSI6Ii9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy9tYWtlLXNweS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IChyZXR1cm5WYWx1ZSkgPT4ge1xuICAvLyBUaGlzIHdpbGwgYmUgYSAyZCBhcnJheTogbGlzdCBvZiBwYXJhbSBsaXN0c1xuICAvLyBmb3IgZWFjaCB0aW1lIGl0IHdhcyBjYWxsZWQuXG4gIGNvbnN0IGNhbGxlZFdpdGggPSBbXVxuXG4gIGNvbnN0IGNhbGwgPSAoLi4ucGFzc2VkQXJncykgPT4ge1xuICAgIC8vIFNhdmUgYWxsIHRoZSBwYXJhbXMgcmVjZWl2ZWQgdG8gZXhwb3NlZCBsb2NhbCB2YXJcbiAgICBjYWxsZWRXaXRoLnB1c2gocGFzc2VkQXJncylcbiAgICAvLyBSZXR1cm4gdmFsdWUgcHJvdmlkZWQgb24gc3B5IGluaXRcbiAgICByZXR1cm4gcmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyAnY2FsbGVkIHNweSdcbiAgICAgIDogcmV0dXJuVmFsdWVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2FsbCxcbiAgICBjYWxsZWRXaXRoLFxuICAgIGNhbGxlZDogKCkgPT4gQm9vbGVhbihjYWxsZWRXaXRoLmxlbmd0aClcbiAgfVxufVxuIl19