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
        console.log("Memory cleanup error: " + err.stack);
    }

    //Get current creeps and sort them by their role
    try{
        var currentCreeps = {};
        for (let creepName in Game.creeps) {
            let role = Game.creeps[creepName].memory.role;
            if(currentCreeps[role] == undefined){
                currentCreeps[role] = [];
            }
            currentCreeps[role].push(creepName);
        }
    } catch (err) {
        console.log("Error calculating number of Creeps" + " " + err.stack)
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
        //console.log(JSON.stringify(currentCreeps['extractor']));
        var myRooms = [];
        for(let room in Game.rooms){
            if(Game.rooms[room].controller != undefined && Game.rooms[room].controller.owner != undefined && Game.rooms[room].controller.owner.username == 'bikewrecker') {
                myRooms.push(room);
            }
        }
        for(let room of myRooms){
            currentCreeps = Game.rooms[room].runRoom(currentCreeps);
        }
    } catch(err) {
        console.log("Room Runtime Error: " + err.stack);
    }
    
    });
};