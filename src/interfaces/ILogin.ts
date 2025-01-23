export interface ILoginData {
    email: string;
    password: string;
}

export interface ILoginErrors {
    email?: string;
    password?: string;
}


/*export interface IUserSession{
    token:string;
    user: {
        address: string;
        credential:{
            id:number;
            password:string
        }
        email: string;
        id: number
        name: string;
        orders: number[]
        phone: string;
        role: string;
    }
}*/
export interface IAppointment {
    id: string;
    status: string;
    date: string; // O Date, dependiendo de cómo lo manejes en tu backend
    time: string; // Puede ser un string tipo "HH:mm:ss" o similar
  }

  //revisar que estos sean los datos de IORDER
  interface IOrder {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    date: string;
  }

export interface IUserSession {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      rol: string; // Cambiado de 'role' a 'rol' según el ejemplo proporcionado
      status: string;
      height?: number;
      weight?: number;
      imgUrl: string;
      createdAt: string;
      membershipExpiresAt: string | null; // Puede ser null si no hay una membresía activa
      gym: string | null; // Puede ser null si no está asociado a un gimnasio
      appointments: IAppointment[]; 
      orders: IOrder[]; 
      /*reviews: any[]; // Cambiar `any` si hay una estructura definida para las reseñas
      reviewsGyms: any[]; // Cambiar `any` si hay una estructura definida para las reseñas de gimnasios*/
    };
  }
  

