var roleHealer = require('role.healer');
var roleMeleeAttacker= require('role.meleeAttacker');
var roleRangedAttacker= require('role.rangedAttacker');
module.exports = {
	run: function(creep) {
		var subRole = creep.memory.subRole;
		var healer = Game.getObjectById(creep.memory.healerMate);
		var ranged = Game.getObjectById(creep.memory.rangedMate);
		var melee = Game.getObjectById(creep.memory.meleeMate);
		if(creep.memory.engage == true) {
			if(creep.room.name != creep.memory.target) {
				creep.moveTo(Game.flags[creep.memory.target]);
			} else {
				if(subRole == 'healer') {
					if(melee != undefined  && melee.hits == melee.hitsMax && ranged.hits == ranged.hitsMax){
						creep.moveTo(melee);
					} else {
						roleHealer.run(creep);
					}
				} else if(subRole == 'meleeAttacker'){
					roleMeleeAttacker.run(creep);
				} else if(subRole == 'rangedAttacker') {
					if(creep.memory.attacking == undefined) {
						creep.memory.attacking = false;
					} else if(creep.memory.attacking == true) {
						roleRangedAttacker.run(creep);
					} else if(creep.memory.attacking == false){
						if(melee.hits != melee.hitsMax) {
							creep.memory.attacking = true;
						} else {
							creep.moveTo(melee);
						}
					}
				}
			}
		}
	}
};