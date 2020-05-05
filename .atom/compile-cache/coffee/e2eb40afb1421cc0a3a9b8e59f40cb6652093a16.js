(function() {
  $(function() {
    var animate, bloom, camera, composer, container, distance, geometry, h, material, mesh, playing, renderPass, renderer, scene, shader, uniforms, w;
    container = document.getElementById('stage');
    w = container.offsetWidth || window.innerWidth;
    h = container.offsetHeight || window.innerHeight;
    w = 640;
    h = 380;
    distance = 1000;
    camera = new THREE.PerspectiveCamera(30, w / h, 1, 10000);
    camera.position.z = distance;
    scene = new THREE.Scene();
    geometry = new THREE.SphereGeometry(200, 40, 30);
    uniforms = {
      texture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('/images/0.png')
      }
    };
    shader = {
      vertexShader: 'varying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  vNormal = normalize( normalMatrix * normal );\n  vUv = uv;\n}',
      fragmentShader: 'uniform sampler2D texture;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main() {\n\n  vec3 diffuse = texture2D( texture, vUv ).xyz;\n  float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );\n  vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );\n  gl_FragColor = vec4( diffuse + atmosphere, 1.0 );\n}'
    };
    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 0.0);
    renderer.setSize(w, h);
    composer = new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloom = new THREE.BloomPass();
    bloom.renderToScreen = true;
    composer.addPass(bloom);
    container.appendChild(composer.renderTarget.domElement);
    playing = true;
    animate = function() {
      composer.render(0.1);
      mesh.rotation.y += 0.002;
      return setTimeout((function() {
        if (playing) {
          return requestAnimationFrame(animate);
        }
      }), 0);
    };
    return animate();
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYWltb3JyaXMvLmF0b20vcGFja2FnZXMvbGluZS1jb3VudC90ZXN0L2V4b3BsYW5ldHMvYXBwL2Fzc2V0cy9qYXZhc2NyaXB0cy90aHJlZV9ib290LmpzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtFQUFBLENBQUEsQ0FBRSxTQUFBO0FBQ0EsUUFBQTtJQUFBLFNBQUEsR0FBWSxRQUFRLENBQUMsY0FBVCxDQUF3QixPQUF4QjtJQUVaLENBQUEsR0FBSSxTQUFTLENBQUMsV0FBVixJQUF5QixNQUFNLENBQUM7SUFDcEMsQ0FBQSxHQUFJLFNBQVMsQ0FBQyxZQUFWLElBQTBCLE1BQU0sQ0FBQztJQUVyQyxDQUFBLEdBQUk7SUFDSixDQUFBLEdBQUk7SUFFSixRQUFBLEdBQVc7SUFFWCxNQUFBLEdBQVMsSUFBSSxLQUFLLENBQUMsaUJBQVYsQ0FBNEIsRUFBNUIsRUFBZ0MsQ0FBQSxHQUFJLENBQXBDLEVBQXVDLENBQXZDLEVBQTBDLEtBQTFDO0lBQ1QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFoQixHQUFvQjtJQUVwQixLQUFBLEdBQVEsSUFBSSxLQUFLLENBQUMsS0FBVixDQUFBO0lBRVIsUUFBQSxHQUFXLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FBeUIsR0FBekIsRUFBOEIsRUFBOUIsRUFBa0MsRUFBbEM7SUFFWCxRQUFBLEdBQVc7TUFBQSxPQUFBLEVBQVM7UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLEtBQUEsRUFBTyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQWpCLENBQTZCLGVBQTdCLENBQXBCO09BQVQ7O0lBRVgsTUFBQSxHQUNFO01BQUEsWUFBQSxFQUFjLHlNQUFkO01BVUEsY0FBQSxFQUFnQix5VUFWaEI7O0lBd0JGLFFBQUEsR0FBVyxJQUFJLEtBQUssQ0FBQyxjQUFWLENBQXlCO01BQ2xDLFFBQUEsRUFBVSxRQUR3QjtNQUVsQyxZQUFBLEVBQWMsTUFBTSxDQUFDLFlBRmE7TUFHbEMsY0FBQSxFQUFnQixNQUFNLENBQUMsY0FIVztLQUF6QjtJQU1YLElBQUEsR0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFWLENBQWUsUUFBZixFQUF5QixRQUF6QjtJQUVQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtJQUVBLFFBQUEsR0FBVyxJQUFJLEtBQUssQ0FBQyxhQUFWLENBQXdCO01BQUMsU0FBQSxFQUFXLElBQVo7S0FBeEI7SUFDWCxRQUFRLENBQUMsU0FBVCxHQUFxQjtJQUNyQixRQUFRLENBQUMsYUFBVCxDQUF1QixRQUF2QixFQUFpQyxHQUFqQztJQUNBLFFBQVEsQ0FBQyxPQUFULENBQWlCLENBQWpCLEVBQW9CLENBQXBCO0lBRUEsUUFBQSxHQUFXLElBQUksS0FBSyxDQUFDLGNBQVYsQ0FBeUIsUUFBekI7SUFDWCxVQUFBLEdBQWEsSUFBSSxLQUFLLENBQUMsVUFBVixDQUFxQixLQUFyQixFQUE0QixNQUE1QjtJQUViLFFBQVEsQ0FBQyxPQUFULENBQWlCLFVBQWpCO0lBRUEsS0FBQSxHQUFRLElBQUksS0FBSyxDQUFDLFNBQVYsQ0FBQTtJQUNSLEtBQUssQ0FBQyxjQUFOLEdBQXVCO0lBQ3ZCLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCO0lBSUEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUE1QztJQUdBLE9BQUEsR0FBVTtJQUVWLE9BQUEsR0FBVSxTQUFBO01BR1IsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEI7TUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQWQsSUFBbUI7YUFFbkIsVUFBQSxDQUFXLENBQUMsU0FBQTtRQUFHLElBQWlDLE9BQWpDO2lCQUFBLHFCQUFBLENBQXNCLE9BQXRCLEVBQUE7O01BQUgsQ0FBRCxDQUFYLEVBQTBELENBQTFEO0lBTlE7V0FRVixPQUFBLENBQUE7RUFwRkEsQ0FBRjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIz0gcmVxdWlyZSB0aHJlZVxuIz0gcmVxdWlyZV90cmVlIC4uLy4uLy4uL3ZlbmRvci9hc3NldHMvamF2YXNjcmlwdHMvc2hhZGVyc1xuIz0gcmVxdWlyZV90cmVlIC4uLy4uLy4uL3ZlbmRvci9hc3NldHMvamF2YXNjcmlwdHMvcG9zdHByb2Nlc3NpbmdcblxuJCAtPlxuICBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhZ2UnKVxuXG4gIHcgPSBjb250YWluZXIub2Zmc2V0V2lkdGggb3Igd2luZG93LmlubmVyV2lkdGhcbiAgaCA9IGNvbnRhaW5lci5vZmZzZXRIZWlnaHQgb3Igd2luZG93LmlubmVySGVpZ2h0XG5cbiAgdyA9IDY0MFxuICBoID0gMzgwXG5cbiAgZGlzdGFuY2UgPSAxMDAwXG5cbiAgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDMwLCB3IC8gaCwgMSwgMTAwMDApXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gZGlzdGFuY2VcblxuICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpXG5cbiAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoMjAwLCA0MCwgMzApXG5cbiAgdW5pZm9ybXMgPSB0ZXh0dXJlOiB7IHR5cGU6ICd0JywgdmFsdWU6IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy9pbWFnZXMvMC5wbmcnKX1cblxuICBzaGFkZXIgPVxuICAgIHZlcnRleFNoYWRlcjogJycnXG4gICAgICB2YXJ5aW5nIHZlYzMgdk5vcm1hbDtcbiAgICAgIHZhcnlpbmcgdmVjMiB2VXY7XG5cbiAgICAgIHZvaWQgbWFpbigpIHtcbiAgICAgICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCggcG9zaXRpb24sIDEuMCApO1xuICAgICAgICB2Tm9ybWFsID0gbm9ybWFsaXplKCBub3JtYWxNYXRyaXggKiBub3JtYWwgKTtcbiAgICAgICAgdlV2ID0gdXY7XG4gICAgICB9XG4gICAgJycnXG4gICAgZnJhZ21lbnRTaGFkZXI6ICcnJ1xuICAgICAgdW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcbiAgICAgIHZhcnlpbmcgdmVjMyB2Tm9ybWFsO1xuICAgICAgdmFyeWluZyB2ZWMyIHZVdjtcblxuICAgICAgdm9pZCBtYWluKCkge1xuXG4gICAgICAgIHZlYzMgZGlmZnVzZSA9IHRleHR1cmUyRCggdGV4dHVyZSwgdlV2ICkueHl6O1xuICAgICAgICBmbG9hdCBpbnRlbnNpdHkgPSAxLjA1IC0gZG90KCB2Tm9ybWFsLCB2ZWMzKCAwLjAsIDAuMCwgMS4wICkgKTtcbiAgICAgICAgdmVjMyBhdG1vc3BoZXJlID0gdmVjMyggMS4wLCAxLjAsIDEuMCApICogcG93KCBpbnRlbnNpdHksIDMuMCApO1xuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KCBkaWZmdXNlICsgYXRtb3NwaGVyZSwgMS4wICk7XG4gICAgICB9XG4gICAgJycnXG5cbiAgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICAgIHVuaWZvcm1zOiB1bmlmb3Jtc1xuICAgIHZlcnRleFNoYWRlcjogc2hhZGVyLnZlcnRleFNoYWRlclxuICAgIGZyYWdtZW50U2hhZGVyOiBzaGFkZXIuZnJhZ21lbnRTaGFkZXJcbiAgfSlcblxuICBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKVxuICAjIG1lc2gubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlXG4gIHNjZW5lLmFkZChtZXNoKVxuXG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2FudGlhbGlhczogdHJ1ZX0pXG4gIHJlbmRlcmVyLmF1dG9DbGVhciA9IHRydWVcbiAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDAwMDAwMCwgMC4wKVxuICByZW5kZXJlci5zZXRTaXplKHcsIGgpXG5cbiAgY29tcG9zZXIgPSBuZXcgVEhSRUUuRWZmZWN0Q29tcG9zZXIocmVuZGVyZXIpXG4gIHJlbmRlclBhc3MgPSBuZXcgVEhSRUUuUmVuZGVyUGFzcyhzY2VuZSwgY2FtZXJhKVxuICAjIHJlbmRlclBhc3MucmVuZGVyVG9TY3JlZW4gPSB0cnVlXG4gIGNvbXBvc2VyLmFkZFBhc3MocmVuZGVyUGFzcylcblxuICBibG9vbSA9IG5ldyBUSFJFRS5CbG9vbVBhc3MoKVxuICBibG9vbS5yZW5kZXJUb1NjcmVlbiA9IHRydWVcbiAgY29tcG9zZXIuYWRkUGFzcyhibG9vbSlcblxuICAjIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbXBvc2VyLnJlbmRlclRhcmdldC5kb21FbGVtZW50KVxuICAjIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KVxuXG4gIHBsYXlpbmcgPSB0cnVlXG5cbiAgYW5pbWF0ZSA9IC0+XG4gICAgIyByZW5kZXJlci5jbGVhcigpXG4gICAgIyByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSlcbiAgICBjb21wb3Nlci5yZW5kZXIoMC4xKVxuICAgIG1lc2gucm90YXRpb24ueSArPSAwLjAwMlxuXG4gICAgc2V0VGltZW91dCAoLT4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFuaW1hdGUgaWYgcGxheWluZyksIDBcblxuICBhbmltYXRlKClcblxuXG5cblxuXG5cbiJdfQ==
