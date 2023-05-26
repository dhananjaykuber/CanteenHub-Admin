import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodaysMenuInterface } from '../../../modle';
import Menu from './Menu';

const TodaysMenu = () => {
  const [menus, setMenus] = useState<TodaysMenuInterface[]>([]);
  const [search, setSearch] = useState<string>('');

  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>(' ');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    const menusReference = collection(db, 'todaysmenus');

    onSnapshot(menusReference, (querySnapshot) => {
      let tempMenus: TodaysMenuInterface[] = [];

      querySnapshot.forEach((doc) => {
        tempMenus.push({
          id: doc.id,
          image: doc.data().image,
          name: doc.data().name,
          imageRef: doc.data().imageRef,
        });
      });

      setMenus(tempMenus);
    });
  };

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

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const time = Date.now();

    if (image) {
      const imageReference = ref(storage, 'todaysmenus/' + time);

      uploadBytesResumable(imageReference, image)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            const menusReference = collection(db, 'todaysmenus');

            addDoc(menusReference, {
              image: url,
              name: name,
              imageRef: time,
              type: snapshot.metadata.contentType?.split('/')[1],
            })
              .then(() => {
                success();

                setImage(undefined);
                setName('');
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
          error(`Cannot add ${name}. Please try again.`);
        });
    }
  };

  return (
    <div>
      <div className="text-xl font-medium">Todays Menu</div>

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

        <button className="bg-slate-700 px-5 py-2 rounded-lg text-sm text-white border hover:bg-white hover:text-slate-700 hover:border-slate-700 transition">
          {loading ? 'Adddding...' : 'Add Menu'}
        </button>
      </form>

      <ToastContainer />

      <div className="flex-1 flex justify-between mt-14">
        <div className="text-xl font-medium">Menus</div>
        <input
          required
          type="text"
          placeholder="Search..."
          className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-72"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap mt-5">
        {menus
          ?.filter((menu) => menu.name.toLocaleLowerCase().includes(search))
          .map((menu) => (
            <Menu key={menu.id} menu={menu} />
          ))}
      </div>
    </div>
  );
};

export default TodaysMenu;
