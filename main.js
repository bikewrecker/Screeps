require('prototype.creep');
require('prototype.room');
const profiler = require('screeps-profiler');
profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {
    //Clear dead creep from memory
    try{
        for(let name in Memory.creeps) {
            if(Game.creeps[name] == undefined) {
                delete(Memory.creeps[name]);
            }
        }
    } catch(err) {
        console.log("Memory cleanup error: " + err);
    }

    //Operate Creeps
    for (let name in Game.creeps) {
        try{
            Game.creeps[name].runRole();
        } catch(err) {
            console.log("Creep runtime error: " + name + " " + err);
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
        console.log("Room Runtime Error: " + err);
    }
    
    });
};