'use strict';

var helper = require('helper');

module.exports.get_part_config = function(room, energy, heal) {
  var parts = [MOVE, RANGED_ATTACK, MOVE, HEAL];
  return room.get_part_config(energy, parts);
};

module.exports.energyRequired = function(room) {
  return Math.min(room.energyCapacityAvailable, 3430);
};

module.exports.energyBuild = function(room) {
  return Math.min(room.energyCapacityAvailable, 3430);
};

function heal(creep) {
  if (creep.hits < 500) {
    var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter: function(object) {
        return object.hits > 100;
      }
    });
    var range = creep.pos.getRangeTo(target);
    creep.heal(creep);
    if (range <= 3) {
      var direction = creep.pos.getDirectionTo(target);
      direction = (direction + 3) % 8 + 1;
      var pos = creep.pos.getAdjacentPosition(direction);
      var terrain = pos.lookFor(LOOK_TERRAIN)[0];
      if (terrain == 'wall') {
        direction = (Math.random() * 8) + 1;
      }
      creep.move(direction);
    } else if (range >= 5) {
      creep.moveTo(target);
    }
    creep.rangedAttack(target);
    return true;
  }
  return false;
}

function attack(creep) {
  var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  var range;
  var direction;

  if (creep.hits < creep.hitsMax) {
    creep.heal(creep);
    creep.rangedAttack(target);
    range = creep.pos.getRangeTo(target);
    if (range >= 5) {
      creep.moveTo(target);
    }
    if (range < 3) {
      direction = creep.pos.getDirectionTo(target);
      creep.move((direction + 4) % 8);
    }
    return true;
  } else {
    var my_creeps = creep.pos.findInRange(FIND_MY_CREEPS, 1, {
      filter: function(object) {
        return object.hits < object.hitsMax;
      }
    });
    if (my_creeps.length > 0) {
      creep.heal(my_creeps[0]);
    }
  }

  if (!target || target === null) {
    var my_creep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: function(object) {
        if (object.hits == object.hitsMax) {
          return false;
        }
        if (object.memory.role == 'atkeeper') {
          return false;
        }
        return true;
      }
    });
    if (my_creep !== null) {
      creep.moveTo(my_creep);
      creep.rangedHeal(my_creep);
      return true;
    }

    var source_keepers = creep.room.find(FIND_STRUCTURES, {
      filter: function(object) {
        if (!object.owner) {
          return false;
        }
        return object.owner.username == 'Source Keeper';
      }
    });
    var min_spawn_time = 500;
    var min_source_keeper = null;
    for (var i in source_keepers) {
      var source_keeper = source_keepers[i];
      if (source_keeper.ticksToSpawn < min_spawn_time) {
        min_spawn_time = source_keeper.ticksToSpawn;
        min_source_keeper = source_keeper;
      }
    }

    if (min_source_keeper === null) {
      creep.moveRandom();
    } else {
      range = creep.pos.getRangeTo(min_source_keeper);
      if (range > 3) {
        creep.moveTo(min_source_keeper);
      }
    }
    return true;
  }
  range = creep.pos.getRangeTo(target);
  if (range > 3) {
    creep.moveTo(target);
  }

  creep.rangedAttack(target);
  if (range < 3) {
    direction = creep.pos.getDirectionTo(target);
    creep.move((direction + 4) % 8);
  }
  return true;
}

function run(creep) {
  creep.setNextSpawn();

  if (heal(creep)) {
    return true;
  }

  if (attack(creep)) {
    return true;
  }
  creep.heal(creep);
}

module.exports.action = function(creep) {
  //TODO Untested
  creep.spawnReplacement();
  run(creep);
  return true;
};

module.exports.execute = function(creep) {
  creep.log('Execute!!!');
};
