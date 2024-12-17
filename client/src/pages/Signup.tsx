import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
    const [formState, setFormState] = useState({
        name: '',
        password: '',
        role: '',
        username: '',
    });

    const [addUser, {error, data }] = useMutation(ADD_USER);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const { data } = await addUser({
                variables: { input: { ...formState }},
            });

            Auth.login(data.addUser.token);
        } catch (e) {
            console.error(e);
        }
    };

    return(
        <main>
            <div>
                <div>
                    <h4>Sign up</h4>
                    <div>
                        {data? (
                            <p>
                                Success! You may now head{' '}
                                <Link to='/'>back to the homepage.</Link>
                            </p>
                        ) : (
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    placeholder="Your name"
                                    name="name"
                                    type="text"
                                    value={formState.name}
                                    onChange={handleChange}
                                />
                                <input
                                    placeholder="********"
                                    name="password"
                                    type="text"
                                    value={formState.password}
                                    onChange={handleChange}
                                />
                                <select 
                                    id='options' 
                                    value = {formState.role} 
                                    onChange = {handleSelectChange} 
                                    name='role'>
                                    <option value='player'>Player</option>
                                    <option value='coach'>Coach</option>
                                </select>
                                <input
                                    placeholder="Your username"
                                    name="username"
                                    type="text"
                                    value={formState.username}
                                    onChange={handleChange}
                                />
                                <button
                                    style={{ cursor: 'pointer'}}
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

export default Signup;