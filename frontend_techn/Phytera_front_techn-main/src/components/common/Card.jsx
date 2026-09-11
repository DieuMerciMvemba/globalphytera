import React from 'react';

const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20 ${className}`}>
            {(title || action) && (
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    {title && <h3 className="font-semibold text-white/90">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
