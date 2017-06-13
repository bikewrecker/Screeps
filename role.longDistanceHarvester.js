var roleBuilder = require('role.builder');
module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
          var construct = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
          //console.log(creep.name + " " + construct);
          if(construct != undefined) {
              if(creep.build(construct) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(construct);
              } else {
                  creep.build(construct);
              }
          } else {
             if(creep.room.name != creep.memory.homeRoom) {
                  var fix = creep.pos.findInRange(FIND_STRUCTURES, 2, {filter: f => f.hits < f.hitsMax})[0];
                  if(fix != undefined) {
                      if(creep.repair(fix) == ERR_NOT_IN_RANGE){
                          creep.moveTo(fix);
                      } else {
                          creep.repair(fix);
                      }
                  } else {
                      creep.moveTo(Game.flags[creep.room.name + 'Exit']);
                  }
             } else {
                 var structure = undefined;
                 structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_LINK && s.store != s.storeCapacity)});
                 if(structure == undefined){
                      structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE)});
                 } if(structure == undefined){ 
                     structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
                 } if(structure == undefined) {
                     roleBuilder.run(creep);
                 } if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(structure, {reusePath:50});
                 } else {
                     creep.transfer(structure, RESOURCE_ENERGY);
                 }
             }
         }
       } else { // working == false;
        // if(creep.name == 'Jasmine') {
        //   console.log(creep.room.name);
        // }
           if(creep.room.name == creep.memory.target) {
            creep.getEnergyFromSource();
            creep.checkGround(2);
           } else {
             creep.moveTo(Game.flags[creep.memory.target], {reusePath:50});
           }
       }
    }
};