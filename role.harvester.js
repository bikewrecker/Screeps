module.exports = {
    run: function(creep) {
        
        if(creep.memory.sourceID == undefined){
            var sources = creep.room.find(FIND_SOURCES);
            
            for(let source of sources) {
                //console.log(source.id);
                if(!_.some(Game.creeps, c => c.memory.homeRoom == creep.memory.homeRoom && c.memory.role == 'harvester' && c.memory.sourceID == source.id)) {
                    creep.memory.sourceID = source.id;
                }
            }
        }

       creep.work();
       
       if(creep.memory.working == true) {
           
           var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy < s.energyCapacity)});
           //console.log(structure);
           if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(structure);
           } else {
               creep.transfer(structure, RESOURCE_ENERGY);
           }
       } else {
           let pop = creep.getEnergyFromSource();
           //console.log(creep.name + pop);
           /*
           if(creep.memory.sourceID != undefined){
               var source = Game.getObjectById(creep.memory.sourceID);
           } else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
           }
          // console.log(source);
           if(creep.harvest(source) == ERR_NOT_IN_RANGE){
               creep.moveTo(source);
           } else {
               creep.harvest(source);
           }
           */
       }
    }
};