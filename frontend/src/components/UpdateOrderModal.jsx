import { useOrderStore } from "@/store/useOrder";
import { SaveIcon, X } from "lucide-react";
import React, { useState } from "react";

function UpdateOrderModal({ order, onClose, onSave }) {
  const [status, setStatus] = useState(order.status);
  const {updateOrderStatus} = useOrderStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateOrderStatus(order.order_id, status);
    onClose(); // close modal after update
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Order Status</h2>
          <button onClick={onClose} className="btn btn-sm text-red-500">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
  <label className="block text-sm font-medium mb-1">Order Status</label>
        <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full"
            required
        >
            <option value="" disabled>Select status</option>
            <option value={order.status}>{order.status}</option>
            <option value="in-progress">In Progress</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
        </select>
        </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              <SaveIcon className="size-5 mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateOrderModal;
