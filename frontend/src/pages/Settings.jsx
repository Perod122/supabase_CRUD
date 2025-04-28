import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
import { fLogic } from '../store/fLogic'; // adjust path if needed

function Settings() {
  const navigate = useNavigate();
  const form = fLogic((state) => state.form);
  const creds = fLogic((state) => state.creds);
  const fetchUser = fLogic((state) => state.fetchUser);
  const handleFormChange = fLogic((state) => state.handleFormChange);
  const updateProfile = fLogic((state) => state.updateProfile);
  const loading = fLogic((state) => state.loading);

  // Ensure loading state is handled without causing conditional hook calls
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

          <form 
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault(); // prevent form from reloading
              updateProfile();
            }}
          >
            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">First Name</span>
              </label>
              <input 
                name="firstname"
                type="text" 
                placeholder="First name" 
                className="input input-bordered w-full" 
                value={form.firstname}
                onChange={handleFormChange}
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Lastname</span>
              </label>
              <input 
                name="lastname"
                type="text"  
                className="input input-bordered w-full" 
                value={form.lastname}
                onChange={handleFormChange}
              />
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Phone</span>
              </label>
              <input 
                name="phone"
                type="text" 
                className="input input-bordered w-full" 
                value={form.phone}
                onChange={handleFormChange}
              />
            </div>

            {/* Email (readonly) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base font-medium">Email</span>
              </label>
              <input 
                type="text"  
                className="input input-bordered w-full" 
                value={creds?.email || ""}
                readOnly
              />
            </div>

            {/* Save Button */}
            <button type="submit" className="btn btn-primary">
              {loading ? (
                <div className="loading loading-spinner loading-sm"/>
              ) : (
                <>
                  <SaveIcon className="size-5 mr-2" />
                  Save
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
