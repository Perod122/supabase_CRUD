import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Edit2Icon, SaveIcon, XIcon } from 'lucide-react';
import { fLogic } from '../store/fLogic'; // adjust path if needed
import ThemeSelector from '@/components/ThemeSelector';

function Settings() {
  const navigate = useNavigate();
  const form = fLogic((state) => state.form);
  const creds = fLogic((state) => state.creds);
  const fetchUser = fLogic((state) => state.fetchUser);
  const handleFormChange = fLogic((state) => state.handleFormChange);
  const updateProfile = fLogic((state) => state.updateProfile);
  const loading = fLogic((state) => state.loading);
  
  const [isEdit, setIsEdit] = useState(false); // Use useState to manage isEdit

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
          <div className="flex items-center justify-between">
          <h1 className="card-title text-2xl mb-6">Settings</h1>
          <ThemeSelector/>
          </div>
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
                readOnly={!isEdit} // Condition based on isEdit
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
                readOnly={!isEdit} // Condition based on isEdit
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
                readOnly={!isEdit} // Condition based on isEdit
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
                readOnly // Email is always read-only
              />
            </div>

            <div className="flex justify-between space-x-2 mt-8">
            {isEdit ? (
              // Cancel Button (shown when isEdit is true)
              <div 
                className="btn btn-error btn-outline" 
                onClick={() => setIsEdit(false)} // Set isEdit to false when clicked
              >
                <XIcon />
                Cancel {/* Assuming you have an XIcon for Cancel */}
              </div>
            ) : (
              // Edit Button (shown when isEdit is false)
              <div 
                className="btn btn-accent btn-outline" 
                onClick={() => setIsEdit(true)} // Set isEdit to true when clicked
              >
                <Edit2Icon />
              </div>
            )}

              {/* Save Button */}
              <button type="submit" className="btn btn-primary"  disabled={!isEdit}>
                {loading ? (
                  <div className="loading loading-spinner loading-sm"/>
                ) : (
                  <>
                    <SaveIcon className="size-5 mr-2" />
                    Save
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
