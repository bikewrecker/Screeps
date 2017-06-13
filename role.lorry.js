module.exports = {
    run: function(creep) {
       creep.work();
       if(creep.memory.working == true) {
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
           if(structure == undefined) {
               structure = creep.room.storage;
           }
           if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(structure);
           } else {
               creep.transfer(structure, RESOURCE_ENERGY);
           }
       } else {//working = false
            creep.getEnergyFromContainer();
            creep.checkGround(2);
        }   
    }
};