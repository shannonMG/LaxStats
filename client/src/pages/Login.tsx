import { useState, type FormEvent, type ChangeEvent } from 'react';
//import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';


import Auth from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({ username: '', password: '' });
    const [showError, setShowError] = useState(false)
    const [login] = useMutation(LOGIN_USER);

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
            setShowError(true)
        }

        setFormState({
            username: '',
            password: '',
        });
    };
    return (
        <div
          className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://mountathletics.com/images/2021/5/13/MSM_050821_WLAX_125.jpg')",
          }}
        >
          <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
            <div className="text-white">
              <div className="mb-8 flex flex-col items-center">
                {/* <img src="..." width="150" alt="" /> */}
                <h1 className="mb-2 text-2xl">Login</h1>
                <span className="text-gray-300">Enter Login Details</span>
              </div>
      
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4 text-lg">
                  <input
                    className="
                      rounded-3xl 
                      border-none 
                      bg-mindaro/50
                      px-6 
                      py-2 
                      text-center 
                      text-dark-green
                      placeholder-dark-green 
                      shadow-lg 
                      outline-none 
                      backdrop-blur-md
                    "
                    type="text"
                    placeholder="Your username"
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                  />
                </div>
      
                <div className="mb-4 text-lg">
                  <input
                    className="
                      rounded-3xl 
                      border-none 
                      bg-mindaro/50
                      px-6 
                      py-2 
                      text-center 
                      text-dark-green
                      placeholder-dark-green 
                      shadow-lg 
                      outline-none 
                      backdrop-blur-md
                    "
                    type="password"
                    placeholder="********"
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                  />
                </div>
      
                <div className="mt-8 flex justify-center text-lg text-black">
                  <button
                    type="submit"
                    className="
                      rounded-3xl 
                      px-10 
                      py-2 
                      border-b-4 
                      border-fern-green
                      bg-fern-green
                      text-mindaro
                      shadow-xl 
                      backdrop-blur-md 
                      transition-colors 
                      duration-300 
                      hover:bg-hunter-green 
                      hover:border-hunter-green
                    "
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    };   

        // <main>
        //     <div>
        //         <div>
        //             <h4>Login</h4>
        //             <div>
        //                 {data? (
        //                     <p>
        //                         Success! You may now head{' '}
        //                         <Link to='/'>back to the homepage</Link>
        //                     </p>
        //                 ):(
        //                     <form onSubmit={handleFormSubmit}>
        //                         <input
        // placeholder="Your username"
        // name="username"
        // value={formState.username}
        // onChange={handleChange}
        //                         />
        //                         <input
        // placeholder="********"
        // name="password"
        // value={formState.password}
        // onChange={handleChange}
        //                         />
        //                         <button
        //                             style={{ cursor: 'pointer' }}
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


export default Login;