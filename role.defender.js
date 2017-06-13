var roleHealer = require('role.healer');
module.exports = {
    run: function(creep) {
           if(creep.room.name == creep.memory.target) {
                var bogey = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                if(creep.attack(bogey) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bogey);
                } 
                if(creep.memory.flag){
                    if(bogey == undefined) {
                        var homeRoom  = Game.rooms[creep.memory.homeRoom];
                        homeRoom.memory.hostileCreep = false;
                        creep.memory.flag = false;
                        for(let i in homeRoom.memory.helping) {
                            if(homeRoom.memory.helping[i] == creep.room.name){
                                homeRoom.memory.helping.splice(i,1); //removes this room from list of rooms being helped
                                break;
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