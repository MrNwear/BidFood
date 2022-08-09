import React, { useEffect, useContext, useState } from 'react';
import moment from 'moment';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Text } from '../common';
import { orderProductDetail } from '../../actions';
import { getProductThumbnailFromAttribute } from '../../helper/product';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { magento } from '../../magento';
import { store } from '../../store';

import {
  NAVIGATION_HOME_SCREEN_PATH,
} from '../../navigation/routes';

const OrderScreen = ({
  products,
  navigation,
  orderProductDetail: _orderProductDetail,
}) => {
  
  const theme = useContext(ThemeContext);
  const currencySymbol = priceSignByCode(
    navigation.state.params.item.order_currency_code,
  );
  const paymentMethod = navigation.state.params?.item?.payment?.method;
  const orderCreationDate = moment(
    navigation.state.params.item.created_at,
  ).format('MMMM D, YYYY');
  const billingAddress = navigation.state.params?.item.billing_address;

  const [customerToken,setCustomerToken]=useState(null)

  const { street, city, postcode } = billingAddress;

  useEffect(async() => {
    // const customerTokenget = await AsyncStorage.getItem('customerToken');
    // setCustomerToken(customerTokenget)
    navigation.state.params.item.items.forEach(item => {
      if (!(item.sku in products)) {
        _orderProductDetail(item.sku);
      }
    });
  }, [_orderProductDetail, navigation.state.params.item.items, products]);

  const image = item => {
    console.log('image', item.sku)
    if (products[item.sku]) {
      console.log('image', getProductThumbnailFromAttribute(products[item.sku]));
      return getProductThumbnailFromAttribute(products[item.sku]);
    }
  };


  const renderItem = item =>{
    console.log('testsaaaaa', JSON.stringify(item.item))
    return(
      <View style={[styles.itemContainer(theme),{marginVertical:3}]}>
     
      <View style={styles.row}>
        <View
          style={{
            width: '30%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FastImage
            style={styles.imageStyle(theme)}
            resizeMode="contain"
            source={{ uri: image(item.item) }}
            />
        </View>
        <View style={{ width: '70%', justifyContent: 'flex-start' }}>
          <Text
            style={{
              marginRight: 5,
              fontSize: 16,
              flexWrap: 'wrap',
              paddingLeft: 10,
            }}>
            {item.item.name}
          </Text>
          {/* <Text type="label">{`${translate('common.sku')}: ${
            item.item.sku
          }`}</Text> */}
          
          <Text style={{ fontSize: 16, paddingLeft: 10, color: '#F37A20' }}>Quantity : {item.item.qty_ordered}</Text>
          <Text style={{ fontSize: 16, paddingLeft: 10, color: '#F37A20' }}>Total : AED {(item.item.price_incl_tax*item.item.qty_ordered).toFixed(2)}</Text>

          
          {/* <Text type="label">{`${translate('common.quantity')}: ${
            item.item.qty_ordered
          }`}</Text> */}
          {/* <View style={styles.row}> */}
          {/* <Text type="label">{`${translate('common.subTotal')}: `}</Text> */}
          {/* <Price
              basePrice={item.item.row_total}
              currencyRate={1}
              currencySymbol={currencySymbol}
            /> */}
          {/* </View> */}
        </View>
      </View>
    </View>
  );
}

  const { item } = navigation.state.params;
  console.log('token====>',store.getState().customerAuth?.token)

  const checkAuth=()=>{
    if(store.getState().customerAuth?.token=="" || store.getState().customerAuth?.token==null || store.getState().customerAuth?.token==undefined){
      navigation.navigate(NAVIGATION_HOME_SCREEN_PATH)
    }else{
      navigation.goBack()
    }
  }

  return (
    <View style={styles.container(theme)}>
      <View style={{ height: 50, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity 
        onPress={() => {
          checkAuth()}}
          style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Image style={{ height: 20, width: 20 }} source={require('../../../src/assets/Icons/back.png')} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20 }}>{"Order #" + navigation.state.params.item.increment_id}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
        </View>

      </View>
      <View
        style={{
          paddingBottom: 5,
          borderBottomWidth: 1,
          borderColor: '#E1E1E1',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ opacity: 0.5, color: '#000', fontSize: 17 }}>
            Ordered on:
          </Text>
          <Text
            style={{
              opacity: 0.7,
              color: '#000',
              fontSize: 16,
              paddingLeft: 10,
            }}>
            {`${orderCreationDate}`}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ opacity: 0.5, color: '#000', fontSize: 17 }}>
            Payment method:
          </Text>
          <Text
            style={{
              opacity: 0.7,
              color: '#000',
              fontSize: 16,
              paddingLeft: 10,
            }}>
            {`${paymentMethod === 'checkoutcom_card_payment'
              ? 'Paid By Card'
              : 'Card On Delivery'
              }`}
          </Text>
        </View>
      </View>
      <View style={{
          paddingBottom: 5,
          borderBottomWidth: 1,
          borderColor: '#E1E1E1',
        }}>
        <Text
          style={{ fontSize: 17, paddingTop: 10, color: '#000', opacity: 0.8 }}>
          Delivery Location
        </Text>
        <Text>{`${street}, ${city}, ${postcode}`}</Text>
      </View>
      <View style={{
          paddingBottom: 5,
          borderBottomWidth: 1,
          borderColor: '#E1E1E1',
        }}>

      <Text style={{ fontSize: 17, paddingTop: 10, color: '#000', opacity: 0.8 }}> Cart Items</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={[...item.items]}
        renderItem={renderItem}
        keyExtractor={(_item, index) => index.toString()}
      />
      <View style={styles.totalContainer}>
        <Text
          style={{
            fontSize: 18,
          }}>
          Status
        </Text>
        <Text
          type="label"
          style={{ fontSize: 15, color: '#000', opacity: 0.6 }}>
          {item.status}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text
          type="label"
          style={{ fontSize: 18, color: '#000', opacity: 0.6 }}>{`${translate(
            'common.subTotal',
          )} `}</Text>
        <Text
          type="label"
          style={{ fontSize: 15, color: '#000', opacity: 0.6 }}>
          AED {item.subtotal.toFixed(2)}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text
          style={{
            fontSize: 18,
          }}>
          Delivery Fee
        </Text>
        <Text
          type="label"
          style={{ fontSize: 15, color: '#000', opacity: 0.6 }}>
          AED {item.base_shipping_incl_tax}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text
          style={{
            fontSize: 18,
          }}>
          Discount
        </Text>
        <Text
          type="label"
          style={{ fontSize: 15, color: '#000', opacity: 0.6 }}>
          AED {item.discount_amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text
          style={{
            fontSize: 18,
          }}>
          VAT
        </Text>
        <Text
          type="label"
          style={{ fontSize: 15, color: '#000', opacity: 0.6 }}>
          AED {item.tax_amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.totalContainer}>
        <Text style={{ fontSize: 18, color: '#8BC63E' }}>Total</Text>
        <Text type="label" style={{ fontSize: 15, color: '#8BC63E' }}>
          AED {item.base_grand_total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

OrderScreen.navigationOptions = ({ navigation }) => ({

  title: `${translate('common.order')} #${navigation.state.params.item.increment_id
    }`,

});


const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
    flex: 1,
  }),
  itemContainer: theme => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    // padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
  }),
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageStyle: theme => ({
    width: theme.dimens.orderImageWidth,
    height: theme.dimens.orderImageHeight,
    marginRight: 10,
  }),
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 3,
  },
});

OrderScreen.propTypes = {
  products: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  orderProductDetail: PropTypes.func.isRequired,
};

OrderScreen.defaultProps = {};

const mapStateToProps = ({ account, magento }) => {
  const { products } = account;
  return {
    products,
  };
};

export default connect(mapStateToProps, {
  orderProductDetail,
})(OrderScreen);
