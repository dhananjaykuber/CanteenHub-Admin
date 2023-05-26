import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { OrderInterface } from '../../../modle';
import Order from './Order';

const History = () => {
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const date =
      new Date().getDate() + 1 > 10
        ? new Date().getDate()
        : '0' + new Date().getDate();
    const month =
      new Date().getMonth() + 1 > 10
        ? new Date().getMonth() + 1
        : '0' + (new Date().getMonth() + 1);
    const year = new Date().getFullYear();

    setDate(`${date}-${month}-${year}`);
  }, []);

  useEffect(() => {
    getOrders();
  }, [date]);

  const getOrders = async () => {
    const menusReference = query(
      collection(db, 'orders'),
      where('date', '==', date),
      where('served', '==', true)
    );

    onSnapshot(menusReference, (querySnapshot) => {
      let tempOrders: OrderInterface[] = [];

      querySnapshot.forEach((doc) => {
        tempOrders.push({
          id: doc.id,
          date: doc.data().date,
          email: doc.data().email,
          name: doc.data().name,
          total: doc.data().total,
          served: doc.data().served,
          items: doc.data().items,
          createdAt: doc.data().createdAt,
        });
      });

      setOrders(tempOrders);
    });
  };

  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateArray = e.target.value.split('-');
    setDate(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
  };

  return (
    <div>
      <div className="text-xl font-medium">History</div>

      <div className="flex-1 flex justify-between w-[265%] mt-5">
        <input
          required
          type="text"
          placeholder="Name"
          className="border border-slate-300 rounded-md outline-none text-sm shadow-sm px-3 py-2 placeholder-slate-400 w-72"
          // value={name}
          // onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          className="border border-slate-400 p-2 rounded-md text-sm outline-none"
          onChange={(e) => dateChange(e)}
        />
      </div>

      <div className="flex flex-wrap mt-3">
        {orders
          ?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
          .map((order) => (
            <Order key={order.id} order={order} />
          ))}
      </div>
    </div>
  );
};

export default History;
