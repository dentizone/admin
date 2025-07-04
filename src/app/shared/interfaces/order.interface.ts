export interface Seller {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  totalAmount: number;
  orderShipmentAddress: { street: string; city: string } | null;
  createdAt: string;
  statusTimeline: { status: string; timestamp: string }[];
  orderItems: {
    id: string;
    postId: string;
    postTitle: string;
    price: number;
    createdAt: string;
    pickupLocation?: string;
  }[];
  sellers: Seller[];
  status?: string;
}
