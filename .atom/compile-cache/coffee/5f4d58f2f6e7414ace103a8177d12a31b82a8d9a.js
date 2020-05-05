(function() {
  var addAttrs, filewalker, fs, moment, pad, parser, path, sloc, suffixes,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  moment = require('moment');

  sloc = require('sloc');

  filewalker = require('filewalker');

  parser = require('gitignore-parser');

  path = require('path');

  suffixes = ["asm", "brs", "c", "cc", "clj", "cljs", "coffee", "cpp", "cr", "cs", "css", "cxx", "erl", "go", "groovy", "gs", "h", "handlebars", "hbs", "hpp", "hr", "hs", "html", "htm", "hx", "hxx", "hy", "iced", "ino", "jade", "java", "jl", "js", "jsx", "less", "ld", "lua", "ls", "m", "md", "ml", "mli", "mm", "mochi", "monkey", "mustache", "nix", "nim", "nut", "php", "php5", "pl", "py", "r", "rb", "rkt", "rs", "sass", "scala", "scss", "styl", "svg", "swift", "ts", "ttslua", "vb", "vue", "xml", "yaml"];

  pad = function(num, w) {
    num = '' + num;
    while (num.length < w) {
      num = ' ' + num;
    }
    return ' ' + num;
  };

  addAttrs = function(sfx, aIn, b) {
    var a, k, results, v;
    a = (aIn[sfx] != null ? aIn[sfx] : aIn[sfx] = {});
    results = [];
    for (k in b) {
      v = b[k];
      if (a[k] == null) {
        a[k] = 0;
      }
      a[k] += v;
      results.push(null);
    }
    return results;
  };

  module.exports = {
    activate: function() {
      var e;
      try {
        this.gitignore = parser.compile(fs.readFileSync(".gitignore", "utf8"));
      } catch (error) {
        e = error;
        this.gitignore = null;
      }
      return this.sub = atom.commands.add('atom-workspace', {
        'line-count:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      });
    },
    open: function() {
      var add, editor, printSection, rootDirPath, text;
      text = '';
      add = function(txt) {
        return text += (txt != null ? txt : '') + '\n';
      };
      printSection = function(title, data) {
        var c, hdr, i, j, l, label, len, line, lines, maxC, maxS, maxT, ref, wc, ws, wt;
        hdr = '\n' + title + '\n';
        for (i = j = 0, ref = title.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          hdr += '-';
        }
        add(hdr);
        maxS = maxC = maxT = 0;
        for (label in data) {
          c = data[label];
          maxS = Math.max(maxS, c.source);
          maxC = Math.max(maxC, c.comment);
          maxT = Math.max(maxT, c.total);
          ws = ('' + maxS).length + 1;
          wc = ('' + maxC).length + 1;
          wt = ('' + maxT).length + 1;
        }
        lines = (function() {
          var results;
          results = [];
          for (label in data) {
            c = data[label];
            results.push([label, c]);
          }
          return results;
        })();
        lines.sort();
        for (l = 0, len = lines.length; l < len; l++) {
          line = lines[l];
          label = line[0], c = line[1];
          add(pad(c.source, ws) + pad(c.comment, wc) + pad(c.total, wt) + '  ' + label);
        }
        return null;
      };
      rootDirPath = atom.project.getDirectories()[0].getPath();
      editor = atom.workspace.getActiveTextEditor();
      if (editor && editor.getPath()) {
        rootDirPath = path.dirname(editor.getPath());
        console.log(rootDirPath);
      }
      return atom.workspace.open('line-count.txt').then((function(_this) {
        return function(editor) {
          var dirs, files, total, typeData;
          files = {};
          typeData = {};
          dirs = {};
          total = {};
          return filewalker(rootDirPath, {
            maxPending: 4
          }).on("file", function(path, stats, absPath) {
            var code, counts, dir, dirPart, dirParts, e, idx, j, len, ref, sfx, sfxMatch, type;
            sfxMatch = /\.([^\.]+)$/.exec(path);
            if (sfxMatch && (ref = (sfx = sfxMatch[1]), indexOf.call(suffixes, ref) >= 0) && path.indexOf('vendor') === -1 && path.indexOf('node_modules') === -1 && path.indexOf('bower_components') === -1 && (!_this.gitignore || _this.gitignore.accepts(path))) {
              code = fs.readFileSync(absPath, 'utf8');
              code = code.replace(/\r/g, '');
              type = sfx;
              if (type === 'ttslua') {
                type = 'lua';
              }
              try {
                counts = sloc(code, type);
              } catch (error) {
                e = error;
                add('Warning: ' + e.message);
                return;
              }
              dirParts = path.split('/');
              dir = '';
              for (idx = j = 0, len = dirParts.length; j < len; idx = ++j) {
                dirPart = dirParts[idx];
                if (idx === dirParts.length - 1) {
                  break;
                }
                dir += dirPart;
                addAttrs(dir, dirs, counts);
                dir += '/';
              }
              files[path] = counts;
              addAttrs(sfx, typeData, counts);
              return addAttrs('', total, counts);
            }
          }).on("error", function(err) {
            return add(err.message);
          }).on("done", function() {
            add('\nLine counts for project ' + rootDirPath + '.');
            add('Generated by the Atom editor package Line-Count on ' + moment().format('MMMM D YYYY H:mm.'));
            add('Counts are in order of source, comments, and total.');
            printSection('Files', files);
            printSection('Directories', dirs);
            printSection('Types', typeData);
            printSection('Total', total);
            return editor.setText(text);
          }).walk();
        };
      })(this));
    },
    deactivate: function() {
      return this.sub.dispose();
    }
  };

  
;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC9saWIvbGluZS1jb3VudC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBLG1FQUFBO0lBQUE7O0VBQUEsRUFBQSxHQUFhLE9BQUEsQ0FBUSxJQUFSOztFQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsUUFBUjs7RUFDYixJQUFBLEdBQWEsT0FBQSxDQUFRLE1BQVI7O0VBQ2IsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSOztFQUNiLE1BQUEsR0FBYSxPQUFBLENBQVEsa0JBQVI7O0VBQ2IsSUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSOztFQUViLFFBQUEsR0FBVyxDQUNULEtBRFMsRUFFVCxLQUZTLEVBR1QsR0FIUyxFQUlULElBSlMsRUFLVCxLQUxTLEVBTVQsTUFOUyxFQU9ULFFBUFMsRUFRVCxLQVJTLEVBU1QsSUFUUyxFQVVULElBVlMsRUFXVCxLQVhTLEVBWVQsS0FaUyxFQWFULEtBYlMsRUFjVCxJQWRTLEVBZVQsUUFmUyxFQWdCVCxJQWhCUyxFQWlCVCxHQWpCUyxFQWtCVCxZQWxCUyxFQWtCSyxLQWxCTCxFQW1CVCxLQW5CUyxFQW9CVCxJQXBCUyxFQXFCVCxJQXJCUyxFQXNCVCxNQXRCUyxFQXNCRCxLQXRCQyxFQXVCVCxJQXZCUyxFQXdCVCxLQXhCUyxFQXlCVCxJQXpCUyxFQTBCVCxNQTFCUyxFQTJCVCxLQTNCUyxFQTRCVCxNQTVCUyxFQTZCVCxNQTdCUyxFQThCVCxJQTlCUyxFQStCVCxJQS9CUyxFQWdDVCxLQWhDUyxFQWlDVCxNQWpDUyxFQWtDVCxJQWxDUyxFQW1DVCxLQW5DUyxFQW9DVCxJQXBDUyxFQXFDVCxHQXJDUyxFQXNDVCxJQXRDUyxFQXVDVCxJQXZDUyxFQXdDVCxLQXhDUyxFQXlDVCxJQXpDUyxFQTBDVCxPQTFDUyxFQTJDVCxRQTNDUyxFQTRDVCxVQTVDUyxFQTZDVCxLQTdD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QWtDTyxPQWxDUCxFQWtDZ0IsU0FBQyxHQUFEO21CQUNaLEdBQUEsQ0FBSSxHQUFHLENBQUMsT0FBUjtVQURZLENBbENoQixDQXFDRyxDQUFDLEVBckNKLENBcUNPLE1BckNQLEVBcUNlLFNBQUE7WUFDWCxHQUFBLENBQUksNEJBQUEsR0FBK0IsV0FBL0IsR0FBNkMsR0FBakQ7WUFDQSxHQUFBLENBQUkscURBQUEsR0FDQSxNQUFBLENBQUEsQ0FBUSxDQUFDLE1BQVQsQ0FBZ0IsbUJBQWhCLENBREo7WUFFQSxHQUFBLENBQUkscURBQUo7WUFFQSxZQUFBLENBQWEsT0FBYixFQUE0QixLQUE1QjtZQUNBLFlBQUEsQ0FBYSxhQUFiLEVBQTRCLElBQTVCO1lBQ0EsWUFBQSxDQUFhLE9BQWIsRUFBNEIsUUFBNUI7WUFDQSxZQUFBLENBQWEsT0FBYixFQUE0QixLQUE1QjttQkFFQSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWY7VUFYVyxDQXJDZixDQWtERyxDQUFDLElBbERKLENBQUE7UUFOeUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDO0lBL0JJLENBUE47SUFnR0EsVUFBQSxFQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsR0FBRyxDQUFDLE9BQUwsQ0FBQTtJQURVLENBaEdaOzs7OztBQTFGRiIsInNvdXJjZXNDb250ZW50IjpbIlxuZnMgICAgICAgICA9IHJlcXVpcmUgJ2ZzJ1xubW9tZW50ICAgICA9IHJlcXVpcmUgJ21vbWVudCdcbnNsb2MgICAgICAgPSByZXF1aXJlICdzbG9jJ1xuZmlsZXdhbGtlciA9IHJlcXVpcmUgJ2ZpbGV3YWxrZXInXG5wYXJzZXIgICAgID0gcmVxdWlyZSAnZ2l0aWdub3JlLXBhcnNlcidcbnBhdGggICAgICAgPSByZXF1aXJlICdwYXRoJ1xuXG5zdWZmaXhlcyA9IFtcbiAgXCJhc21cIlxuICBcImJyc1wiXG4gIFwiY1wiXG4gIFwiY2NcIlxuICBcImNsalwiXG4gIFwiY2xqc1wiXG4gIFwiY29mZmVlXCJcbiAgXCJjcHBcIlxuICBcImNyXCJcbiAgXCJjc1wiXG4gIFwiY3NzXCJcbiAgXCJjeHhcIlxuICBcImVybFwiXG4gIFwiZ29cIlxuICBcImdyb292eVwiXG4gIFwiZ3NcIlxuICBcImhcIlxuICBcImhhbmRsZWJhcnNcIiwgXCJoYnNcIlxuICBcImhwcFwiXG4gIFwiaHJcIlxuICBcImhzXCJcbiAgXCJodG1sXCIsIFwiaHRtXCJcbiAgXCJoeFwiXG4gIFwiaHh4XCJcbiAgXCJoeVwiXG4gIFwiaWNlZFwiXG4gIFwiaW5vXCJcbiAgXCJqYWRlXCJcbiAgXCJqYXZhXCJcbiAgXCJqbFwiXG4gIFwianNcIlxuICBcImpzeFwiXG4gIFwibGVzc1wiXG4gIFwibGRcIlxuICBcImx1YVwiXG4gIFwibHNcIlxuICBcIm1cIlxuICBcIm1kXCJcbiAgXCJtbFwiXG4gIFwibWxpXCJcbiAgXCJtbVwiXG4gIFwibW9jaGlcIlxuICBcIm1vbmtleVwiXG4gIFwibXVzdGFjaGVcIlxuICBcIm5peFwiXG4gIFwibmltXCJcbiAgXCJudXRcIlxuICBcInBocFwiLCBcInBocDVcIlxuICBcInBsXCJcbiAgXCJweVwiXG4gIFwiclwiXG4gIFwicmJcIlxuICBcInJrdFwiXG4gIFwicnNcIlxuICBcInNhc3NcIlxuICBcInNjYWxhXCJcbiAgXCJzY3NzXCJcbiAgXCJzdHlsXCJcbiAgXCJzdmdcIlxuICBcInN3aWZ0XCJcbiAgXCJ0c1wiXG4gIFwidHRzbHVhXCJcbiAgXCJ2YlwiXG4gIFwidnVlXCJcbiAgXCJ4bWxcIlxuICBcInlhbWxcIlxuXVxuXG5wYWQgPSAobnVtLCB3KSAtPlxuICBudW0gPSAnJyArIG51bVxuICB3aGlsZSBudW0ubGVuZ3RoIDwgdyB0aGVuIG51bSA9ICcgJyArIG51bVxuICAnICcgKyBudW1cblxuYWRkQXR0cnMgPSAoc2Z4LCBhSW4sIGIpIC0+XG4gIGEgPSAoYUluW3NmeF0gPz0ge30pXG4gIGZvciBrLCB2IG9mIGJcbiAgICBhW2tdID89IDBcbiAgICBhW2tdICs9IHZcbiAgICBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmF0ZTogLT5cbiAgICB0cnlcbiAgICAgIEBnaXRpZ25vcmUgPSBwYXJzZXIuY29tcGlsZSBmcy5yZWFkRmlsZVN5bmMgXCIuZ2l0aWdub3JlXCIsIFwidXRmOFwiXG4gICAgY2F0Y2ggZVxuICAgICAgQGdpdGlnbm9yZSA9IG51bGxcbiAgICBAc3ViID0gYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ2xpbmUtY291bnQ6b3Blbic6ID0+IEBvcGVuKClcblxuICBvcGVuOiAtPlxuICAgIHRleHQgPSAnJ1xuICAgIGFkZCA9ICh0eHQpIC0+IHRleHQgKz0gKHR4dCA/ICcnKSArICdcXG4nXG5cbiAgICBwcmludFNlY3Rpb24gPSAodGl0bGUsIGRhdGEpIC0+XG4gICAgICBoZHIgPSAnXFxuJyArIHRpdGxlICsgJ1xcbidcbiAgICAgIGZvciBpIGluIFswLi4udGl0bGUubGVuZ3RoXSB0aGVuIGhkciArPSAnLSdcbiAgICAgIGFkZCBoZHJcblxuICAgICAgbWF4UyA9IG1heEMgPSBtYXhUID0gMFxuICAgICAgZm9yIGxhYmVsLCBjIG9mIGRhdGFcbiAgICAgICAgbWF4UyA9IE1hdGgubWF4IG1heFMsIGMuc291cmNlXG4gICAgICAgIG1heEMgPSBNYXRoLm1heCBtYXhDLCBjLmNvbW1lbnRcbiAgICAgICAgbWF4VCA9IE1hdGgubWF4IG1heFQsIGMudG90YWxcbiAgICAgICAgd3MgPSAoJycgKyBtYXhTKS5sZW5ndGggKyAxXG4gICAgICAgIHdjID0gKCcnICsgbWF4QykubGVuZ3RoICsgMVxuICAgICAgICB3dCA9ICgnJyArIG1heFQpLmxlbmd0aCArIDFcblxuICAgICAgbGluZXMgPSAoW2xhYmVsLCBjXSBmb3IgbGFiZWwsIGMgb2YgZGF0YSlcbiAgICAgIGxpbmVzLnNvcnQoKVxuICAgICAgZm9yIGxpbmUgaW4gbGluZXNcbiAgICAgICAgW2xhYmVsLCBjXSA9IGxpbmVcbiAgICAgICAgYWRkIHBhZChjLnNvdXJjZSwgd3MpICsgcGFkKGMuY29tbWVudCwgd2MpICsgcGFkKGMudG90YWwsIHd0KSArICcgICcgKyBsYWJlbFxuICAgICAgbnVsbFxuXG4gICAgcm9vdERpclBhdGggPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5nZXRQYXRoKClcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBlZGl0b3IgYW5kIGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHJvb3REaXJQYXRoID0gcGF0aC5kaXJuYW1lKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICBjb25zb2xlLmxvZyByb290RGlyUGF0aFxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignbGluZS1jb3VudC50eHQnKS50aGVuIChlZGl0b3IpID0+XG4gICAgICBmaWxlcyAgICA9IHt9XG4gICAgICB0eXBlRGF0YSA9IHt9XG4gICAgICBkaXJzICAgICA9IHt9XG4gICAgICB0b3RhbCAgICA9IHt9XG5cbiAgICAgIGZpbGV3YWxrZXIocm9vdERpclBhdGgsIG1heFBlbmRpbmc6IDQpLm9uKFwiZmlsZVwiLCAocGF0aCwgc3RhdHMsIGFic1BhdGgpID0+XG4gICAgICAgICAgc2Z4TWF0Y2ggPSAvXFwuKFteXFwuXSspJC8uZXhlYyBwYXRoXG4gICAgICAgICAgaWYgc2Z4TWF0Y2ggYW5kXG4gICAgICAgICAgICAgIChzZnggPSBzZnhNYXRjaFsxXSkgaW4gc3VmZml4ZXMgYW5kXG4gICAgICAgICAgICAgIHBhdGguaW5kZXhPZigndmVuZG9yJykgaXMgLTEgYW5kXG4gICAgICAgICAgICAgIHBhdGguaW5kZXhPZignbm9kZV9tb2R1bGVzJykgaXMgLTEgYW5kXG4gICAgICAgICAgICAgIHBhdGguaW5kZXhPZignYm93ZXJfY29tcG9uZW50cycpIGlzIC0xIGFuZFxuICAgICAgICAgICAgICAobm90IEBnaXRpZ25vcmUgb3IgQGdpdGlnbm9yZS5hY2NlcHRzIHBhdGgpXG5cbiAgICAgICAgICAgIGNvZGUgPSBmcy5yZWFkRmlsZVN5bmMgYWJzUGF0aCwgJ3V0ZjgnXG4gICAgICAgICAgICBjb2RlID0gY29kZS5yZXBsYWNlIC9cXHIvZywgJydcblxuICAgICAgICAgICAgI2hhY2sgdG8gbWFrZSBzbG9jIGNvdW50IHR0c2x1YSBhcyBsdWFcbiAgICAgICAgICAgIHR5cGUgPSBzZnhcbiAgICAgICAgICAgIGlmIHR5cGUgPT0gJ3R0c2x1YSdcbiAgICAgICAgICAgICAgdHlwZSA9ICdsdWEnXG5cbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICBjb3VudHMgPSBzbG9jIGNvZGUsIHR5cGVcbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgYWRkICdXYXJuaW5nOiAnICsgZS5tZXNzYWdlXG4gICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICBkaXJQYXJ0cyA9IHBhdGguc3BsaXQgJy8nXG4gICAgICAgICAgICBkaXIgPSAnJ1xuICAgICAgICAgICAgZm9yIGRpclBhcnQsIGlkeCBpbiBkaXJQYXJ0c1xuICAgICAgICAgICAgICBpZiBpZHggaXMgZGlyUGFydHMubGVuZ3RoLTEgdGhlbiBicmVha1xuICAgICAgICAgICAgICBkaXIgKz0gZGlyUGFydFxuICAgICAgICAgICAgICBhZGRBdHRycyBkaXIsIGRpcnMsIGNvdW50c1xuICAgICAgICAgICAgICBkaXIgKz0gJy8nXG4gICAgICAgICAgICBmaWxlc1twYXRoXSA9IGNvdW50c1xuICAgICAgICAgICAgYWRkQXR0cnMgc2Z4LCB0eXBlRGF0YSwgY291bnRzXG4gICAgICAgICAgICBhZGRBdHRycyAgJycsIHRvdGFsLCAgICBjb3VudHNcblxuICAgICAgICApLm9uKFwiZXJyb3JcIiwgKGVycikgLT5cbiAgICAgICAgICBhZGQgZXJyLm1lc3NhZ2VcblxuICAgICAgICApLm9uKFwiZG9uZVwiLCAtPlxuICAgICAgICAgIGFkZCAnXFxuTGluZSBjb3VudHMgZm9yIHByb2plY3QgJyArIHJvb3REaXJQYXRoICsgJy4nXG4gICAgICAgICAgYWRkICdHZW5lcmF0ZWQgYnkgdGhlIEF0b20gZWRpdG9yIHBhY2thZ2UgTGluZS1Db3VudCBvbiAnICtcbiAgICAgICAgICAgICAgbW9tZW50KCkuZm9ybWF0ICdNTU1NIEQgWVlZWSBIOm1tLidcbiAgICAgICAgICBhZGQgJ0NvdW50cyBhcmUgaW4gb3JkZXIgb2Ygc291cmNlLCBjb21tZW50cywgYW5kIHRvdGFsLidcblxuICAgICAgICAgIHByaW50U2VjdGlvbiAnRmlsZXMnLCAgICAgICBmaWxlc1xuICAgICAgICAgIHByaW50U2VjdGlvbiAnRGlyZWN0b3JpZXMnLCBkaXJzXG4gICAgICAgICAgcHJpbnRTZWN0aW9uICdUeXBlcycsICAgICAgIHR5cGVEYXRhXG4gICAgICAgICAgcHJpbnRTZWN0aW9uICdUb3RhbCcsICAgICAgIHRvdGFsXG5cbiAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCB0ZXh0XG5cbiAgICAgICAgKS53YWxrKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWIuZGlzcG9zZSgpXG5cblxuXG5gXG5gXG4iXX0=
