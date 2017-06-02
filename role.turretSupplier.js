var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
           
           var tower = Game.getObjectById(creep.memory.towerID);
           if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(tower);
           } else {
               let succ = creep.transfer(tower, RESOURCE_ENERGY);
               if(succ == 0) {
                   let newTower = creep.room.find(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_TOWER && c.id != creep.memory.towerID})[0];
                   if(newTower != undefined){
                        creep.memory.towerID = newTower.id;
                   }
               }
           }
       } else {
           creep.checkGround(2);
           let check = creep.getEnergyFromStorage();
           if(check == ERR_NOT_IN_RANGE) {
               creep.moveTo(creep.room.storage);
           } else if(check != 0) {
              creep.getEnergyFromContainer();
           }
        }
    }
};