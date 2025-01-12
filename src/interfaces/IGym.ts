export interface IGym {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    latitude: string;
    longitude: string;
    rol: string;
    createdAt: string;
    users: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      rol: string;
      height: number;
      weight: number;
      password: string;
      googlePassword: string | null;
      createdAt: string;
    }[];
    classes: {
      id: string;
      name: string;
      description: string;
      capacity: number;
      duration: number;
      imgUrl: string;
      date: string;
      time: string;
    }[];
  }