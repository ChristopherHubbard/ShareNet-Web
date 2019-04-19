import * as React from 'react';

import '../assets/Payment.scss';

const ilpIcon: any = require('../assets/ilp_logo.svg');

interface Props
{
    show: any
    isSupported: boolean
    disabled: boolean
    className: string
};

export const PaymentRequestButton: React.StatelessComponent<Props> = ({ show, isSupported, disabled, className }) => 
{
    // Add the ablity to disable here
    return (
      <div onClick={show} className={className} role="button" id="ilp-button">
          <img src={ilpIcon}/>
          <div>
              <h6> Interledger </h6>
          </div>
      </div>
    )
}