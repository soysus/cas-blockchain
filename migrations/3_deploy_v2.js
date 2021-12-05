const LockerManagerV2Payable = artifacts.require('LockerManagerV2Payable');
const LockerManagerV2Core = artifacts.require('LockerManagerV2Core');
const LockerManagerV2 = artifacts.require('LockerManagerV2');

const initialPricePerBlock = web3.utils.toWei('10', 'micro');

module.exports = function (deployer) {
   deployer.deploy(LockerManagerV2Core);
   deployer.deploy(LockerManagerV2Payable);
   deployer.deploy(LockerManagerV2, initialPricePerBlock);
};
