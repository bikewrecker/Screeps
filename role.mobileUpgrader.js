module.exports = {
    run: function(creep) {
      if(creep.memory.containerID == undefined){
          creep.memory.containerID = creep.room.memory.containers.source2;
      }

      if(creep.room.name != creep.memory.homeRoom){
        creep.moveTo(Game.flags[creep.memory.homeRoom + 'Source']);
      } else {
         creep.work();
         if(creep.memory.working == true) {
             if(creep.room.controller.owner != undefined && creep.room.controller.owner.username == 'bikewrecker'){
                 if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(creep.room.controller);
                 } else {
                     creep.upgradeController(creep.room.controller);
                 }
             } else {
                let flag = Game.flags[creep.room.name + 'Source'];
                if(flag != undefined && !creep.pos.isEqualTo(flag.pos)) {
                      creep.moveTo(Game.flags[creep.room.name + 'Source']);
                  }
             }
         } else { // working == false
              creep.checkGround(2);
              let str = creep.room.storage;
              if(str != undefined) {
                  creep.getEnergyFromStorage();
              } else {
                let container = creep.room.find(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER})[0];
                  if (container != undefined) {
                    creep.getEnergyFromContainer();
                  } else {
                    creep.getEnergyFromSource();
                  }
              }
          }
      }
    }
};