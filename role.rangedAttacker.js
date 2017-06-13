module.exports = {
	run: function(creep) {
	 if(creep.room.name == creep.memory.target) {
          var bogey = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
          if(creep.rangedAttack(bogey) == ERR_NOT_IN_RANGE) {
              creep.moveTo(bogey);
          }
     } else {
          creep.moveTo(Game.flags[creep.memory.target]);
     }	
	}
};