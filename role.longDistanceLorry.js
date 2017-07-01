module.exports = {
    run: function(creep) {

       creep.work();
       /*
       let cont = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
       if(cont == undefined && creep.carry / creep.carryCapacity >= 0.8) {
           creep.memory.working = true;
       }
       */
       if(creep.memory.working == true) {
           //bring to upgrader
           
           if(creep.room.name != creep.memory.homeRoom){
                creep.moveTo(Game.flags[creep.memory.homeRoom + 'Source']);
            } else {
                if(creep.memory.homeRoom != 'W78N26') {
                    var structure = creep.room.storage;
                    if(structure == undefined){
                        structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
                    }
                    var rez =  _.findKey(creep.carry);
                   if (creep.transfer(structure, rez) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(structure, {reusePath:50});
                   } else {
                       creep.transfer(structure, RESOURCE_ENERGY);
                   }
                   if(structure == undefined) {
                       if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                            creep.moveTo(Game.flags[creep.room.name + 'Source']);
                        }
                   }
                } else {
                    var structure = Game.getObjectById(creep.room.memory.links.externalLink);
                    //console.log(structure);
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                       creep.moveTo(structure);
                   } else {
                       creep.transfer(structure, RESOURCE_ENERGY);
                   }
                }
           }
         } else { // working == false; try editing so it attempts to get energy from container first, then the ground.
          let ground = creep.checkGround(2);
          if(ground == 0 && (creep.carry.energy / creep.carryCapacity) > 0.8){
              creep.memory.working = true;
          }
          if(ground == -1 || ground == 1){
             if(creep.room.name == creep.memory.target) {
                let check = creep.getEnergyFromContainer();
                if(check == ERR_NOT_IN_RANGE && creep.memory.containerID != undefined) {
                  creep.moveTo(Game.getObjectById(creep.memory.containerID));
                }
                 if(check != 0) {
                     let cont = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 10})[0];
                     if (cont != undefined) {
                         creep.getResourcesFromContainer();
                     } else {
                        let flag = Game.flags[creep.room.name + 'Source'];
                         if(!(creep.pos.isEqualTo(flag.pos))){
                              creep.moveTo(flag);
                          }
                     }
                 } 
             } else {
                  creep.moveTo(Game.flags[creep.memory.target], {reusePath:50});
             }
          }
       }       
    }
};