module.exports = {
    run: function(creep) {
        
        if(creep.memory.containerID == undefined) {
            var containers = creep.room.find(FIND_STRUCTURES, {filter: s=> s.structureType == STRUCTURE_CONTAINER});
            for(let container in containers) {
                if(!(_.some(creep.room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == 'lorry' && c.memory.containerID == containers[container].id})))){
                    creep.memory.containerID = containers[container].id;
                    break;
                }
            }
        }

       creep.work();
       
       if(creep.memory.working == true) {
           
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
           //console.log(structure);
           if(structure == undefined) {
               structure = creep.room.storage;
           }
           if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(structure);
           } else {
               creep.transfer(structure, RESOURCE_ENERGY);
           }
       } else {//working = false
            creep.checkGround(2);
            creep.getEnergyFromContainer();
        }   
    }
};