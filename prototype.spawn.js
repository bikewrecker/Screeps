    var listOfRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper'];
    //var allRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper', 'longDistanceLorry', 'longDistanceMiner', 'longDistanceRepairer', 'longDistanceHarvester', 'claimer', 'stealer']
    //Game.spawns.BIKES.memory.minCreeps = {harvester: 0, claimer: 1, upgrader: 2, builder: 1, repairer: 1, wallRepairer: 1, turretSupplier: 1, miner: 2, lorry: 2, linkLorry: 2};
StructureSpawn.prototype.spawnCreepsIfNecessary = function (currentCreeps) {
    /** @type {Room} */
    let room = this.room;
    let numberOfCreeps = {};
    for (let role of listOfRoles) {
        numberOfCreeps[role] = 0;
        for(let creepRole in currentCreeps[role]) {
            let creepName = currentCreeps[role][creepRole];
            let creep = Game.creeps[creepName];
            if(creep.memory.homeRoom == this.room.name && creep.ticksToLive > 70) {
                numberOfCreeps[role]++;
            }
        }
    }
    let maxEnergy = room.energyCapacityAvailable;
    let name = undefined;
    //Defense procedure
    // Edit following line later to not go through whole Game.creeps.
    if(this.room.memory.hostileCreep == true) {
        let numDefenders = {};
        let role = 'defender';
        numDefenders = 0;
        if(currentCreeps[role] == undefined){
            numDefenders++;
        } else {
            for(let creepRole in currentCreeps[role]) {
                let creepName = currentCreeps[role][creepRole];
                let creep = Game.creeps[creepName];
                if(creep.memory.target == this.room.memory.creepLocation) {
                  numDefenders++;
                }
            }   
        }
        if(numDefenders > 0) {
            name = this.createDefender(this.room.memory.creepLocation);
            if(name != undefined && _.isString(name)){
                console.log("Defence protocall initiated: " + this.name + " spawned defender: " + name + ", Objective location: " + this.room.memory.creepLocation);
                this.room.memory.hostileCreep = false;
            }
        }
    } else {
        // Create a backup creep if needed
        name = this.backup(numberOfCreeps);

        // Spawn miners if necessary
        name = this.checkForMiners();
        
        // if none of the above caused a spawn command check for standard roles
        if (name == undefined) {
            for (let role of listOfRoles) {
                if (numberOfCreeps[role] < this.room.memory.minCreeps[role]) {
                    name = this.spawnStandardCreep(role);
                    if(name != undefined){
                        break;
                    }
                }
            }
        }
        
        //spawn special creeps
        if(name == undefined){
            name = this.spawnSpecialCreep(numberOfCreeps, currentCreeps);
        }

        //if spawn was successfull
        if (name != undefined && _.isString(name)) {
            if(Game.creeps[name].memory.target != undefined){
                console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ") " + Game.creeps[name].memory.target);
            } else {
                console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            }
           //this.room.displayCreeps();
        }
    }
    //if we spawned a new creep, update currentCreeps for other spawners.
    if(name != undefined && _.isString(name)) {
        let creep = Game.creeps[name];
        if(currentCreeps[creep.memory.role] == undefined){
            currentCreeps[creep.memory.role] = [];
        }
        currentCreeps[creep.memory.role].push(name);
    }
    return currentCreeps;
};

        StructureSpawn.prototype.spawnSpecialCreep = function(numberOfCreeps, currentCreeps) {
            var name = undefined;
            let room = this.room;
            let numberOfLongDistanceMiners = 0;
            if (name == undefined) {
            // count the number of long distance harvesters globally
            let role = 'longDistanceMiner';
            for (let roomName in this.room.memory.minLongDistanceMiners) {
                //numberOfLongDistanceMiners[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceMiner' && c.memory.target == roomName && c.memory.homeRoom == this.room.name && c.ticksToLive > 250);
                numberOfLongDistanceMiners = 0;
                for(let creepRole in currentCreeps[role]) {
                    let creepName = currentCreeps[role][creepRole];
                    let creep = Game.creeps[creepName];
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name && creep.ticksToLive > 250) {
                        numberOfLongDistanceMiners++;
                    }
                }

                if (numberOfLongDistanceMiners < this.room.memory.minLongDistanceMiners[roomName]) {
                    name = this.createLongDistanceMiner(roomName);
                    break;
                }
            }
        }
        
         //spawn claimers
         let numberOfClaimers = 0;
         if (name == undefined && this.room.memory.maxClaimers != undefined) {
            let role = 'claimer';
            for (let roomName in this.room.memory.maxClaimers) {
                if(roomName != undefined){
                    //numberOfClaimers[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'claimer' && c.memory.target == roomName && c.ticksToLive > 100)
                    numberOfClaimers = 0;
                    for(let creepRole in currentCreeps[role]) {
                        let creepName = currentCreeps[role][creepRole];
                        let creep = Game.creeps[creepName];
                        if(creep.memory.target == roomName && creep.ticksToLive > 100) {
                            numberOfClaimers++;
                        }
                    }
                    if(this.room.energyCapacityAvailable > 800){
                        if(this.room.memory.reserveTimers[roomName] < 4000 && numberOfClaimers < this.room.memory.maxClaimers[roomName]){
                            name = this.createClaimer(roomName);
                            break;
                        }
                    } else {
                        if(control != undefined && numberOfClaimers < this.room.memory.maxClaimers[roomName]) {
                            name = this.createClaimer(roomName);
                            break;
                        }
                    }
                }
            }

        }
        
        let numberOfLongDistanceRepairers = 0;
        if (name == undefined) {
            // count the number of long distance harvesters globally
            let role = 'longDistanceRepairer';
            for (let roomName in this.room.memory.minLongDistanceRepairers) {
                //numberOfLongDistanceRepairers[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceRepairer' && c.memory.target == roomName && c.memory.homeRoom == this.room.name);
                numberOfLongDistanceRepairers = 0;
                for(let creepRole in currentCreeps[role]) {
                    let creepName = currentCreeps[role][creepRole];
                    let creep = Game.creeps[creepName];
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name) {
                        numberOfLongDistanceRepairers++;
                    }
                }
                if (numberOfLongDistanceRepairers < this.room.memory.minLongDistanceRepairers[roomName]) {
                    name = this.createLongDistanceRepairer(roomName);
                    break;
                }
            }
        }
        
        let numberOfLongDistanceLorrys = 0;
        if (name == undefined) {
            // count the number of long distance harvesters globally
            let role = 'longDistanceLorry';
            for (let roomName in this.room.memory.minLongDistanceLorrys) {
                //numberOfLongDistanceLorrys[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceLorry' && c.memory.target == roomName && c.memory.homeRoom == this.room.name && c.ticksToLive > 150);
                numberOfLongDistanceLorrys = 0;
                //console.log(JSON.stringify(currentCreeps[role]));
                for(let creepRole in currentCreeps[role]) {
                    let creepName = currentCreeps[role][creepRole];
                    let creep = Game.creeps[creepName];
                    //console.log("HELLOOO " + creepName);
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name && creep.ticksToLive > 150) {
                       numberOfLongDistanceLorrys++;
                   }
                }
                //console.log(this.room.name + " " + roomName + " " + numberOfLongDistanceLorrys + " " + this.room.memory.minLongDistanceLorrys[roomName])
                if(numberOfLongDistanceLorrys < this.room.memory.minLongDistanceLorrys[roomName]) {
                    name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry']);
                    break;
                }
            }
        }
   /*     
    if(this.room.memory.minCreeps.stealer != undefined){
        let numberOfStealers = 0;
        if (name == undefined) {
            let roomName = 'W79N25';
            numberOfStealers = _.sum(Game.creeps, (c) => c.memory.role == 'stealer' && c.memory.target == roomName && c.memory.homeRoom == this.room.name && c.ticksToLive > 150);
            if (numberOfStealers < this.room.memory.minCreeps.stealer) {
                name = this.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    undefined, {role: 'stealer', target: 'W79N25', homeRoom: this.room.name, working: false});
                console.log(name);
            }
        }
    }
    */
    if(this.room.name == 'W75N23'){
        console.log("outside");
   }
    let numberOfLongDistanceHarvesters = 0;
    if (name == undefined) {
       let role = "longDistanceHarvester"; 
       if(this.room.name == 'W75N23'){
            console.log(name);
       }
            // count the number of long distance harvesters globally
            for (let roomName in this.room.memory.minLongDistanceHarvesters) {
                //console.log(roomName);
                //numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName && c.memory.homeRoom == this.room.name);
                if(this.room.name == 'W75N23') {
                    console.log("here");
                }
                numberOfLongDistanceHarvesters = 0;
                for(let creepRole in currentCreeps[role]) {
                    let creepName = currentCreeps[role][creepRole];
                    let creep = Game.creeps[creepName];
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name) {
                       numberOfLongDistanceHarvesters++;
                   }
               }
               if (numberOfLongDistanceHarvesters < this.room.memory.minLongDistanceHarvesters[roomName]) {
                    name = this.createLongDistanceHarvester(roomName);
                    console.log(name);
                    break;
            }
        }
    }

        //spawn a terminal Lorry
        if(name == undefined){
            let terminal = this.room.terminal;
            let mine = this.room.find(FIND_MINERALS)[0];
            if((mine.mineralAmount > 0) || (mine.ticksToRegeneration != undefined && mine.ticksToRegeneration > 0)){
                if(this.room.name == 'W75N23'){
                 console.log(terminal != undefined);
                 console.log(terminal.store[RESOURCE_ENERGY] < 3000);
                 console.log(numberOfCreeps['terminalLorry'] < this.room.memory.maxCreeps.terminalLorrys);
             }
             if(terminal != undefined && terminal.store[RESOURCE_ENERGY] < 3000 && numberOfCreeps['terminalLorry'] < this.room.memory.maxCreeps.terminalLorrys){
                console.log(name);
                name = this.createCarrier(this.room.memory.energyForRoles['terminalLorry'], 'terminalLorry');
            }             
        }
    }
    return name;
};

StructureSpawn.prototype.spawnStandardCreep = function(role) {
    var name = undefined;
    let room = this.room;

    if (role == 'lorry') {
        var containers = [];
        _.each(room.memory.containers, function(val, key) {
            if(val != undefined && key != 'mineral') {
                containers.push(val);
            }
        });
        for(let container in containers) {
            if(!(_.some(this.room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == 'lorry' && c.memory.homeRoom == this.room.name && c.memory.containerID == containers[container]})))){
                name = this.createCarrier(this.room.memory.energyForRoles[role], role, undefined, containers[container]);
                break;
            }
        }
    } else if(role == 'linkLorry' || role == 'sourceLorry' || role == 'mineralLorry') {
        if(role == 'mineralLorry'){
            let mine = this.room.find(FIND_MINERALS)[0];
            if(mine.ticksToRegeneration > 0){

            } else {
                name = this.createCarrier(this.room.memory.energyForRoles[role], role);
            }
        } else{
            name = this.createCarrier(this.room.memory.energyForRoles[role], role);
        }
    } else if (role == 'upgrader'){
        name = this.createUpgrader(this.room.memory.energyForRoles[role]);
    } else if (role == 'helper'){
        name = this.createHelper(this.room.memory.energyForRoles[role], 'W79N24');
    } else if(role == 'turretSupplier') {
        var towers = room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
            // for each tower
            for(let tower of towers) {
                let towerID = tower.id;
                let existsCreep = room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == 'turretSupplier' && c.memory.towerID == towerID})[0];
                if(existsCreep == undefined) {
                    name = this.createCarrier(this.room.memory.energyForRoles[role], role, towerID);
                    break;
                }
            }
        } else if(role == 'extractor') {
            let mine = this.room.find(FIND_MINERALS)[0];
            if(mine.ticksToRegeneration > 0){

            } else {
                name = this.createExtractor(this.room.memory.energyForRoles[role]);                
            }
        } else {
            name = this.createCustomCreep(this.room.memory.energyForRoles[role], role);
        }
        return name;
    };
    
    StructureSpawn.prototype.backup = function(numberOfCreeps) {
        var name = undefined;
        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0 && numberOfCreeps['sourceLorry'] == 0) {
            if (numberOfCreeps['miner'] > 0 && this.room.energyCapacityAvailable >= this.room.memory.energyForRoles['lorry'])  {
                name = this.createCarrier(this.room.energyAvailable, 'lorry');
            } else if((this.room.storage != undefined && this.room.storage.store[RESOURCE_ENERGY] >= this.room.memory.energyForRoles['sourceLorry'] + this.room.memory.energyForRoles['miner'] + this.room.memory.energyForRoles['lorry'])) {
                name = this.createCarrier(this.room.memory.energyForRoles['sourceLorry'], 'sourceLorry');
            } else {
                // create a harvester because it can work on its own
                name = this.createCustomCreep(this.room.energyAvailable, 'harvester');
            }
        }
        return name;
    };

    StructureSpawn.prototype.checkForMiners = function() {
        let creepsInRoom = this.room.find(FIND_MY_CREEPS);
        let sources = this.room.find(FIND_SOURCES);
        var name = undefined;

        // iterate over all sources
        for (let source of sources) {
            // if the source has no miner
            if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceID == source.id && c.ticksToLive > 40)) {
                // check whether or not the source has a container
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER});
                // if there is a container next to the source
                if (containers.length > 0) {
                    // spawn a miner
                    name = this.createMiner(source.id);
                    break;
                }
            }
        }
        return name;
    };
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        var numberOfParts = Math.floor(energy/200);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, {role: roleName, working: false, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createHelper= function(energy, target) {
        var numberOfParts = Math.floor(energy/200);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        return this.createCreep(body, undefined, {role: 'helper', working: false, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createExtractor = function(energy) {
        var numberOfParts = Math.floor(energy/450);
        var body = [];
        for(let i = 0; i < numberOfParts*4; i++) {
            body.push(WORK);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        mType = this.room.find(FIND_MINERALS)[0].mineralType;
        return this.createCreep(body,undefined, {role: 'extractor', working: false, mineralType: mType, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createDefender = function(target) {
        if(this.room.energyCapacityAvailable > 800) {
            return this.createCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE],undefined, {role: 'defender', target: target, flag: true, homeRoom: this.room.name});
        }
        else {
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE], undefined, {role: 'defender', target: target, flag: true, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createMeleeAttacker = function(target) {
        if(this.room.energyCapacityAvailable > 1900) {
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE], undefined, {role: 'meleeAttacker', target:target, homeRoom: this.room.name});
        } else {
            return this.createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE], undefined, {role: 'meleeAttacker', target:target, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createLongDistanceHarvester = function (target) {
        var numberOfParts = Math.floor(this.room.energyCapacityAvailable/200);
        var body = [];
        for(let i = 0; i < numberOfParts; i++){
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        //console.log(this.createCreep(body, undefined, {role: 'longDistanceHarvester', working: false, target: target, homeRoom: this.room.name}));
        return this.createCreep(body, undefined, {role: 'longDistanceHarvester', working: false, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceRepairer = function (target) {
        return this.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'longDistanceRepairer', working: false, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceLorry = function(target, energy) {
        var numberOfParts = Math.floor(energy/150);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY, CARRY, MOVE);
        }
        return this.createCreep(body, undefined, {role: "longDistanceLorry", target: target, working: false, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createClaimer = function(target) {
        if(this.room.energyCapacityAvailable < 1300) {
            return this.createCreep([CLAIM,MOVE], undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        } else if (this.room.energyCapacityAvailable < 1950) {
            return this.createCreep([CLAIM,MOVE,CLAIM,MOVE], undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        } else {
            return this.createCreep([CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE], undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createMiner = function(sourceID) {
        return this.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'miner', sourceID: sourceID, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceMiner = function(target, sourceID) {
        return this.createCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'longDistanceMiner', sourceID: sourceID, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createCarrier = function(energy, role, towerID, containerID) {
        var numberOfParts = Math.floor(energy/150);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
            body.push(CARRY);
            body.push(MOVE);
        }
        if(role == 'lorry') {
            return this.createCreep(body, undefined, {role: role, working: false, towerID: towerID, containerID: containerID, homeRoom: this.room.name});
        }
        return this.createCreep(body, undefined, {role: role, working: false, homeRoom: this.room.name, towerID: towerID});
    };
    
    StructureSpawn.prototype.createUpgrader = function(energy) {
        var useEnergy = energy - 50;
        var numberOfParts = Math.floor(useEnergy/450);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(MOVE);
        }
        body.push(CARRY);
        return this.createCreep(body, undefined, {role: 'upgrader', working: false, homeRoom: this.room.name});
    };