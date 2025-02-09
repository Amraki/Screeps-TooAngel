module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    screeps: {
      options: {
        email: process.env.email,
        password: process.env.password,
        branch: 'default',
        ptr: false
      },
      dist: {
        src: ['dist/*.js']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/*.js'],
      options: {
        globals: {
          Memory: false,
          Game: false,
          console: false,
          require: false,
          Creep: false,
          RoomPosition: false,
          FIND_MY_CREEPS: false,
          FIND_MY_CONSTRUCTION_SITES: false,
          OK: false,
          RESOURCE_ENERGY: false,
          ERR_NOT_FOUND: false,
          FIND_DROPPED_ENERGY: false,
          FIND_MY_STRUCTURES: false,
          module: false,
          FIND_CONSTRUCTION_SITES: false,
          STRUCTURE_LINK: false,
          FIND_SOURCES: false,
          Room: false,
          _: false,
          ERR_TIRED: false,
          FIND_HOSTILE_CREEPS: false,
          STRUCTURE_STORAGE: false,
          FIND_SOURCES_ACTIVE: false,
          FIND_STRUCTURES: false,
          ERR_NO_PATH: false,
          STRUCTURE_ROAD: false,
          COLOR_ORANGE: false,
          ERR_NAME_EXISTS: false,
          COLOR_GREEN: false,
          COLOR_BLUE: false,
          COLOR_RED: false,
          FIND_FLAGS: false,
          MOVE: false,
          RANGED_ATTACK: false,
          HEAL: false,
          STRUCTURE_RAMPART: false,
          STRUCTURE_WALL: false,
          FIND_HOSTILE_STRUCTURES: false,
          STRUCTURE_CONTROLLER: false,
          ATTACK: false,
          CARRY: false,
          WORK: false,
          ERR_FULL: false,
          FIND_DROPPED_RESOURCES: false,
          RESOURCE_POWER: false,
          CLAIM: false,
          FIND_EXIT: false,
          FIND_EXIT_TOP: false,
          FIND_EXIT_RIGHT: false,
          FIND_EXIT_BOTTOM: false,
          FIND_EXIT_LEFT: false,
          FIND_MY_SPAWNS: false,
          STRUCTURE_POWER_SPAWN: false,
          COLOR_WHITE: false,
          COLOR_YELLOW: false,
          COLOR_CYAN: false,
          COLOR_BROWN: false,
          COLOR_GREY: false,
          STRUCTURE_TOWER: false,
          STRUCTURE_EXTENSION: false,
          STRUCTURE_SPAWN: false,
          ERR_INVALID_TARGET: false,
          PathFinder: false,
          ERR_RCL_NOT_ENOUGH: false,
          FIND_MINERALS: false,
          STRUCTURE_EXTRACTOR: false,
          TOP: false,
          RIGHT: false,
          BOTTOM: false,
          LEFT: false,
          BOTTOM_RIGHT: false,
          BOTTOM_LEFT: false,
          TOP_RIGHT: false,
          TOP_LEFT: false,
          STRUCTURE_OBSERVER: false,
          STRUCTURE_LAB: false,
          STRUCTURE_CONTAINER: false,
          STRUCTURE_TERMINAL: false,
          ERR_NOT_ENOUGH_RESOURCES: false,
          COLOR_PURPLE: false,
          LOOK_STRUCTURES: false,
          STRUCTURE_NUKER: false,
          RESOURCE_ZYNTHIUM: false,
          RESOURCE_KEANIUM: false,
          RESOURCE_UTRIUM: false,
          RESOURCE_LEMERGIUM: false,
          RESOURCE_ZYNTHIUM_KEANITE: false,
          RESOURCE_UTRIUM_LEMERGITE: false,
          RESOURCE_GHODIUM: false,
          StructureStorage: false,
          StructureLab: false,
          StructureTerminal: false,
          BODYPART_COST: false,
          CREEP_CLAIM_LIFE_TIME: false,
          CREEP_LIFE_TIME: false,
          CONTROLLER_STRUCTURES: false,
          FIND_NUKES: false,
          LOOK_CONSTRUCTION_SITES: false,
          MAX_CREEP_SIZE: false,
          RESOURCE_OXYGEN: false,
          RESOURCE_UTRIUM_OXIDE: false,
          RESOURCE_HYDROGEN: false,
          RESOURCE_LEMERGIUM_HYDRIDE: false,
          RESOURCE_CATALYST: false,
          BOOSTS: false,
          REACTIONS: false,
          ERR_NOT_IN_RANGE: false,
          ERR_INVALID_ARGS: false,
          LOOK_TERRAIN: false,
          ERR_NO_BODYPART: false,
          Source: false,
          LOOK_ENERGY: false,
          ORDER_BUY: false,
          FIND_CREEPS: false,
          LOOK_SOURCES: false,
          CONTROLLER_DOWNGRADE: false,
          ConstructionSite: false,
          OBSERVER_RANGE: false,
          STRUCTURE_POWER_BANK: false,
          MINIFIED: false,
          global: false,
          config: false,
          brain: false
        },
        node: true,
        esnext: true
      }
    },
    jsbeautifier: {
      files: ["Gruntfile.js", "src/*.js"],
      options: {
        js: {
          indentSize: 2
        }
      }
    },
    mochaTest: {
      src: ['test/**/*.js']
    },
    jscs: {
      src: "src/*.js",
      config: '.jscsrc'
    },
    clean: ['dist/'],
    uglify: {
      my_target: {
        options: {
          compress: {
            global_defs: {
              'MINIFIED': true
            },
            dead_code: true
          }
        },
        files: {
          'dist/main.js': [
            'src/config.js',
            'src/config_brain_memory.js',
            'src/config_brain_nextroom.js',
            'src/config_brain_squadmanager.js',
            'src/config_creep.js',
            'src/config_creep_resources.js',
            'src/config_creep_fight.js',
            'src/config_creep_harvest.js',
            'src/config_creep_mineral.js',
            //            'src/config_creep_move.js',
            'src/config_creep_routing.js',
            //            'src/config_creep_startup_tasks.js',
            'src/config_roomPosition_structures.js',
            'src/config_room.js',
            'src/config_room_basebuilder.js',
            'src/config_room_controller.js',
            'src/config_room_defense.js',
            'src/config_room_market.js',
            'src/config_room_mineral.js',
            'src/config_room_not_mine.js',
            'src/config_room_external.js',
            'src/config_room_flags.js',
            'src/config_room_routing.js',
            'src/config_room_wallsetter.js',
            'src/config_string.js',
            'src/main.js'
          ]
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            '**',
            '!main.js',
            '!require.js',
            '!config.js',
            '!config_brain_memory.js',
            '!config_brain_nextroom.js',
            '!config_brain_squadmanager.js',
            '!config_creep.js',
            '!config_creep_resources.js',
            '!config_creep_fight.js',
            '!config_creep_harvest.js',
            '!config_creep_mineral.js',
            //            '!config_creep_move.js',
            '!config_creep_routing.js',
            //            '!config_creep_startup_tasks.js',
            '!config_roomPosition_structures.js',
            '!config_room.js',
            '!config_room_basebuilder.js',
            '!config_room_controller.js',
            '!config_room_defense.js',
            '!config_room_market.js',
            '!config_room_mineral.js',
            '!config_room_not_mine.js',
            '!config_room_external.js',
            '!config_room_flags.js',
            '!config_room_routing.js',
            '!config_room_wallsetter.js',
            '!config_string.js'
          ],
          dest: 'dist/',
        }, {
          expand: true,
          cwd: 'node_modules/screeps-profiler',
          src: ['screeps-profiler.js'],
          dest: 'dist/'
        }, {
          expand: true,
          cwd: 'screeps-elk/js',
          src: ['utils.logger.js'],
          dest: 'dist/'
        }]
      },
      uglify: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: [
            'main.js',
            'require.js',
            'config.js',
            'config_brain_memory.js',
            'config_brain_nextroom.js',
            'config_brain_squadmanager.js',
            'config_creep.js',
            'config_creep_resources.js',
            'config_creep_fight.js',
            'config_creep_harvest.js',
            'config_creep_mineral.js',
            //            'config_creep_move.js',
            'config_creep_routing.js',
            //            'config_creep_startup_tasks.js',
            'config_roomPosition_structures.js',
            'config_room.js',
            'config_room_basebuilder.js',
            'config_room_controller.js',
            'config_room_defense.js',
            'config_room_market.js',
            'config_room_mineral.js',
            'config_room_not_mine.js',
            'config_room_external.js',
            'config_room_flags.js',
            'config_room_routing.js',
            'config_room_wallsetter.js',
            'config_string.js'
          ],
          dest: 'dist/',
        }]
      }
    },

    sync: {
      main: {
        files: [],
        updateAndDelete: true,
        verbose: true,
        compareUsing: "md5"
      },
    }
  });

  grunt.registerTask('default', ['jshint', 'jsbeautifier', 'clean', 'copy', 'screeps']);
  grunt.registerTask('release', ['jshint', 'jsbeautifier', 'clean', 'uglify', 'copy:main', 'requireFile', 'sync']);
  grunt.registerTask('local', ['jshint', 'jsbeautifier', 'clean', 'copy:uglify', 'copy:main', 'sync']);
  grunt.registerTask('requireFile', 'Creates an empty file', function() {
    grunt.file.write('dist/require.js', '');
  });

};
