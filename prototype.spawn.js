    var listOfRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper'];
    //var allRoles = ['miner', 'lorry', 'harvester','mobileUpgrader', 'upgrader', 'linkLorry','sourceLorry', 'builder', 'repairer', 'wallRepairer', 'turretSupplier', 'extractor','terminalLorry', 'mineralLorry', 'helper', 'longDistanceLorry', 'longDistanceMiner', 'longDistanceRepairer', 'longDistanceHarvester', 'claimer', 'stealer']
    var energyUsed = 0;

StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
    let maxEnergy = this.room.energyCapacityAvailable;
    var name = undefined;

    //Defense procedure
    if(this.room.name != 'W75N23' && this.room.memory.hostileCreep == true) {
       name = this.defenseProcedure();
        
    } else {
        // Create a backup creep if needed
        name = this.backup();
        // Spawn miners if necessary
        if(this.room.energyCapacityAvailable >= 650) {
            name = this.checkForMiners();
        }

        // if none of the above caused a spawn command check for local roles
        if(!_.isEmpty(this.room.memory.localSpawnQueue) && name == undefined) {
            let role = this.room.memory.localSpawnQueue.shift();//dequeue
            name = this.spawnStandardCreep(role);
        }

        if(!_.isEmpty(this.room.memory.distanceSpawnQueue) && name == undefined) {
            let role = this.room.memory.distanceSpawnQueue.shift();//dequeue role
            let roomName = this.room.memory.distanceSpawnQueue.shift();//dequeue room

            name = this.spawnSpecialCreep(role, roomName);
        }
    }
    //if we spawned a new creep, update currentCreeps for other spawners.
    if(name != undefined && _.isString(name)) {
        let extra = "";
        if(Game.creeps[name].memory.target != undefined){
            extra = Game.creeps[name].memory.target;
        } 
        console.log(this.room.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ") " + extra);

        let creep = Game.creeps[name];
        if(creep.memory.target == undefined){
            if(this.room.memory.creepsOfRoom[creep.memory.role] == undefined) {
                this.room.memory.creepsOfRoom[creep.memory.role] = [];
            }
            this.room.memory.creepsOfRoom[creep.memory.role].push(name);
        } else {
            if(this.room.memory.distanceCreeps[creep.memory.role] == undefined) {
                this.room.memory.distanceCreeps[creep.memory.role] = {}
            }
            if(this.room.memory.distanceCreeps[creep.memory.role][creep.memory.target] == undefined) {
                this.room.memory.distanceCreeps[creep.memory.role][creep.memory.target] = [];
            }
            this.room.memory.distanceCreeps[creep.memory.role][creep.memory.target].push(name);
        }
        this.room.energyAvailable -= energyUsed;
    }
    return 0;
};


StructureSpawn.prototype.backup = function() {
    var name = undefined;
    let numberOfCreeps = this.room.memory.creepsOfRoom;
    if(numberOfCreeps == undefined) {
        //we dont have any creeps left
        name = this.createCustomCreep(200, 'harvester');
    }else
    if((numberOfCreeps['harvester'] == undefined || ( numberOfCreeps['harvester'] != undefined && numberOfCreeps['harvester'].length == 0))
    &&(numberOfCreeps['lorry'] == undefined || (numberOfCreeps['lorry'] != undefined && numberOfCreeps['lorry'].length == 0))
    &&(numberOfCreeps['sourceLorry'] == undefined || (numberOfCreeps['sourceLorry'] != undefined && (numberOfCreeps['sourceLorry'].length == 0 && this.room.storage.store[RESOURCE_ENERGY] != 0)))) {// && this.room.energyAvailable < this.room.memory.energyForRoles['miner'] + this.room.memory.energyForRoles['lorry']) {
        if(numberOfCreeps['miner'] != undefined && numberOfCreeps['miner'] > 0)  {
            name = this.createCarrier(this.room.energyAvailable, 'lorry', undefined, this.room.memory.containers['source1']);
        } else if((this.room.storage != undefined && this.room.storage.store[RESOURCE_ENERGY] >= this.room.memory.energyForRoles['sourceLorry'] + this.room.memory.energyForRoles['miner'] + this.room.memory.energyForRoles['lorry'])) {
            name = this.createCarrier(this.room.memory.energyForRoles['sourceLorry'], 'sourceLorry');
        } else {
            // create a harvester because it can work on its own
            name = this.createCustomCreep(200, 'harvester');
        }
    }
    return name;
};

StructureSpawn.prototype.spawnStandardCreep = function(role) {
    let name = undefined;
    switch(role) {
        case 'miner':
            break;
        case 'lorry':
            let container = this.room.memory.localSpawnQueue.shift();//dequeue container id
            name = this.createCarrier(this.room.memory.energyForRoles[role], role, undefined, container);
            break;
        case 'linkLorry':
        case 'sourceLorry':
            name = this.createCarrier(this.room.memory.energyForRoles[role], role);
            break;
        case 'mineralLorry':
            name = this.createCarrier(this.room.memory.energyForRoles[role], role);
            break;
        case 'upgrader':
        case 'mobileUpgrader':
            name = this.createUpgrader(this.room.memory.energyForRoles[role], role);
            break;
        case 'helper':
            name = this.createHelper(this.room.memory.energyForRoles[role], 'W73N25');
            break;
        case 'turretSupplier':
            let towerID = this.room.memory.localSpawnQueue.shift();//dequeue tower id
            name = this.createCarrier(this.room.memory.energyForRoles[role], role, towerID);
            break;
        case 'extractor':
            name = this.createExtractor(this.room.memory.energyForRoles[role]);                
            break;
        case 'terminalLorry':
            name = this.createCarrier(this.room.memory.energyForRoles['terminalLorry'], 'terminalLorry');
            break;
        default:
            name = this.createCustomCreep(this.room.memory.energyForRoles[role], role);
            break;
    }
    return name;
};

StructureSpawn.prototype.spawnSpecialCreep = function(role, roomName) {
    let name = undefined;
    let container = undefined;
    switch(role) {
        case 'longDistanceLorry':
            container = this.room.memory.distanceSpawnQueue.shift();//dequeue container id
            name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'], container);
            break;
        case 'longDistanceMiner':
            container = this.room.memory.distanceSpawnQueue.shift();//dequeue container id
            name = this.createLongDistanceMiner(roomName,container);
            break;
        case 'longDistanceRepairer':
            name = this.createLongDistanceRepairer(roomName);
            break;
        case 'claimer':
            name = this.createClaimer(roomName);
            break;
        case 'scout':
            name = this.createScout(roomName);
            break;
        case 'longDistanceHarvester':
            name = this.createLongDistanceHarvester(roomName);
            break;
        default:
            console.log('Error spawning long distance creep. Dequeued role not in list: ' + role);
            delete this.room.memory.distanceSpawnQueue;
            //console.log(JSON.stringify(this.room.memory.distanceSpawnQueue));
            break;
    }
    return name;
};

StructureSpawn.prototype.checkForMiners = function() {
    let role = 'miner';
    let sources = this.room.find(FIND_SOURCES);
    if(this.room.memory.creepsOfRoom == undefined){
        this.room.memory.creepsOfRoom = {};
    }
    var miners = this.room.memory.creepsOfRoom[role];
    var name = undefined;
    var found = false;
    // iterate over all sources
    for (let source of sources) {
        found = false;
        if(miners != undefined){
            for(let creepName of miners){
                let creep = Game.creeps[creepName];
                if(creep != undefined){
                    if(creep.memory.sourceID == source.id && (creep.ticksToLive > 40 || creep.ticksToLive == undefined)) {
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
        if(this.room.controller.level < 7 || this.room.name == 'W78N26' || this.room.name == 'W75N23' || this.room.name == 'W73N25' || this.room.name == 'W78N25'){
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
    console.log(this.room.name + " is trying to use " + energyUsed + " to spawn a " + subRole);
    Game.notify(this.room.name + " is trying to use " + energyUsed + " to spawn a " + subRole);
    return this.createCreep(body, undefined, {role: 'squadMember', subRole: subRole, target: this.room.memory.creepLocation, homeRoom: this.room.name, engage: false})
};

StructureSpawn.prototype.defenseProcedure = function() {
    var invasion = this.checkForInvasion();
    var name = undefined;
    if(invasion) {
        //Game.notify("Hostile Squad spotted in room " + this.room.memory.creepLocation);
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
    let addDefender = false;
    if(this.room.memory.distanceCreeps[role] == undefined){
        addDefender = true;
    } 
    if(addDefender) {
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
    let target = this.room.memory.creepLocation;
    if(this.room.memory.distanceCreeps == undefined) {
        this.room.memory.distanceCreeps = {};
    }
    if(this.room.memory.distanceCreeps[role] == undefined){
        this.room.memory.distanceCreeps[role] = {};
    }
    if(this.room.memory.distanceCreeps[role][target] == undefined){
        this.room.memory.distanceCreeps[role][target] = [];
    }
    for(let creepName of this.room.memory.distanceCreeps[role][target]) {
        console.log(creepName);
        let creep = Game.creeps[creepName];
        if(creep == undefined){
            break;
        } else if(creep.memory.subRole == 'healer' && creep.memory.homeRoom == this.room.name){
            heal = true;
        } else if(creep.memory.subRole == 'meleeAttacker' && creep.memory.homeRoom == this.room.name) {
            melee = true;
        } else if(creep.memory.subRole == 'rangedAttacker' && creep.memory.homeRoom == this.room.name) {
            ranged = true;
        }
    } 
    if(melee == false) {
        name = this.createSquad('meleeAttacker');
        this.room.memory.distanceCreeps[role][target].push(name);
        if(name != undefined && _.isString(name)){
            console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned meleeAttacker: " + name + ", Objective location: " + this.room.memory.creepLocation);
        }
    } else if(ranged == false) {
        name = this.createSquad('rangedAttacker');
        this.room.memory.distanceCreeps[role][target].push(name);
        if(name != undefined && _.isString(name)){
            console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned rangedAttacker: " + name + ", Objective location: " + this.room.memory.creepLocation);
        }
    } else if (heal == false) {
        name = this.createSquad('healer');
        this.room.memory.distanceCreeps[role][target].push(name);
        if(name != undefined && _.isString(name)){
            console.log("Squad defence protocall initiated: " + this.name + " in room " + this.room.name + " spawned healer: " + name + ", Objective location: " + this.room.memory.creepLocation);
        }
    } else {
        var squadMates = {};
        squadMates.healer = undefined;
        squadMates.meleeAttacker = undefined;
        squadMates.rangedAttacker = undefined;
        for(let creepName in this.room.memory.distanceCreeps[role][target]) {
            let creep = Game.creeps[creepName];
            if(creep.memory.homeRoom == this.room.name){
                creep.memory.engage = true;
                squadMates[creep.memory.subRole] = creep.id;
            } 
        } 
        for(let creepName in this.room.memory.distanceCreeps[role][target]) {
            let creep = Game.creeps[creepName];
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
        this.room.memory.distanceCreeps[role][target].push(name);
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