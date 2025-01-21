type CategoryName = "Nutritional Supplements" | "Sports Apparel" | "Home Equipment" | "Health & Wellness" | "Training Accessories" | "other"
| null;


export interface IProducts {
    subcategory?: string;
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imgUrl?: string;
    category?: CategoryName;
    quantity?: number;
    status?: string;
}
