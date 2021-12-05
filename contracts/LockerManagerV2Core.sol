// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import {locker, PaymentNotAccepted} from "./LockerManagerV2Library.sol";

//contract to manage locker states
contract LockerManagerV2Core {
    //lockerState: map of lockerId -> locker struct
    mapping(bytes16 => locker) lockerState;
    //event emitted when a locker is opened
    event lockerOpened(bytes16 indexed lockerId, address indexed opener);
    //event emitted when a locker is closed
    event lockerClosed(bytes16 indexed lockerId, address indexed closer);

    //function for closing lockers by id
    function closeLocker(bytes16 _id) public virtual {
        //the locker must not be already locked
        require(lockerState[_id].allowedOpener == address(0), "Locker is already closed");
        lockerState[_id].allowedOpener = msg.sender;
        emit lockerClosed(_id, msg.sender);
    }

    //function for opening lockers by id
    function openLocker(bytes16 _id) public virtual {
        //the locker must be locked by the same address that is trying to open it
        require(lockerState[_id].allowedOpener == msg.sender, "Locker doesn't belong to address");
        delete lockerState[_id];
        emit lockerOpened(_id, msg.sender);
    }

    //checks the whether a locker is closed
    function isLockerClosed(bytes16 _id) view public virtual returns (bool){
        return lockerState[_id].allowedOpener != address(0);
    }

    //this contract doesn't allow payments
    receive() external virtual payable {
        revert PaymentNotAccepted();
    }
}