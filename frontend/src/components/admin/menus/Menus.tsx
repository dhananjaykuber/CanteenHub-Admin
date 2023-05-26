import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { MenuInterface } from '../../../modle';
import Menu from './Menu';

const Menus = () => {
  const [menus, setMenus] = useState<MenuInterface[]>([]);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    const menusReference = collection(db, 'menus');

    onSnapshot(menusReference, (querySnapshot) => {
      let tempMenus: MenuInterface[] = [];

      querySnapshot.forEach((doc) => {
        tempMenus.push({
          id: doc.id,
          image: doc.data().image,
          name: doc.data().name,
          popular: doc.data().popular,
          price: doc.data().price,
          type: doc.data().type,
        });
      });

      setMenus(tempMenus);
    });
  };

  return (
    <div>
      <div className="flex-1 flex justify-between mt-5">
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

export default Menus;
