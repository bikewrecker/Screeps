module.exports = {
    run: function(creep) {
        if(creep.room.name != creep.memory.target){
            creep.moveTo(Game.flags[creep.memory.target]);
        } else {
            var container = Game.getObjectById(creep.memory.containerID);
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
};