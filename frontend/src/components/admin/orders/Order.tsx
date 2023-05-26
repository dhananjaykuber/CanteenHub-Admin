import React from 'react';
import { OrderInterface } from '../../../modle';
import { AiOutlineCheck } from 'react-icons/ai';
import { db } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';

interface Props {
  order: OrderInterface;
}

const Order: React.FC<Props> = ({ order }) => {
  const success = (message: String) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const handleServerd = () => {
    const orderReference = doc(db, 'orders', order.id);

    updateDoc(orderReference, {
      served: true,
    }).then(() => {
      success(`${order.id} moved to served`);
    });
  };

  return (
    <div className="w-[300px] shadow-lg bg-white p-6 rounded-lg m-3">
      <div className="text-sm font-semibold">{order.name}</div>
      <div className="text-sm font-semibold border-b-[2px] border-slate-200 pb-3">
        {order.email}
      </div>
      <div className="text-sm font-semibold mt-3">Order #{order.id}</div>
      <p className="text-xs font-medium text-slate-400">{order.date}</p>

      <div className="w-full mt-4">
        {order?.items.map((item) => (
          <div key={item.id} className="flex items-center my-3 space-x-3">
            <img
              src={item.image}
              alt={`${item.name}_image`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="border-b-[2px] border-slate-200 w-full pb-3">
              <div className="text-sm font-semibold">{item.name}</div>
              <div className="flex justify-between mt-1">
                <p className="text-sm font-semibold">
                  Rs. {item.price * item.total}
                </p>
                <p className="text-sm font-semibold">Qty. {item.total}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="text-sm font-bold text-slate-900">
          Total: Rs. {order.total}
        </div>

        <button
          className="border-2 border-green-300 p-2 rounded-md"
          onClick={handleServerd}
        >
          <AiOutlineCheck color="#67de92" />
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Order;
