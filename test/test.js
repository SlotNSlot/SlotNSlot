'use strict';

//
const Dispatcher = artifacts.require('./Dispatcher.sol');
const DispatcherStorage = artifacts.require('./DispatcherStorage.sol');

const SlotLib = artifacts.require("./sns/SlotLib.sol");
const SlotMachineManager = artifacts.require("./sns/SlotMachineManager.sol");
const SlotLib2 = artifacts.require("./sns/SlotLib2.sol");
const SlotMachineStorage = artifacts.require("./sns/SlotMachineStorage.sol");


contract('TestProxyLibrary', () => {
  describe('test', () => {
    it('works', () => {
      var slotManager, slotStorage;
      var dispatcherStorage;

      var creatingevent, removingevent, testevent;
      SlotLib.new()
      .then(slotlib => {
        console.log('slotlib address : ', slotlib.address);
        return DispatcherStorage.new(slotlib.address);
      })
      .then(d => {
        dispatcherStorage = d;
        Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
          .replace('1111222233334444555566667777888899990000',
          dispatcherStorage.address.slice(2));
        return Dispatcher.new();
      })
      .then(dispatcher => {
        SlotMachineManager.link('LibInterface',dispatcher.address);
        return SlotMachineManager.new();
      })
      .then(c => {
        slotManager = c;
        console.log('slotManager address : ', slotManager.address);
        // console.log('slotmanager address : ', slotManager.address);
        // creatingevent = slotManager.slotMachineCreated();
        return slotManager.getStorageAddr();
      }).
      then(addr => {
        slotStorage = SlotMachineStorage.at(addr);
        console.log('storage address : ',addr);
        testevent = slotStorage.slotMachineCreated();
        testevent.watch(function(error, result){
          if (!error){
            console.log('slotMachine created in storage, provider : ', result.args.provider,
              'decider : ', result.args.decider,
              'minBet : ', result.args.minBet,
              'maxBet : ', result.args.maxBet);
          }
        });
      })
      .then(() => {
        // return slotStorage.whoissender();
        return slotStorage.getOwner();
      })
      .then((addr) => {
        // console.log('storage sender',addr);
        console.log('storage owner : ',addr);
        // removingevent = slotManager.slotMachineRemoved();
        // removingevent.watch(function(error, result){
        //   if (!error)
        //     console.log(result.args._manageraddr, result.args._storageaddr, result.args._idx);
        // });
        //console.log('storage address = ',slotManager.getStorageAddr());
        // slotevent.watch(function(error, result){
        //   if (!error)
        //     console.log(result.args.user, result.args._idx);
        // });

      }).then(() => {
        slotManager.createSlotMachine(0x0, 1, 1000, 10000);
        slotManager.createSlotMachine(0x0, 2, 2000, 20000);
        slotManager.createSlotMachine(0x0, 3, 3000, 30000);
        slotManager.createSlotMachine(0x0, 4, 4000, 40000);
        slotManager.createSlotMachine(0x0, 5, 5000, 50000);
        //slotStorage.eventTrigger();
        return slotManager.getNumofSlotMachine();
      }).then(result => {
        assert.equal(result, 5, 'There should be 5 machines, creating failed');
        slotManager.removeSlotMachine(0);
        return slotManager.getNumofSlotMachine();
      }).then(result => {
        assert.equal(result, 4, 'There should be 4 machines, removing failed');
        return slotManager.getSlotMachineDecider(0);
      }).then(result => {
        assert.equal(result, 2, 'Decider should be 2, decider retrieving failed');
      })
    //  .then(() => SlotLib2.new())
  //    .then(newslotlib => dispatcherStorage.replace(newslotlib.address))
      .then(() => {
        return slotManager.getSlotMachineDecider(0);
      }).then(result => {
        assert.equal(result, 2, 'Decider should be 20, new library loading test failed');
      })
      .then(() => {
        return slotManager.getSlotMachineInfo(0);
      }).then(result => {
        assert.equal(result[0], 2, 'Decider should be 2, multiple return test failed');
        assert.equal(result[1], 2000, 'Decider should be 2000, multiple return test failed');
        assert.equal(result[2], 20000, 'Decider should be 20000, multiple return test failed');
        console.log('Basic test completed, start Ownership test');
        return 1;
    //    return slotStorage.getNumofSlotMachine();
      }).then(result => {
        //assert.equal(result, 4, 'Ownership test failed');
      })




      });
  });
});
