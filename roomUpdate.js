Room.prototype.updateSpawnQueues = function() {
	if(this.memory.localSpawnQueue == undefined) {
		this.memory.localSpawnQueue = [];
	}
	for(let role of this.memory.creepsOfRoom){
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
            break;
		}
		if(this.memory.creepsOfRoom[role] < this.memory.minCreeps[role]){
			switch(role) {
				case 'lorry':
					var containers = this.memory.containers;
			        var found = false;        
			        for(let container in containers) {
			            found = false;
			            if(container != 'mineral') {
			                for(let creepRole of Memory.currentCreeps[role]) {
			                    let creep = Game.creeps[creepRole];
			                    if(creep != undefined){
			                        if(creep.memory.homeRoom == this.name && creep.memory.containerID == containers[container]){
			                            found = true;
			                            break;
			                        }
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
					let ammount = this.memory.minCreeps[role] - this.memory.creepsOfRoom[role];
					for(let i = 0; i < ammount; i++) {
						this.memory.localSpawnQueue.push(role);
					}
					break;
			}
		}
	}
	if(this.memory.distanceSpawnQueue == undefined) {
		this.memory.distanceSpawnQueue = [];
	}

	let role = 'claimer';
	for (let roomName in this.memory.maxClaimers) {
        if(roomName != undefined){
            if(this.energyCapacityAvailable > 800){
                if(this.memory.distanceCreeps[role][roomName] < this.memory.maxClaimers[roomName] && this.memory.distanceRooms[roomName].reserveTimer < 4000){
                    this.memory.distanceSpawnQueue.push(role);
					this.memory.distanceSpawnQueue.push(room);
                }
            } else {
                if(this.memory.distanceCreeps[role][roomName] < this.memory.maxClaimers[roomName]) {
                	this.memory.distanceSpawnQueue.push(role);
					this.memory.distanceSpawnQueue.push(room);
                }
            }
        }
  	}
	for(let role of this.memory.minDistanceCreeps){
		if(role == 'scout'){
			for (let roomName in this.memory.distanceRooms) {
				if(this.memory.distanceCreeps[role][roomName] == undefined || this.memory.distanceCreeps[role][roomName] == 0) {
					this.memory.distanceSpawnQueue.push(role);
					this.memory.distanceSpawnQueue.push(room);
				}
        	}
        	break;
        }
		for(let room of this.memory.minDistanceCreeps[role]){
			switch(role) {
				case 'longDistanceLorry':
					if(this.memory.distanceCreeps[role][room] < this.memory.minDistanceCreeps[role][room]){
						let cont1 = this.memory.distanceRooms[roomName].container1;
		                let cont2 = this.memory.distanceRooms[roomName].container2;
		                //if we dont have any creeps in the target room
		                if(cont2 == undefined || this.memory.distanceCreeps[role][room] == 0) {
		                	this.memory.distanceSpawnQueue.push(role);
							this.memory.distanceSpawnQueue.push(room);
							this.memory.distanceSpawnQueue.push(cont1);
		                } else {
		                    //if we only have one in the target room
		                    if(this.memory.distanceCreeps[role][room] == 1) {
		                    	let currentContainer = undefined;
		                    	for(let creepName of Memory.currentCreeps[role]){
		                    		let creep = Game.creeps[Memory.currentCreeps[role][creepName]];
		                    		if(creep.memory.homeRoom == this.name && creep.memory.target = room) {
		                    			currentContainer = creep.memory.containerID;
		                    			break;
		                    		}
		                    	}
		                        if(currentContainer == cont1) {
		                        	this.memory.distanceSpawnQueue.push(role);
									this.memory.distanceSpawnQueue.push(room);
									this.memory.distanceSpawnQueue.push(cont2);
		                        } else {
		                        	this.memory.distanceSpawnQueue.push(role);
									this.memory.distanceSpawnQueue.push(room);
									this.memory.distanceSpawnQueue.push(cont1);
		                        }
		                    // if we have 2 or more lorrys in the room
		                    } else {
	                            let c1 = 0;
	                            let c2 = 0;
		                    	for(let creepName of Memory.currentCreeps[role]){
		                    		let creep = Game.creeps[Memory.currentCreeps[role][creepName]];
		                    		if(creep.memory.homeRoom == this.name && creep.memory.target = room) {
		                    			if(creep.memory.containerID == cont1) {
		                    				c1++
		                    			} else {
		                    				c2++;
		                    			}
		                    		}
		                    	}
	                            //if we have more creeps using container 1 spawn a creep to use container 2
	                            if(c1 > c2){
	                            	this.memory.distanceSpawnQueue.push(role);
									this.memory.distanceSpawnQueue.push(room);
									this.memory.distanceSpawnQueue.push(cont2);
	                            } else { //if we have more creeps using container 2 or the same number using both, create a creep that uses container 1
	                            	this.memory.distanceSpawnQueue.push(role);
									this.memory.distanceSpawnQueue.push(room);
									this.memory.distanceSpawnQueue.push(cont1);
	                            }
	                        } 
	                    }
	                }
					break;
				case 'longDistanceMiner': 
					if(this.memory.distanceCreeps[role][room] < this.memory.minDistanceCreeps[role][room]){
						let cont1 = this.memory.distanceRooms[room].container1;
						let cont2 = this.memory.distanceRooms[room].container2;
						if(cont2 == undefined){
							this.memory.distanceSpawnQueue.push(role);
							this.memory.distanceSpawnQueue.push(room);
							this.memory.distanceSpawnQueue.push(cont1);
						} else {
		                    let currentContainer = undefined;
	                    	for(let creepName of Memory.currentCreeps[role]){
	                    		let creep = Game.creeps[Memory.currentCreeps[role][creepName]];
	                    		if(creep.memory.homeRoom == this.name && creep.memory.target = room) {
	                    			currentContainer = creep.memory.containerID;
	                    			break;
	                    		}
	                    	}
	                        if(currentContainer == cont1) {
	                        	this.memory.distanceSpawnQueue.push(role);
								this.memory.distanceSpawnQueue.push(room);
								this.memory.distanceSpawnQueue.push(cont2);
	                        } else {
	                        	this.memory.distanceSpawnQueue.push(role);
								this.memory.distanceSpawnQueue.push(room);
								this.memory.distanceSpawnQueue.push(cont1);
	                        }
		                }
		            }
					break;
				case 'longDistanceRepairer':
				case 'longDistanceHarvester':
					if(this.memory.distanceCreeps[role][room] < this.memory.minDistanceCreeps[role][room]){
						this.memory.distanceSpawnQueue.push(role);
						this.memory.distanceSpawnQueue.push(room);
					}
					break;
			}

			if(this.memory.distanceCreeps[role][room] < this.memory.minDistanceCreeps[role][room]){
				let ammount = this.memory.minDistanceCreeps[role][room] - this.memory.distanceCreeps[role][room];
				for(let i = 0; i < ammount; i++) {
					this.memory.distanceSpawnQueue.push(role);
					this.memory.distanceSpawnQueue.push(room);
				}
			}
		}
	}
};

// EDIT: this will be done at the global level instead of the room level
Room.prototype.updateRoomCreeps = function() {
	if(this.memory.creepsOfRoom == undefined) {
		this.memory.creepsOfRoom = {};
	}
	if(this.memory.distanceCreeps == undefined) {
		this.memory.distanceCreeps = {};
	}
	for(let role of Memory.creepRoles) {
		if(role != 'longDistanceHarvester' && role != 'longDistanceLorry' && role != 'longDistanceMiner' && role != 'longDistanceRepairer' && role != 'scout' && role != 'claimer') {
			if(Memory.currentCreeps[role] != undefined){
				if(this.memory.creepsOfRoom[role] == undefined) {
					this.memory.creepsOfRoom[role] = [];
				} 
				for(let creepName in Memory.currentCreeps[role]) {
					let creep = Game.creeps[Memory.currentCreeps[role][creepName]];
					if(creep.memory.homeRoom == this.name && (creep.ticksToLive > 150 || creep.ticksToLive == undefined)) {
						this.memory.creepsOfRoom[role].push(creep.name);
					}
				}
			}
		} else {
			if(Memory.currentCreeps[role] != undefined){
				if(this.memory.distanceCreeps[role] == undefined) {
					this.memory.distanceCreeps[role] = {};
				} 
				for(let creepName in Memory.currentCreeps[role]) {
					let creep = Game.creeps[Memory.currentCreeps[role][creepName]];
					if(creep.memory.homeRoom == this.name && (creep.ticksToLive > 150 || creep.ticksToLive == undefined)) {
						if(this.memory.distanceCreeps[role][creep.memory.target] == undefined) {
							this.memory.distanceCreeps[role][creep.memory.target] = [];
						}
						this.memory.distanceCreeps[role][creep.memory.target].push(creep.name);
					}
				}
			}
		}
	} // fills up creepsOfRoom and distanceCreeps arrays with current number of creeps in game that were made by this room. 
};// EDIT: this will be done at the global level instead of the room level



///SPANW UPDATE


StructureSpawn.prototype.spawnCreepsIfNecessary = function () {
    let maxEnergy = this.room.energyCapacityAvailable;
    let name = undefined;

    //Defense procedure
    if(this.room.memory.hostileCreep == true) {
       name = this.defenseProcedure();
        
    } else {
        // Create a backup creep if needed
        name = this.backup();
        // Spawn miners if necessary
        name = this.checkForMiners();

        // if none of the above caused a spawn command check for local roles
        if(name == undefined) {
        	let role = this.room.memory.localSpawnQueue.shift();//dequeue
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
        }

        if(name == undefined) {
        	let name = undefined;
        	let role = this.room.memory.distanceSpawnQueue.shift();//dequeue role
        	let roomName = this.room.memory.distanceSpawnQueue.shift();//dequeue room
        	switch(role) {
        		case 'longDistanceLorry':
        			let container = this.room.memory.distanceSpawnQueue.shift();//dequeue container id
        			name = this.createLongDistanceLorry(roomName, this.room.memory.energyForRoles['longDistanceLorry'], container);
        			break;
        		case 'longDistanceMiner':
        			let container = this.room.memory.distanceSpawnQueue.shift();//dequeue container id
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
        			break;
        	}

        }

        //if spawn was successfull
        if (name != undefined && _.isString(name)) {
        	let extra = "";
            if(Game.creeps[name].memory.target != undefined){
            	extra = Game.creeps[name].memory.target;
            } 
            console.log(this.room.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")" + extra);
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


StructureSpawn.prototype.backup = function() {
    var name = undefined;
    let numberOfCreeps = this.room.memory.creepsOfRoom;
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


