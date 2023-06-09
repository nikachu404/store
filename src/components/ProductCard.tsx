import React from 'react';

import { motion } from 'framer-motion';
import { Col } from 'reactstrap';
import styled from 'styled-components';
import { Product } from '../types/Product';
import { ProductWithQuantity } from '../types/ProductWithQuantity';
import { toast } from 'react-toastify';

import { useAppDispatch } from '../redux/hooks';
import { addProduct } from '../redux/features/cartSlice';

const ProductImg = styled.div`
  img { 
    &:hover { 
      transform: scale(0.9); 
    } 
  };
`;

const ProductName = styled.h3`
  font-size: 1.2rem; 
  color: var(--primary-color); 
  font-weight: 600; 
  margin-top: 15px; 

  a { 
    &:hover { 
      color: inherit; 
    } 
  }

  @media only screen and(max-width: 992px) { 
    font-size: 1.1rem; 
  } 

  @media only screen and(max-width: 768px) { 
  font-size: 1rem; 
  }
`;

const ProductCategory = styled.span`
  font-size: 0.9rem;
`;

const ProductCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  line-height: 1;
`;

const ProductPrice = styled.span`
  color: var(--primary-color); 
  font-size: 1.3rem; 
  font-weight: 500;
`;

const AddToCart = styled(motion.span)`
 font-size: 1.2rem; 
 padding: 5px; 
 background: var(--primary-color); 
 color: #fff; 
 border-radius: 50px;
`;

const StyledCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  background-color: white;
`;

interface Props {
  item: Product
}

export const ProductCard: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();

  // додати продукт до корзини
  const addToCart = () => {
    dispatch(addProduct(item));
    toast.success('Product added successfully'); //вспливаюча модалка про доданий товар
  };

  // зберегти дані продукту при його перетягуванні
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, product: Product | ProductWithQuantity) => {
    event.dataTransfer.setData('application/json', JSON.stringify(product));
  };

  return (
    <StyledCol
      lg="3"
      md="4"
      className="mb-2"
      draggable
      onDragStart={(event: React.DragEvent<HTMLDivElement>) => handleDragStart(event, item)}>
      <ProductImg>
        <motion.img whileHover={{ scale: 0.9 }} src={item.imgUrl} alt="" />
      </ProductImg>
      <div>
        <ProductName>
          {item.productName}
        </ProductName>
        <ProductCategory>{item.category}</ProductCategory>
      </div>
      <ProductCardBottom>
        <ProductPrice>${item.price}</ProductPrice>
        <AddToCart whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={addToCart}>
          <i className="ri-add-line" />
        </AddToCart>
      </ProductCardBottom>

    </StyledCol >
  );
};
