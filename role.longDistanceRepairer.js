var roleRepairer = require('role.repairer');
module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
        if(creep.room.name != creep.memory.target) {
          creep.moveTo(Game.flags[creep.memory.target]);
        } else {
          roleRepairer.run(creep);
        }
       } else { // working == false;
           if(creep.room.name == creep.memory.target) {
               if(creep.memory.containerID == undefined){
                   let source = creep.room.find(FIND_SOURCES)[0];
                    if(source != undefined) {
                        var cont = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
                    }
                    if(cont != undefined) {
                      creep.memory.containerID = cont.id;
                    } else {
                      creep.memory.containerID = 0;
                    }
                }
                if(creep.memory.containerID == 0) {
                  creep.getEnergyFromSource();
                } else {
                  let container = creep.getEnergyFromContainer();
                  if(container == -6) {
                      creep.getEnergyFromSource();
                  } else if(container != 0 && container != 1 && !creep.pos.isEqualTo(Game.flags[creep.memory.target + "Source"].pos)) {
                      creep.moveTo(Game.flags[creep.memory.target + "Source"]);
                  }                  
                }
           } else {
               creep.moveTo(Game.flags[creep.memory.target]);
           }
       }
    }
};