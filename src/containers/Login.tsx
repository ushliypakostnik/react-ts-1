import React from 'react';

import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { credentialsType } from '../store/types';

import { fetchAuth } from '../store/actions';

import CenterMessage from '../components/CenterMessage';

import {
  Page,
  CenterFormWrapper,
  Form,
  FormGroup,
  FormMessage,
  TextSmall,
  TextLarge,
  Input,
  Button,
  A,
} from '../theme/widgets';

interface Props {
  fetchAuth: (credentials: credentialsType) => void;
}

interface State {
  login: boolean,
  mailError: string;
  passError: string;
}

class Login extends React.Component<Props, State> {
  private usermailInput: React.RefObject<HTMLInputElement>;
  private passwordInput: React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this.usermailInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  public state : State = {
    login: true,
    mailError: '',
    passError: '',
  };

  private submit = credentials => {
    this.props.fetchAuth(credentials);
  };

  private validateEmail = (email : string) : boolean => {
    // eslint-disable-next-line no-useless-escape
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validate = regExp.test(email);
    let mailError;
    if (email === '') {
      mailError = 'This field is required!';
    } else if (validate) {
      mailError = '';
    } else {
      mailError = 'Invalid email!';
    }
    this.setState({
      mailError: mailError,
    });
    return validate;
  };

  private validatePassword = (password : string) : boolean => {
    // eslint-disable-next-line no-useless-escape
    const regExp = /^(?=.*\d)(?=.*[a-z])(?!.*\s).*$/;
    const validate = regExp.test(password);
    const minLenght = 6;
    let passError;
    if (password === '') {
      passError = 'This field is required!';
    } else if (password.length < minLenght) {
      passError = `Password must be at least ${minLenght} characters`;
    } else if (!validate) {
      passError = 'Password must contain at least one digit.';
    } else {
      passError = '';
    }
    this.setState({
      passError: passError,
    });
    return validate;
  }

  render() {
    const { login, mailError, passError } = this.state;

    return (
      <Page outer>
        <CenterFormWrapper>
          <CenterMessage>
            <TextLarge>Create React App based<br />frontend boilerplate</TextLarge>
          </CenterMessage>
          <Form>
            <FormGroup>
              <Input
                type="email"
                aria-label="email input"
                placeholder="Email"
                ref={this.usermailInput}
              />
              {!(mailError === '')
                && <FormMessage error={!!mailError}>
                     <TextSmall>{mailError}</TextSmall>
                   </FormMessage>}
            </FormGroup>
            {login &&
              <FormGroup>
                <Input
                  type="password"
                  aria-label="password input"
                  placeholder="Password"
                  ref={this.passwordInput}
                 />
                 {!(passError === '')
                   && <FormMessage error={!!passError}>
                         <TextSmall>{passError}</TextSmall>
                      </FormMessage>}
              </FormGroup>
            }
            <Button
              type="submit"
              role="button"
              aria-label={login ? 'Login' : 'Remind'}
              onClick={(e) => {
                e.preventDefault();
                const emailValid = this.validateEmail(this.usermailInput.current.value);
                const passwordValid = this.validatePassword(this.passwordInput.current.value);
                if (emailValid && passwordValid) {
                  const user = {
                    usermail: this.usermailInput.current.value,
                    password: this.passwordInput.current.value,
                  }
                  this.submit(user);
                }
            }}>{login ? 'Login' : 'Remind'}</Button>
            <A
              href="#"
              rel="noopener noreferrer"
              aria-label={login ? 'Забыли пароль?' : 'Попробовать зайти'}
              onClick={(e) => {
                e.preventDefault();
                this.setState({
                  login: !login,
                });
              }}
            >{login ? 'Забыли пароль?' : 'Попробовать зайти'}</A>
          </Form>
        </CenterFormWrapper>
       </Page>
    );
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) : Props => ({
  fetchAuth: (credentials: credentialsType) => dispatch(fetchAuth(credentials)),
});

export default connect(null, mapDispatchToProps)(Login);
