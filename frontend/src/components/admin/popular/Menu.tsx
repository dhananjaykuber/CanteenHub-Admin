import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MenuInterface } from '../../../modle';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast, ToastContainer } from 'react-toastify';

interface Props {
  menu: MenuInterface;
}

const Menu: React.FC<Props> = ({ menu }) => {
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

  const handlePopular = async () => {
    const menuReference = doc(db, 'menus', menu.id);

    await updateDoc(menuReference, {
      popular: !menu.popular,
    });

    success(`${menu.name + ' is removed from popular menus'}`);
  };

  return (
    <div className="shadow-xl p-5 w-60 rounded-lg m-3 relative">
      <button
        className="absolute bg-white p-2 rounded-full right-6 top-6"
        onClick={handlePopular}
      >
        {menu.popular ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
      <LazyLoadImage
        src={menu.image}
        alt={`${menu.name}_image`}
        className="mb-3 rounded-lg w-[200px] h-[133.2px] object-cover"
        width={200}
        height={133.2}
      />

      <div className="text-sm text-slate-700 font-medium">{menu.name}</div>
      <p className="text-sm text-slate-600 font-semibold">Rs. {menu.price}</p>

      <ToastContainer />
    </div>
  );
};

export default Menu;
