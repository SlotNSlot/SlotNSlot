pragma solidity ^0.4.0;

contract PaytableStorage {

    struct Payline {
        uint16 prize;
        uint prob;
    }

    mapping (uint16 => mapping (uint16 => Payline[])) private payTable;

    function addPayline(uint16 maxPrize, uint16 targetProb, uint16 prize, uint prob) {
        payTable[maxPrize][targetProb].push(Payline(prize, prob));
    }

    function PaytableStorage() {
        addPayline(1000,100,0,0);
        addPayline(1000,100,5,7223700000);
        addPayline(1000,100,10,2102600000);
        addPayline(1000,100,25,411320000);
        addPayline(1000,100,50,119720000);
        addPayline(1000,100,75,58160000);
        addPayline(1000,100,100,34846000);
        addPayline(1000,100,125,23421000);
        addPayline(1000,100,150,16928000);
        addPayline(1000,100,250,6816900);
        addPayline(1000,100,500,1984200);
        addPayline(1000,100,1000,577520);

        addPayline(1000,125,0,0);
        addPayline(1000,125,5,9461100000);
        addPayline(1000,125,10,2426600000);
        addPayline(1000,125,25,401620000);
        addPayline(1000,125,50,103010000);
        addPayline(1000,125,75,46471000);
        addPayline(1000,125,100,26419000);
        addPayline(1000,125,125,17048000);
        addPayline(1000,125,150,11919000);
        addPayline(1000,125,250,4372500);
        addPayline(1000,125,500,1121500);
        addPayline(1000,125,1000,287640);

        addPayline(1000,150,0,0);
        addPayline(1000,150,5,12186000000);
        addPayline(1000,150,10,2423700000);
        addPayline(1000,150,25,286600000);
        addPayline(1000,150,50,57000000);
        addPayline(1000,150,75,22161000);
        addPayline(1000,150,100,11336000);
        addPayline(1000,150,125,6740200);
        addPayline(1000,150,150,4407400);
        addPayline(1000,150,250,1340500);
        addPayline(1000,150,500,266610);
        addPayline(1000,150,1000,53024);
/*
        addPayline(1500,100,0,0);
        addPayline(1500,100,5,7017600000);
        addPayline(1500,100,10,2183900000);
        addPayline(1500,100,25,466740000);
        addPayline(1500,100,50,145250000);
        addPayline(1500,100,75,73378000);
        addPayline(1500,100,100,45202000);
        addPayline(1500,100,125,31043000);
        addPayline(1500,100,150,22836000);
        addPayline(1500,100,250,9660600);
        addPayline(1500,100,500,3006400);
        addPayline(1500,100,1000,935600);
        addPayline(1500,100,1500,472650);

        addPayline(1500,125,0,0);
        addPayline(1500,125,5,9424000000);
        addPayline(1500,125,10,2445400000);
        addPayline(1500,125,25,411020000);
        addPayline(1500,125,50,106660000);
        addPayline(1500,125,75,48447000);
        addPayline(1500,125,100,27676000);
        addPayline(1500,125,125,17926000);
        addPayline(1500,125,150,12571000);
        addPayline(1500,125,250,4651700);
        addPayline(1500,125,500,1207100);
        addPayline(1500,125,1000,313220);
        addPayline(1500,125,1500,142280);

        addPayline(1500,150,0,0);
        addPayline(1500,150,5,12118000000);
        addPayline(1500,150,10,2468400000);
        addPayline(1500,150,25,301250000);
        addPayline(1500,150,50,61363000);
        addPayline(1500,150,75,24193000);
        addPayline(1500,150,100,12499000);
        addPayline(1500,150,125,7489000);
        addPayline(1500,150,150,4927900);
        addPayline(1500,150,250,1525500);
        addPayline(1500,150,500,310730);
        addPayline(1500,150,1000,63293);
        addPayline(1500,150,1500,24954);*/

/*
        addPayline(2000,100,0,0);
        addPayline(2000,100,5,6986400000);
        addPayline(2000,100,10,2195400000);
        addPayline(2000,100,25,475230000);
        addPayline(2000,100,50,149330000);
        addPayline(2000,100,75,75869000);
        addPayline(2000,100,100,46925000);
        addPayline(2000,100,125,32326000);
        addPayline(2000,100,150,23841000);
        addPayline(2000,100,250,10158000);
        addPayline(2000,100,500,3192000);
        addPayline(2000,100,1000,1003000);
        addPayline(2000,100,1500,315180);*/
/*
        addPayline(2000,125,0,0);
        addPayline(2000,125,5,9379700000);
        addPayline(2000,125,10,2467600000);
        addPayline(2000,125,25,422350000);
        addPayline(2000,125,50,111110000);
        addPayline(2000,125,75,50878000);
        addPayline(2000,125,100,29231000);
        addPayline(2000,125,125,19018000);
        addPayline(2000,125,150,13385000);
        addPayline(2000,125,250,5003200);
        addPayline(2000,125,500,1316200);
        addPayline(2000,125,1000,346270);
        addPayline(2000,125,1500,91098);*/

        /*addPayline(2000,150,0,0);
        addPayline(2000,150,5,11692000000);
        addPayline(2000,150,10,2728200000);
        addPayline(2000,150,25,398470000);
        addPayline(2000,150,50,92977000);
        addPayline(2000,150,75,39689000);
        addPayline(2000,150,100,21695000);
        addPayline(2000,150,125,13580000);
        addPayline(2000,150,150,9260800);
        addPayline(2000,150,250,3168700);
        addPayline(2000,150,500,739360);
        addPayline(2000,150,1000,172520);
        addPayline(2000,150,1500,40255);*/

    }

    function getPayline(uint16 prize, uint16 prob, uint idx) constant returns (uint16, uint) {
        return (payTable[prize][prob][idx].prize, payTable[prize][prob][idx].prob);
    }

    function getNumofPayline(uint16 prize, uint16 prob) constant returns (uint) {
        return payTable[prize][prob].length;
    }

}
