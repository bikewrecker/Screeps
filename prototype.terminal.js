StructureTerminal.prototype.sellMinerals = function() {
    var mineral = this.room.find(FIND_MINERALS)[0].mineralType;
    var minPrice = {'Z': 0.15, 'H': 0.15};
    
    if(this.store[RESOURCE_ENERGY] >= 2000 && this.store[mineral] > 4000) {
        var orders = Game.market.getAllOrders(order => order.resourceType == mineral && order.type == ORDER_BUY && order.remainingAmount >= 2000 && Game.market.calcTransactionCost(2000, this.room.name, order.roomName) < 1500);
        orders.sort(function(a,b){return b.price - a.price;});
        if(orders[0].price >= minPrice[mineral]) {
            let result = Game.market.deal(orders[0].id, 2000, this.room.name);
             if (result == 0) {
                console.log(mineral + ' buy orders found: ' + orders.length);
                console.log('Best price: ' + orders[0].price);
                console.log("Order completed successfully for " + Game.market.calcTransactionCost(2000, this.room.name, orders[0].roomName) + " energy. " +  orders[0].price * 2000 + " total credits recieved");
            }
        }
    }
}