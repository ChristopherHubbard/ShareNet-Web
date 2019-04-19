import * as React from 'react';

import '../assets/Payment.scss';

const paypalIcon: any = require('../assets/paypal_icon.png');

interface Props
{
    show: any
    isSupported: boolean
    disabled: boolean
    className: string
};

export const PayPalRequestButton: React.StatelessComponent<Props> = ({ show, isSupported, disabled, className }) => 
{
    // Add the ability to disable here
    return (
      <div onClick={show} className={className} role="button" id="paypal-button">
          <img src={paypalIcon}/>
          <div>
              <h6> PayPal </h6>
          </div>
      </div>
    )
}