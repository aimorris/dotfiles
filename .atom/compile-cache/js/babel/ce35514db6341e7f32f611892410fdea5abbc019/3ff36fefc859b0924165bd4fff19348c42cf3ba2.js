function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _srcMigrateConfigOptions = require('../src/migrate-config-options');

var _srcMigrateConfigOptions2 = _interopRequireDefault(_srcMigrateConfigOptions);

var _makeSpy = require('./make-spy');

var _makeSpy2 = _interopRequireDefault(_makeSpy);

'use babel';

describe('migrateConfigOptions()', function () {
  it('calls the migrate functions of objects in a proided migrations array', function () {
    var migrateSpy = (0, _makeSpy2['default'])();
    var migrations = [{ migrate: migrateSpy.call }];
    (0, _srcMigrateConfigOptions2['default'])(migrations);
    expect(migrateSpy.called()).toEqual(true);
  });

  it('provides the linter-eslint config to migrate functions', function () {
    atom.config.set('linter-eslint.oldSetting', true);
    var migrateSpy = (0, _makeSpy2['default'])();
    var migrations = [{ migrate: migrateSpy.call }];
    (0, _srcMigrateConfigOptions2['default'])(migrations);
    expect(migrateSpy.calledWith[0][0]).toEqual(atom.config.get('linter-eslint'));
  });

  it('moves configs using `moves` array in a provided migrations array', function () {
    atom.config.set('linter-eslint.oldSetting', true);
    var migrations = [{
      moves: [{
        old: 'oldSetting',
        'new': 'newSetting'
      }]
    }];
    (0, _srcMigrateConfigOptions2['default'])(migrations);
    var oldSetting = atom.config.get('linter-eslint.oldSetting');
    var newSetting = atom.config.get('linter-eslint.newSetting');
    console.log({ oldSetting: oldSetting, newSetting: newSetting });
    expect(oldSetting).toEqual(undefined);
    expect(newSetting).toEqual(true);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3BlYy9taWdyYXRlLWNvbmZpZy1vcHRpb25zLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7dUNBRWlDLCtCQUErQjs7Ozt1QkFDNUMsWUFBWTs7OztBQUhoQyxXQUFXLENBQUE7O0FBS1gsUUFBUSxDQUFDLHdCQUF3QixFQUFFLFlBQU07QUFDdkMsSUFBRSxDQUFDLHNFQUFzRSxFQUFFLFlBQU07QUFDL0UsUUFBTSxVQUFVLEdBQUcsMkJBQVMsQ0FBQTtBQUM1QixRQUFNLFVBQVUsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2pELDhDQUFxQixVQUFVLENBQUMsQ0FBQTtBQUNoQyxVQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQzFDLENBQUMsQ0FBQTs7QUFFRixJQUFFLENBQUMsd0RBQXdELEVBQUUsWUFBTTtBQUNqRSxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNqRCxRQUFNLFVBQVUsR0FBRywyQkFBUyxDQUFBO0FBQzVCLFFBQU0sVUFBVSxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDakQsOENBQXFCLFVBQVUsQ0FBQyxDQUFBO0FBQ2hDLFVBQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7R0FDOUUsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQyxrRUFBa0UsRUFBRSxZQUFNO0FBQzNFLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ2pELFFBQU0sVUFBVSxHQUFHLENBQUM7QUFDbEIsV0FBSyxFQUFFLENBQUM7QUFDTixXQUFHLEVBQUUsWUFBWTtBQUNqQixlQUFLLFlBQVk7T0FDbEIsQ0FBQztLQUNILENBQUMsQ0FBQTtBQUNGLDhDQUFxQixVQUFVLENBQUMsQ0FBQTtBQUNoQyxRQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0FBQzlELFFBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUE7QUFDOUQsV0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBVixVQUFVLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNyQyxVQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0dBQ2pDLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NwZWMvbWlncmF0ZS1jb25maWctb3B0aW9ucy1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IG1pZ3JhdGVDb25maWdPcHRpb25zIGZyb20gJy4uL3NyYy9taWdyYXRlLWNvbmZpZy1vcHRpb25zJ1xuaW1wb3J0IG1ha2VTcHkgZnJvbSAnLi9tYWtlLXNweSdcblxuZGVzY3JpYmUoJ21pZ3JhdGVDb25maWdPcHRpb25zKCknLCAoKSA9PiB7XG4gIGl0KCdjYWxscyB0aGUgbWlncmF0ZSBmdW5jdGlvbnMgb2Ygb2JqZWN0cyBpbiBhIHByb2lkZWQgbWlncmF0aW9ucyBhcnJheScsICgpID0+IHtcbiAgICBjb25zdCBtaWdyYXRlU3B5ID0gbWFrZVNweSgpXG4gICAgY29uc3QgbWlncmF0aW9ucyA9IFt7IG1pZ3JhdGU6IG1pZ3JhdGVTcHkuY2FsbCB9XVxuICAgIG1pZ3JhdGVDb25maWdPcHRpb25zKG1pZ3JhdGlvbnMpXG4gICAgZXhwZWN0KG1pZ3JhdGVTcHkuY2FsbGVkKCkpLnRvRXF1YWwodHJ1ZSlcbiAgfSlcblxuICBpdCgncHJvdmlkZXMgdGhlIGxpbnRlci1lc2xpbnQgY29uZmlnIHRvIG1pZ3JhdGUgZnVuY3Rpb25zJywgKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLWVzbGludC5vbGRTZXR0aW5nJywgdHJ1ZSlcbiAgICBjb25zdCBtaWdyYXRlU3B5ID0gbWFrZVNweSgpXG4gICAgY29uc3QgbWlncmF0aW9ucyA9IFt7IG1pZ3JhdGU6IG1pZ3JhdGVTcHkuY2FsbCB9XVxuICAgIG1pZ3JhdGVDb25maWdPcHRpb25zKG1pZ3JhdGlvbnMpXG4gICAgZXhwZWN0KG1pZ3JhdGVTcHkuY2FsbGVkV2l0aFswXVswXSkudG9FcXVhbChhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQnKSlcbiAgfSlcblxuICBpdCgnbW92ZXMgY29uZmlncyB1c2luZyBgbW92ZXNgIGFycmF5IGluIGEgcHJvdmlkZWQgbWlncmF0aW9ucyBhcnJheScsICgpID0+IHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1lc2xpbnQub2xkU2V0dGluZycsIHRydWUpXG4gICAgY29uc3QgbWlncmF0aW9ucyA9IFt7XG4gICAgICBtb3ZlczogW3tcbiAgICAgICAgb2xkOiAnb2xkU2V0dGluZycsXG4gICAgICAgIG5ldzogJ25ld1NldHRpbmcnLFxuICAgICAgfV0sXG4gICAgfV1cbiAgICBtaWdyYXRlQ29uZmlnT3B0aW9ucyhtaWdyYXRpb25zKVxuICAgIGNvbnN0IG9sZFNldHRpbmcgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci1lc2xpbnQub2xkU2V0dGluZycpXG4gICAgY29uc3QgbmV3U2V0dGluZyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLWVzbGludC5uZXdTZXR0aW5nJylcbiAgICBjb25zb2xlLmxvZyh7IG9sZFNldHRpbmcsIG5ld1NldHRpbmcgfSlcbiAgICBleHBlY3Qob2xkU2V0dGluZykudG9FcXVhbCh1bmRlZmluZWQpXG4gICAgZXhwZWN0KG5ld1NldHRpbmcpLnRvRXF1YWwodHJ1ZSlcbiAgfSlcbn0pXG4iXX0=