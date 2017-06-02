var roleRepairer = require('role.repairer');
module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
            roleRepairer.run(creep);
       } else { // working == false;
           if(creep.room.name == creep.memory.target) {
               if(creep.memory.containerID == undefined){
                   let source = creep.room.find(FIND_SOURCES)[0];
                    if(source != undefined) {
                        var cont = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
                    }
                    if(cont != undefined) {
                        creep.memory.containerID = cont.id;
                    }
                }
                if(creep.memory.containerID == undefined) {
                    creep.getEnergyFromSource();
                } else {
                    let container = creep.getEnergyFromContainer();
                    if(container == -1 && !creep.pos.isEqualTo(Game.flags[creep.memory.target + "Source"].pos)) {
                        creep.moveTo(Game.flags[creep.memory.target + "Source"]);
                    }
                }
           } else {
               creep.moveTo(Game.flags[creep.memory.target]);
           }
       }
    }
};