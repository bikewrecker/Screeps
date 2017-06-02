module.exports = {
    run: function(creep) {
    
       creep.work();
       
       //BEGIN REGULAR DIRECTION
       
       if(creep.memory.working == true) {
           
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
           //console.log(structure);
           if(structure != undefined){
               if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(structure);
               } else {
                   creep.transfer(structure, RESOURCE_ENERGY);
               }
           }
       } else {
           creep.checkGround(2);
          creep.getEnergyFromStorage();
       }
         //  console.log("here");
         
          // var container  = Game.rooms['W78N26'].lookForAt('structure', 39, 2)[0];
           /*
          if(container != undefined) {
               if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                   creep.moveTo(container);
               } else {
                   creep.withdraw(container);
               }
               if(creep.memory.working == false && (creep.carry.energy > 0 && container.energy == 0)) {
                     creep.memory.working = true;
               }
          } 
          
          
       }
       
       //END REGULAR DIRECTION
       /*
       //OPPOSITE DIRECTION
        if(creep.memory.working == true) {
           
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_LINK)});
           //console.log(structure);
           
           if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(structure);
           } else {
               creep.transfer(structure, RESOURCE_ENERGY);
           }
       } else {
           //var container  = Game.rooms['W78N26'].lookForAt('structure', 39, 2)[0];
            var container = creep.room.storage;
            if(container != undefined) {
               if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                   creep.moveTo(container);
               } else {
                   creep.withdraw(container);
               }
               if(creep.memory.working == false && (creep.carry.energy > 0 && container.energy == 0)) {
                     creep.memory.working = true;
               }
            } 
       }
       //END OPPOSITE
       */
    }
};