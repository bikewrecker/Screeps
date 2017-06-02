var roleUpgrader = require('role.mobileUpgrader');
module.exports = {
run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite == undefined){
                roleUpgrader.run(creep);
            } 
            else if(creep.build(constructionSite) == ERR_NOT_IN_RANGE){
                    creep.moveTo(constructionSite);
                } else {
                    creep.build(constructionSite);
                }
           } else { //workign == false
                creep.checkGround(2);
               var container = creep.room.storage;
               if(container != undefined) {
                   creep.getEnergyFromStorage();
               } else {
                   container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER})
                   if(container != undefined){
                        creep.getEnergyFromContainer();
                    } else {
                       creep.getEnergyFromSource();
                    }
               }
            }
}
};