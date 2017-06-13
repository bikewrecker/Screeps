module.exports = {
    run: function(creep) {
       if(creep.room.name == creep.memory.target) {
            if(creep.memory.role == 'squadMember'){
               var friendly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax && c.memory.role == 'squadMember'});
            } else {
               var friendly = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: c => c.hits < c.hitsMax});
            }
            if(friendly == undefined) {
                if(creep.hits < creep.hitsMax) {
                    friendly = creep;
                }
            }
            if(creep.heal(friendly) == ERR_NOT_IN_RANGE) {
                creep.moveTo(friendly);
                if(creep.pos.getRangeTo(friendly) < 4){
                  creep.rangedHeal(friendly);
                }
            } 
            if(friendly == undefined) {
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