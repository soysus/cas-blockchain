// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

//contract to manage locker states
contract LockerManagerV1 {
    //lockerState: map of lockerId -> owner's address
    mapping(string => address) lockerAddressMap;

    //event emitted when a locker is opened
    event lockerOpened(bytes indexed lockerId, address indexed owner);
    //event emitted when a locker is closed
    event lockerClosed(bytes indexed lockerId, address indexed owner);

    //function for closing lockers by id
    function closeLocker(string memory _id) public {
        //the locker must not be already locked
        require(lockerAddressMap[_id] == address(0), "Locker is already closed");
        lockerAddressMap[_id] = msg.sender;
        emit lockerClosed(abi.encode(_id), msg.sender);
    }

    //function for opening lockers by id
    function openLocker(string memory _id) public {
        //the locker must be locked by the same address that is trying to open it
        require(lockerAddressMap[_id] == msg.sender, "Locker doesn't belong to address");
        delete lockerAddressMap[_id];
        emit lockerOpened(abi.encode(_id), msg.sender);
    }

    //checks the whether a locker is closed
    function isLockerClosed(string memory _id) view public returns (bool){
        return lockerAddressMap[_id] != address(0);
    }
}