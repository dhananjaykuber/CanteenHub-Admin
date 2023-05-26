import React from 'react';
import { UsersInterface } from '../../../modle';
import { AiFillDelete } from 'react-icons/ai';
import { confirmAlert } from 'react-confirm-alert';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

interface Props {
  user: UsersInterface;
}

const User: React.FC<Props> = ({ user }) => {
  const handleDelete = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white shadow-2xl rounded-lg px-8 py-5">
            <div className="font-semibold text-slate-700 text-lg">
              Are you sure?
            </div>
            <p className="text-sm text-slate-600 mb-3">
              You want to delete this user?
            </p>

            <button
              onClick={async () => {
                const userReference = doc(db, 'users', user.email);
                await deleteDoc(userReference);

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
    <div className="shadow-lg px-6 py-5 rounded-lg m-2 flex flex-col items-end">
      <div className="flex space-x-5 items-center">
        <img
          src={user.picture}
          alt={`${user.name}_image`}
          className="w-12 rounded-full"
        />
        <div>
          <div className="text-sm font-medium text-slate-900">{user.name}</div>
          <div className="text-sm font-medium text-slate-600">{user.email}</div>
        </div>
        <button
          className="border-2 rounded-md border-red-400 p-2 mt-3"
          onClick={handleDelete}
        >
          <AiFillDelete color="#ff6d6d" />
        </button>
      </div>
    </div>
  );
};

export default User;
