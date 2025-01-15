import { useState, type FormEvent, type ChangeEvent } from 'react';
//import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
    const [formState, setFormState] = useState({
        name: '',
        password: '',
        role: 'player',
        username: '',
    });

    const [addUser] = useMutation(ADD_USER);

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
        <div className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat" style={{
            // backgroundImage: "url('https://images.unsplash.com/photo-1499123785106-343e69e68db1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80')"
            backgroundImage: "url('https://images.unsplash.com/photo-1526649172339-5c979f9941a3?q=80&w=1977&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}>
            <div className="rounded-xl bg-fern-green bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
                <div className="text-white">
                    <div className="mb-8 flex flex-col items-center">
                        {/* <img src="https://www.logo.wine/a/logo/Instagram/Instagram-Glyph-Color-Logo.wine.svg" width="150" alt="" srcset="" /> */}
                        <h1 className="mb-2 text-2xl">Sign Up</h1>
                        <span className="text-gray-300">Enter SignUp Details</span>
                    </div>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4 text-lg">
                            <input
                                className="rounded-3xl border-none bg-mindaro/50 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={formState.name}
                                onChange={handleChange} />
                        </div>

                        <div className="mb-4 text-lg">
                            <input
                                className="rounded-3xl border-none bg-mindaro/50 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="Password"
                                placeholder="********"
                                name="password"
                                value={formState.password}
                                onChange={handleChange} />
                        </div>
                        <div className="mt-8 mb-4 flex justify-center text-lg">
                        <select 
                        className="rounded-3xl border-none bg-mindaro/50 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                    id='options'
                                    value = {formState.role} 
                                    onChange = {handleSelectChange} 
                                    name='role'
                                    >
                                    <option className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md" value='player'>Player</option>
                                    <option className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md" value='coach'>Coach</option>
                                </select>
                        </div>
                        <div className="mb-4 text-lg">
                            <input
                                className="rounded-3xl border-none bg-mindaro/50 bg-opacity-50 px-6 py-2 text-center text-inherit placeholder-slate-200 shadow-lg outline-none backdrop-blur-md"
                                type="text"
                                placeholder="Your username"
                                name="username"
                                value={formState.username}
                                onChange={handleChange} />
                        </div>
                        <div className="mt-8 flex justify-center text-lg text-black">
                            <button type="submit" className="rounded-3xl bg-mindaro/50 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        // <main>
        //     <div>
        //         <div>
        //             <h4>Sign up</h4>
        //             <div>
        //                 {data? (
        //                     <p>
        //                         Success! You may now head{' '}
        //                         <Link to='/'>back to the homepage.</Link>
        //                     </p>
        //                 ) : (
        //                     <form onSubmit={handleFormSubmit}>
        //                         <input
        //                             placeholder="Your name"
        //                             name="name"
        //                             type="text"
        //                             value={formState.name}
        //                             onChange={handleChange}
        //                         />
        //                         <input
        //                             placeholder="********"
        //                             name="password"
        //                             type="text"
        //                             value={formState.password}
        //                             onChange={handleChange}
        //                         />
                                // <select 
                                //     id='options'
                                //     value = {formState.role} 
                                //     onChange = {handleSelectChange} 
                                //     name='role'
                                //     >
                                //     <option value='player'>Player</option>
                                //     <option value='coach'>Coach</option>
                                // </select>
        //                         <input
        //                             placeholder="Your username"
        //                             name="username"
        //                             type="text"
        //                             value={formState.username}
        //                             onChange={handleChange}
        //                         />
        //                         <button
        //                             style={{ cursor: 'pointer'}}
        //                             type="submit"
        //                         >
        //                             Submit
        //                         </button>                                    
        //                     </form>
        //                 )}

        //                 {error && (
        //                     <div>
        //                         {error.message}
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //     </div>
        // </main>
    );
};

export default Signup;