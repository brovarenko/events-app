'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface RegistrationForm {
  fullName: string;
  email: string;
  dateOfBirth: Date;
  referral: string;
}

const schema = yup
  .object({
    fullName: yup.string().required('Full Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    dateOfBirth: yup.date().required('Date of Birth is required'),
    referral: yup
      .string()
      .required('Please select where you heard about the event'),
  })
  .required();

const RegisterPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const router = useRouter();

  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegistrationForm) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, eventId: id }),
      });

      if (response.ok) {
        reset();
        router.push('/events');
      } else {
        setServerError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setServerError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Register for Event
      </h1>
      {serverError && <p className='text-red-500'>{serverError}</p>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 gap-4 max-w-md mx-auto'
      >
        <div>
          <input
            type='text'
            placeholder='Full Name'
            {...register('fullName')}
            className={`border p-2 rounded w-full ${
              errors.fullName ? 'border-red-500' : ''
            }`}
          />
          {errors.fullName && (
            <p className='text-red-500'>{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <input
            type='email'
            placeholder='Email'
            {...register('email')}
            className={`border p-2 rounded w-full ${
              errors.email ? 'border-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className='text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type='date'
            {...register('dateOfBirth')}
            className={`border p-2 rounded w-full ${
              errors.dateOfBirth ? 'border-red-500' : ''
            }`}
          />
          {errors.dateOfBirth && (
            <p className='text-red-500'>{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <select
            {...register('referral')}
            className={`border p-2 rounded w-full ${
              errors.referral ? 'border-red-500' : ''
            }`}
          >
            <option value=''>Where did you hear about this event?</option>
            <option value='social_media'>Social Media</option>
            <option value='friend'>Friend</option>
            <option value='advertisement'>Advertisement</option>
          </select>
          {errors.referral && (
            <p className='text-red-500'>{errors.referral.message}</p>
          )}
        </div>

        <Button type='submit'>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
