    var listOfRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper'];
    //var allRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper', 'longDistanceLorry', 'longDistanceMiner', 'longDistanceRepairer', 'longDistanceHarvester', 'claimer', 'stealer']
    var energyUsed = 0;
StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
    /** @type {Room} */

    let room = this.room;
    let numberOfCreeps = {};
    for (let role of listOfRoles) {
        numberOfCreeps[role] = 0;
        for(let creepRole in Memory.currentCreeps[role]) {
            if(Memory.currentCreeps[role] != undefined){
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep != undefined){
                    if(creep.memory.homeRoom == this.room.name && (creep.ticksToLive > 150 || creep.ticksToLive == undefined)) {
                        numberOfCreeps[role]++;
                    }
                }
            }
        }
    }
    let maxEnergy = room.energyCapacityAvailable;
    let name = undefined;

    //Defense procedure
    if(this.room.memory.hostileCreep == true) {
       name = this.defenseProcedure();
        
    } else {
        // Create a backup creep if needed
        name = this.backup(numberOfCreeps);
        // Spawn miners if necessary
        name = this.checkForMiners();

        // if none of the above caused a spawn command check for standard roles
        if (name == undefined) {
            for (let role of listOfRoles) {
                if (numberOfCreeps[role] < this.room.memory.minCreeps[role] && role != 'miner') {
                    name = this.spawnStandardCreep(role);
                    if(name != undefined){
                        break;
                    }
                }
            }
        }
        //spawn special creeps
        if(name == undefined){
            name = this.spawnSpecialCreep(numberOfCreeps);
        }


        

        //if spawn was successfull
        if (name != undefined && _.isString(name)) {
            if(Game.creeps[name].memory.target != undefined){
                console.log(this.room.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ") " + Game.creeps[name].memory.target);
            } else {
                console.log(this.room.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            }
        }
    }
    //if we spawned a new creep, update currentCreeps for other spawners.
    if(name != undefined && _.isString(name)) {
        let creep = Game.creeps[name];
        if(Memory.currentCreeps[creep.memory.role] == undefined){
            Memory.currentCreeps[creep.memory.role] = [];
        }
        Memory.currentCreeps[creep.memory.role].push(name);
        this.room.energyAvailable -= energyUsed;

    }
    return 0;
};

StructureSpawn.prototype.spawnStandardCreep = function(role) {
    var name = undefined;
    if(role == 'lorry') {
        var containers = this.room.memory.containers;
        var found = false;        
        for(let container in containers) {
            found = false;
            if(container != 'mineral') {
                for(let creepRole of Memory.currentCreeps[role]) {
                    let creep = Game.creeps[creepRole];
                    if(creep != undefined){
                        if(creep.memory.homeRoom == this.room.name && creep.memory.containerID == containers[container]){
                            found = true;
                            break;
                        }
                    }
                }
                if(!found){
                    name = this.createCarrier(this.room.memory.energyForRoles[role], role, undefined, containers[container]);
                    break;
                }
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
    } else if (role == 'upgrader' || role == 'mobileUpgrader'){
        name = this.createUpgrader(this.room.memory.energyForRoles[role], role);
    } else if (role == 'helper'){
        name = this.createHelper(this.room.memory.energyForRoles[role], 'W73N25');
    } else if(role == 'turretSupplier') {
        var towers = this.room.find(FIND_MY_STRUCTURES, {filter: s => s.structureType == STRUCTURE_TOWER});
        let newTower = towers[0];
        for(let tower of towers) {
            if(towers[tower] != undefined){
                if(towers[tower].energy < newTower.energy) {
                    newTower = tower;
                }
            }
        }
         name = this.createCarrier(this.room.memory.energyForRoles[role], role, newTower.id)   

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

    StructureSpawn.prototype.spawnSpecialCreep = function(numberOfCreeps) {
        var name = undefined;
        let room = this.room;


        let numberOfScouts = 0;
        if(name == undefined) {
            let role = 'scout'; 
            for (let roomName in this.room.memory.minLongDistanceMiners) {
                if(this.room.memory.minLongDistanceMiners[roomName] != 0) {
                    numberOfScouts = 0;
                    for(let creepRole in Memory.currentCreeps[role]) {
                        if(Memory.currentCreeps[role] == undefined){
                            numberOfScouts++;
                            break;
                        }
                        let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                        if(creep != undefined){
                            if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name && (creep.ticksToLive > 50 || creep.ticksToLive == undefined)) {
                                numberOfScouts++;
                            }
                        }
                    }
                    if(numberOfScouts < 1){
                        name = this.createScout(roomName);
                    }
                }
            }
        }
        let numberOfLongDistanceMiners = 0;
        if (name == undefined) {
        let role = 'longDistanceMiner';
        for (let roomName in this.room.memory.minLongDistanceMiners) {
            //numberOfLongDistanceMiners[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceMiner' && c.memory.target == roomName && c.memory.homeRoom == this.room.name && c.ticksToLive > 250);
            numberOfLongDistanceMiners = 0;
            let currentMiner = undefined;
            for(let creepRole in Memory.currentCreeps[role]) {
                if(Memory.currentCreeps[role] == undefined){
                    numberOfLongDistanceMiners++;
                    break;
                }
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep != undefined){
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name && (creep.ticksToLive > 250 || creep.ticksToLive == undefined)) {
                        numberOfLongDistanceMiners++;
                        currentMiner = creep.name;
                    }
                }
            }
            if (numberOfLongDistanceMiners < this.room.memory.minLongDistanceMiners[roomName]) {
                let cont1 = this.room.memory.distanceRooms[roomName].container1;
                if(currentMiner == undefined){
                    name = this.createLongDistanceMiner(roomName,cont1);
                } else {
                    if(Game.creeps[currentMiner].memory.containerID == cont1){
                        name = this.createLongDistanceMiner(roomName,this.room.memory.distanceRooms[roomName].container2);    
                    } else {
                        name = this.createLongDistanceMiner(roomName,cont1);
                    }
                }
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
                numberOfClaimers = 0;
                for(let creepRole in Memory.currentCreeps[role]) {
                    if(Memory.currentCreeps[role] == undefined){
                        numberOfClaimers++;
                        break;
                    }
                    let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                    if(creep != undefined){
                        if(creep.memory.target == roomName && (creep.ticksToLive > 100 || creep.ticksToLive == undefined)) {
                            numberOfClaimers++;
                        }
                    }
                }
                if(this.room.energyCapacityAvailable > 800){
                    if(numberOfClaimers < this.room.memory.maxClaimers[roomName] && this.room.memory.distanceRooms[roomName].reserveTimer < 4000){
                        name = this.createClaimer(roomName);
                        break;
                    }
                } else {
                    if(numberOfClaimers < this.room.memory.maxClaimers[roomName]) {
                        name = this.createClaimer(roomName);
                        break;
                    }
                }
            }
        }

    }

    let numberOfLongDistanceRepairers = 0;
    if (name == undefined) {
        let role = 'longDistanceRepairer';
        for (let roomName in this.room.memory.minLongDistanceRepairers) {
            numberOfLongDistanceRepairers = 0;
            for(let creepRole in Memory.currentCreeps[role]) {
                if(Memory.currentCreeps[role] == undefined){
                    numberOfLongDistanceRepairers++;
                    break;
                }
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep != undefined){
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name) {
                        numberOfLongDistanceRepairers++;
                    }
                }
            }
            if (numberOfLongDistanceRepairers < this.room.memory.minLongDistanceRepairers[roomName]) {
                name = this.createLongDistanceRepairer(roomName);
            }
        }
    }


    let numberOfLongDistanceLorrys = 0;
    if (name == undefined) {
        let role = 'longDistanceLorry';
        //for every room we want longDistanceLorrys in
        for (let roomName in this.room.memory.minLongDistanceLorrys) {
            numberOfLongDistanceLorrys = 0;
            var currentLorrys = [];
            var contID = undefined;
            //for every longDistanceLorry we have
            for(let creepRole in Memory.currentCreeps[role]) {
                if(Memory.currentCreeps[role] == undefined){
                    numberOfLongDistanceLorrys++;
                    break;
                }
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                //if its for the target room
                if(creep != undefined){
                    if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name && (creep.ticksToLive > 150 || creep.ticksToLive == undefined)) {
                       numberOfLongDistanceLorrys++;
                       currentLorrys.push(creep.name);
                   }
               }
            }
            //if we want more longDistanceLorrys in the room than we have
            if(numberOfLongDistanceLorrys < this.room.memory.minLongDistanceLorrys[roomName]) {
                let cont1 = this.room.memory.distanceRooms[roomName].container1;
                let cont2 = this.room.memory.distanceRooms[roomName].container2;
                //if we dont have any creeps in the target room
                if(currentLorrys.length == 0) {
                    name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'], cont1);
                } else {
                    //if we only have one in the target room
                    if(currentLorrys.length == 1) {
                        if(Game.creeps[currentLorrys].memory.containerID == cont1 && cont2 != undefined) {
                            name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'], cont2);
                        } else {
                            name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'], cont1);
                        }
                    // if we have 2 or more lorrys in the room
                    } else {
                        if(cont2 != undefined){
                            let c1 = 0;
                            let c2 = 0;
                            for(creepName of currentLorrys) {
                                let creeper = Game.creeps[creepName];    
                                if(creeper.memory.containerID == cont1){
                                    c1++;
                                } else if(creeper.memory.containerID == cont2){
                                    c2++;
                                }
                            }
                            //if we have more creeps using container 1 spawn a creep to use container 2
                            if(c1 > c2){
                                name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'],cont2);
                            } else { //if we have more creeps using container 2 or the same number using both, create a creep that uses container 1
                                name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'],cont1);
                            }
                        } else {
                            name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'],cont1);
                        }
                    }
                }
                break;
            }
        }
    }
    
    let numberOfLongDistanceHarvesters = 0;
    if (name == undefined) {
        
       let role = "longDistanceHarvester"; 
            // count the number of long distance harvesters globally
            for (let roomName in this.room.memory.minLongDistanceHarvesters) {
                numberOfLongDistanceHarvesters = 0;
                for(let creepRole in Memory.currentCreeps[role]) {
                    if(Memory.currentCreeps[role] == undefined){
                        numberOfLongDistanceHarvesters++;
                        break;
                    } 
                    let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                    if(creep != undefined){
                        if(creep.memory.target == roomName && creep.memory.homeRoom == this.room.name) {
                           numberOfLongDistanceHarvesters++;
                       }
                   }

               }
               // if(this.room.name == 'W78N26') {
               //  console.log(numberOfLongDistanceHarvesters);
               //   } 
               if (numberOfLongDistanceHarvesters < this.room.memory.minLongDistanceHarvesters[roomName]) {
                    name = this.createLongDistanceHarvester(roomName);
                    break;
            }
        }
    }
    if(this.room.memory.minCreeps.stealer != undefined && this.room.memory.minCreeps.stealer > 0){
        let numberOfStealers = 0;
        if (name == undefined) {
            let target = 'W73N26';
            let role = 'stealer';
            for(let creepRole in Memory.currentCreeps[role]) {
                if(Memory.currentCreeps[role] == undefined){
                    numberOfStealers++;
                    break;
                }
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep != undefined){
                    if(creep.memory.target == target && creep.memory.homeRoom == this.room.name) {
                       numberOfStealers++;
                   }
               }
            }    
            //numberOfStealers = _.sum(Game.creeps, (c) => c.memory.role == 'stealer' && c.memory.target == roomName && c.memory.homeRoom == this.room.name && (c.ticksToLive > 150 || creep.ticksToLive == undefined));
            if (numberOfStealers < this.room.memory.minCreeps.stealer) {
                var body = [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE];
                energyUsed = calculateCostOfBody(body);
                name = this.createCreep(body, undefined, {role: role, target: target, homeRoom: this.room.name, working: false});
            }
        }
    }
    

        //spawn a terminal Lorry
        if(name == undefined){
            let terminal = this.room.terminal;
            let mine = this.room.find(FIND_MINERALS)[0];
            if((mine.mineralAmount > 0) || (mine.ticksToRegeneration != undefined && mine.ticksToRegeneration > 0)){
                if(this.room.name == 'W75N23'){
             }
             if(terminal != undefined && terminal.store[RESOURCE_ENERGY] < 3000 && numberOfCreeps['terminalLorry'] < this.room.memory.maxCreeps.terminalLorrys && this.room.storage.store[RESOURCE_ENERGY] > 30000){
                name = this.createCarrier(this.room.memory.energyForRoles['terminalLorry'], 'terminalLorry');
              }             
        }
    }
    return name;
};

    StructureSpawn.prototype.backup = function(numberOfCreeps) {
        var name = undefined;
        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0 && numberOfCreeps['sourceLorry'] == 0){// && this.room.energyAvailable < this.room.memory.energyForRoles['miner'] + this.room.memory.energyForRoles['lorry']) {
            if (numberOfCreeps['miner'] > 0 && this.room.energyAvailable >= 150)  {
                name = this.createCarrier(this.room.energyAvailable, 'lorry', undefined, this.room.memory.containers['source1']);
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
        let role = 'miner';
        let sources = this.room.find(FIND_SOURCES);
        var miners = Memory.currentCreeps[role];
        var name = undefined;
        var found = false;
        // iterate over all sources
        for (let source of sources) {
            found = false;
            for(let creepName of miners){
                if(miners != undefined){
                    let creep = Game.creeps[creepName];
                    if(creep != undefined){
                        if(creep.memory.homeRoom == this.room.name && creep.memory.sourceID == source.id && (creep.ticksToLive > 40 || creep.ticksToLive == undefined)) {
                            found = true;
                            break;
                        }
                    }
                }
            }
            if(!found){
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER});
                if (containers.length > 0) {
                    name = this.createMiner(source.id);
                    break;
                }
            }
        }
        return name;
    };
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
        if(_.isString(energy)) {
            energy = this.room.energyCapacityAvailable;
        }
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
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: roleName, working: false, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createHelper= function(energy, target) {
        if(_.isString(energy)) {
            energy = this.room.energyCapacityAvailable;
        }
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
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'helper', working: false, target: target, homeRoom: this.room.name});
    };

    StructureSpawn.prototype.createExtractor = function(energy) {
        if(_.isString(energy)) {
            energy = this.room.energyCapacityAvailable;
        }
        var numberOfParts = Math.floor(energy/450);
        var body = [];
        for(let i = 0; i < numberOfParts*4; i++) {
            body.push(WORK);
        }
        for(let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        mType = this.room.find(FIND_MINERALS)[0].mineralType;
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body,undefined, {role: 'extractor', working: false, mineralType: mType, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createDefender = function(target) {
        if(this.room.energyCapacityAvailable > 800) {
            var body = [MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE, HEAL];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'defender', target: target, flag: true, homeRoom: this.room.name});
        }
        else {
            var body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'defender', target: target, flag: true, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createMeleeAttacker = function(target) {
        if(this.room.energyCapacityAvailable > 1900) {
            var body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
            ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'meleeAttacker', target:target, homeRoom: this.room.name});
        } else {
            var body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'meleeAttacker', target:target, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createLongDistanceHarvester = function (target) {
        var numberOfParts = Math.floor(this.room.memory.energyForRoles.longDistanceHarvester/200);
        //console.log(JSON.stringify(this.room.memory.energyForRoles));
        var body = [];
        for(let i = 0; i < numberOfParts; i++){
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'longDistanceHarvester', working: false, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceRepairer = function (target) {
        var body = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'longDistanceRepairer', working: false, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceLorry = function(target, energy, containerID) {
        var numberOfParts = Math.floor(energy/150);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY, CARRY, MOVE);
        }

        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: "longDistanceLorry", target: target, working: false,containerID: containerID, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createClaimer = function(target) {
        if(this.room.energyCapacityAvailable < 1300) {
            var body = [CLAIM,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        } else if (this.room.energyCapacityAvailable < 1950) {
            var body = [CLAIM,MOVE,CLAIM,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        } else {
            var body = [CLAIM,MOVE,CLAIM,MOVE,CLAIM,MOVE];
            energyUsed = calculateCostOfBody(body);
            return this.createCreep(body, undefined, {role: 'claimer', target: target, homeRoom: this.room.name});
        }
    };
    
    StructureSpawn.prototype.createMiner = function(sourceID) {
        var body = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'miner', sourceID: sourceID, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createLongDistanceMiner = function(target, containerID) {
        var body = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'longDistanceMiner', containerID: containerID, target: target, homeRoom: this.room.name});
    };
    
    StructureSpawn.prototype.createCarrier = function(energy, role, towerID, containerID) {
        if(_.isString(energy)) {
            energy = this.room.energyCapacityAvailable;
        }
        var numberOfParts = Math.floor(energy/150);
        var body = [];
        for(let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
            body.push(CARRY);
            body.push(MOVE);
        }
        energyUsed = calculateCostOfBody(body);
        if(role == 'lorry') {
            return this.createCreep(body, undefined, {role: role, working: false, containerID: containerID, homeRoom: this.room.name});
        } else {
            return this.createCreep(body, undefined, {role: role, working: false, homeRoom: this.room.name, towerID: towerID});
        }
    };
    
    StructureSpawn.prototype.createUpgrader = function(energy, role) {
        if(_.isString(energy)) {
            energy = this.room.energyCapacityAvailable;
        }
        if(role == 'upgrader'){
            if(this.room.controller.level < 7 || this.room.name == 'W78N26'){
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
            } else {
                body = Array(50).fill(WORK,0,45).fill(MOVE,45,49).fill(CARRY,49,50);
            }
        } else if(role == 'mobileUpgrader') {
            if(energy >= 1350) {
                var useEnergy = energy - 150;
                var numberOfParts = Math.floor(useEnergy/400);
                var body = [];
                for(let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE);
                    body.push(WORK);
                    body.push(WORK);
                    body.push(WORK);
                    body.push(CARRY);
                }
                body.push(MOVE);
                body.push(CARRY);
                body.push(CARRY);
            } else {

                var numberOfParts = Math.floor(energy/200);
                var body = [];
                for(let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
            }
        }
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: role, working: false, homeRoom: this.room.name});
    };

    StructureSpawn.prototype.createScout = function(target) {
        var body = [MOVE];
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'scout', target: target, homeRoom: this.room.name});
    };

    StructureSpawn.prototype.createSquad = function(subRole) {
        var name = undefined;
        var energy = this.room.energyCapacityAvailable;
        var body = [];
        if(this.room.controller.level > 5) {
            if(subRole == 'meleeAttacker') {
                body = Array(38).fill(TOUGH,0,5).fill(MOVE,5,18).fill(ATTACK,18,38);
            } else if(subRole == 'rangedAttacker') {
                body = Array(26).fill(TOUGH,0,5).fill(MOVE,5,14).fill(RANGED_ATTACK,14,26);
            } else if(subRole == 'healer') {
                body = Array(18).fill(TOUGH,0,5).fill(MOVE,5,11).fill(HEAL,11,28);
            }
        } else {
            if(subRole == 'meleeAttacker') {
                body = Array(23).fill(TOUGH,0,5).fill(MOVE,5,13).fill(ATTACK,13,23);
            } else if(subRole == 'rangedAttacker') {
                body = Array(18).fill(TOUGH,0,5).fill(MOVE,5,13).fill(RANGED_ATTACK,13,18);
            } else if(subRole == 'healer') {
                body = Array(14).fill(TOUGH,0,5).fill(MOVE,5,10).fill(HEAL,10,14);
            }
        }
        energyUsed = calculateCostOfBody(body);
        return this.createCreep(body, undefined, {role: 'squadMember', subRole: subRole, target: this.room.memory.creepLocation, homeRoom: this.room.name, engage: false})
    };

    StructureSpawn.prototype.defenseProcedure = function() {
        var invasion = this.checkForInvasion();
        var name = undefined;
        if(invasion) {
            Game.notify("Hostile Squad spotted in room " + this.room.memory.creepLocation);
            console.log("Hostile Squad spotted in room " + this.room.memory.creepLocation);
            name = this.assembleSquad();
        } else {
            name = this.sendDefender();
        }
        return name;
    };

    StructureSpawn.prototype.checkForInvasion = function() {
        let room = Game.rooms[this.room.memory.creepLocation];
        if(room != undefined){
            if(room.name == this.room.name) {
                return true;
            }
            let creeps = room.find(FIND_HOSTILE_CREEPS);
            if(creeps.length > 1) {
                return true;
            } else { 
                return false;
            }
        }
        return -1;
    };

    StructureSpawn.prototype.sendDefender = function() {
        var name = undefined;
        let numDefenders = 0;
        let role = 'defender';
        if(Memory.currentCreeps[role] == undefined){
            numDefenders++;
        } else {
            for(let creepRole in Memory.currentCreeps[role]) {
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep != undefined){
                    if(creep.memory.target == this.room.memory.creepLocation) {
                      numDefenders = 0;
                      break;
                    }
                }
                numDefenders++;
            }   
        }
        if(numDefenders > 0) {
            name = this.createDefender(this.room.memory.creepLocation);
            if(name != undefined && _.isString(name)){
                console.log("Defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned defender: " + name + ", Objective location: " + this.room.memory.creepLocation);
                this.room.memory.hostileCreep = false;
                if(this.room.memory.helping == undefined) {
                    this.room.memory.helping = [];
                }
                this.room.memory.helping.push(this.room.memory.creepLocation);
            }
        } 
        return name;
    };

    StructureSpawn.prototype.assembleSquad = function() {// doesnt set fellow squadmates ID's
        var name = undefined;
        let role = 'squadMember';
        let heal = false;
        let melee = false;
        let ranged = false;
        if(Memory.currentCreeps[role] == undefined) {
            Memory.currentCreeps[role] = [];
        }
        for(let creepRole in Memory.currentCreeps[role]) {
            let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
            if(creep.memory.subRole == 'healer' && creep.memory.homeRoom == this.room.name){
                heal = true;
            } else if(creep.memory.subRole == 'meleeAttacker' && creep.memory.homeRoom == this.room.name) {
                melee = true;
            } else if(creep.memory.subRole == 'rangedAttacker' && creep.memory.homeRoom == this.room.name) {
                ranged = true;
            }
        } 
        if(melee == false) {
            name = this.createSquad('meleeAttacker');
            if(name != undefined && _.isString(name)){
                console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned meleeAttacker: " + name + ", Objective location: " + this.room.memory.creepLocation);
            }
        } else if(ranged == false) {
            name = this.createSquad('rangedAttacker');
            if(name != undefined && _.isString(name)){
                console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned rangedAttacker: " + name + ", Objective location: " + this.room.memory.creepLocation);
            }
        } else if (heal == false) {
            name = this.createSquad('healer');
            if(name != undefined && _.isString(name)){
                console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned healer: " + name + ", Objective location: " + this.room.memory.creepLocation);
            }
        } else {
            var squadMates = {};
            squadMates.healer = undefined;
            squadMates.meleeAttacker = undefined;
            squadMates.rangedAttacker = undefined;
            for(let creepRole in Memory.currentCreeps[role]) {
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep.memory.homeRoom == this.room.name){
                    creep.memory.engage = true;
                    squadMates[creep.memory.subRole] = creep.id;
                } 
            } 
            for(let creepRole in Memory.currentCreeps[role]) {
                let creep = Game.creeps[Memory.currentCreeps[role][creepRole]];
                if(creep.memory.homeRoom == this.room.name){
                    if(creep.memory.subRole == 'healer'){
                        creep.memory.rangedMate = squadMates.rangedAttacker;
                        creep.memory.meleeMate = squadMates.meleeAttacker;
                    } else if(creep.memory.subRole == 'meleeAttacker') {
                        creep.memory.rangedMate = squadMates.rangedAttacker;
                        creep.memory.healerMate = squadMates.healer;
                    } else if(creep.memory.subRole == 'rangedAttacker') {
                        creep.memory.meleeMate = squadMates.meleeAttacker;
                        creep.memory.healerMate = squadMates.healer;
                    }
                    squadMates[creep.memory.subRole] = creep.id;
                } 
            } 
            this.memory.hostileCreep = false;
        }
        if(name != undefined && _.isString(name)) {
            if(Memory.currentCreeps[role] == undefined) {
                Memory.currentCreeps[role] = [];
            } 
            Memory.currentCreeps[role].push(name);
        }
        return name;
    };


 calculateCostOfBody = function(body) {
        var cost = 0;
        for(let part of body) {
            //console.log(part);
            switch(part) {
            case 'work':
                cost += 100;
                break;
            case 'carry':
                cost += 50;
                break;
            case 'move':
                cost += 50;
                break;
            case 'claim':
                cost += 600;
                break;
            case 'attack':
                cost += 80;
                break;
            case 'heal':
                cost += 250;
                break;
            case RANGED_ATTACK:
                cost += 150;
                break;
            case TOUGH:
                cost += 10;
                break;
            default:
                return -1;
            }
        }
        return cost;
    };