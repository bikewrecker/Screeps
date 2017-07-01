var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHarvester = require('role.harvester');
var roleMobileUpgrader = require('role.mobileUpgrader');
var roleLorry = require('role.lorry');
module.exports = {
run: function(creep) {
  roleHarvester.run(creep);/*
  if(creep.memory.renewTimer != undefined && creep.memory.renewTimer > 0) {
    creep.renewSelf();
    creep.memory.renewTimer--;
  } else {
    creep.work();
    if(creep.memory.target == undefined){
      creep.memory.target = 'W78N23';
    }
    if(creep.memory.working == true) {
      if(creep.room.name != creep.memory.target) {
        creep.moveTo(Game.flags[creep.memory.target]);
      }
      //roleMobileUpgrader.run(creep);
      roleBuilder.run(creep);
    } else { //working == false
        if(creep.room.name != 'W78N24') {
          creep.moveTo(Game.flags[creep.room.name + 'Exit']);
        } else {
          creep.getEnergyFromContainer();
        }
        //creep.getEnergyFromContainer();
    }

    var spawner = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
    if(creep.ticksToLive < 500 && spawner != undefined){
        creep.memory.renewTimer = 70;
    }
  }

/*
  if(creep.memory.traveled == undefined){
    creep.memory.traveled = false;
  }

  if(!creep.memory.traveled){
    if(creep.memory.way1 == undefined) {
      creep.memory.way1 = true;
    }
    if(creep.memory.way2==undefined) {
      creep.memory.way2 = true;
    }
    if(creep.memory.way1){
      creep.moveTo(Game.flags.waypoint);
      if(creep.pos.isEqualTo(Game.flags.waypoint)) {
        creep.memory.way1 = false;
      }
    } else{
      if(creep.memory.way2) {
        creep.moveTo(Game.flags.waypoint2);
        if(creep.pos.isEqualTo(Game.flags.waypoint2)) {
          creep.memory.way2 = false;
        }
      }

      if(!creep.memory.way2) {
        creep.moveTo(Game.flags.waypoint3);
      }
    }
    if(creep.pos.isEqualTo(Game.flags.waypoint3)){
      creep.memory.traveled = true;
      creep.memory.homeRoom = creep.memory.target;
      creep.memory.target = 'W78N23';
    }
  } 
  
      if(creep.memory.renewTimer > 0){
        if(creep.room.name != creep.memory.homeRoom) {
          creep.moveTo(Game.flags[creep.room.name + 'Exit']);
        } else {
            creep.renewSelf();
            creep.memory.renewTimer--;
          }
      }
      if(creep.memory.working == true) {
        if(creep.room.name != creep.memory.homeRoom) {
          creep.moveTo(Game.flags[creep.room.name + 'Exit']);
        } else {
          
            roleMobileUpgrader.run(creep);
            // roleLorry.run(creep);
        }
      } else { //working == false
        if(creep.room.name != creep.memory.target) {
          creep.moveTo(Game.flags[creep.memory.target]);
        } else {
          /*
          let store = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_STORAGE})[0];
          if(store != undefined) {
            if(creep.withdraw(store) == ERR_NOT_IN_RANGE) {
              creep.moveTo(store);
            }
          } else {
            
            creep.checkGround(2);
            creep.getEnergyFromSource();

          //}
        }
      var spawner = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
      if(creep.ticksToLive < 500 && spawner != undefined){
          creep.memory.renewTimer = 70;
      }
    }
  }
  */
}
};