module.exports = {
    run: function(creep) {
       if(creep.room.name != creep.memory.target) {
           if(creep.room.name == 'W75N21') {
                creep.moveTo(Game.flags['dummy']);
           } else {
                creep.moveTo(Game.flags[creep.memory.target]);
           }
       } else {
           var controller = creep.room.controller;
           creep.reserveController(creep.room.controller);
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            } else {
                creep.reserveController(controller);
                if(creep.ticksToLive % 25 == 1) {
                    Game.rooms[creep.memory.homeRoom].memory.reserveTimers[creep.room.name] = controller.reservation.ticksToEnd;
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
};