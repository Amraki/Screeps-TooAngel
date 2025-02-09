'use strict';

var helper = require('helper');

function getOppositeDirection(direction) {
  console.log('getOppositeDirection typeof: ' + typeof direction);
  return ((direction + 3) % 8) + 1;
}

Creep.prototype.handle = function() {
  if (this.spawning) {
    return;
  }

  let role = this.memory.role;
  if (!role) {
    this.log('Creep role not defined for: ' + this.id + ' ' + this.name.split('-')[0].replace(/[0-9]/g, ''));
    this.suicide();
    return;
  }

  try {
    var unit = require('creep_' + role);

    if (unit.stayInRoom) {
      if (this.stayInRoom()) {
        return;
      }
    }

    // TODO this happens when the creep is not on the path (maybe pathPos check will solve)
    if (unit.buildRoad) {
      if (this.memory.routing && !this.memory.routing.reached && this.memory.routing.pathPos >= 0) {
        this.buildRoad();
      }
    }

    if (!this.memory.boosted) {
      if (this.boost()) {
        return true;
      }
    }

    if (unit.action) {
      this.initRouting();

      if (this.memory.routing && this.memory.routing.reached) {
        if (this.room.name == this.memory.base || !Room.isRoomUnderAttack(this.room.name)) {
          // TODO maybe rename action to ... something better
          //      this.say('Action');
          return unit.action(this);
        }
      }

      if (this.followPath(unit.action)) {
        return true;
      }
    }

    //    if (this.memory.role != 'defendranged' && this.memory.role != 'repairer' && this.memory.role != 'scout' && this.memory.role != 'scoutnextroom' && this.memory.role != 'nextroomer' && this.memory.role != 'builder') {
    //      this.log('After followPath');
    //    }

    if (unit.execute) {
      unit.execute(this);
      // TODO this is very old, can be removed?
    } else {
      this.log('Old module execution !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
      unit(this);
    }

  } catch (err) {
    let message = 'Executing creep role failed: ' +
      this.room.name + ' ' +
      this.name + ' ' +
      this.id + ' ' +
      JSON.stringify(this.pos) + ' ' +
      err;
    if (err !== null) {
      message += '\n' + err.stack;
    }

    this.log(message);
    Game.notify(message, 30);
  }
};

Creep.prototype.log = function(message, level) {
  if (!level || level != 'DEBUG') {
    //     console.log(`<font color=red>${this.room.name.rpad(' ', 6)}</font>`, `<font color=green>${this.name.rpad(' ', 20)}</font>`, message);
    console.log(`${this.room.name.rpad(' ', 6)} ${this.name.rpad(' ', 20)} ${message}`);
  }
};

Creep.prototype.getEnergyFromStructure = function() {
  if (this.carry.energy == this.carryCapacity) {
    return false;
  }
  var area = this.room.lookForAtArea(
    'structure',
    Math.max(1, this.pos.y - 1),
    Math.max(1, this.pos.x - 1),
    Math.min(48, this.pos.y + 1),
    Math.min(48, this.pos.x + 1)
  );
  for (var y in area) {
    for (var x in area[y]) {
      if (area[y][x].length === 0) {
        continue;
      }
      for (var i in area[y][x]) {
        if (area[y][x][i].structureType == STRUCTURE_EXTENSION ||
          area[y][x][i].structureType == STRUCTURE_SPAWN) {
          area[y][x][i].transferEnergy(this);
          return true;
        }
      }
    }
  }
};

Creep.prototype.stayInRoom = function() {
  if (this.room.name == this.memory.base) {
    return false;
  }

  var exitDir = Game.map.findExit(this.room, this.memory.base);
  var exit = this.pos.findClosestByRange(exitDir);
  this.moveTo(exit);
  return true;
};

Creep.prototype.buildRoad = function() {
  // TODO as creep variable
  if (this.memory.role != 'carry' && this.memory.role != 'harvester') {
    this.getEnergyFromStructure();
  }

  if (this.carry.energy === 0) {
    return false;
  }

  var i;

  if (this.room.controller && !this.room.controller.my && this.room.controller.owner) {
    return false;
  }

  if (this.pos.x === 0 ||
    this.pos.x == 49 ||
    this.pos.y === 0 ||
    this.pos.y == 49
  ) {
    return true;
  }

  var structures = this.pos.findInRange(FIND_STRUCTURES, 3, {
    filter: function(object) {
      if (object.structureType != STRUCTURE_ROAD) {
        return false;
      }
      if (object.hits > 0.8 * object.hitsMax) {
        return false;
      }
      return true;
    }
  });
  if (structures.length > 0) {
    this.repair(structures[0]);
    return true;
  }

  let creep = this;
  let buildableRoads = function(object) {
    if (object.structureType != STRUCTURE_ROAD) {
      return false;
    }
    return creep.pos.getRangeTo(object.pos.x, object.pos.y) < 4;
  };

  let constructionSites = _.filter(this.room.memory.constructionSites, buildableRoads);

  if (constructionSites.length > 0) {
    this.build(constructionSites[0]);
    return true;
  }

  constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: function(object) {
      if (object.structureType == STRUCTURE_ROAD) {
        return true;
      }
      return false;
    }
  });
  if (constructionSites.length <= config.buildRoad.maxConstructionSitesRoom && Object.keys(Game.constructionSites).length < config.buildRoad.maxConstructionSitesTotal && this.pos.inPath()) {
    let returnCode = this.pos.createConstructionSite(STRUCTURE_ROAD);
    if (returnCode == OK) {
      return true;
    }
    if (returnCode != OK && returnCode != ERR_INVALID_TARGET && returnCode != ERR_FULL) {
      this.log('Road: ' + this.pos + ' ' + returnCode + ' pos: ' + this.pos);
    }
    return false;
  }
  return false;
};

Creep.prototype.moveForce = function(target, forward) {
  var positionId = this.getPositionInPath(target);
  var nextPosition;
  if (forward) {
    nextPosition = this.memory.path[this.room.name][(+positionId + 1)];
  } else {
    nextPosition = this.memory.path[this.room.name][(+positionId - 1)];
  }

  var lastPos = this.memory.lastPosition;
  if (this.memory.lastPosition &&
    this.pos.isEqualTo(new RoomPosition(
      lastPos.x,
      lastPos.y,
      lastPos.roomName))) {
    var pos = new RoomPosition(nextPosition.x, nextPosition.y, this.room.name);
    var creeps = pos.lookFor('creep');
    if (0 < creeps.length) {
      this.moveCreep(pos, getOppositeDirection(nextPosition.direction));
    }
  }

  if (this.fatigue === 0) {
    if (forward) {
      if (!nextPosition) {
        return true;
      }
      this.move(nextPosition.direction);
    } else {
      let position = this.memory.path[this.room.name][(+positionId)];
      this.move(getOppositeDirection(position.direction));
    }
    this.memory.lastPosition = this.pos;
  }
  return;
};

Creep.prototype.getPositionInPath = function(target) {
  if (!this.memory.path) {
    this.memory.path = {};
  }
  if (!this.memory.path[this.room.name]) {
    var start = this.pos;
    var end = new RoomPosition(target.x, target.y, target.roomName);

    this.memory.path[this.room.name] = this.room.findPath(start, end, {
      ignoreCreeps: true,
      costCallback: helper.getAvoids(this.room, {
        controller: true,
        power: true,
        filler: true
      })
    });
  }
  var path = this.memory.path[this.room.name];

  for (var index in path) {
    if (this.pos.isEqualTo(path[index].x, path[index].y)) {
      return index;
    }
  }
  return -1;
};

Creep.prototype.killPrevious = function() {
  var creep = this;
  var previous = this.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function(object) {
      if (object.id == creep.id) {
        return false;
      }
      if (object.memory.role != creep.memory.role) {
        return false;
      }
      if (object.memory.role != creep.memory.role) {
        return false;
      }
      return true;
    }
  });
  if (previous === null) {
    return false;
  }

  var range = this.pos.getRangeTo(previous);
  if (range == 1) {
    if (this.ticksToLive < previous.ticksToLive) {
      this.log('kill me');
      this.suicide();
    } else {
      this.log('kill other');
      previous.suicide();
    }
    this.log(
      'Kill previous',
      this.memory.role, range,
      JSON.stringify(previous)
    );
    //    throw Error();
  }
};

Creep.prototype.spawnReplacement = function(maxOfRole) {
  if (this.memory.nextSpawn) {


    //    this.say('sr: ' + (this.ticksToLive - this.memory.nextSpawn));
    if (this.ticksToLive == this.memory.nextSpawn) {
      if (maxOfRole) {
        let creep = this;
        let creepOfRole = creep.room.find(FIND_MY_CREEPS, {
          filter: function(object) {
            if (object.memory.role == creep.memory.role) {
              return true;
            }
            return false;
          }
        });
        if (maxOfRole.length > maxOfRole) {
          return false;
        }

      }

      let routing = {};
      if (this.memory.routing) {
        routing = JSON.parse(JSON.stringify(this.memory.routing));
      }
      routing.reached = false;
      routing.routePos = 0;
      routing.pathPos = 0;
      var spawn = {
        role: this.memory.role,
        source: this.memory.source,
        target: this.memory.target,
        target_id: this.memory.target_id,
        heal: this.memory.heal,
        level: this.memory.level,
        routing: routing
      };
      if (spawn.role == 'sourcer') {
        this.log('Spawn replacement from ' + this.memory.base + ' ' + JSON.stringify(spawn));
      }
      Game.rooms[this.memory.base].memory.queue.push(spawn);
    }
  }
};

Creep.prototype.setNextSpawn = function() {
  if (!this.memory.nextSpawn) {
    this.memory.nextSpawn = Game.time - this.memory.born - config.creep.renewOffset;
    //    this.killPrevious();

    if (this.ticksToLive < this.memory.nextSpawn) {
      var spawn = {
        role: this.memory.role,
        source: this.memory.source
      };
      Game.rooms[this.memory.base].memory.queue.push(spawn);
    }
  }
};
