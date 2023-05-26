import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AdminStateInterface } from '../../../modle';
import User from './User';

const Admin = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [superAdmin, setSuperAdmin] = useState<boolean>(false);

  const [admins, setAdmins] = useState<AdminStateInterface[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = async () => {
    const adminsReference = collection(db, 'admins');

    onSnapshot(adminsReference, (querySnapshot) => {
      let tempAdmins: AdminStateInterface[] = [];

      querySnapshot.forEach((doc) => {
        tempAdmins.push({
          id: doc.id,
          email: doc.data().email,
          isSuperAdmin: doc.data().isSuperAdmin,
        });
      });

      setAdmins(tempAdmins);
    });
  };

  const success = () => {
    toast.success(`${email} admin added successfully!`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuperAdmin(e.target.checked);
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const adminReference = collection(db, 'admins');
    addDoc(adminReference, {
      email: email,
      password: password,
      isSuperAdmin: superAdmin,
    })
      .then(() => {
        success();

        setEmail('');
        setPassword('');
        setSuperAdmin(false);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="text-xl font-medium">Admin Users</div>

      <form
        className="w-[400px] mt-10 shadow-xl px-10 py-10 rounded-lg mb-16"
        onSubmit={handleAddAdmin}
      >
        <label className="block mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </span>
          <input
            required
            type="email"
            placeholder="Email"
            className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-4 relative">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            password
          </span>
          <input
            required
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="absolute right-2 bottom-3 cursor-pointer">
            {showPassword ? (
              <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <FaEye onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
        </label>

        <label className="mb-4 flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-700 mb-1">
            Super Admin
          </span>
          <input
            type="checkbox"
            placeholder="Popular"
            checked={superAdmin}
            onChange={onCheckboxChange}
          />
        </label>

        <button
          className="bg-slate-700 px-5 py-2 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition"
          disabled={loading}
        >
          {loading ? 'Adddding...' : 'Add Admin'}
        </button>
      </form>

      <div className="text-xl font-medium">Admins</div>

      <div className="flex flex-wrap">
        {admins?.map((admin) => (
          <User key={admin.id} admin={admin} />
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Admin;
