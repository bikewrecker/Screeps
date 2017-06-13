module.exports = {
    run: function(creep) {
       //creep.work();
       if(creep.memory.working == true) {
          console.log('butts');
           if(creep.room.name != creep.memory.homeRoom) {
                creep.moveTo(Game.flags[creep.room.name + 'Exit']);
            } else {
                var structure = creep.room.storage;
                if(structure == undefined){
                    structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
                }
                var rez =  _.findKey(creep.carry);
               if(creep.transfer(structure, rez) == ERR_NOT_IN_RANGE) {
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
          if(creep.room.name != creep.memory.target){
            creep.moveTo(Game.flags[creep.memory.target]);
          } else {
              /*
            let ground = creep.checkGround(2);
            if(ground == 0 && creep.carry.energy /creep.carryCapacity > 0.8){
                creep.memory.working = true;
            }
            */
               var store = creep.room.storage;
               //var ramp = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
               var ramp = Game.getObjectById('58f4ac56d7f59b9976ae0f91');

               if(creep.attack(ramp) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(ramp);
               } else {
                creep.attack(ramp);
              }

              if(creep.rangedAttack(ramp) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(ramp);
               } else {
                creep.rangedAttack(ramp);
              }


               if(creep.dismantle(ramp) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(ramp);
               } else {
                creep.dismantle(ramp);
                creep.checkGround(1);
               }
           } 
       }       
    }
};