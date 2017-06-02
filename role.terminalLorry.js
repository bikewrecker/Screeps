module.exports = {
    run: function(creep) {
    
       creep.work();
       
       if(creep.memory.working == true) {
           
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_TERMINAL)});
           //console.log(structure);
           if(structure != undefined && structure.store[RESOURCE_ENERGY] < 15000){
               if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(structure);
               } else {
                   creep.transfer(structure, RESOURCE_ENERGY);
               }
           }
       } else {
           creep.checkGround(2);
           creep.getEnergyFromStorage();
       }
       /*
       if(creep.memory.working == true) {
           creep.transfer(creep.room.storage,RESOURCE_ENERGY);
       } else {
           creep.withdraw(creep.room.terminal,RESOURCE_ENERGY);
       }
*/
       
       
       
    }
};