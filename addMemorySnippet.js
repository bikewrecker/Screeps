if(!Memory.structures) {	
	Memory.structures = {}; 
}
 
Object.defineProperty(OwnedStructure.prototype, "memory", {
    get: function () {      
		if(!Memory.structures[this.id])
			Memory.structures[this.id] = {};
		return Memory.structures[this.id];
    },
	set: function(v) {
		return _.set(Memory, 'structures.' + this.id, v);
	},
	configurable: true,
	enumerable: false
});

global.GCStructureMemory = function() {
	for (var id in Memory.structures )
		if(!Game.structures[id]) {
			delete Memory.structures[id];
		}
}