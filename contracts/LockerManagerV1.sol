pragma solidity >=0.8.10 <0.9.0;

contract LockerManagerV1 {
    mapping(string => address) lockerAddressMap;
    event lockerOpened(bytes indexed _lockerId);
    event lockerClosed(bytes indexed _lockerId, address _owner);


    function closeLocker(string memory _id) public {
        require(lockerAddressMap[_id] == address(0), "Locker is already closed");
        lockerAddressMap[_id] = msg.sender;
        emit lockerClosed(abi.encode(_id), msg.sender);
    }

    function openLocker(string memory _id) public {
        require(lockerAddressMap[_id] == msg.sender, "Locker doesn't belong to address");
        delete lockerAddressMap[_id];
        emit lockerOpened(abi.encode(_id));
      }

    function isLockerClosed(string memory _id) view public returns (bool){
        return lockerAddressMap[_id] != address(0);
    }
}