var roleHealer = require('role.healer');
module.exports = {
    run: function(creep) {
           if(creep.room.name == creep.memory.target) {
                var bogey = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if(creep.attack(bogey) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bogey);
                } else {
                    creep.attack(bogey);
                }
                if(creep.memory.flag){
                    if(bogey == undefined || bogey.hits <= 0) {
                        for(let spawnName in Game.spawns) {
                            if(Game.rooms[creep.memory.homeRoom].memory.myID == creep.memory.myID) {
                                Game.rooms[creep.memory.homeRoom].memory.hostileCreep = false;
                                creep.memory.flag = false;
                            }
                        }
                    } 
                } else {
                    roleHealer.run(creep);
                }
           } else {
               var exit = Game.flags[creep.memory.target];
               creep.moveTo(exit);
           } 
    }
};