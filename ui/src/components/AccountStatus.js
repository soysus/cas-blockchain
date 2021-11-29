import React from 'react';

import { Divider, Grid, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const AccountStatus = (props) => {
   const { drizzle, drizzleState } = props;
   const account = drizzleState.accounts[0];
   const utils = drizzle.web3.utils;
   const balanceWei = drizzleState.accountBalances[account];
   const balanceEth = balanceWei > 0 ? utils.fromWei(balanceWei, 'ether') : 0;
   return (
      <div>
         <Grid container alignItems="center" sx={{ background: 'white' }}>
            <Grid item xs={12}>
               <Typography gutterBottom variant="h7" component="div">
                  Account connected   <CheckIcon color="success" />
               </Typography>

            </Grid>
            <Grid item xs={8}>
               <Typography
                  gutterBottom
                  variant="h7"
                  component="div"
                  color="darkgrey"
               >
                  {account}
               </Typography>
            </Grid>
            <Grid item xs={4}>
               <Typography
                  gutterBottom
                  variant="h7"
                  component="div"
                  align="right"
                  color="darkgrey"
               >
                  {balanceEth} ETH
               </Typography>
            </Grid>
         </Grid>
         <Divider variant="fullWidth" />
      </div>
   );
};

export default AccountStatus;
