var roleBuilder = require('role.builder');
module.exports = {
run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
           var walls = creep.room.find(FIND_STRUCTURES, {filter: (w) => (w.structureType == STRUCTURE_WALL || w.structureType == STRUCTURE_RAMPART)});
           var target = undefined;
           
           for(let percentage = .00001; percentage < 1; percentage += .00001) {
               
               for(let wall of walls){
                   if(wall.structureType == STRUCTURE_WALL){
                       if(wall.hits/wall.hitsMax < percentage) {
                           target = wall;
                           break;
                       }
                   } else {
                       if(wall.hits/wall.hitsMax < percentage*10) {
                           target = wall;
                           break;
                       }
                   }
               }
               if(target != undefined){
                   break;
               }
           }
           if(creep.repair(target) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target);
           } else {
               creep.repair(target);
           }
           
       } else {
            creep.getEnergyFromContainer();
        }
    }
};