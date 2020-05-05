'use babel';

/*
 * These migrations can take one of two forms, a direct move or a general function.
 *
 * Direct move:
 *   These objects have an array of `moves`, which
 *   are objects containing an `old` setting name and a `new` setting name.
 *   Any existing config found in the `old` name will be moved over to (and overwrite)
 *   the `new` key.
 *
 * Functions:
 *   These have a `migrate` function, which takes the
 *   current linter-eslint atom config as an argument, and can act on it however
 *   it needs to.
 */
var activeMigrations = [{
  added: 'January, 2018',
  description: 'Organized config settings into sections',
  moves: [{
    old: 'disableWhenNoEslintConfig',
    'new': 'disabling.disableWhenNoEslintConfig'
  }, {
    old: 'fixOnSave',
    'new': 'autofix.fixOnSave'
  }, {
    old: 'ignoreFixableRulesWhileTyping',
    'new': 'autofix.ignoreFixableRulesWhileTyping'
  }, {
    old: 'rulesToDisableWhileFixing',
    'new': 'autofix.rulesToDisableWhileFixing'
  }, {
    old: 'rulesToSilenceWhileTyping',
    'new': 'disabling.rulesToSilenceWhileTyping'
  }, {
    old: 'disableEslintIgnore',
    'new': 'advanced.disableEslintIgnore'
  }, {
    old: 'disableFSCache',
    'new': 'advanced.disableFSCache'
  }, {
    old: 'showRuleIdInMessage',
    'new': 'advanced.showRuleIdInMessage'
  }, {
    old: 'eslintrcPath',
    'new': 'global.eslintrcPath'
  }, {
    old: 'advancedLocalNodeModules',
    'new': 'advanced.localNodeModules'
  }, {
    old: 'eslintRulesDirs',
    'new': 'advanced.eslintRulesDirs'
  }, {
    old: 'useGlobalEslint',
    'new': 'global.useGlobalEslint'
  }, {
    old: 'globalNodePath',
    'new': 'global.globalNodePath'
  }]
}, {
  added: 'September, 2017',
  description: 'Deprecated eslintRulesDir{String} option in favor of eslintRulesDirs{Array<String>}',
  migrate: function migrate(config) {
    var oldRulesdir = config.eslintRulesDir;
    if (oldRulesdir) {
      var newRulesDirs = config.eslintRulesDirs;
      if (newRulesDirs.length === 0) {
        atom.config.set('linter-eslint.eslintRulesDirs', [oldRulesdir]);
      }
      atom.config.unset('linter-eslint.eslintRulesDir');
    }
  }
}];

/*
 * This function can be called when linter-eslint first activates in order to
 * ensure that the user's settings are up-to-date with the current version of
 * linter-eslint.  Ideally, we would call this only when upgrading to a new
 * version.
 */
function migrateConfigOptions() {
  var migrations = arguments.length <= 0 || arguments[0] === undefined ? activeMigrations : arguments[0];

  if (migrations.length) {
    (function () {
      var linterEslintConfig = atom.config.get('linter-eslint');
      migrations.forEach(function (migration) {
        if (migration.moves && Array.isArray(migration.moves)) {
          // Copy old settings over to the new ones, then unset the old setting keys
          migration.moves.forEach(function (move) {
            var oldSetting = linterEslintConfig[move.old];
            if (oldSetting !== undefined) {
              atom.config.set('linter-eslint.' + move['new'], oldSetting);
              atom.config.unset('linter-eslint.' + move.old);
            }
          });
        } else if (typeof migration.migrate === 'function') {
          migration.migrate(linterEslintConfig);
        }
      });
    })();
  }
}

module.exports = migrateConfigOptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FpbW9ycmlzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1lc2xpbnQvc3JjL21pZ3JhdGUtY29uZmlnLW9wdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JYLElBQU0sZ0JBQWdCLEdBQUcsQ0FDdkI7QUFDRSxPQUFLLEVBQUUsZUFBZTtBQUN0QixhQUFXLEVBQUUseUNBQXlDO0FBQ3RELE9BQUssRUFBRSxDQUNMO0FBQ0UsT0FBRyxFQUFFLDJCQUEyQjtBQUNoQyxXQUFLLHFDQUFxQztHQUMzQyxFQUFFO0FBQ0QsT0FBRyxFQUFFLFdBQVc7QUFDaEIsV0FBSyxtQkFBbUI7R0FDekIsRUFBRTtBQUNELE9BQUcsRUFBRSwrQkFBK0I7QUFDcEMsV0FBSyx1Q0FBdUM7R0FDN0MsRUFBRTtBQUNELE9BQUcsRUFBRSwyQkFBMkI7QUFDaEMsV0FBSyxtQ0FBbUM7R0FDekMsRUFBRTtBQUNELE9BQUcsRUFBRSwyQkFBMkI7QUFDaEMsV0FBSyxxQ0FBcUM7R0FDM0MsRUFBRTtBQUNELE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsV0FBSyw4QkFBOEI7R0FDcEMsRUFBRTtBQUNELE9BQUcsRUFBRSxnQkFBZ0I7QUFDckIsV0FBSyx5QkFBeUI7R0FDL0IsRUFBRTtBQUNELE9BQUcsRUFBRSxxQkFBcUI7QUFDMUIsV0FBSyw4QkFBOEI7R0FDcEMsRUFBRTtBQUNELE9BQUcsRUFBRSxjQUFjO0FBQ25CLFdBQUsscUJBQXFCO0dBQzNCLEVBQUU7QUFDRCxPQUFHLEVBQUUsMEJBQTBCO0FBQy9CLFdBQUssMkJBQTJCO0dBQ2pDLEVBQUU7QUFDRCxPQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLFdBQUssMEJBQTBCO0dBQ2hDLEVBQUU7QUFDRCxPQUFHLEVBQUUsaUJBQWlCO0FBQ3RCLFdBQUssd0JBQXdCO0dBQzlCLEVBQUU7QUFDRCxPQUFHLEVBQUUsZ0JBQWdCO0FBQ3JCLFdBQUssdUJBQXVCO0dBQzdCLENBQ0Y7Q0FDRixFQUNEO0FBQ0UsT0FBSyxFQUFFLGlCQUFpQjtBQUN4QixhQUFXLEVBQUUscUZBQXFGO0FBQ2xHLFNBQU8sRUFBQSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxRQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFBO0FBQ3pDLFFBQUksV0FBVyxFQUFFO0FBQ2YsVUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQTtBQUMzQyxVQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtPQUNoRTtBQUNELFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7S0FDbEQ7R0FDRjtDQUNGLENBQ0YsQ0FBQTs7Ozs7Ozs7QUFRRCxTQUFTLG9CQUFvQixHQUFnQztNQUEvQixVQUFVLHlEQUFHLGdCQUFnQjs7QUFDekQsTUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFOztBQUNyQixVQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFBO0FBQzNELGdCQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUyxFQUFLO0FBQ2hDLFlBQUksU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFFckQsbUJBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ2hDLGdCQUFNLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDL0MsZ0JBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtBQUM1QixrQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLG9CQUFrQixJQUFJLE9BQUksRUFBSSxVQUFVLENBQUMsQ0FBQTtBQUN4RCxrQkFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLG9CQUFrQixJQUFJLENBQUMsR0FBRyxDQUFHLENBQUE7YUFDL0M7V0FDRixDQUFDLENBQUE7U0FDSCxNQUFNLElBQUksT0FBTyxTQUFTLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtBQUNsRCxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1NBQ3RDO09BQ0YsQ0FBQyxDQUFBOztHQUNIO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQSIsImZpbGUiOiIvaG9tZS9haW1vcnJpcy8uYXRvbS9wYWNrYWdlcy9saW50ZXItZXNsaW50L3NyYy9taWdyYXRlLWNvbmZpZy1vcHRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuLypcbiAqIFRoZXNlIG1pZ3JhdGlvbnMgY2FuIHRha2Ugb25lIG9mIHR3byBmb3JtcywgYSBkaXJlY3QgbW92ZSBvciBhIGdlbmVyYWwgZnVuY3Rpb24uXG4gKlxuICogRGlyZWN0IG1vdmU6XG4gKiAgIFRoZXNlIG9iamVjdHMgaGF2ZSBhbiBhcnJheSBvZiBgbW92ZXNgLCB3aGljaFxuICogICBhcmUgb2JqZWN0cyBjb250YWluaW5nIGFuIGBvbGRgIHNldHRpbmcgbmFtZSBhbmQgYSBgbmV3YCBzZXR0aW5nIG5hbWUuXG4gKiAgIEFueSBleGlzdGluZyBjb25maWcgZm91bmQgaW4gdGhlIGBvbGRgIG5hbWUgd2lsbCBiZSBtb3ZlZCBvdmVyIHRvIChhbmQgb3ZlcndyaXRlKVxuICogICB0aGUgYG5ld2Aga2V5LlxuICpcbiAqIEZ1bmN0aW9uczpcbiAqICAgVGhlc2UgaGF2ZSBhIGBtaWdyYXRlYCBmdW5jdGlvbiwgd2hpY2ggdGFrZXMgdGhlXG4gKiAgIGN1cnJlbnQgbGludGVyLWVzbGludCBhdG9tIGNvbmZpZyBhcyBhbiBhcmd1bWVudCwgYW5kIGNhbiBhY3Qgb24gaXQgaG93ZXZlclxuICogICBpdCBuZWVkcyB0by5cbiAqL1xuY29uc3QgYWN0aXZlTWlncmF0aW9ucyA9IFtcbiAge1xuICAgIGFkZGVkOiAnSmFudWFyeSwgMjAxOCcsXG4gICAgZGVzY3JpcHRpb246ICdPcmdhbml6ZWQgY29uZmlnIHNldHRpbmdzIGludG8gc2VjdGlvbnMnLFxuICAgIG1vdmVzOiBbXG4gICAgICB7XG4gICAgICAgIG9sZDogJ2Rpc2FibGVXaGVuTm9Fc2xpbnRDb25maWcnLFxuICAgICAgICBuZXc6ICdkaXNhYmxpbmcuZGlzYWJsZVdoZW5Ob0VzbGludENvbmZpZycsXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ2ZpeE9uU2F2ZScsXG4gICAgICAgIG5ldzogJ2F1dG9maXguZml4T25TYXZlJ1xuICAgICAgfSwge1xuICAgICAgICBvbGQ6ICdpZ25vcmVGaXhhYmxlUnVsZXNXaGlsZVR5cGluZycsXG4gICAgICAgIG5ldzogJ2F1dG9maXguaWdub3JlRml4YWJsZVJ1bGVzV2hpbGVUeXBpbmcnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ3J1bGVzVG9EaXNhYmxlV2hpbGVGaXhpbmcnLFxuICAgICAgICBuZXc6ICdhdXRvZml4LnJ1bGVzVG9EaXNhYmxlV2hpbGVGaXhpbmcnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ3J1bGVzVG9TaWxlbmNlV2hpbGVUeXBpbmcnLFxuICAgICAgICBuZXc6ICdkaXNhYmxpbmcucnVsZXNUb1NpbGVuY2VXaGlsZVR5cGluZydcbiAgICAgIH0sIHtcbiAgICAgICAgb2xkOiAnZGlzYWJsZUVzbGludElnbm9yZScsXG4gICAgICAgIG5ldzogJ2FkdmFuY2VkLmRpc2FibGVFc2xpbnRJZ25vcmUnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ2Rpc2FibGVGU0NhY2hlJyxcbiAgICAgICAgbmV3OiAnYWR2YW5jZWQuZGlzYWJsZUZTQ2FjaGUnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ3Nob3dSdWxlSWRJbk1lc3NhZ2UnLFxuICAgICAgICBuZXc6ICdhZHZhbmNlZC5zaG93UnVsZUlkSW5NZXNzYWdlJ1xuICAgICAgfSwge1xuICAgICAgICBvbGQ6ICdlc2xpbnRyY1BhdGgnLFxuICAgICAgICBuZXc6ICdnbG9iYWwuZXNsaW50cmNQYXRoJ1xuICAgICAgfSwge1xuICAgICAgICBvbGQ6ICdhZHZhbmNlZExvY2FsTm9kZU1vZHVsZXMnLFxuICAgICAgICBuZXc6ICdhZHZhbmNlZC5sb2NhbE5vZGVNb2R1bGVzJ1xuICAgICAgfSwge1xuICAgICAgICBvbGQ6ICdlc2xpbnRSdWxlc0RpcnMnLFxuICAgICAgICBuZXc6ICdhZHZhbmNlZC5lc2xpbnRSdWxlc0RpcnMnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ3VzZUdsb2JhbEVzbGludCcsXG4gICAgICAgIG5ldzogJ2dsb2JhbC51c2VHbG9iYWxFc2xpbnQnXG4gICAgICB9LCB7XG4gICAgICAgIG9sZDogJ2dsb2JhbE5vZGVQYXRoJyxcbiAgICAgICAgbmV3OiAnZ2xvYmFsLmdsb2JhbE5vZGVQYXRoJ1xuICAgICAgfVxuICAgIF1cbiAgfSxcbiAge1xuICAgIGFkZGVkOiAnU2VwdGVtYmVyLCAyMDE3JyxcbiAgICBkZXNjcmlwdGlvbjogJ0RlcHJlY2F0ZWQgZXNsaW50UnVsZXNEaXJ7U3RyaW5nfSBvcHRpb24gaW4gZmF2b3Igb2YgZXNsaW50UnVsZXNEaXJze0FycmF5PFN0cmluZz59JyxcbiAgICBtaWdyYXRlKGNvbmZpZykge1xuICAgICAgY29uc3Qgb2xkUnVsZXNkaXIgPSBjb25maWcuZXNsaW50UnVsZXNEaXJcbiAgICAgIGlmIChvbGRSdWxlc2Rpcikge1xuICAgICAgICBjb25zdCBuZXdSdWxlc0RpcnMgPSBjb25maWcuZXNsaW50UnVsZXNEaXJzXG4gICAgICAgIGlmIChuZXdSdWxlc0RpcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItZXNsaW50LmVzbGludFJ1bGVzRGlycycsIFtvbGRSdWxlc2Rpcl0pXG4gICAgICAgIH1cbiAgICAgICAgYXRvbS5jb25maWcudW5zZXQoJ2xpbnRlci1lc2xpbnQuZXNsaW50UnVsZXNEaXInKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXVxuXG4vKlxuICogVGhpcyBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIHdoZW4gbGludGVyLWVzbGludCBmaXJzdCBhY3RpdmF0ZXMgaW4gb3JkZXIgdG9cbiAqIGVuc3VyZSB0aGF0IHRoZSB1c2VyJ3Mgc2V0dGluZ3MgYXJlIHVwLXRvLWRhdGUgd2l0aCB0aGUgY3VycmVudCB2ZXJzaW9uIG9mXG4gKiBsaW50ZXItZXNsaW50LiAgSWRlYWxseSwgd2Ugd291bGQgY2FsbCB0aGlzIG9ubHkgd2hlbiB1cGdyYWRpbmcgdG8gYSBuZXdcbiAqIHZlcnNpb24uXG4gKi9cbmZ1bmN0aW9uIG1pZ3JhdGVDb25maWdPcHRpb25zKG1pZ3JhdGlvbnMgPSBhY3RpdmVNaWdyYXRpb25zKSB7XG4gIGlmIChtaWdyYXRpb25zLmxlbmd0aCkge1xuICAgIGNvbnN0IGxpbnRlckVzbGludENvbmZpZyA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLWVzbGludCcpXG4gICAgbWlncmF0aW9ucy5mb3JFYWNoKChtaWdyYXRpb24pID0+IHtcbiAgICAgIGlmIChtaWdyYXRpb24ubW92ZXMgJiYgQXJyYXkuaXNBcnJheShtaWdyYXRpb24ubW92ZXMpKSB7XG4gICAgICAgIC8vIENvcHkgb2xkIHNldHRpbmdzIG92ZXIgdG8gdGhlIG5ldyBvbmVzLCB0aGVuIHVuc2V0IHRoZSBvbGQgc2V0dGluZyBrZXlzXG4gICAgICAgIG1pZ3JhdGlvbi5tb3Zlcy5mb3JFYWNoKChtb3ZlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgb2xkU2V0dGluZyA9IGxpbnRlckVzbGludENvbmZpZ1ttb3ZlLm9sZF1cbiAgICAgICAgICBpZiAob2xkU2V0dGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoYGxpbnRlci1lc2xpbnQuJHttb3ZlLm5ld31gLCBvbGRTZXR0aW5nKVxuICAgICAgICAgICAgYXRvbS5jb25maWcudW5zZXQoYGxpbnRlci1lc2xpbnQuJHttb3ZlLm9sZH1gKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1pZ3JhdGlvbi5taWdyYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1pZ3JhdGlvbi5taWdyYXRlKGxpbnRlckVzbGludENvbmZpZylcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWlncmF0ZUNvbmZpZ09wdGlvbnNcbiJdfQ==