var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
    turretSupplier: require('role.turretSupplier'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    claimer: require('role.claimer'),
    miner: require('role.miner'),
    lorry: require('role.lorry'),
    linkLorry: require('role.linkLorry'),
    sourceLorry: require('role.sourceLorry'),
    defender: require('role.defender'),
    helper: require('role.helper'),
    longDistanceMiner: require('role.longDistanceMiner'),
    longDistanceLorry: require('role.longDistanceLorry'),
    longDistanceRepairer: require('role.longDistanceRepairer'),
    healer: require('role.healer'),
    extractor: require('role.extractor'),
    terminalLorry: require('role.terminalLorry'),
    mineralLorry: require('role.mineralLorry'),
    manual: require('role.manual'),
    mobileUpgrader: require('role.mobileUpgrader'),
    meleeAttacker: require('role.meleeAttacker'),
    stealer: require('role.stealer'),
    scout: require('role.scout'),
    squadMember: require('role.squadMember'),
    rangedAttacker: require('role.rangedAttacker')
};

Creep.prototype.runRole =
    function () {
        roles[this.memory.role].run(this);
    };
    
Creep.prototype.getEnergyFromContainer = function () {
        if(this.memory.containerID != undefined){
            var container = Game.getObjectById(this.memory.containerID);
        } else{
            // find closest container
            var source = this.pos.findClosestByPath(FIND_SOURCES);
            if(source != undefined){
                var container = source.pos.findInRange(FIND_STRUCTURES, 1, {filter: s => s.structureType == STRUCTURE_CONTAINER})[0];
            }
        }
        // if one was found    

        if (container != undefined) {
            // try to withdraw energy, if the container is not in range
            if(container.store[RESOURCE_ENERGY] > 10) {
                var taken = this.withdraw(container, RESOURCE_ENERGY);
                if (taken == ERR_NOT_IN_RANGE) {
                    // move towards it
                    this.moveTo(container);
                    return 1;
                }
                return taken;
            }
            return -6;
        } else {
            return -1;
        }
    };
    
    Creep.prototype.getResourcesFromContainer =
    function () {
        if(this.memory.containerID != undefined){
            var container = Game.getObjectById(this.memory.containerID);
        } else{
            // find closest container
            var container = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER});
        }
        // if one was found
        if (container != undefined) {
            let rez = _.findKey(container.store);
            if (this.withdraw(container, rez) == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(container);
            }
            return 0;
        } else {
            return -1;
        }
    };
    
Creep.prototype.getEnergyFromSource =
    function () {
        if(this.memory.sourceID != undefined){
            var source = Game.getObjectById(this.memory.sourceID);
        } else{
            var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        }
        if(source == undefined) {
           // this.moveTo(Game.flags[this.memory.target + "Source"])
        } else{
            var harv = this.harvest(source);
            if (harv == ERR_NOT_IN_RANGE) {
                // move towards it
                let mv = this.moveTo(source);
                if(mv != 0){
                    this.moveTo(Game.flags[this.memory.target + "Source"]);
                }
            }
            return harv;
        }
    };
    
Creep.prototype.getEnergyFromStorage =
    function () {
        var container;
        // find closest storage
        container = this.room.storage;
        // if one was found
        if(container == undefined){
            this.moveTo(Game.flags[this.memory.target + "Source"]);
        } else {
            // try to withdraw energy, if the container is not in range
            let wi = this.withdraw(container, RESOURCE_ENERGY);
            if (wi == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(container);
            }
            return wi;
        }
        return -1;
    };
    
Creep.prototype.getEnergyFromLink = function (linkID) {
        if(linkID != undefined) {
           var link = Game.getObjectById(linkID); 
        } else{
            var link = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: s=> s.structureType == STRUCTURE_LINK});
        }
        // try to harvest energy, if the source is not in range
        if(link != undefined){
            // try to withdraw energy, if the container is not in range
            let withDrew = this.withdraw(link, RESOURCE_ENERGY);
            if (withDrew == ERR_NOT_IN_RANGE) {
                // move towards it
                this.moveTo(link);
            }
            return withDrew;
        } else {
            console.log("couldnt find a link");
            return -1;
        }
    };
    
Creep.prototype.getEnergyFromGround = function () {
        const target = this.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: r => r.resourceType == RESOURCE_ENERGY});
        if(target != undefined) {
            var pick = this.pickup(target);
            if(pick == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
                return 1;
            } 
            return pick;
        } else {
            return -1;
        }
    };
    
    Creep.prototype.work = function (max) {
        if(max == undefined){
            if(this.memory.working == true && _.sum(this.carry) == 0){
                this.memory.working = false;
            } else if(this.memory.working == false && (_.sum(this.carry) == this.carryCapacity)) {
                this.memory.working = true;
            }
        } else {
            if(this.memory.working == true &&  _.sum(this.carry) == 0){
                this.memory.working = false;
            } else if(this.memory.working == false && (_.sum(this.carry) / this.carryCapacity > max)) {
                this.memory.working = true;
            }
        }
    };
    
    Creep.prototype.checkGround = function(distance) {
        let nearbyEnergy = this.pos.findInRange(FIND_DROPPED_RESOURCES, distance)[0];
            if(nearbyEnergy != undefined && nearbyEnergy.amount > 10) {
               let ret = this.getEnergyFromGround();
               return ret;
            } else {
                return -1;
            }
    };
    
    Creep.prototype.renewSelf = function() {
        var spawn = this.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_SPAWN})[0];
        if(spawn != undefined && spawn.room.energyAvailable >= 100){
            var ren = spawn.renewCreep(this);
            if(ren == ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
            if(this.carry.energy > 0){
                this.transfer(spawn,RESOURCE_ENERGY);
            }
            //console.log(ren);
        }
    };