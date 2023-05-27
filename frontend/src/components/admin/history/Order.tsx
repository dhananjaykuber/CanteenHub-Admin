import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { AiOutlineClose, AiFillDelete } from 'react-icons/ai';
import { db } from '../../../firebase';
import { OrderInterface } from '../../../modle';

import { useAppSelector } from '../../../redux/hook';

interface Props {
  order: OrderInterface;
}

const Order: React.FC<Props> = ({ order }) => {
  const admin = useAppSelector((store) => store.admin);

  const handleMoveToOrder = async () => {
    const orderReference = doc(db, 'orders', order.id);

    await updateDoc(orderReference, {
      served: false,
    });
  };

  const handleDelete = async () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white shadow-2xl rounded-lg px-8 py-5">
            <div className="font-semibold text-slate-700 text-lg">
              Are you sure?
            </div>
            <p className="text-sm text-slate-600 mb-3">
              You want to delete this order?
            </p>

            <button
              onClick={async () => {
                const orderReference = doc(db, 'orders', order.id);
                await deleteDoc(orderReference);

                onClose();
              }}
              className="bg-red-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-red-700 hover:border-red-700 transition mr-3"
            >
              Yes
            </button>
            <button
              className="bg-slate-700 px-3 py-1 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition"
              onClick={onClose}
            >
              No
            </button>
          </div>
        );
      },
    });
  };

  return (
    <div className="w-[300px] shadow-lg bg-white p-6 rounded-lg m-3 relative">
      {admin.isSuperAdmin && (
        <AiFillDelete
          className="absolute right-5"
          color="#fa2020"
          cursor={'pointer'}
          onClick={handleDelete}
        />
      )}
      <div className="text-sm font-semibold">{order.name}</div>
      {order.phone.length === 10 ? (
        <>
          <div className="text-sm font-semibold">{order.email}</div>
          <div className="text-sm font-semibold border-b-[2px] border-slate-200 pb-3">
            {order.phone}
          </div>
        </>
      ) : (
        <div className="text-sm font-semibold border-b-[2px] border-slate-200 pb-3">
          {order.email}
        </div>
      )}
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

        <div className="flex space-x-2">
          <button
            className="border-2 border-red-500 p-2 rounded-md px-3"
            onClick={handleMoveToOrder}
          >
            <AiOutlineClose color="#e41324" />
          </button>
          <button className="border-2 border-red-200 p-2 rounded-md uppercase text-red-300 text-sm font-medium">
            Served
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
