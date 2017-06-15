require('prototype.creep');
require('prototype.room');
const profiler = require('screeps-profiler');
profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {
      
    //Clear dead creep from memory
    if(Game.time % 20 == 0){
        try{
            for(let name in Memory.creeps) {
                if(Game.creeps[name] == undefined) {
                    delete(Memory.creeps[name]);
                }
            }
        } catch(err) {
            console.log("Memory cleanup error: " + err.stack);
        }
    }
    //Get current creeps and sort them by their role
    if(Game.time % 20 == 0){
        try{
            Memory.currentCreeps = {};
            for (let creepName in Game.creeps) {
                let role = Game.creeps[creepName].memory.role;
                if(Memory.currentCreeps[role] == undefined){
                    Memory.currentCreeps[role] = [];
                }
                Memory.currentCreeps[role].push(creepName);
            }
        } catch (err) {
            console.log("Error calculating number of Creeps" + " " + err.stack)
        }
    }

    //Operate Creeps
    for (let name in Game.creeps) {
        try{
            Game.creeps[name].runRole();
        } catch(err) {
            console.log("Creep runtime error: " + name + " " + err.stack);
        }
    }
    
    //Operate Rooms
    try{
        var myRooms = [];
        for(let room in Game.rooms){
            if(Game.rooms[room].controller != undefined && Game.rooms[room].controller.owner != undefined && Game.rooms[room].controller.owner.username == 'bikewrecker') {
                myRooms.push(room);
            }
        }
        for(let room of myRooms){
            Game.rooms[room].runRoom();
        }
    } catch(err) {
        console.log("Room Runtime Error: " + err.stack);
    }
    
    });
};