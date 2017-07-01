module.exports = {
    run: function(creep) {
        if(creep.room.name != creep.memory.target){
            creep.moveTo(Game.flags[creep.memory.target]);
        } else {
            var container = Game.getObjectById(creep.memory.containerID);
            if(container == undefined) {
                Game.rooms[creep.memory.homeRoom].addRoomToDistanceRooms(creep.memory.target);
                creep.memory.containerID = Game.rooms[creep.memory.homeRoom].memory.distanceRooms.container1;
            } else {
                var source = container.pos.findInRange(FIND_SOURCES, 1)[0];
                if(container != undefined){
                    if(creep.pos.isEqualTo(container.pos)){
                        creep.harvest(source);
                    } else {
                        if(creep.moveTo(container) == ERR_NO_PATH) {
                            if(!creep.pos.isEqualTo(Game.flags[creep.room.name + 'Source'].pos)){
                                creep.moveTo(Game.flags[creep.room.name + 'Source']);
                            }
                        } 
                    }
                }
            }
       }
    }
};