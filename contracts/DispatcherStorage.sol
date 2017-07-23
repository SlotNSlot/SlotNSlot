pragma solidity ^0.4.8;

contract DispatcherStorage {
  address public lib;
  mapping(bytes4 => uint32) public sizes;

  //TODO : sizes mapping should be completed;

  function DispatcherStorage(address newLib) {
    sizes[bytes4(sha3("getUint(LibInterface.S storage)"))] = 32;
  //  sizes[bytes4(sha3("getData2(LibInterface.S storage)"))] = 32;
    replace(newLib);
  }

  function replace(address newLib) /* onlyDAO */ {
    lib = newLib;
  }

  function getLib() constant returns (address) {
    return lib;
  }
}
