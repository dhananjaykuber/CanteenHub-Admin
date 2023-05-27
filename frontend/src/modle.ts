export interface MenuInterface {
  id: string;
  image: string;
  name: string;
  popular: boolean;
  price: number;
  imageRef?: Number;
  type: string;
}

export interface OrderItemInterface {
  id: string;
  image: string;
  name: string;
  price: number;
  total: number;
}

export interface OrderInterface {
  id: string;
  date: string;
  email: string;
  name: string;
  phone: string;
  total: number;
  served: boolean;
  items: [OrderItemInterface];
  createdAt: string;
}

export interface UsersInterface {
  email: string;
  name: string;
  picture: string;
}

export interface AdminStateInterface {
  id?: string;
  email: string;
  isSuperAdmin: boolean;
}

export interface TodaysMenuInterface {
  id: string;
  image: string;
  name: string;
  imageRef?: Number;
  today: boolean;
}
