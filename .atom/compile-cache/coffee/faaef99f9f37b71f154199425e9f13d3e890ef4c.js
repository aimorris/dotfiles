(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ex.Cloud = (function(superClass) {
    extend(Cloud, superClass);

    function Cloud() {
      return Cloud.__super__.constructor.apply(this, arguments);
    }

    Cloud.prototype.getStyle = function(front, x, y, rotate, dist) {
      var b, g, r, r3, ratio, scale, shadow, transform;
      scale = Math.abs(Math.cos(ex.deg2rad(dist / 128 * 90)));
      shadow = (5 + this.altitude) * 1 / scale;
      ratio = 1 - scale;
      r3 = ratio * ratio * ratio;
      r = 255 - Math.round(r3 * (255 - 0x8f));
      g = 255 - Math.round(r3 * (255 - 0xed));
      b = 255 - Math.round(r3 * (255 - 0xf4));
      transform = this.getTransform(rotate, Math.max(scale, 0.3));
      return transform + " background: rgb(" + r + "," + g + "," + b + "); box-shadow: 0 0 4px 1px rgb(" + r + "," + g + "," + b + "), 0 0 8px 1px rgb(" + r + "," + g + "," + b + ");";
    };

    Cloud.prototype.getShadowStyle = function(front, x, y, rotate, dist) {
      var scale, transform;
      scale = Math.abs(Math.cos(ex.deg2rad(dist / 128 * 90)));
      transform = this.getTransform(rotate, Math.max(scale, 0.0001));
      if (front) {
        return transform;
      } else {
        return 'display: none;';
      }
    };

    Cloud.prototype.getTransform = function(rotate, scale) {
      var prefixes, transformString;
      transformString = "rotate(" + (Math.round(ex.rad2deg(rotate))) + "deg) scale(" + scale + ", 1)";
      prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
      return prefixes.map(function(p) {
        return p + "transform: " + transformString + ";";
      }).join('');
    };

    return Cloud;

  })(ex.Orbitable);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy9wbGFuZXRzL2Nsb3VkLmpzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7OztFQUFNLEVBQUUsQ0FBQzs7Ozs7OztvQkFDUCxRQUFBLEdBQVUsU0FBQyxLQUFELEVBQVEsQ0FBUixFQUFXLENBQVgsRUFBYyxNQUFkLEVBQXNCLElBQXRCO0FBQ1IsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsRUFBRSxDQUFDLE9BQUgsQ0FBVyxJQUFBLEdBQU8sR0FBUCxHQUFhLEVBQXhCLENBQVQsQ0FBVDtNQUNSLE1BQUEsR0FBUyxDQUFDLENBQUEsR0FBRSxJQUFDLENBQUEsUUFBSixDQUFBLEdBQWdCLENBQWhCLEdBQW9CO01BQzdCLEtBQUEsR0FBUyxDQUFBLEdBQUU7TUFDWCxFQUFBLEdBQUssS0FBQSxHQUFRLEtBQVIsR0FBZ0I7TUFDckIsQ0FBQSxHQUFJLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUEsR0FBSyxDQUFDLEdBQUEsR0FBTSxJQUFQLENBQWhCO01BQ1YsQ0FBQSxHQUFJLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUEsR0FBSyxDQUFDLEdBQUEsR0FBTSxJQUFQLENBQWhCO01BQ1YsQ0FBQSxHQUFJLEdBQUEsR0FBTSxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUEsR0FBSyxDQUFDLEdBQUEsR0FBTSxJQUFQLENBQWhCO01BRVYsU0FBQSxHQUFZLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsRUFBZ0IsR0FBaEIsQ0FBdEI7YUFFVCxTQUFELEdBQVcsbUJBQVgsR0FBOEIsQ0FBOUIsR0FBZ0MsR0FBaEMsR0FBbUMsQ0FBbkMsR0FBcUMsR0FBckMsR0FBd0MsQ0FBeEMsR0FBMEMsaUNBQTFDLEdBQTJFLENBQTNFLEdBQTZFLEdBQTdFLEdBQWdGLENBQWhGLEdBQWtGLEdBQWxGLEdBQXFGLENBQXJGLEdBQXVGLHFCQUF2RixHQUE0RyxDQUE1RyxHQUE4RyxHQUE5RyxHQUFpSCxDQUFqSCxHQUFtSCxHQUFuSCxHQUFzSCxDQUF0SCxHQUF3SDtJQVhsSDs7b0JBYVYsY0FBQSxHQUFnQixTQUFDLEtBQUQsRUFBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLE1BQWQsRUFBc0IsSUFBdEI7QUFDZCxVQUFBO01BQUEsS0FBQSxHQUFRLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFFLENBQUMsT0FBSCxDQUFXLElBQUEsR0FBTyxHQUFQLEdBQWEsRUFBeEIsQ0FBVCxDQUFUO01BRVIsU0FBQSxHQUFZLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxFQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsRUFBZ0IsTUFBaEIsQ0FBdEI7TUFFWixJQUFHLEtBQUg7ZUFDRSxVQURGO09BQUEsTUFBQTtlQUdFLGlCQUhGOztJQUxjOztvQkFVaEIsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLEtBQVQ7QUFDWixVQUFBO01BQUEsZUFBQSxHQUFrQixTQUFBLEdBQVMsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxPQUFILENBQVcsTUFBWCxDQUFYLENBQUQsQ0FBVCxHQUF1QyxhQUF2QyxHQUFvRCxLQUFwRCxHQUEwRDtNQUM1RSxRQUFBLEdBQVcsQ0FBQyxFQUFELEVBQUssS0FBTCxFQUFZLE1BQVosRUFBb0IsT0FBcEIsRUFBNkIsVUFBN0I7YUFDWCxRQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMsQ0FBRDtlQUFVLENBQUQsR0FBRyxhQUFILEdBQWdCLGVBQWhCLEdBQWdDO01BQXpDLENBQWIsQ0FBeUQsQ0FBQyxJQUExRCxDQUErRCxFQUEvRDtJQUhZOzs7O0tBeEJPLEVBQUUsQ0FBQztBQUExQiIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIGV4LkNsb3VkIGV4dGVuZHMgZXguT3JiaXRhYmxlXG4gIGdldFN0eWxlOiAoZnJvbnQsIHgsIHksIHJvdGF0ZSwgZGlzdCkgLT5cbiAgICBzY2FsZSA9IE1hdGguYWJzIE1hdGguY29zKGV4LmRlZzJyYWQgZGlzdCAvIDEyOCAqIDkwKVxuICAgIHNoYWRvdyA9ICg1K0BhbHRpdHVkZSkgKiAxIC8gc2NhbGVcbiAgICByYXRpbyA9ICgxLXNjYWxlKVxuICAgIHIzID0gcmF0aW8gKiByYXRpbyAqIHJhdGlvXG4gICAgciA9IDI1NSAtIE1hdGgucm91bmQgcjMgKiAoMjU1IC0gMHg4ZilcbiAgICBnID0gMjU1IC0gTWF0aC5yb3VuZCByMyAqICgyNTUgLSAweGVkKVxuICAgIGIgPSAyNTUgLSBNYXRoLnJvdW5kIHIzICogKDI1NSAtIDB4ZjQpXG5cbiAgICB0cmFuc2Zvcm0gPSBAZ2V0VHJhbnNmb3JtIHJvdGF0ZSwgTWF0aC5tYXggc2NhbGUsIDAuM1xuXG4gICAgXCIje3RyYW5zZm9ybX0gYmFja2dyb3VuZDogcmdiKCN7cn0sI3tnfSwje2J9KTsgYm94LXNoYWRvdzogMCAwIDRweCAxcHggcmdiKCN7cn0sI3tnfSwje2J9KSwgMCAwIDhweCAxcHggcmdiKCN7cn0sI3tnfSwje2J9KTtcIlxuXG4gIGdldFNoYWRvd1N0eWxlOiAoZnJvbnQsIHgsIHksIHJvdGF0ZSwgZGlzdCkgLT5cbiAgICBzY2FsZSA9IE1hdGguYWJzIE1hdGguY29zKGV4LmRlZzJyYWQgZGlzdCAvIDEyOCAqIDkwKVxuXG4gICAgdHJhbnNmb3JtID0gQGdldFRyYW5zZm9ybSByb3RhdGUsIE1hdGgubWF4IHNjYWxlLCAwLjAwMDFcblxuICAgIGlmIGZyb250XG4gICAgICB0cmFuc2Zvcm1cbiAgICBlbHNlXG4gICAgICAnZGlzcGxheTogbm9uZTsnXG5cbiAgZ2V0VHJhbnNmb3JtOiAocm90YXRlLCBzY2FsZSkgLT5cbiAgICB0cmFuc2Zvcm1TdHJpbmcgPSBcInJvdGF0ZSgje01hdGgucm91bmQgZXgucmFkMmRlZyByb3RhdGV9ZGVnKSBzY2FsZSgje3NjYWxlfSwgMSlcIlxuICAgIHByZWZpeGVzID0gWycnLCAnLW8tJywgJy1tcy0nLCAnLW1vei0nLCAnLXdlYmtpdC0nXVxuICAgIHByZWZpeGVzLm1hcCgocCkgLT4gXCIje3B9dHJhbnNmb3JtOiAje3RyYW5zZm9ybVN0cmluZ307XCIpLmpvaW4oJycpXG4iXX0=
