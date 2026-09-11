import React from 'react';

const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 border-transparent',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
    outline: 'bg-transparent border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    disabled = false,
    ...props
}) => {
    return (
        <button
            className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 border
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
            {children}
        </button>
    );
};

export default Button;
