/*
require('prototype.creep');
require('prototype.room');
const profiler = require('screeps-profiler');
profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function() {

    //Clear dead creep from memory
    if(Game.time % 100 == 0){
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
    //Get current creeps and sort them by their rooms and their roles
    if(Game.time % 20 == 0){
        try{
            for(let room in Game.rooms) {
                if(Game.rooms[room].memory.creepsOfRoom != undefined){
                    delete Game.rooms[room].memory.creepsOfRoom;
                    delete Game.rooms[room].memory.distanceCreeps;
                }
            }
            for(let creepName in Game.creeps) {
                let creep = Game.creeps[creepName];
                let role = creep.memory.role;
                let room = Game.rooms[creep.memory.homeRoom];

                if(room.memory.creepsOfRoom == undefined) {
                    room.memory.creepsOfRoom = {};
                }
                if(room.memory.distanceCreeps == undefined) {
                    room.memory.distanceCreeps = {};
                }
                if(role != 'longDistanceHarvester' && role != 'longDistanceLorry' &&
                 role != 'longDistanceMiner' && role != 'longDistanceRepairer' && role != 'scout' && role != 'claimer') {
                    if(room.memory.creepsOfRoom[role] == undefined) {
                        room.memory.creepsOfRoom[role] = [];
                    } 
                    if(creep.ticksToLive > 150 || creep.ticksToLive == undefined) {
                        room.memory.creepsOfRoom[role].push(creep.name);
                    }
                } else {
                    if(room.memory.distanceCreeps[role] == undefined) {
                        room.memory.distanceCreeps[role] = {};
                    } 
                    if(creep.ticksToLive > 150 || creep.ticksToLive == undefined) {
                        if(room.memory.distanceCreeps[role][creep.memory.target] == undefined) {
                            room.memory.distanceCreeps[role][creep.memory.target] = [];
                        }
                        room.memory.distanceCreeps[role][creep.memory.target].push(creep.name);
                    }
                }
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
}*/;