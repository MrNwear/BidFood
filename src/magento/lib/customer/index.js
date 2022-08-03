import { CUSTOMER_TYPE } from '../../types';

export default magento => ({
  getCurrentCustomer: () =>
    magento.get('/V1/customers/me', undefined, undefined, CUSTOMER_TYPE),
    

  getCustomerCart: () =>
    magento.get('/V1/carts/mine', undefined, undefined, CUSTOMER_TYPE),

  createCart: customerId =>
    magento.post(`/V1/customers/${customerId}/carts`, undefined, CUSTOMER_TYPE),

  addItemToCart: (item,store) =>{
    return magento.post(`/V1/carts/mine/items`, item, CUSTOMER_TYPE);
  },

  addCartBillingAddress: address =>
    magento.post('/V1/carts/mine/billing-address', address, CUSTOMER_TYPE),

  cartEstimateShippingMethods: address =>
    magento.post(
      '/V1/carts/mine/estimate-shipping-methods',
      address,
      CUSTOMER_TYPE,
    ),

  addCartShippingInfo: address =>
    magento.post('/V1/carts/mine/shipping-information', address, CUSTOMER_TYPE),

  getCartShippingMethods: () =>
    magento.get(
      '/V1/carts/mine/estimate-shipping-methods',
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),

  getCartPaymentMethods: () =>
    magento.get(
      '/V1/carts/mine/payment-methods',
      undefined,
      undefined,
      CUSTOMER_TYPE,
    ),

  placeCartOrder: payment =>
    magento.post('/V1/carts/mine/payment-information', payment, CUSTOMER_TYPE),

  addCoupon: couponCode =>
    magento.put(
      `/V1/carts/mine/coupons/${couponCode}`,
      undefined,
      CUSTOMER_TYPE,
    ),

  postReview: review =>
    magento.post('/V1/mma/review/mine/post', review, CUSTOMER_TYPE),
});
