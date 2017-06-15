module.exports = {
run: function(creep) {
//const startTime = Game.cpu.getUsed();

  if(creep.memory.walls == undefined){
    console.log('building memory of walls');
    creep.memory.minWall = 1;
    let walls = creep.room.find(FIND_STRUCTURES, {filter: (w) => (w.structureType == STRUCTURE_WALL || w.structureType == STRUCTURE_RAMPART)});
    creep.memory.walls = [];
    for(let wall of walls) {
      creep.memory.walls.push(wall.id);
      if(wall.hits/wall.hitsMax < creep.memory.minWall) {
        creep.memory.minWall = wall.hits/wall.hitsMax;
      }
    }
  }
  
   creep.work();
   
   if(creep.memory.working == true) {
       var target = undefined;
       for(let percentage = creep.memory.minWall; percentage < 1; percentage += .00001) {
           for(let wall of creep.memory.walls) {
            let current = Game.getObjectById(wall);
             if(current.hits/current.hitsMax < percentage) {
                 target = current;
                 break;
             }
           }
           if(target != undefined){
               break;
           }
       }
       if(creep.repair(target) == ERR_NOT_IN_RANGE) {
           creep.moveTo(target);
       } 
   } else {//working == false
        if(creep.room.storage != undefined) {
          creep.getEnergyFromStorage();
        } else {
          creep.getEnergyFromContainer();
        }
    }
        
        //console.log('Used ' + (Game.cpu.getUsed() - startTime) + ' cpu for this creep ' + creep.room.name);
    }
};