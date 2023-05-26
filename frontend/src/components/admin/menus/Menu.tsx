import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MenuInterface } from '../../../modle';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Props {
  menu: MenuInterface;
}

const Menu: React.FC<Props> = ({ menu }) => {
  return (
    <div className="shadow-xl p-5 w-60 rounded-lg m-3 relative">
      <div className="absolute bg-white p-2 rounded-full right-6 top-6">
        {menu.popular ? <FaHeart color="red" /> : <FaRegHeart />}
      </div>
      <LazyLoadImage
        src={menu.image}
        alt={`${menu.name}_image`}
        className="mb-3 rounded-lg w-[200px] h-[133.2px] object-cover"
        width={200}
        height={133.2}
      />

      <div className="text-sm text-slate-700 font-medium">{menu.name}</div>
      <p className="text-sm text-slate-600 font-semibold">Rs. {menu.price}</p>
    </div>
  );
};

export default Menu;
