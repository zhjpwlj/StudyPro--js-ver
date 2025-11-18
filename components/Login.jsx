import React from 'react';
import { useLocalization } from '../hooks/useLocalization.jsx';
import { BrainCircuitIcon } from './icons/Icons.jsx';

const Login = ({ onLogin }) => {
    const { t } = useLocalization();

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center p-8 max-w-md w-full bg-white/30 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                <div className="flex justify-center mb-6">
                    <BrainCircuitIcon className="w-20 h-20 text-primary-500"/>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{t('login_title')}</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{t('login_subtitle')}</p>
                <div className="mt-10">
                    <button
                        onClick={onLogin}
                        className="w-full px-6 py-3 text-lg font-semibold text-white bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:-translate-y-1"
                    >
                        {t('login_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
