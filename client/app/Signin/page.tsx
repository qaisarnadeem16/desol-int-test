/* eslint-disable @next/next/no-img-element */
'use client'
import axios from "axios";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from "next/navigation";

export default function Home() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter()
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const addUser = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://desol-int-test-server.vercel.app/api/login', {
        email,
        password
      });
      const token = response.data.token;
      localStorage.setItem('id', token);

      router.push('/AddCars')
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (



    <  >
      <div className="flex flex-wrap  justify-between lg:min-h-screen  w-full">
        <section className="relative lg:w-1/2 min-h-screen w-full lg:flex hidden h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

        </section>

        <section className="bg-gray-50 dark:bg-gray-900 lg:w-1/2 w-full">
          <Toaster />
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 w-full">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" action="#" onSubmit={addUser}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => { setEmail(e.target.value) }}
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <AiFillEyeInvisible className="h-5 w-5 text-gray-500" />
                        ) : (
                          <AiFillEye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Sign up
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ >

  );
}
