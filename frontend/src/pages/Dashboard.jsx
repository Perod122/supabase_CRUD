import React from 'react';
import { fLogic } from '../store/flogic';

function Dashboard() {
  const handleSignOut = fLogic((state) => state.handleSignOut);

  return (
    <div>
      <h1>You are logged in successfully!</h1>
      <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
