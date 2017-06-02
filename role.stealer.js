module.exports = {
    run: function(creep) {

       creep.work();
       if(creep.memory.working == true) {
           if(creep.room.name != creep.memory.homeRoom) {
                creep.moveTo(Game.flags[creep.room.name + 'Exit']);
            } else {
                //if(creep.memory.homeRoom == 'W78N25') {
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
       } else { // working == false;
            let ground = creep.checkGround(2);
            if(ground == 0 && creep.carry.energy /creep.carryCapacity > 0.8){
                creep.memory.working = true;
            }
            if(ground == -1 || ground == 1){
               if(creep.room.name == creep.memory.target) {
                   let check = creep.getEnergyFromStorage();
                   if(check != 0) {
                       creep.getEnergyFromGround();
                   }
               } else {
                    creep.moveTo(Game.flags[creep.memory.target], {reusePath:50});
               }
            }
       }       
    }
};