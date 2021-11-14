const LockerManagerV1 = artifacts.require("LockerManagerV1");

module.exports = function(deployer) {
    deployer.deploy(LockerManagerV1);
};