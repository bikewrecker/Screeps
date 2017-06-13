var roleDefender = require('role.defender');
module.exports = {
    run: function(creep) {
        //roleDefender.run(creep);
        if(creep.room.name == creep.memory.target) {
            var bogey = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(creep.attack(bogey) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bogey);
            }
            //var bogey = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.objective.pos)[0];
            /*
            if(bogey == undefined) {
                bogey = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN});
            }
            if(bogey == undefined) {
                bogey = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_EXTENSION});
            }
            if(bogey == undefined) {
                bogey = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_LINK});
            }
            if(bogey == undefined) {
                bogey = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: s => s.structureType == STRUCTURE_STORAGE});
            }

            if(bogey != undefined){
                if(creep.attack(bogey) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(bogey);
                } else {
                    creep.attack(bogey);
                }
            }  
            */
       } else {
            creep.moveTo(Game.flags[creep.memory.target]);
       }
       
    }
};