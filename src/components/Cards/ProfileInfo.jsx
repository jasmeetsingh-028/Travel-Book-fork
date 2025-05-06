import React from 'react';
import { getInitials } from '../../utils/helper';
import { Link } from 'react-router-dom';

const ProfileInfo = ({ userInfo, onLogout }) => {
    return (
        userInfo && (
            <div className='flex items-center gap-3'>
                <Link to="/profile" className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 hover:bg-slate-200 transition-colors">
                    {userInfo && userInfo.fullName && getInitials(userInfo.fullName)}
                </Link>

                <div>
                    <Link to="/profile" className="text-sm font-medium hover:text-cyan-600 transition-colors">
                        {userInfo && userInfo.fullName ? userInfo.fullName : ""}
                    </Link>
                    <button className="block text-sm text-slate-700 underline" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        )
    );
};

export default ProfileInfo;