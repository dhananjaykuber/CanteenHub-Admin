import { useState, useEffect } from 'react';

import AddMenu from './components/admin/addmenu/AddMenu';
import Admin from './components/admin/admins/Admin';
import History from './components/admin/history/History';
import Menus from './components/admin/menus/Menus';
import Orders from './components/admin/orders/Orders';
import Popular from './components/admin/popular/Popular';
import TodaysMenu from './components/admin/todaysmenu/TodaysMenu';
import UpdateMenus from './components/admin/updatemenus/UpdateMenus';
import Users from './components/admin/users/Users';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminStateInterface } from './modle';
import { setAdmin } from './redux/admin/adminSlice';

import { useAppSelector, useAppDispatch } from './redux/hook';

const options = [
  'Menus',
  'Add Menu',
  'Todays Menu',
  'Update Menu',
  'Orders',
  'History',
  'Paid Orders',
  'App Users',
  'Transactions',
  'Popular',
];

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const admin = useAppSelector((state) => state.admin);

  const [active, setActive] = useState<String>('Menus');

  useEffect(() => {
    const value = localStorage.getItem('canteenhubadmin');

    if (value && typeof value === 'string') {
      const data = JSON.parse(value);

      if (data?.email) {
        dispatch(
          setAdmin({
            email: data.email,
            isSuperAdmin: data.isSuperAdmin,
          })
        );
      }
    }
  }, []);

  return (
    <div className="max-h-scree">
      <Navbar />

      {admin.email.length > 0 ? (
        <div className="flex">
          <Sidebar active={active} setActive={setActive} />
          <div className="px-8 py-8 ml-[280px] mt-[80px]">
            {active === 'Menus' && <Menus />}
            {active === 'Add Menu' && <AddMenu />}
            {active === 'Todays Menu' && <TodaysMenu />}
            {active === 'Update Menu' && <UpdateMenus />}
            {active === 'Orders' && <Orders />}
            {active === 'History' && <History />}
            {active === 'All Users' && <Users />}
            {active === 'Popular' && <Popular />}
            {active === 'Admins' && <Admin />}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
