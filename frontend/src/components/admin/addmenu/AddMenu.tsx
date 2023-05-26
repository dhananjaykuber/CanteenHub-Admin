import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { addDoc, collection } from 'firebase/firestore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMenu = () => {
  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>(' ');
  const [price, setPrice] = useState<number>(0);
  const [popular, setPopular] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const success = () => {
    toast.success(`${name} added successfully!`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const handleFileChange = (files: any) => {
    if (files && files[0].size < 10000000) {
      setImage(files[0]);
    }
  };

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPopular(e.target.checked);
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const time = Date.now();

    if (image) {
      const imageReference = ref(storage, 'images/' + time);

      uploadBytesResumable(imageReference, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            const menusReference = collection(db, 'menus');

            addDoc(menusReference, {
              image: url,
              name: name,
              price: price,
              popular: popular,
              imageRef: time,
              type: snapshot.metadata.contentType?.split('/')[1],
            })
              .then(() => {
                success();

                setImage(undefined);
                setName('');
                setPopular(false);
                setPrice(0);
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                setLoading(false);
              });
          });
        })
        .catch((error) => {
          error(`Cannot update ${name}. Please try again.`);
        });
    }
  };

  return (
    <div>
      <div className="text-xl font-medium">Add Menu</div>

      <form
        className="w-[400px] mt-10 shadow-xl px-10 py-10 rounded-lg"
        onSubmit={handleAddMenu}
      >
        <label className="block mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Choose menu photo
          </span>
          <input
            required
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-3
      file:rounded-full file:border-0
      file:text-sm file:font-medium
      file:bg-slate-200 file:text-slate-600
      hover:file:bg-slate-300 outline-none"
            onChange={(file) => handleFileChange(file.target.files)}
          />
        </label>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </span>
          <input
            required
            type="text"
            placeholder="Name"
            className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-1">
            Price
          </span>
          <input
            required
            type="number"
            placeholder="Price"
            className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-full"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </label>
        <label className="mb-4 flex items-center space-x-3">
          <span className="text-sm font-medium text-slate-700 mb-1">
            Popular
          </span>
          <input
            type="checkbox"
            placeholder="Popular"
            checked={popular}
            onChange={onCheckboxChange}
          />
        </label>

        <button className="bg-slate-700 px-5 py-2 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition">
          {loading ? 'Adddding...' : 'Add Menu'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddMenu;
