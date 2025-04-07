import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  console.log(name, password, confirmPassword, email);

  const formValidation = () => {
    if (confirmPassword !== password) {
      return <div>Fail</div>;
    }
    return <div>Success</div>;
  };

  return (
    <div className='bg-sky-50 rounded-md mx-20 my-5'>
      <h1 className='text-2xl font-bold text-gray-900 px-10 pt-5'>
        Register Here
      </h1>

      <form>
        <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 px-10'>
          <div className='sm:col-span-3'>
            <label
              htmlFor='registerName'
              className='block text-sm/6 font-medium text-gray-900'
            >
              Enter Name:
            </label>
            <div className='mt-2'>
              <input
                type='text'
                id='registerName'
                name='registerName'
                autoComplete='off'
                required
                value={name}
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='registerEmail'
              className='block text-sm/6 font-medium text-gray-900'
            >
              Enter Email:
            </label>
            <div className='mt-2'>
              <input
                type='email'
                id='registerEmail'
                name='registerEmail'
                autoComplete='off'
                required
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='registerPassword'
              className='block text-sm/6 font-medium text-gray-900'
            >
              Enter Password:
            </label>
            <div className='mt-2'>
              <input
                type='password'
                id='registerPassword'
                name='registerPassword'
                autoComplete='off'
                required
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm/6 font-medium text-gray-900'
            >
              Confirm Password:
            </label>
            <div className='mt-2'>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                autoComplete='off'
                required
                className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
      <div className='flex justify-self-center'>
        <button
          type='submit'
          style={{ cursor: 'pointer' }}
          className='flex-auto my-10 mx-10 rounded-md bg-indigo-600 px-10 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          onClick={formValidation}
        >
          Register Account
        </button>
      </div>
    </div>
  );
}
