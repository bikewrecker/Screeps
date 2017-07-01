require('prototype.link'); 
require('prototype.spawn');
require('prototype.terminal');
require('prototype.tower');

Room.prototype.runRoom = function() {

    let hostilePlayer = this.find(FIND_HOSTILE_CREEPS, {filter: c => c.owner.username != 'Invader'})[0];
    if(hostilePlayer != undefined) {
        Game.notify("Enemy spotted in room " + this.name + "! Attack may be imminent!!!")
        this.memory.hostileCreep = true;
        this.memory.creepLocation = this.name;
    }
    if(Game.time % 20 == 1) {
      this.updateCreepSpawnQueues();
    }

    this.runSpawns();
    /*
    if(this.memory.addRoom != undefined && this.memory.addRoom == true) {
        this.addRoomToDistanceRooms(this.memory.roomToAdd);
        this.memory.addRoom = false;
    }
    */ //must add this.memory.addRoom flag and this.memory.roomToAdd to rooms memory before use

    if(this.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_LINK})[0] != undefined) {
        this.runLinks();
    }
    if(this.terminal != undefined){
        this.runTerminals();
    }
    var towers = this.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
    if(towers[0] != undefined) {
        this.runTowers(towers);
    }
    if(this.memory.distanceRooms != undefined && Game.time % 25 == 0) {
        for(let room in this.memory.distanceRooms) {
            this.memory.distanceRooms[room].reserveTimer -= 25;
        }
    }
    this.calculateUpgradeTime();
    return 0;
};

Room.prototype.runLinks = function() {
    try {
        var homeLink = Game.getObjectById(this.memory.links.homeLink);
        var upgraderLink = Game.getObjectById(this.memory.links.upgraderLink);
        var externalLink = Game.getObjectById(this.memory.links.externalLink);
        switch(this.name) {
            case 'W78N26': 
                externalLink.activate(upgraderLink, 0);
                if(externalLink.energy < 400 && upgraderLink.energy < 20){
                    homeLink.activate(upgraderLink, .5);
                }
                break;
            case 'W78N25':
                if(upgraderLink.energy <= 400){
                    homeLink.activate(upgraderLink, .5);
                }
                if(externalLink.energy >= 400) {
                    externalLink.activate(upgraderLink, .5);
                }
                break;
            case 'W75N23':
                if(upgraderLink.energy <= 400){
                    homeLink.activate(upgraderLink, .5);
                }
                break; 
            case 'W73N25':
                if(upgraderLink.energy <= 400){
                    homeLink.activate(upgraderLink, .5);
                }
                break;
        }
    } catch (err) {
        console.log("Link operation error: " + err.stack);
    }
};

Room.prototype.runSpawns = function() {
    try{
        var creepsBeforeSpawning = undefined;
        var spawns = _.filter(Game.spawns, s=> s.room.name == this.name)
        for(let spawn of spawns) {
            if(Game.spawns[spawn.name].canCreateCreep([MOVE]) == 0) {
                Game.spawns[spawn.name].spawnCreepsIfNecessary();
            }
        }
        
        return 0;
   } catch(err) {
       console.log("spawn operation error: " + err.stack);
       console.log(this.name);
    }  
};

Room.prototype.runTerminals = function() {
    if(Game.time % 10 == 0){
        try{
            this.terminal.sellMinerals();
        } catch(err) {
            console.log("Terminal Runtime Error: " + err.stack);
        }
    }
};

Room.prototype.runTowers = function(towers) {
    try{
        // for each tower
        for (let tower of towers) {
            // run tower logic
            let defence = tower.defend();
            if(defence != 0){
                tower.repairStructs();
            }
        }
    } catch(err){
        console.log("Tower Runtime Error: " + err.stack);
    }
};

Room.prototype.calculateUpgradeTime = function() {
    try{
        if(this.memory.upgradeTimer.timer == 0) {
            let currentProgress = this.controller.progress;
            let rawSeconds = (((this.controller.progressTotal - this.controller.progress) / (currentProgress - this.memory.upgradeTimer.initial)) * this.memory.upgradeTimer.resetValue) * 5;
            let raw = rawSeconds/86400;
            let days = Math.floor(raw);
            let hours = Math.floor((raw - days)*24);
            let minutes = Math.floor((((raw - days)*24) - hours)*60);
            let seconds = Math.floor(rawSeconds - minutes * 60 - hours * 3600 - days * 86400);
            this.memory.upgradeTimer.timeToUpgrade = days +" Days, " + hours +" Hours, "+ minutes +" Minutes, "+ seconds + " Seconds.";
            this.memory.upgradeTimer.energyPerTick = (currentProgress - this.memory.upgradeTimer.initial)/200;
            this.memory.upgradeTimer.initial = currentProgress;
            this.memory.upgradeTimer.timer = this.memory.upgradeTimer.resetValue;
        } else {
            this.memory.upgradeTimer.timer--;
        }
    } catch(err) {
        console.log("Calculate Upgrade Time Error: " + err.stack);
    }
};
    
Room.prototype.displayCreeps = function() {
    try{
        var listOfRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper'];
        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(Game.creeps, (c) => c.memory.role == role && c.memory.homeRoom == this.name);
        }
    
        for (let role of listOfRoles) {
            console.log(role + ": " + numberOfCreeps[role]);
        }
        let numberOfLongDistanceHarvesters = {};
        for (let roomName in this.memory.minLongDistanceHarvesters) {
            numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName && c.memory.homeRoom == this.name);
            console.log("longDistanceHarvester: " + numberOfLongDistanceHarvesters[roomName] + " [" + roomName + "]");
        } 
        let numberOfLongDistanceLorrys = {};
        for (let roomName in this.memory.minLongDistanceLorrys) {
            numberOfLongDistanceLorrys[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceLorry' && c.memory.target == roomName && c.memory.homeRoom == this.name);
            console.log("longDistanceLorry: " + numberOfLongDistanceLorrys[roomName] + " [" + roomName + "]");
        }
        let numberOfLongDistanceMiners = {};
        for (let roomName in this.memory.minLongDistanceMiners) {
            numberOfLongDistanceMiners[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceMiner' && c.memory.target == roomName && c.memory.homeRoom == this.name);
            console.log("longDistanceMiner: " + numberOfLongDistanceMiners[roomName] + " [" + roomName + "]");
        }
        return 0;
    } catch(err) {
        console.log("Display Creeps Error: " + err.stack);
    }
};

Room.prototype.addRoomToDistanceRooms = function(room) {
    this.memory.distanceRooms[room] = {};
    let container = Game.rooms[room].find(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER})[0];
    if(container != undefined){
        this.memory.distanceRooms[room].container1 = container.id;
    }
    container = Game.rooms[room].find(FIND_STRUCTURES, {filter: c => c.structureType == STRUCTURE_CONTAINER})[1];
    if(container != undefined) {
        this.memory.distanceRooms[room].container2 = container.id;
    }
    if(this.memory.distanceRooms[room].reserveTimer == undefined){
        this.memory.distanceRooms[room].reserveTimer = 0;
    }
};

Room.prototype.updateCreepSpawnQueues = function() {
    this.updateRoomCreeps();
    this.updateSpawnQueues();
};

Room.prototype.updateRoomCreeps = function() {
    delete this.memory.creepsOfRoom;
    if(this.memory.creepsOfRoom == undefined) {
        this.memory.creepsOfRoom = {};
    }
    delete this.memory.distanceCreeps;
    if(this.memory.distanceCreeps == undefined) {
        this.memory.distanceCreeps = {};
    }
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if(creep.memory.homeRoom == this.name){
            let role = Game.creeps[creepName].memory.role;
            if(role != 'longDistanceHarvester' && role != 'longDistanceLorry' && role != 'longDistanceMiner' && role != 'longDistanceRepairer' && role != 'scout' && role != 'claimer') {
                if(this.memory.creepsOfRoom[role] == undefined) {
                    this.memory.creepsOfRoom[role] = [];
                }
                this.memory.creepsOfRoom[role].push(creepName);
            } else {
                if(this.memory.distanceCreeps[role] == undefined) {
                    this.memory.distanceCreeps[role] = {};
                } 
                if(this.memory.distanceCreeps[role][creep.memory.target] == undefined) {
                    this.memory.distanceCreeps[role][creep.memory.target] = [];
                }
                this.memory.distanceCreeps[role][creep.memory.target].push(creepName);
            }
        }
    } // fills up creepsOfRoom and distanceCreeps arrays with current names of creeps in game that were made by this room. 
};

Room.prototype.updateSpawnQueues = function() {
    delete this.memory.localSpawnQueue;
    if(this.memory.localSpawnQueue == undefined){
        this.memory.localSpawnQueue = [];
    }
    if(this.memory.creepsOfRoom == undefined){
        this.memory.creepsOfRoom = {};
    }

    for(let role in this.memory.minCreeps){
        var addLocal = false;
        var haveCreepInRoom = this.memory.creepsOfRoom[role];
        if(haveCreepInRoom == undefined) {
            if(this.memory.minCreeps[role] != 0) {
               addLocal = true; 
            }
        } else if(haveCreepInRoom.length < this.memory.minCreeps[role]) {
            addLocal = true;
        }
        if(addLocal){
            if(role == 'terminalLorry') {
                let mine = this.find(FIND_MINERALS)[0];
                let terminal = this.terminal;
                if((mine.mineralAmount > 0) || (mine.ticksToRegeneration != undefined && mine.ticksToRegeneration > 0)){
                    if(terminal != undefined 
                    && terminal.store[RESOURCE_ENERGY] < 3000 
                    && this.memory.creepsOfRoom[role] < this.memory.maxCreeps.terminalLorrys 
                    && this.storage.store[RESOURCE_ENERGY] > 30000){
                        this.memory.localSpawnQueue.push(role);
                    }
                }
                continue;
            }
            if(this.memory.creepsOfRoom[role] == undefined){
                this.memory.creepsOfRoom[role] = [];
            }
            switch(role) {
                case 'lorry':
                    var containers = this.memory.containers;
                    var found = false;        
                    for(let container in containers) {
                        found = false;
                        if(container != 'mineral') {
                            for(let creepName of this.memory.creepsOfRoom[role]) {
                                let creep = Game.creeps[creepName];
                                if(creep != undefined){
                                    if(creep.memory.homeRoom == this.name && creep.memory.containerID == containers[container]){
                                        found = true;
                                        break;
                                    }
                                } else {
                                    console.log("Error spawning lorry, creep is undefined")
                                }
                            }
                            if(!found){
                                this.memory.localSpawnQueue.push(role);
                                this.memory.localSpawnQueue.push(containers[container]);
                                break;
                            }
                        }
                    }
                    break;
                case 'mineralLorry':
                case 'extractor':
                    let mine = this.find(FIND_MINERALS)[0];
                    if(mine.ticksToRegeneration > 0){
                        //don't do anything because mineral mine is currently depeleted
                    } else {
                        this.memory.localSpawnQueue.push(role);
                    }

                    break;
                case 'turretSupplier':
                    var towers = this.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
                    let newTower = towers[0];
                    for(let tower of towers) {
                        if(towers[tower] != undefined){
                            if(towers[tower].energy < newTower.energy) {
                                newTower = tower;
                            }
                        }
                    }
                    this.memory.localSpawnQueue.push(role);
                    this.memory.localSpawnQueue.push(newTower.id);
                    break;
                default:
                    let amount = this.memory.minCreeps[role];
                    if(this.memory.creepsOfRoom[role] != undefined){
                        amount = this.memory.minCreeps[role] - this.memory.creepsOfRoom[role].length;
                    }
                    for(let i = 0; i < amount; i++) {
                        this.memory.localSpawnQueue.push(role);
                    }
                    break;
            }
        }
    }


    delete this.memory.distanceSpawnQueue;
    if(this.memory.distanceSpawnQueue == undefined){
        this.memory.distanceSpawnQueue = [];
    }

    let role = 'claimer';
    for (let roomName in this.memory.maxClaimers) {
        if(roomName != undefined){
            if(this.memory.distanceRooms[roomName].reserveTimer < 4000) {
                let addClaimer = false;
                var haveCreepRole = undefined;
                var haveCreepRoom = undefined;
                let numNeeded = this.memory.maxClaimers[roomName]; 
                if(numNeeded != undefined && numNeeded != 0) {
                    haveCreepRole = this.memory.distanceCreeps[role]; 
                    if(haveCreepRole == undefined){
                        addClaimer = true;
                    } else {
                        haveCreepRoom = haveCreepRole[roomName];
                        if(haveCreepRoom == undefined) {
                            addClaimer = true;
                        } else {
                            if(haveCreepRoom.length < this.memory.maxClaimers[roomName]) {
                                addClaimer = true;
                            }
                        }
                    }
                }

                if(addClaimer){
                    this.memory.distanceSpawnQueue.push(role);
                    this.memory.distanceSpawnQueue.push(roomName);
                }
            }
        }
    }
    for(let role in this.memory.minDistanceCreeps){
        for(let roomName in this.memory.distanceRooms){
            let addDistance = false;
            var haveCreepRole = undefined;
            var haveCreepRoom = undefined;
            let numNeeded = this.memory.minDistanceCreeps[role][roomName]; 
            if(numNeeded != undefined && numNeeded != 0) {
                haveCreepRole = this.memory.distanceCreeps[role]; 
                if(haveCreepRole == undefined){
                    addDistance = true;
                } else {
                    haveCreepRoom = haveCreepRole[roomName];
                    if(haveCreepRoom == undefined) {
                        addDistance = true;
                    } else {
                        if(haveCreepRoom.length < this.memory.minDistanceCreeps[role][roomName]) {
                            addDistance = true;
                        }
                    }
                }
            }
            if(addDistance){
                this.memory.distanceSpawnQueue.push(role);
                this.memory.distanceSpawnQueue.push(roomName);
                let cont1 = undefined;
                let cont2 = undefined;
                switch(role) {
                    case 'longDistanceLorry':
                        cont1 = this.memory.distanceRooms[roomName].container1;
                        cont2 = this.memory.distanceRooms[roomName].container2;
                        //if we dont have any creeps in the target room
                        if(cont2 == undefined || haveCreepRole == undefined ||
                         (haveCreepRole != undefined && (haveCreepRoom == undefined || haveCreepRoom != undefined && haveCreepRoom.length == 0))) {
                            this.memory.distanceSpawnQueue.push(cont1);
                        } else {
                            //if we only have one in the target room
                            if(haveCreepRoom.length == 1) {
                                let currentContainer = undefined;
                                let creep = Game.creeps[haveCreepRoom[0]];
                                if(creep.memory.homeRoom == this.name && creep.memory.target == roomName) {
                                    currentContainer = creep.memory.containerID;
                                    //break;
                                }
                                if(currentContainer == cont1) {
                                    this.memory.distanceSpawnQueue.push(cont2);
                                } else {
                                    this.memory.distanceSpawnQueue.push(cont1);
                                }
                            // if we have 2 or more lorrys in the room
                            } else {
                                let c1 = 0;
                                let c2 = 0;
                                for(let creepName of haveCreepRoom){
                                    let creep = Game.creeps[creepName];
                                    if(creep.memory.homeRoom == this.name && creep.memory.target == roomName) {
                                        if(creep.memory.containerID == cont1) {
                                            c1++
                                        } else {
                                            c2++;
                                        }
                                    }
                                }
                                //if we have more creeps using container 1 spawn a creep to use container 2
                                if(c1 > c2){
                                    this.memory.distanceSpawnQueue.push(cont2);
                                } else { //if we have more creeps using container 2 or the same number using both, create a creep that uses container 1
                                    this.memory.distanceSpawnQueue.push(cont1);
                                }
                            } 
                        }
                        break;
                    case 'longDistanceMiner':
                        cont1 = this.memory.distanceRooms[roomName].container1;
                        cont2 = this.memory.distanceRooms[roomName].container2;
                        if(cont2 == undefined || haveCreepRole == undefined || haveCreepRoom == undefined){
                            this.memory.distanceSpawnQueue.push(cont1);
                        } else {
                            let currentContainer = undefined;
                            for(let creepName of haveCreepRoom){
                                let creep = Game.creeps[creepName];
                                if(creep != undefined && creep.memory.homeRoom == this.name && creep.memory.target == roomName) {
                                    currentContainer = creep.memory.containerID;
                                    break;
                                }
                            }
                            if(currentContainer == cont1) {
                                this.memory.distanceSpawnQueue.push(cont2);
                            } else {
                                this.memory.distanceSpawnQueue.push(cont1);
                            }
                        }
                        break;
                    case 'scout':
                    case 'longDistanceRepairer':
                    case 'longDistanceHarvester':
                        //role and target roomname have already been pushed to queue.
                        break;
                    default:
                        console.log("Cant find this role when spawning long distance creeps: " + role);
                        break;
                }
            }
        }
    }
};