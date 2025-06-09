import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import NavBar from '@/components/NavBar';

async function register_me(formData) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    return data; // { success: bool, message: string }
  } catch (error) {
    return { success: false, message: 'Network error. Please try again.' };
  }
}

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get('token')) {
      router.push('/');
    }
  }, [router]);

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setError({ name: '', email: '', password: '' });

    // Validation
    let hasError = false;
    if (!formData.name) {
      setError((prev) => ({ ...prev, name: 'Name Field is required' }));
      hasError = true;
    }
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: 'Email Field is required' }));
      hasError = true;
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: 'Password Field is required' }));
      hasError = true;
    } else if (formData.password.length < 8) {
      setError((prev) => ({ ...prev, password: 'Password must be at least 8 characters' }));
      hasError = true;
    }

    if (hasError) return;

    const data = await register_me(formData);
    if (data.success) {
      toast.success(data.message);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="w-full h-screen bg-indigo-600">
        <div className="flex flex-col text-center items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0 shadow-xl">
          <div className="w-full bg-white rounded-lg shadow dark:border text-black md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Register your account
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div className="text-left">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {error.name && <p className="text-sm text-red-500">{error.name}</p>}
                </div>
                <div className="text-left">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {error.email && <p className="text-sm text-red-500">{error.email}</p>}
                </div>
                <div className="text-left">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  {error.password && <p className="text-sm text-red-500">{error.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-500">
                  Already have an account{' '}
                  <Link href="/auth/login" className="font-medium text-indigo-600 hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
