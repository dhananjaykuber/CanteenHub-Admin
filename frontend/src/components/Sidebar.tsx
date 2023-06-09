import { IoFastFoodSharp, IoAddCircleSharp } from 'react-icons/io5';
import {
  FaPenSquare,
  FaClock,
  FaHistory,
  FaUsers,
  FaStar,
  FaUserLock,
} from 'react-icons/fa';
import { useAppSelector } from '../redux/hook';

const options = [
  'Menus',
  'Add Menu',
  'Todays Menu',
  'Update Menu',
  'Orders',
  'History',
  'All Users',
  'Popular',
  'Admins',
];

const restricted = [true, false, true, false, true, true, false, true, false];

const icons = [
  IoFastFoodSharp,
  IoAddCircleSharp,
  IoAddCircleSharp,
  FaPenSquare,
  FaClock,
  FaHistory,
  FaUsers,
  FaStar,
  FaUserLock,
];

interface Props {
  active: String;
  setActive: React.Dispatch<React.SetStateAction<String>>;
}

const Sidebar: React.FC<Props> = ({ active, setActive }) => {
  const admin = useAppSelector((store) => store.admin);

  return (
    <div className="flex fixed bottom-0 top-[80px]">
      <div className="w-[280px] shadow-lg py-5 px-4 flex flex-col justify-between">
        <div className="overflow-x-auto	no-scrollbar">
          {options.map((name, index) => {
            const Icon = icons[index];

            return (
              <div key={index}>
                {(admin.isSuperAdmin || restricted[index]) && (
                  <div
                    className={`flex items-center space-x-2 px-3 py-3 rounded-md my-2 cursor-pointer transition ${
                      active === name && 'bg-slate-300'
                    }`}
                    onClick={() => setActive(name)}
                  >
                    <Icon size={15} />
                    <p className="text-sm">{name}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-sm font-light text-slate-400">
          By Dhananjay Kuber
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
