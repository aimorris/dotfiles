function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcValidateEditor = require('../../src/validate/editor');

var _makeSpy = require('../make-spy');

var _makeSpy2 = _interopRequireDefault(_makeSpy);

// NOTE throwIfInvalidPoint not covered,
// but it is a simple composition of 2 tested functions.

'use babel';

describe('isValidPoint', function () {
  it('returns true if clipped point reports being equal to point', function () {
    var mockPoint = { isEqual: function isEqual() {
        return true;
      } };
    var spy = (0, _makeSpy2['default'])(mockPoint);
    var mockTextBuffer = { clipPosition: spy.call };
    var point = [34, 110];

    var result = _srcValidateEditor.isValidPoint.apply(undefined, [mockTextBuffer].concat(point));
    expect(spy.calledWith[0][0]).toEqual(point);
    expect(result).toBe(true);
  });

  it('returns false if clipped point reports not being equal to point', function () {
    var mockPoint = { isEqual: function isEqual() {
        return false;
      } };
    var spy = (0, _makeSpy2['default'])(mockPoint);
    var mockTextBuffer = { clipPosition: spy.call };
    var point = [12, 14];

    var result = _srcValidateEditor.isValidPoint.apply(undefined, [mockTextBuffer].concat(point));
    expect(spy.calledWith[0][0]).toEqual(point);
    expect(result).toBe(false);
  });
});

describe('hasValidScope', function () {
  it('returns true if scopes array contains some value in validScopes', function () {
    var mockEditor = {
      getCursors: function getCursors() {
        return [{
          getScopeDescriptor: function getScopeDescriptor() {
            return {
              getScopesArray: function getScopesArray() {
                return ['valid.scope'];
              }
            };
          }
        }];
      }
    };
    var scopes = ['valid.scope'];
    var result = (0, _srcValidateEditor.hasValidScope)(mockEditor, scopes);
    expect(result).toBe(true);
  });

  it('returns false when scopes array has no values in validScopes', function () {
    var mockEditor = {
      getCursors: function getCursors() {
        return [{
          getScopeDescriptor: function getScopeDescriptor() {
            return {
              getScopesArray: function getScopesArray() {
                return ['someother.scope'];
              }
            };
          }
        }];
      }
    };
    var scopes = ['invalid.scope'];
    var result = (0, _srcValidateEditor.hasValidScope)(mockEditor, scopes);
    expect(result).toBe(false);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy92YWxpZGF0ZS9lZGl0b3Itc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztpQ0FFNEMsMkJBQTJCOzt1QkFDbkQsYUFBYTs7Ozs7OztBQUhqQyxXQUFXLENBQUE7O0FBUVgsUUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNO0FBQzdCLElBQUUsQ0FBQyw0REFBNEQsRUFBRSxZQUFNO0FBQ3JFLFFBQU0sU0FBUyxHQUFHLEVBQUUsT0FBTyxFQUFFO2VBQU0sSUFBSTtPQUFBLEVBQUUsQ0FBQTtBQUN6QyxRQUFNLEdBQUcsR0FBRywwQkFBUSxTQUFTLENBQUMsQ0FBQTtBQUM5QixRQUFNLGNBQWMsR0FBRyxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakQsUUFBTSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7O0FBRXZCLFFBQU0sTUFBTSxHQUFHLGtEQUFhLGNBQWMsU0FBSyxLQUFLLEVBQUMsQ0FBQTtBQUNyRCxVQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzFCLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBTTtBQUMxRSxRQUFNLFNBQVMsR0FBRyxFQUFFLE9BQU8sRUFBRTtlQUFNLEtBQUs7T0FBQSxFQUFFLENBQUE7QUFDMUMsUUFBTSxHQUFHLEdBQUcsMEJBQVEsU0FBUyxDQUFDLENBQUE7QUFDOUIsUUFBTSxjQUFjLEdBQUcsRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pELFFBQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUV0QixRQUFNLE1BQU0sR0FBRyxrREFBYSxjQUFjLFNBQUssS0FBSyxFQUFDLENBQUE7QUFDckQsVUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMzQixDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUE7O0FBRUYsUUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQzlCLElBQUUsQ0FBQyxpRUFBaUUsRUFBRSxZQUFNO0FBQzFFLFFBQU0sVUFBVSxHQUFHO0FBQ2pCLGdCQUFVLEVBQUU7ZUFBTSxDQUFDO0FBQ2pCLDRCQUFrQixFQUFFO21CQUFPO0FBQ3pCLDRCQUFjLEVBQUU7dUJBQU0sQ0FBQyxhQUFhLENBQUM7ZUFBQTthQUN0QztXQUFDO1NBQ0gsQ0FBQztPQUFBO0tBQ0gsQ0FBQTtBQUNELFFBQU0sTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDOUIsUUFBTSxNQUFNLEdBQUcsc0NBQWMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQ2hELFVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDMUIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyw4REFBOEQsRUFBRSxZQUFNO0FBQ3ZFLFFBQU0sVUFBVSxHQUFHO0FBQ2pCLGdCQUFVLEVBQUU7ZUFBTSxDQUFDO0FBQ2pCLDRCQUFrQixFQUFFO21CQUFPO0FBQ3pCLDRCQUFjLEVBQUU7dUJBQU0sQ0FBQyxpQkFBaUIsQ0FBQztlQUFBO2FBQzFDO1dBQUM7U0FDSCxDQUFDO09BQUE7S0FDSCxDQUFBO0FBQ0QsUUFBTSxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUNoQyxRQUFNLE1BQU0sR0FBRyxzQ0FBYyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDaEQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMzQixDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGludGVyLWVzbGludC9zcGVjL3ZhbGlkYXRlL2VkaXRvci1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgaXNWYWxpZFBvaW50LCBoYXNWYWxpZFNjb3BlIH0gZnJvbSAnLi4vLi4vc3JjL3ZhbGlkYXRlL2VkaXRvcidcbmltcG9ydCBtYWtlU3B5IGZyb20gJy4uL21ha2Utc3B5J1xuXG4vLyBOT1RFIHRocm93SWZJbnZhbGlkUG9pbnQgbm90IGNvdmVyZWQsXG4vLyBidXQgaXQgaXMgYSBzaW1wbGUgY29tcG9zaXRpb24gb2YgMiB0ZXN0ZWQgZnVuY3Rpb25zLlxuXG5kZXNjcmliZSgnaXNWYWxpZFBvaW50JywgKCkgPT4ge1xuICBpdCgncmV0dXJucyB0cnVlIGlmIGNsaXBwZWQgcG9pbnQgcmVwb3J0cyBiZWluZyBlcXVhbCB0byBwb2ludCcsICgpID0+IHtcbiAgICBjb25zdCBtb2NrUG9pbnQgPSB7IGlzRXF1YWw6ICgpID0+IHRydWUgfVxuICAgIGNvbnN0IHNweSA9IG1ha2VTcHkobW9ja1BvaW50KVxuICAgIGNvbnN0IG1vY2tUZXh0QnVmZmVyID0geyBjbGlwUG9zaXRpb246IHNweS5jYWxsIH1cbiAgICBjb25zdCBwb2ludCA9IFszNCwgMTEwXVxuXG4gICAgY29uc3QgcmVzdWx0ID0gaXNWYWxpZFBvaW50KG1vY2tUZXh0QnVmZmVyLCAuLi5wb2ludClcbiAgICBleHBlY3Qoc3B5LmNhbGxlZFdpdGhbMF1bMF0pLnRvRXF1YWwocG9pbnQpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdyZXR1cm5zIGZhbHNlIGlmIGNsaXBwZWQgcG9pbnQgcmVwb3J0cyBub3QgYmVpbmcgZXF1YWwgdG8gcG9pbnQnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9ja1BvaW50ID0geyBpc0VxdWFsOiAoKSA9PiBmYWxzZSB9XG4gICAgY29uc3Qgc3B5ID0gbWFrZVNweShtb2NrUG9pbnQpXG4gICAgY29uc3QgbW9ja1RleHRCdWZmZXIgPSB7IGNsaXBQb3NpdGlvbjogc3B5LmNhbGwgfVxuICAgIGNvbnN0IHBvaW50ID0gWzEyLCAxNF1cblxuICAgIGNvbnN0IHJlc3VsdCA9IGlzVmFsaWRQb2ludChtb2NrVGV4dEJ1ZmZlciwgLi4ucG9pbnQpXG4gICAgZXhwZWN0KHNweS5jYWxsZWRXaXRoWzBdWzBdKS50b0VxdWFsKHBvaW50KVxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoZmFsc2UpXG4gIH0pXG59KVxuXG5kZXNjcmliZSgnaGFzVmFsaWRTY29wZScsICgpID0+IHtcbiAgaXQoJ3JldHVybnMgdHJ1ZSBpZiBzY29wZXMgYXJyYXkgY29udGFpbnMgc29tZSB2YWx1ZSBpbiB2YWxpZFNjb3BlcycsICgpID0+IHtcbiAgICBjb25zdCBtb2NrRWRpdG9yID0ge1xuICAgICAgZ2V0Q3Vyc29yczogKCkgPT4gW3tcbiAgICAgICAgZ2V0U2NvcGVEZXNjcmlwdG9yOiAoKSA9PiAoe1xuICAgICAgICAgIGdldFNjb3Blc0FycmF5OiAoKSA9PiBbJ3ZhbGlkLnNjb3BlJ11cbiAgICAgICAgfSlcbiAgICAgIH1dXG4gICAgfVxuICAgIGNvbnN0IHNjb3BlcyA9IFsndmFsaWQuc2NvcGUnXVxuICAgIGNvbnN0IHJlc3VsdCA9IGhhc1ZhbGlkU2NvcGUobW9ja0VkaXRvciwgc2NvcGVzKVxuICAgIGV4cGVjdChyZXN1bHQpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgncmV0dXJucyBmYWxzZSB3aGVuIHNjb3BlcyBhcnJheSBoYXMgbm8gdmFsdWVzIGluIHZhbGlkU2NvcGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IG1vY2tFZGl0b3IgPSB7XG4gICAgICBnZXRDdXJzb3JzOiAoKSA9PiBbe1xuICAgICAgICBnZXRTY29wZURlc2NyaXB0b3I6ICgpID0+ICh7XG4gICAgICAgICAgZ2V0U2NvcGVzQXJyYXk6ICgpID0+IFsnc29tZW90aGVyLnNjb3BlJ11cbiAgICAgICAgfSlcbiAgICAgIH1dXG4gICAgfVxuICAgIGNvbnN0IHNjb3BlcyA9IFsnaW52YWxpZC5zY29wZSddXG4gICAgY29uc3QgcmVzdWx0ID0gaGFzVmFsaWRTY29wZShtb2NrRWRpdG9yLCBzY29wZXMpXG4gICAgZXhwZWN0KHJlc3VsdCkudG9CZShmYWxzZSlcbiAgfSlcbn0pXG4iXX0=