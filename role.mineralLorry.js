module.exports = {
    run: function(creep) {
        
        if(creep.memory.containerID == undefined) {
            creep.memory.containerID = creep.room.memory.containers.mineral;
        }

       creep.work();
       
       if(creep.memory.working == true) {
          var terminal = creep.room.terminal;
          let rez = _.findKey(creep.carry);
          if(creep.transfer(terminal, rez) == ERR_NOT_IN_RANGE) {
              creep.moveTo(terminal, {reusePath: 50});
          } else if(creep.transfer(terminal, rez) == ERR_NOT_ENOUGH_RESOURCES) {
              creep.transfer(terminal, RESOURCE_ENERGY);
          } 
          
       } else {//working = false
            var minerals = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {filter: c => c.resourceType != RESOURCE_ENERGY})[0];
            if(minerals != undefined) {
                if(creep.pickup(minerals) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(minerals, {reusePath: 50});
                }
            }
            //creep.checkGround(2);
            creep.getResourcesFromContainer();
        }   
    }
};