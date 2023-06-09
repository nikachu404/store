import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/Product';
import { ProductWithQuantity } from '../../types/ProductWithQuantity';

interface CartState {
  products: ProductWithQuantity[];
  quantity: number;
  total: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: JSON.parse(localStorage.getItem('products') ?? '[]'),
    quantity: JSON.parse(localStorage.getItem('quantity') ?? '0'),
    total: JSON.parse(localStorage.getItem('total') ?? '0'),
  } as CartState,
  reducers: {
    addProduct: (state, action: PayloadAction<ProductWithQuantity | Product>) => {
      const { id } = action.payload;
      const productIndex = state.products.findIndex((product) => product.id === id);

      if (productIndex !== -1) {
        // якщо товар вже є у кошику, збільшити кількість на 1
        state.products[productIndex].quantity += 1;
      } else {
        // якщо товару немає у кошику, додати його в кошик
        state.products.push({ ...action.payload, quantity: 1 });
      }

      // збільшити загальну кількість товарів у кошику та загальну суму
      state.quantity += 1;
      state.total += action.payload.price;

      // оновити локальне сховище
      localStorage.setItem('products', JSON.stringify(state.products));
      localStorage.setItem('quantity', JSON.stringify(state.quantity));
      localStorage.setItem('total', JSON.stringify(state.total));
    },
    removeProduct: (state, action: PayloadAction<ProductWithQuantity>) => {
      const productId = action.payload.id;
      const productIndex = state.products.findIndex((product) => product.id === productId);
    
      if (productIndex !== -1) {
        if (state.products[productIndex].quantity > 1) {
          // якщо кількість товару > 1, зменшити кількість на 1
          state.products[productIndex].quantity -= 1;
        } else {
          // якщо кількість товару 1, видалити його з кошика
          state.products.splice(productIndex, 1);
        }
    
        // оновити суму та кількість
        state.quantity -= 1;
        state.total -= action.payload.price;
    
        // оновити локальне сховище
        localStorage.setItem('products', JSON.stringify(state.products));
        localStorage.setItem('quantity', JSON.stringify(state.quantity));
        localStorage.setItem('total', JSON.stringify(state.total));
      }
    },
    removeAllProducts: (state, action: PayloadAction<ProductWithQuantity>) => {
      const { id, price } = action.payload;
      const index = state.products.findIndex((item) => item.id === id);
      if (index !== -1) {
        const item = state.products[index];
        const quantityToRemove = item.quantity;
        //видалити екземпляри продуту
        state.products.splice(index, 1);

        // оновити суму та кількість
        state.quantity -= quantityToRemove;
        state.total -= quantityToRemove * price;

        // оновити локальне сховище
        localStorage.setItem('products', JSON.stringify(state.products));
        localStorage.setItem('quantity', JSON.stringify(state.quantity));
        localStorage.setItem('total', JSON.stringify(state.total));
      }
    },
    setQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (product) {
        const priceDiff = (action.payload.quantity - product.quantity) * product.price;

        // оновити суму, кількість та кількість екземплярів одного продукту
        product.quantity = action.payload.quantity;
        state.total += priceDiff;
        state.quantity = state.products.reduce((acc, productItem) => acc + productItem.quantity, 0);
      }
    
      // оновити локальне сховище
      localStorage.setItem('products', JSON.stringify(state.products));
      localStorage.setItem('quantity', JSON.stringify(state.quantity));
      localStorage.setItem('total', JSON.stringify(state.total));
    },
  },
});

export const { addProduct, removeAllProducts, removeProduct, setQuantity } = cartSlice.actions;

export default cartSlice.reducer;