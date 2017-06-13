// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            var attk = this.attack(target);
            if(target.owner.username != 'Invader' && this.room.memory.hostileCreep == false) {
                Game.rooms[this.room.name].memory.hostileCreep = true;
                Game.spawns[this.room.name].memory.creepLocation = this.room.name;
            }
            
        }
        return attk;
    };
    
StructureTower.prototype.repairStructs =
    function () {
        var structure = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART});
        if(structure != undefined && (this.energy/this.energyCapacity > 0.8)) {
            this.repair(structure);
        }
    };