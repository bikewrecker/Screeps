StructureLink.prototype.activate = function(link, percent) {
    if(this.energy / this.energyCapacity >= percent) {
        this.transferEnergy(link);
    }
};