module.exports = {
    run: function(creep) {

       creep.work();
       let cont = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
       if(cont == undefined && creep.carry / creep.carryCapacity >= 0.8) {
           creep.memory.working = true;
       }
       if(creep.memory.working == true) {
           //bring to upgrader
           
           if(creep.room.name != creep.memory.homeRoom){// && !(creep.memory.homeRoom == 'W78N26' && creep.room.name == 'W78N25')) {
                creep.moveTo(Game.flags[creep.room.name + 'Exit']);
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
           
           //end bring to upgrader
           // bring to storage
           /*
            if(creep.room.name != creep.memory.homeRoom && !(creep.memory.homeRoom == 'W78N26' && creep.room.name == 'W78N25')) {
                creep.moveTo(Game.flags[creep.room.name + 'Exit']);
            } else {
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
           }
           //end bring to storage
           */
       } else { // working == false;
            let ground = creep.checkGround(2);
            if(ground == 0 && creep.carry.energy /creep.carryCapacity > 0.8){
                creep.memory.working = true;
            }
            if(ground == -1 || ground == 1){
               if(creep.room.name == creep.memory.target) {
                   let check = creep.getEnergyFromContainer();
                   if(check != 0) {
                       let cont = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 10})[0];
                       if (cont != undefined) {
                           creep.getResourcesFromContainer();
                       } else {
                           if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                                creep.moveTo(Game.flags[creep.room.name + 'Source']);
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