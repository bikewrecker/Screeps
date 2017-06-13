module.exports = {
     run: function(creep) {
       // creep.moveTo(Game.flags.waypoint);
        //creep.moveTo(Game.flags.waypoint3);
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


         
        var controller = creep.room.controller;
        if(creep.claimController(controller) == ERR_NOT_IN_RANGE){
            creep.moveTo(controller);
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
};