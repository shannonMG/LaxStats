import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({ username: '', password: '' });
    const [login, {error, data }] = useMutation(LOGIN_USER);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        console.log(formState);
        try {
            const { data } = await login({
                variables: { ...formState },
            });

            Auth.login(data.login.token);
        } catch (e) {
            console.log(e);
        }

        setFormState({
            username: '',
            password: '',
        });
    };

    return (
        <main>
            <div>
                <div>
                    <h4>Login</h4>
                    <div>
                        {data? (
                            <p>
                                Success! You may now head{' '}
                                <Link to='/'>back to the homepage</Link>
                            </p>
                        ):(
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    placeholder="Your username"
                                    name="username"
                                    value={formState.username}
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="********"
                                    name="password"
                                    value={formState.password}
                                    onChange={handleChange}
                                />
                                <button
                                    style={{ cursor: 'pointer' }}
                                    type="submit"
                                >
                                    Submit
                                </button>                                
                            </form>
                        )}

                        {error && (
                            <div>
                                {error.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;