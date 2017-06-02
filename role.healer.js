module.exports = {
    run: function(creep) {
       if(creep.room.name == creep.memory.target) {
            var frendly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
            if(frendly == undefined) {
                if(creep.hits < creep.hitsMax) {
                    frendly = creep;
                }
            }
            if(creep.heal(frendly) == ERR_NOT_IN_RANGE) {
                creep.moveTo(frendly);
            } else {
                creep.heal(frendly);
            } 
            if(frendly == undefined) {
                if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                    creep.moveTo(Game.flags[creep.room.name + 'Source']);
                } //get out of way of entrance
            }
       } else {
           var exit = Game.flags[creep.memory.target];
           creep.moveTo(exit);
       } 
        
   }
};