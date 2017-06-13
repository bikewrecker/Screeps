var roleBuilder = require('role.builder');
module.exports = {
run: function(creep) {

 if(creep.room.name != creep.memory.homeRoom && creep.memory.role == 'repairer') {
   creep.moveTo(Game.flags[creep.room.name + 'Exit']);
 } else {
     creep.work();
     
     if(creep.memory.working == true) {
         var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_RAMPART && s.structureType != STRUCTURE_WALL});
          if(structure != undefined) {
              if(creep.repair(structure) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(structure);
              } else {
                  creep.repair(structure)
              }
          } else {
              roleBuilder.run(creep);
          }
     } else { //working == false
          var container = creep.room.storage;
         if(container != undefined && container.store[RESOURCE_ENERGY] > 0) {
             creep.getEnergyFromStorage();
         } else {
             var cont = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 10})
             if(cont != undefined){
                  creep.getEnergyFromContainer();
              } else {
                 creep.getEnergyFromSource();
              }
         }
      }
    }
  }
};