module.exports = {
    run: function(creep) {

       creep.work();
       
       if(creep.memory.working == true) {
           if(creep.room.controller.owner != undefined && creep.room.controller.owner.username == 'bikewrecker'){
               if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(creep.room.controller);
               } else {
                   creep.upgradeController();
                   if(creep.carry.energy < 50){
                       creep.getEnergyFromLink(creep.room.memory.links.upgraderLink);
                   }
               }
           } else {
               if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                    creep.moveTo(Game.flags[creep.room.name + 'Source']);
                }
           }
       } else { // working == false
            creep.checkGround(2);
            let check = creep.getEnergyFromLink(creep.room.memory.links.upgraderLink);
            if(check != 0){
                if(creep.carry.energy > 0 && creep.memory.working == false) {
                    creep.memory.working = true;
                }
            }
        }
    }
};