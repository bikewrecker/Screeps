module.exports = {
    run: function(creep) {
      if(creep.room.name == 'W75N21') {
        creep.moveTo(Game.flags.dummy);
      } else {
       if(creep.room.name != creep.memory.target) {
          creep.moveTo(Game.flags[creep.memory.target]);
       } else {
           var controller = creep.room.controller;
           creep.reserveController(creep.room.controller);
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            } else {
                creep.reserveController(controller);
                if(creep.ticksToLive % 25 == 1) {
                  if(controller.reservation != undefined){
                    Game.rooms[creep.memory.homeRoom].memory.distanceRooms[creep.memory.target].reserveTimer = controller.reservation.ticksToEnd;
                  }
                }
                
                if(controller.sign != undefined) {
                    if(controller.sign.username != 'bikewrecker') {
                        creep.signController(controller, "Claimed by bikewrecker");
                        console.log("Sign set!");
                    }
                } else {
                   creep.signController(controller, "Claimed by bikewrecker");
                   console.log("Sign set!");
                }
                
            }
       }
     }
    }
};