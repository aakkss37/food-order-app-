import { useContext, useState } from 'react';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';
import CheckOutForm from './CheckOutForm';
import React from 'react';

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isorderClicked, setOrderClickHandler] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false)

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };
  const orderClickHandler = ()=>{
    setOrderClickHandler(true)
  }
  const checkoutHandler = async(userData)=>{
    try {
      setIsSubmiting(true)
      const responce = await fetch("https://custon-hooks-default-rtdb.asia-southeast1.firebasedatabase.app/orders.json", {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderItems: cartCtx.items
        })
      })
      if (!responce.ok) {
        throw new Error(responce.status)
      }
      setIsSubmiting(false);
      setIsSubmited(true);
      cartCtx.clearCart();
    } 
    catch (error) {
      console.log(error.message)
    }
    
  }

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const moduleAction = <div className={classes.actions}>
      <button className={classes['button--alt']} onClick={props.onClose}>
        Close
      </button>
      {hasItems && <button className={classes.button} onClick={orderClickHandler}>Order</button>}
    </div>
 

  const moduleContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isorderClicked && <CheckOutForm onCancel={props.onClose} onCheckout={checkoutHandler} />}
      {!isorderClicked && moduleAction}
    </React.Fragment>
  )


  return (
    <Modal onClose={props.onClose}>
      {!isSubmiting && !isSubmited && moduleContent }
      {isSubmiting && <h3>Loading...</h3>}
      {isSubmited && !isSubmiting && <h1>Order Placed!</h1>}
    </Modal>
  );
};

export default Cart;
