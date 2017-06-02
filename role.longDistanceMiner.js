module.exports = {
    run: function(creep) {
        if(creep.room.name != creep.memory.target){
            creep.moveTo(Game.flags[creep.memory.target]);
            //creep.moveTo(creep.memory.myRoom);
        } else {
            let enemy = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            if(enemy != undefined) {
               for(let roomName in Game.rooms) {
                   if(roomName == creep.memory.homeRoom) {
                       if(Game.rooms[roomName].memory.hostileCreep == false) {
                           Game.rooms[roomName].memory.hostileCreep = true;
                           Game.rooms[roomName].memory.creepLocation = creep.room.name;
                       }
                   }
               }
            }

            if(creep.memory.sourceID != undefined) {
                let source = Game.getObjectById(creep.memory.sourceID);
                if(source != undefined) {
                    let container = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
                    if(container != undefined) {
                        if(creep.pos.isEqualTo(container.pos)){
                            creep.harvest(source);
                        } else {
                            if(creep.moveTo(container) == ERR_NO_PATH) {
                                if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                                    creep.moveTo(Game.flags[creep.room.name + 'Source']);
                                }
                            }
                        }
                    } else {
                        if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                            creep.moveTo(Game.flags[creep.room.name + 'Source']);
                        }
                    }
                }
            } else {
                creep.memory.sourceID = creep.room.find(FIND_SOURCES)[0].id;
            }
        }
    }
};