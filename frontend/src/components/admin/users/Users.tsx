import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { UsersInterface } from '../../../modle';
import User from './User';

const Users = () => {
  const [users, setUsers] = useState<UsersInterface[]>([]);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    const menusReference = collection(db, 'users');

    onSnapshot(menusReference, (querySnapshot) => {
      let tempUsers: UsersInterface[] = [];

      querySnapshot.forEach((doc) => {
        tempUsers.push({
          name: doc.data().name,
          email: doc.data().email,
          picture: doc.data().picture,
        });
      });

      setUsers(tempUsers);
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

      <div className="flex flex-wrap mt-10">
        {users
          ?.filter(
            (user) =>
              user.name.toLocaleLowerCase().includes(search) ||
              user.email.toLocaleLowerCase().includes(search)
          )
          .map((user) => (
            <User key={user.email} user={user} />
          ))}
      </div>
    </div>
  );
};

export default Users;
