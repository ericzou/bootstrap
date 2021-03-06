module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    modules: '', //to be filled in by find-modules task
    meta: {
      banner: 'angular.module("ui.bootstrap", [<%= modules %>]);'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'before-test test-run'
    },
    concat: {
      dist: {
        src: ['<banner>', 'src/*/*.js'],
        dest: 'dist/angular-ui-bootstrap.js' 
      }
    },
    html2js: {
      src: ['template/**/*.html']
    },
    jshint: {
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    }
  });

  //register before and after test tasks so we've don't have to change cli options on the goole's CI server
  grunt.registerTask('before-test', 'lint html2js');
  grunt.registerTask('after-test', 'find-modules concat');

  // Default task.
  grunt.registerTask('default', 'before-test test after-test');

  //Common ui.bootstrap module containing all modules
  grunt.registerTask('find-modules', 'Generate ui.bootstrap module depending on all existing directives', function() {
    var modules = [];
    grunt.file.expandDirs('src/*').forEach(function(dir) {
      var moduleName = dir.split("/")[1];
      modules.push('"ui.bootstrap.' + moduleName + '"');
    });
    grunt.config('modules', modules);
  });

  //Html templates to $templateCache for tests
  grunt.registerMultiTask('html2js', 'Generate js versions of html template', function() {
    //Put templates on ng's run function so they are global
    var TPL='angular.module("<%= file %>", []).run(function($templateCache){\n' +
      '  $templateCache.put("<%= file %>",\n    "<%= content %>");\n' +
      '});\n';
    var files = grunt._watch_changed_files || grunt.file.expand(this.data);
  
    function escapeContent(content) {
      return content.replace(/"/g, '\\"').replace(/\n/g, '" +\n    "').replace(/\r/g, '');
    }
    files.forEach(function(file) {
      grunt.file.write(file + ".js", grunt.template.process(TPL, {
        file: file,
        content: escapeContent(grunt.file.read(file))
      }));
    });
  });

  // Testacular configuration
  function runTestacular(command, options) {
    var testacularCmd = process.platform === 'win32' ? 'testacular.cmd' : 'testacular';
    var args = [command].concat(options);
    var done = grunt.task.current.async();
    var child = grunt.utils.spawn({
      cmd: testacularCmd,
      args: args
    }, function(err, result, code) {
      if (code) {
        done(false);
      } else {
        done();
      }
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }

  grunt.registerTask('test', 'run tests on single-run server', function() {
    var options = ['--single-run', '--no-auto-watch', '--log-level=warn'];
    if (process.env.TRAVIS) {
      options =  options.concat(['--browsers=Firefox']);
    } else {
      //Can augment options with command line arguments
      options =  options.concat(this.args);
    }
    runTestacular('start', options);
  });

  grunt.registerTask('server', 'start testacular server', function() {
    var options = ['--no-single-run', '--no-auto-watch'].concat(this.args);
    runTestacular('start', options);
  });

  grunt.registerTask('test-run', 'run tests against continuous testacular server', function() {
    var options = ['--single-run', '--no-auto-watch'].concat(this.args);
    runTestacular('run', options);
  });

  grunt.registerTask('test-watch', 'start testacular server, watch & execute tests', function() {
    var options = ['--no-single-run', '--auto-watch'].concat(this.args);
    runTestacular('start', options);
  });
};
