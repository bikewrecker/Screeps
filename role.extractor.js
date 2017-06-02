module.exports = {
    run: function(creep) {
        var mine = creep.room.find(FIND_MINERALS)[0]; 
        let container = Game.getObjectById(creep.room.memory.containers.mineral);
        if (!creep.pos.isEqualTo(container.pos)) {
           creep.moveTo(container);
        }
        creep.harvest(mine);
    }
};