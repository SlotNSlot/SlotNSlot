pragma solidity ^0.4.0;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract PaytableStorage is Ownable {

    mapping (uint16 => mapping (uint16 => uint[2])) private payTable;
    /*

    payTable[prize][prob][0] (256 bits)

    ----------------------------------------- 256 ----------------------------------
    | remained bits | paylinevalue[6] | paylinevalue[5] | ******** | paylinevalue[1] |
    ---- 4 -----	  ----- 42 -----    ----- 42 -----    - 42*3 -     ----- 42 -----


    payTable[prize][prob][1] (256 bits)

    ----------------------------------------- 256 -----------------------------------
    | remained bits | paylinevalue[12] | paylinevalue[11] | ******** | paylinevalue[7] |
    ---- 4 -----	  ----- 42 -----    ----- 42 -----      - 42*3 -    ----- 42 -----


    each paylinevalue (42 bits)

    | occupation |  prize  |
    ---- 31 ----   -- 11 --

    occupation = probability * 10^10

    */

    function PaytableStorage() {
        payTable[1000][100][0] = 0xb006a57b219002c5f4e04b016d5b8c0c8139cfcc81919107c0a02958739a9805;
        payTable[1000][100][1] = 0x70cc3e800060e207d0005336e8fa0033a926258011de5b87d;

        payTable[1000][125][0] = 0xb0050a004190023746b84b013a59f80c813268958191ced64aa029c3246b4005;
        payTable[1000][125][1] = 0x382dbe800036c247d000356020fa00245fb425800d01b907d;

        payTable[1000][150][0] = 0xb00229894190010e84204b00adf3580c80daa8808191ce47eec02a4517e7f805;
        payTable[1000][150][1] = 0xa5b3e80000d0487d000105d20fa000d7348258005247407d;

        payTable[1500][100][0] = 0xc0089f268190037fbb184b01bb44e80c816417be8191a08b8860294e9fd70805;
        payTable[1500][100][1] = 0x17143770000b6bc3e800092cc07d00075ed48fa0045b04a258017af0407d;

        payTable[1500][125][0] = 0xc005475e8190024f64904b01457cb00c813995690191d26d704029c15ea45005;
        payTable[1500][125][1] = 0x6f277700003d2d3e80003af067d00038c898fa00265d7825800dad3f87d;

        payTable[1500][150][0] = 0xc002624fa190012751b04b00bb43880c80e5d5c90191d6cd57402a41d4c16005;
        payTable[1500][150][1] = 0x137f7700000c5cbe80000f2c07d000129f08fa000f09e4258005b6b007d;

        payTable[2000][100][0] = 0xc008f344c190039e23984b01c7ba800c816a92e48191a2bb5d80294d23bc3005;
        payTable[2000][100][1] = 0xf63bf40000c3e6be80009bdb67d0007bff98fa0048c16a258018a9bd07d;

        payTable[2000][125][0] = 0xc005934f2190026d13004b015316220c81423a468191d6a85fc029bf41e29805;
        payTable[2000][125][1] = 0x472bf4000043a1be80004044e7d0003d12e8fa0028d91825800e826507d;

        payTable[2000][150][0] = 0xc0042351a19001e47b684b011bbe080c813001678192085bd6202a2d85058805;
        payTable[2000][150][1] = 0x1f73f4000021b23e8000241a07d00026ae08fa001c430625800a5c4c87d;

    }

    function getPayline(uint16 _prize, uint16 _prob) constant returns (uint[2]) {
        return payTable[_prize][_prob];
    }

    function getNumofPayline(uint16 _prize, uint16 _prob) constant returns (uint8) {
        uint targetPayline = payTable[_prize][_prob][0];
        return uint8(targetPayline>>252);
    }

    function addPayline(uint16 _maxPrize, uint16 _targetProb, uint _a, uint _b) onlyOwner {
        payTable[_maxPrize][_targetProb][0] = _a;
        payTable[_maxPrize][_targetProb][1] = _b;

    }

}
