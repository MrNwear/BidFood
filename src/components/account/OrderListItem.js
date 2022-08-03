import React, { useContext } from 'react';
import moment from 'moment';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Price } from '../common';
import { NAVIGATION_ORDER_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { theme, ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';
import bag from '../../assets/order/order.png';

const OrderListItem = ({ item }) => {
  const theme = useContext(ThemeContext);
  const currencySymbol = priceSignByCode(item.order_currency_code);

  const openOrdersScreen = () => {
    NavigationService.navigate(NAVIGATION_ORDER_PATH, {
      item,
    });
  };

  const newLocal = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        type="label"
        bold
        style={{ color: '#8BC63E', paddingHorizontal: 5 }}>
        Status:
      </Text>
      <Text>{`${item.status}`}</Text>
    </View>
  );
  return (
    <TouchableOpacity onPress={openOrdersScreen}>
      <View style={styles.container(theme)}>
        <View>
          <Image source={bag} />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '60%',
          }}>
          <Text bold>{`${translate('common.order')} #${item.increment_id
            }`}</Text>
          <Text type="label">
            Date: {`${moment(item.created_at).format('DD/MM/YY')}`}
          </Text>
        </View>
        <View
          style={{
            justifyContent:'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: '#8BC63E',
            }}>
            AED {(item.grand_total).toFixed(2)}
          </Text>
          <Text type="label">
            {`${translate('orderListItem.orderTotal')} `}
          </Text>
        </View>
      </View>
      <View style={styles.status(theme)}>{newLocal}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    marginTop: theme.spacing.small,
    padding: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:"space-between" ,
    flex: 1,
  }),
  status: theme => ({
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    paddingBottom: 5,
    paddingHorizontal: 10,
  }),
  row: {
    flexDirection: 'row',
  },
});

OrderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  currencySymbol: PropTypes.string.isRequired,
};

OrderListItem.defaultProps = {};

export default OrderListItem;
