import * as React from 'react';

// Custom input component -- stateless component (handles re-rendering better if state isnt needed)
export const CustomInput = ({ input, label, type, meta: { error, touched } }: any) =>
{
    return (
        <div className="row-md">
            <input className="form-text-input primary-border" type={type} {...input} placeholder={label}/>
            {touched && error && 
            <strong className="error"> {error} </strong>}
        </div>
    );
};