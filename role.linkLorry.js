module.exports = {
    run: function(creep) {
    
       creep.work();

       if(creep.memory.working == true) {
          var structure  = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_LINK});
           if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(structure);
           } else {
               creep.transfer(structure, RESOURCE_ENERGY);
           }
       } else { // working == false
            creep.checkGround(2);    
            creep.getEnergyFromStorage();
       }
       
    }
};