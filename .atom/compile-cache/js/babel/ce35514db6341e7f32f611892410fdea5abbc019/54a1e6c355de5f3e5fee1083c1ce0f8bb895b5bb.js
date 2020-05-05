function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcValidateThrow = require('../../src/validate/throw');

var _srcValidateThrow2 = _interopRequireDefault(_srcValidateThrow);

'use babel';

describe('throwIfFail', function () {
  it('throws an error when given falsey value', function () {
    var message = 'bad smurf';
    var caught = false;

    try {
      (0, _srcValidateThrow2['default'])(message, false);
    } catch (e) {
      caught = true;
      expect(e.message).toBe('bad smurf');
    }
    expect(caught).toBe(true);
  });

  it('does not throw when given truthy value', function () {
    var message = 'this message is ignored';
    expect((0, _srcValidateThrow2['default'])(message, true)).toBe(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy92YWxpZGF0ZS90aHJvdy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O2dDQUV3QiwwQkFBMEI7Ozs7QUFGbEQsV0FBVyxDQUFBOztBQUlYLFFBQVEsQ0FBQyxhQUFhLEVBQUUsWUFBTTtBQUM1QixJQUFFLENBQUMseUNBQXlDLEVBQUUsWUFBTTtBQUNsRCxRQUFNLE9BQU8sR0FBRyxXQUFXLENBQUE7QUFDM0IsUUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFBOztBQUVsQixRQUFJO0FBQ0YseUNBQVksT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQzVCLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixZQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2IsWUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDcEM7QUFDRCxVQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzFCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsd0NBQXdDLEVBQUUsWUFBTTtBQUNqRCxRQUFNLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQTtBQUN6QyxVQUFNLENBQUMsbUNBQVksT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzlDLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvdmFsaWRhdGUvdGhyb3ctc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB0aHJvd0lmRmFpbCBmcm9tICcuLi8uLi9zcmMvdmFsaWRhdGUvdGhyb3cnXG5cbmRlc2NyaWJlKCd0aHJvd0lmRmFpbCcsICgpID0+IHtcbiAgaXQoJ3Rocm93cyBhbiBlcnJvciB3aGVuIGdpdmVuIGZhbHNleSB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBtZXNzYWdlID0gJ2JhZCBzbXVyZidcbiAgICBsZXQgY2F1Z2h0ID0gZmFsc2VcblxuICAgIHRyeSB7XG4gICAgICB0aHJvd0lmRmFpbChtZXNzYWdlLCBmYWxzZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjYXVnaHQgPSB0cnVlXG4gICAgICBleHBlY3QoZS5tZXNzYWdlKS50b0JlKCdiYWQgc211cmYnKVxuICAgIH1cbiAgICBleHBlY3QoY2F1Z2h0KS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ2RvZXMgbm90IHRocm93IHdoZW4gZ2l2ZW4gdHJ1dGh5IHZhbHVlJywgKCkgPT4ge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSAndGhpcyBtZXNzYWdlIGlzIGlnbm9yZWQnXG4gICAgZXhwZWN0KHRocm93SWZGYWlsKG1lc3NhZ2UsIHRydWUpKS50b0JlKHRydWUpXG4gIH0pXG59KVxuIl19