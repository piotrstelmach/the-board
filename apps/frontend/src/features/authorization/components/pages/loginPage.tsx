import React from 'react';
import { useForm } from '@tanstack/react-form';
import { unprotectedRoute } from '../../../../utils/api';
import { LoginResponse } from '../../types/validation/loginResponse';
import { AuthorizationDispatchContext } from '../../../../stores/context/authorization/authorizationContext';
import { ActionTypes } from '../../../../stores/context/authorization/actionTypes';
import { mapSessionUser } from '../../../../services/userMapper';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const dispatch = React.useContext(AuthorizationDispatchContext);
  const navigate = useNavigate();

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const { data } = await unprotectedRoute<LoginResponse>(
          '/auth/login',
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
            payload: { user: mapSessionUser(data) },
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="container mx-auto p-8">
      <div className="mx-auto max-w-sm bg-surface-light dark:bg-surface-dark flex flex-col gap-8 justify-center p-8 rounded-2xl shadow-2xl">
        <h5 className="ml-3 text-slate-800 text-xl font-semibold text-center">
          Login
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
              name="email"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm text-slate-600"
                  >
                    Login
                  </label>
                  <input
                    type="email"
                    name={field.name}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
          </div>
          <div className="w-full max-w-sm min-w-[200px]">
            <Field
              name="password"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm text-slate-600"
                  >
                    Password
                  </label>
                  <input
                    name={field.name}
                    type="password"
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </>
              )}
            />
          </div>
          <button
            className="rounded-md bg-background-light dark:bg-background-dark py-2 px-4 border border-transparent text-center text-sm text-primary-light dark:text-primary-dark transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
