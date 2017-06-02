require('prototype.link'); 
require('prototype.spawn');
require('prototype.terminal');
require('prototype.tower');

Room.prototype.runRoom = function() {
    if(this.name == 'W75N23' && this.controller.level == 6 && this.memory.upgradeFlag != undefined && this.memory.upgradeFlag == true) {
        this.memory.minCreeps.builder = 2;
        this.memory.minCreeps.mobileUpgrader = 2;
        for(let i = 0; i < 7; i++){
            this.createConstructionSite(28-i, 32+i, STRUCTURE_EXTENSION);
        }
        this.createConstructionSite(17, 29, STRUCTURE_EXTENSION);
        this.createConstructionSite(16, 28, STRUCTURE_EXTENSION);
        this.createConstructionSite(15, 29, STRUCTURE_EXTENSION);
        this.memory.upgradeFlag = false;
    }
    this.runSpawns();
    
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
    
    if(this.memory.reserveTimers != undefined && Game.time % 25 == 0) {
        for(let time in this.memory.reserveTimers) {
            this.memory.reserveTimers[time] -= 25;
        }
    }
    
    this.calculateUpgradeTime();
};

Room.prototype.runLinks = function() {
    try {
    var homeLink = Game.getObjectById(this.memory.links.homeLink);
    var upgraderLink = Game.getObjectById(this.memory.links.upgraderLink);
    var externalLink = Game.getObjectById(this.memory.links.externalLink);
    switch(this.name) {
        case 'W78N26': 
            externalLink.activate(upgraderLink, .5);
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
    }
    } catch (err) {
        console.log("Link operation error: " + err.stack);
    }
};

Room.prototype.runSpawns = function() {
    try{
        var spawns = _.filter(Game.spawns, s=> s.room.name == this.name)
        for(let spawn of spawns) {
            //Spawn Creeps if Nescessary
            if(Game.spawns[spawn.name].canCreateCreep([MOVE]) == 0) {
                Game.spawns[spawn.name].spawnCreepsIfNecessary();
            }
        }
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