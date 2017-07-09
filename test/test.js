'use strict';

//
const Dispatcher = artifacts.require('Dispatcher.sol');
const DispatcherStorage = artifacts.require('DispatcherStorage.sol');

const SlotLib = artifacts.require("./sns/SlotLib.sol");
const SlotMachineManager = artifacts.require("./sns/SlotMachineManager.sol");
const SlotLib2 = artifacts.require("./sns/SlotLib2.sol");
const SlotMachineStorage = artifacts.require("./sns/SlotMachineStorage.sol");



contract('TestProxyLibrary', () => {
  describe('test', () => {
    it('works', () => {
      var slotManager, slotStorage;
      var dispatcherStorage;
      var creationevent, removalevent, numberevent;

      SlotMachineManager.deployed().then(function(instance) {
        slotManager = instance;
        // return slotManager.getNumofSlotMachine();
        // return;
      })
      .then(() => {
        console.log('setting up event watcher...');
        creationevent = slotManager.slotMachineCreated();
        creationevent.watch(function(error, result){
          if (!error){
            console.log('Event Log : \n \tslotMachine created in storage, provider : ', result.args._provider,
              'decider : ', result.args._decider,
              'minBet : ', result.args._minBet,
              'maxBet : ', result.args._maxBet,
              'slot totalnum : ', result.args._totalnum);
          }
        })
      })
      .then(() => {
        removalevent = slotManager.slotMachineRemoved();
        removalevent.watch(function(error, result){
          if(!error){
            console.log('Event Log : \n \tslotMachine removed in storage, manager : ', result.args._manageraddr,
            'storage addr : ', result.args._storageaddr,
            'index : ', result.args._idx);
          }
        });
      })
      // .then(() => {
      //   numberevent = slotManager.slotMachineNumber();
      //   numberevent.watch(function(error, result){
      //     if(!error){
      //       console.log('Event Log : \n \tNumber of slotmachine in storage : ', result.args._num);
      //     }
      //   });
      // })
      .then(() => {
        console.log('event watcher setting completed');
        return  slotManager.getNumofSlotMachine();
      })
      .then(result => {
        console.log('initializing test, # of slotmachine should be 0');
        assert.equal(result,0,'initializing test failed');
        console.log('initializing test completed successfully');
        slotManager.createSlotMachine(0x0, 1, 1000, 10000);
        slotManager.createSlotMachine(0x0, 2, 2000, 20000);
        slotManager.createSlotMachine(0x0, 3, 3000, 30000);
        slotManager.createSlotMachine(0x0, 4, 4000, 40000);
        slotManager.createSlotMachine(0x0, 5, 5000, 50000);
        return slotManager.getNumofSlotMachine();
      })
      .then(result => {
        console.log('creating test, # of slotmachine should be 5');
        assert.equal(result, 5, 'creating test failed');
        console.log('creating test completed successfully');

        console.log('removing test, # of slotmachine should be 4');
        slotManager.removeSlotMachine(0);
        return slotManager.getNumofSlotMachine();
      })
      .then(result => {
        assert.equal(result, 4, 'removing test failed');
        console.log('removing test completed successfully');

        console.log('retrieving infomation test, slotmachine information should be loaded correctly');
        return slotManager.getSlotMachineInfo(0);

      })
      .then(result => {
        assert.equal(result[0], 2, 'Decider should be 2, multiple return test failed');
        assert.equal(result[1], 2000, 'Decider should be 2000, multiple return test failed');
        assert.equal(result[2], 20000, 'Decider should be 20000, multiple return test failed');
        console.log('retrieving infomation test completed successfully');
        return;
      })
      .then(() => {
        return DispatcherStorage.deployed().then(function (instance) {
          dispatcherStorage = instance;
          return dispatcherStorage.getLib();
        })
        .then(libaddr => {
          console.log('current lib address : ', libaddr);
        });
      })
      .then(() => {
        return SlotLib2.deployed().then(function (instance) {
          dispatcherStorage.replace(instance.address);

          console.log('hihi', instance.address);
          return dispatcherStorage.getLib();
        })
        .then(newlibaddr => {
          console.log('changed lib address : ', newlibaddr);
        });
      })
      .then(() => {
        console.log('new library linking test start');
        return slotManager.getSlotMachineDecider(0);
      })
      .then(result => {
        console.log('new result is ', result);
        assert.equal(result, 20, 'Decider should be 20, new library linking failed');
        console.log('new library linking test completed successfully');
      //  return slotManager.getSlotList('0x7cb2752c4da2f607addeaeb1e694dd49411e7787');
      })
      .then(result => {
        console.log('first slot of user : ', result);
      })
      .then(() => {
        console.log('test completed');
      });

      });
  });
});
