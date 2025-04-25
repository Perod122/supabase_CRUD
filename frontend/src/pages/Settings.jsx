import { ArrowLeftIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { fLogic } from '@/store/fLogic';
import { useEffect } from 'react';

function Settings() {
  const navigate = useNavigate();
  const fetchUser = fLogic((state) => state.fetchUser);
  const user = fLogic((state) => state.user);

  useEffect(() => {
      fetchUser();
    }, [fetchUser]);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button className="btn btn-ghost mb-2" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className="size-5 mr-2" />
                Go back
            </button>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
        <h1 className="card-title text-2xl mb-6">Settings</h1>
        {user && (
          <span className="font-mono font-medium text-base-content  text-sm">{user.email}</span>
        )}
        </div>
        
        </div>
      
    </div>
  )
}

export default Settings
