export const OrderTypes = {
  ORDERED: "ordered",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const OrderStatusId = {
  ORDERED: 1,
  PACKED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5,
};
export const OrderStatusForIds: {
  [key in "1" | "2" | "3" | "4" | "5"]: string;
} = {
  "1": "ORDERED",
  "2": "PACKED",
  "3": "SHIPPED",
  "4": "DELIVERED",
  "5": "CANCELLED",
};

export const PaymentTypes = {
  PENDING: "pending",
  COMPLETED: "completed",
  REFUND: "refund",
};

export const PaymentStatusId = {
  PENDING: 1,
  COMPLETED: 2,
  REFUND: 3,
};
