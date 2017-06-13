module.exports = {
    run: function(creep) {
      if(creep.room.name != creep.memory.target){ 
        creep.moveTo(Game.flags[creep.memory.target]);
      } else {
        let enemys = creep.room.find(FIND_HOSTILE_CREEPS);     
        if(enemys[0] != undefined) {
           let room = Game.rooms[creep.memory.homeRoom];
            let gettingHelp = false;
            if(room.memory.helping != undefined){
              for(let i in room.memory.helping){
                if(room.memory.helping[i] == creep.room.name){
                  gettingHelp = true;
                }
              }
            } 
           if(room.memory.hostileCreep == false && (room.memory.helping == undefined || (room.memory.helping != undefined && !gettingHelp))) {
               room.memory.hostileCreep = true;
               room.memory.creepLocation = creep.room.name;
           } else if(room.memory.hostileCreep == true && room.memory.helping != undefined && gettingHelp) {
              if(enemys.length == 1) {
                room.memory.hostileCreep = false;
              }
           }
        } 
        let min = creep.room.find(FIND_MINERALS)[0];
        if(!creep.pos.isNearTo(min)){
          creep.moveTo(min);
        }

      }
    }
};