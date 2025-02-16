import { useForm } from '@tanstack/react-form';
import { unprotectedRoute } from '../../../../utils/api';
import React from 'react';
import { AuthorizationDispatchContext } from '../../../../stores/context/authorization/authorizationContext';
import { useNavigate } from 'react-router';
import { RegisterResponse } from '../../types/validation/registerReponse';
import { ActionTypes } from '../../../../stores/context/authorization/actionTypes';
import { mapLoggedUser } from '../../../../services/userMapper';

export const RegisterPage = () => {
  const dispatch = React.useContext(AuthorizationDispatchContext);
  const navigate = useNavigate();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { data } = await unprotectedRoute<RegisterResponse>(
          '/auth/signup',
          'post',
          null,
          value
        );
        if (data?.accessToken) {
          dispatch({
            type: ActionTypes.SET_TOKEN,
            payload: { token: data.accessToken },
          });
          dispatch({
            type: ActionTypes.SET_AUTHORIZED,
            payload: { isAuthorized: true },
          });
          dispatch({
            type: ActionTypes.SET_USER,
            payload: { user: mapLoggedUser(data) },
          });
          navigate('/dashboard');
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-sm bg-surface-light dark:bg-surface-dark flex flex-col gap-8 justify-center p-8 rounded-2xl shadow-2xl">
        <h5 className="ml-3 text-slate-800 text-xl font-semibold text-center">
          Register
        </h5>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleSubmit();
          }}
          className="flex flex-col gap-8"
        >
          <div className="w-full max-w-sm min-w-[200px]">
            <Field
              name={'name'}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm text-slate-600"
                  >
                    Name
                  </label>
                  <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Name"
                  />
                </>
              )}
            />
          </div>
          <div className="w-full max-w-sm min-w-[200px]">
            <Field
              name={'email'}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm text-slate-600"
                  >
                    Email
                  </label>
                  <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Email"
                  />
                </>
              )}
            />
          </div>
          <div className="w-full max-w-sm min-w-[200px]">
            <Field
              name={'password'}
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm text-slate-600"
                  >
                    Password
                  </label>
                  <input
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Password"
                  />
                </>
              )}
            />
          </div>
          <button
            className="rounded-md bg-background-light dark:bg-background-dark py-2 px-4 border border-transparent text-center text-sm text-primary-light dark:text-primary-dark transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};
