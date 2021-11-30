import React from 'react';

import { Button, Grid, TextField } from '@mui/material';
class LockerAction extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         lockerId: '',
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.contracts = props.drizzle.contracts;
      this.utils = props.drizzle.web3.utils;
      this.lockerManager = this.contracts.LockerManagerV1;
   }

   handleChange(event) {
      this.setState({ lockerId: event.target.value });
   }
   handleSubmit() {
      try {
         this.lockerManager.methods[this.props.method](this.state.lockerId)
            .send()
            .on('error', (error) => {
               console.log('error on');
               console.log(error);
            })
            .on('transactionHash', (transactionHash) => {
               console.log('yei');
               console.log(transactionHash);
            });
      } catch (error) {
         console.log(error);
      }
   }

   render() {
      const { buttonName, color } = this.props;

      return (
         <Grid container>
            <Grid item xs={8}>
               <TextField
                  id={'action' + buttonName}
                  label="Locker ID"
                  variant="standard"
                  fullWidth
                  color={color}
                  value={this.state.lockerId}
                  onChange={this.handleChange}
               />
            </Grid>
            <Grid item xs={1}>&nbsp;</Grid>
            <Grid item>
               <Button
                  variant="contained"
                  color={color}
                  onClick={this.handleSubmit}
               >
                  {buttonName}
               </Button>
            </Grid>
         </Grid>
      );
   }
}

export default LockerAction;
