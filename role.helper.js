var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleHarvester = require('role.harvester');
module.exports = {
run: function(creep) {
    /*
    if(creep.ticksToLive < 500){
        creep.memory.renewTimer = 50;
    }
    if(creep.memory.renewTimer > 0){
        creep.renewSelf();
        creep.memory.renewTimer--;
    } else { 
    */
        creep.work();
        if(creep.memory.working == true) {
           if(creep.room.name != creep.memory.target) {
               creep.moveTo(Game.flags.waypoint);
           } else {
               //if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
                   //roleRepairer.run(creep);
                   roleBuilder.run(creep);
                   //roleHarvester.run(creep);
               //} else {
              //      roleHarvester.run(creep);
              // }
           }
           
        } else { //creep.memory.working == false
        
            if(creep.room.name != creep.memory.target){
                creep.moveTo(Game.flags.waypoint);
            } else {
                if(creep.memory.containerID == undefined) {
                    var source = creep.room.find(FIND_SOURCES)[0];
                    let cont = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
                    creep.memory.containerID = cont.id;
                }
                creep.getEnergyFromContainer();
            }
        }
   // enable for renewSelf }
       
}
};