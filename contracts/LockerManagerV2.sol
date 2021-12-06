// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import {locker, DeprecatedFunction} from "./LockerManagerV2Library.sol";
import "./LockerManagerV2Payable.sol";

//contract to manage locker states
contract LockerManagerV2 is LockerManagerV2Payable {
    uint private _pricePerBlock;

    constructor(uint _initialPricePerBlock){
        //super constructors are called automatically
        _pricePerBlock = _initialPricePerBlock;
    }

    //getter function for current price
    function getCurrentPricePerBlock() view public returns (uint){
        return _pricePerBlock;
    }

    //setter function for current price, only for Owner
    function setCurrentPricePerBlock(uint _currentPrice) public onlyOwner {
        _pricePerBlock = _currentPrice;
    }

    //function for closing lockers by id is deprecated
    function closeLocker(bytes16 /* _id */) public virtual override {
        revert DeprecatedFunction("closeLockerFor");
    }

    //function to close the locker for a given amount of blocks
    function closeLockerFor(bytes16 _id, uint _numberOfBlocks) public virtual payable {
        //the locker must not be already locked
        require(isLockerFree(_id), "Locker is already closed");
        require(msg.value == _numberOfBlocks * _pricePerBlock, "Incorrect amount");
        locker memory closedLocker = locker({allowedOpener : msg.sender, lockedUntilBlock : block.number + _numberOfBlocks});
        lockerState[_id] = closedLocker;
        emit lockerClosed(_id, msg.sender);
    }

    //function to increase the time that a locker is closed
    function increaseRemainingBlocks(bytes16 _id, uint _numberOfBlocks) public virtual payable {
        require(lockerState[_id].allowedOpener == msg.sender, "Locker doesn't belong to address");
        require(msg.value == _numberOfBlocks * _pricePerBlock, "Incorrect amount");
        lockerState[_id].lockedUntilBlock += _numberOfBlocks;
    }

    //function to transfer the locker to a given address
    function transferLocker(bytes12 _id, address _to) public virtual {
        //only the allowed opener's address is able to transfer, unless the payment expired
        require(lockerState[_id].allowedOpener == msg.sender || lockerState[_id].lockedUntilBlock < block.number, "Cannot be transferred");
        lockerState[_id].allowedOpener = _to;
    }

    //checks whether a locker is closed
    function isLockerFree(bytes16 _id) view public virtual returns (bool){
        return lockerState[_id].allowedOpener == address(0) || lockerState[_id].lockedUntilBlock < block.number;
    }

    //checks the amount of blocks remaining before expiration
    function getRemainingBlocks(bytes16 _id) view public returns (uint){
        if (lockerState[_id].lockedUntilBlock > block.number) {
            return lockerState[_id].lockedUntilBlock - block.number;
        } else {
            return 0;
        }
    }
}