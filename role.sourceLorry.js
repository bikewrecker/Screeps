module.exports = {
    run: function(creep) {
    
       creep.work();
       
       //BEGIN REGULAR DIRECTION
       
       if(creep.memory.working == true) {
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
           //console.log(structure);
           if(structure != undefined){
               if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(structure);
               } else {
                   creep.transfer(structure, RESOURCE_ENERGY);
               }
           } else {
              creep.memory.working = false;
           }
       } else {
           creep.checkGround(2);
          creep.getEnergyFromStorage();
       }
    }
};