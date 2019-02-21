import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';
import { reduxForm, Field, Form, isPristine, InjectedFormProps } from 'redux-form';
import { userActions } from '../actions';
import { LoginState as LoginProps } from '../models';
import { CustomInput } from './CustomInput';
import { required, validateEmail, validatePassword } from '../services';

interface LoginState
{
    email: string,
    password: string,
    submitted: boolean
}

export class LoginPage extends React.Component<LoginProps & DispatchProp<any> & InjectedFormProps, LoginState>
{
    constructor(props: LoginProps & DispatchProp<any> & InjectedFormProps)
    {
        super(props);
        
        // Logout the user if not already logged out
        const { dispatch } = this.props;
        dispatch(userActions.logout());

        this.state = {
            email: '',
            password: '',
            submitted: false
        };

        // Bind methods
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    private handleChange(event: any): void
    {
        event = event as React.ChangeEvent<HTMLInputElement>;
        const { name, value } = event.target;

        // Update state -- why does this method not work?
        this.setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    private handleSubmit(event: React.FormEvent<HTMLFormElement>): void
    {
        // Why do we need to prevent the default form submit??
        event.preventDefault();

        this.setState({
            submitted: true
        });

        const { email, password } = this.state;
        const { dispatch } = this.props;
        
        // Dispatch the user login -- create user object -- no need for phone or email on login
        dispatch(userActions.login({
            email,
            password
        }));
    }

    public render(): React.ReactNode
    {
        const { loggingIn, invalid } = this.props;

        return (
            <div>
                <h1> Log in to smart sharing </h1>
                <Form onSubmit={this.handleSubmit}>
                    <div>
                        <Field name="email" type="text" label="Email" component={CustomInput} validate={[required, validateEmail]} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <Field name="password" type="password" label="Password" component={CustomInput} validate={[required, validatePassword]} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <button type="submit" disabled={loggingIn || invalid}> Log in </button>
                    </div>
                </Form>
                <div>
                    <p> No Account? <Link to="/register"> Register now </Link> </p>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: any): LoginProps
{
    const { loggingIn } = state.login;
    return {
        loggingIn
    };
}

// Connect store and set up redux form
export default connect<LoginProps>(
    mapStateToProps
)(reduxForm({
    form: 'loginPage'
})(LoginPage as any));