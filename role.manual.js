module.exports = {
     run: function(creep) {
       // creep.moveTo(Game.flags.waypoint);
        creep.moveTo(Game.flags.waypoint);
        /*
        if(creep.room.name != creep.memory.target)
         {
             
         }    
         else {
             var road = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_ROAD});
             if(creep.dismantle(road) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(road);
             }
             
         }
         */
     }
};