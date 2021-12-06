import React from 'react';

import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

class EventType {
   static Opened = new EventType(
      'Locker successfully opened!',
      'Error during opening...',
      <LockOpenOutlinedIcon />
   );
   static Closed = new EventType(
      'Locker successfully closed!',
      'Error during closing...',
      <LockOutlinedIcon />
   );

   constructor(success, error, icon) {
      this.successText = success;
      this.errorText = error;
      this.icon = icon;
   }
}

class AlertType {
   static Success = new AlertType('success');
   static Error = new AlertType('error');

   constructor(type) {
      this.name = type;
   }
}

class LockerAction extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         alertType: undefined,
         eventType: undefined,
      };

      this.contracts = props.drizzle.contracts;
      this.utils = props.drizzle.web3.utils;
      this.abi = props.drizzle.web3.eth.abi;
      this.lockerManager = this.contracts.LockerManagerV1;
      this.account = props.drizzleState.accounts[0];
   }

   componentDidMount() {
      this.lockerManager.events.lockerClosed(
         { fromBlock: 'latest', filter: { owner: this.account } },
         (error, event) => {
            this.setState({ eventType: EventType.Closed });
            if (error) {
               this.setState({ alertType: AlertType.Error });
            } else {
               this.setState({ alertType: AlertType.Success });
            }
         }
      );
      this.lockerManager.events.lockerOpened(
         {
            fromBlock: 'latest',
            filter: { owner: this.account },
         },
         (error, event) => {
            this.setState({ eventType: EventType.Opened });
            if (error) {
               this.setState({ alertType: AlertType.Error });
            } else {
               this.setState({ alertType: AlertType.Success });
            }
         }
      );
   }

   handleClose() {
      this.setState({ alertType: undefined, eventType: undefined });
   }

   render() {
      const { eventType, alertType } = this.state;
      return (
         <div>
            {eventType && alertType && (
               <Alert
                  severity={alertType.name}
                  action={
                     <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={this.handleClose.bind(this)}
                     >
                        {eventType.icon}
                        <CloseIcon fontSize="inherit" />
                     </IconButton>
                  }
                  sx={{ mb: 2 }}
               >
                  {AlertType.Success === alertType && eventType.successText}
                  {AlertType.Error === alertType && eventType.errorText}
               </Alert>
            )}
         </div>
      );
   }
}

export default LockerAction;
