const LockerManager = artifacts.require('LockerManagerV2Payable');

contract('LockerManagerV2Payable', (accounts) => {
   let manager;
   const AMOUNT = 10000000;

   before(() => {
      return LockerManager.deployed().then((contract) => (manager = contract));
   });

   describe('payable', () => {
      it('can accept money', () => {
         return manager.send(AMOUNT, { from: accounts[0] }).then(async () => {
            const balance = await web3.eth.getBalance(manager.address);
            assert.equal(balance, AMOUNT);
         });
      });
      it('somebody cannot transfer', () => {
         return manager
            .transfer(accounts[1], AMOUNT, { from: accounts[1] })
            .then(async () => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Ownable: caller is not the owner');
            });
      });
      it('somebody cannot withdraw', () => {
         return manager
            .withdraw({ from: accounts[1] })
            .then(async () => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Ownable: caller is not the owner');
            });
      });
      it('owner can transfer', () => {
         return manager
            .transfer(accounts[1], AMOUNT / 2, { from: accounts[0] })
            .then(async () => {
               const balance = await web3.eth.getBalance(manager.address);
               assert.equal(balance, AMOUNT / 2);
            });
      });
      it('owner can withdraw', () => {
         return manager.withdraw({ from: accounts[0] }).then(async () => {
            const balance = await web3.eth.getBalance(manager.address);
            assert.equal(balance, 0);
         });
      });
   });
});
