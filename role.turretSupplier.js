var roleUpgrader = require('role.upgrader');
module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
           
           var tower = Game.getObjectById(creep.memory.towerID);
           if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(tower);
           } else {
               let succ = creep.transfer(tower, RESOURCE_ENERGY);
               if(succ == 0) {
                   let towers = creep.room.find(FIND_MY_STRUCTURES, {filter: c => c.structureType == STRUCTURE_TOWER && c.id != creep.memory.towerID});
                   let newTower = tower;
                   //console.log(newTower);
                   for(let towerIter in towers){
                    if(towers[towerIter].energy < newTower.energy || (newTower.pos.isEqualTo(tower.pos) && towers[towerIter].energy < newTower.energy + creep.carry.energy)) {
                      newTower = towers[towerIter];
                    }
                   }
                   if(newTower != undefined){
                        creep.memory.towerID = newTower.id;
                   }
               }
           }
       } else {
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