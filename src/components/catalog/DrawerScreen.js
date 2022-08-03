import React, { Component, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import {
  getProductsForCategoryOrChild,
  addFilterData,
  getSearchProducts,
  getFilteredProducts,
} from '../../actions';
import { Button, Text, Input } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const DrawerScreen = props => {
  const [maxValue, setMaxValue] = useState('');
  const [minValue, setMinValue] = useState('');
  const [brandValue, setBrandValue] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(props.brands);
  const [avaiableInStock,setAvailableInStock]=useState(false);
  const theme = useContext(ThemeContext);

  // useEffect(() => {
  //   const { brands } = props;
    
  // }, [props]);

  const onApplyPressed = () => {
    const { currencyRate } = props;
    
    const priceFilter = {
      price: {
        condition: 'gteq,lteq',
        value: `${(minValue / currencyRate).toFixed(2)},${(
          maxValue / currencyRate
        ).toFixed(2)}`,
      }
    };
    if(brandValue != ''){
      priceFilter['product_brand'] = {
        condition: 'like',
        value: `%${brandValue}%`
      }
    }
    props.addFilterData(priceFilter);

    
    if (props && props.filters&& props.filters.categoryScreen) {
      
      props.getProductsForCategoryOrChild(
        props.category,
        null,
        props.filters.sortOrder,
        priceFilter,
      );
      props.addFilterData({ categoryScreen: false });
    } else {
      
    }
    props.getFilteredProducts(props.category.id,minValue,maxValue,brandValue,avaiableInStock);
    
    // axios.get('https://dev.bidfoodhome.ae/s44/rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=373&searchCriteria[filter_groups][0][filters][0][condition_type]=eq&searchCriteria[filter_groups][1][filters][0][field]=special_price&searchCriteria[filter_groups][1][filters][0][value]=80&searchCriteria[filter_groups][1][filters][0][condition_type]=gteq&searchCriteria[filter_groups][1][filters][1][field]=price&searchCriteria[filter_groups][1][filters][1][value]=80&searchCriteria[filter_groups][1][filters][1][condition_type]=gteq&searchCriteria[filter_groups][2][filters][0][field]=special_price&searchCriteria[filter_groups][2][filters][0][value]=85&searchCriteria[filter_groups][2][filters][0][condition_type]=lteq&searchCriteria[filter_groups][2][filters][1][field]=price&searchCriteria[filter_groups][2][filters][1][value]=85&searchCriteria[filter_groups][2][filters][1][condition_type]=lteq&searchCriteria[filter_groups][3][filters][0][field]=product_brand&searchCriteria[filter_groups][3][filters][0][value]=77&searchCriteria[filter_groups][3][filters][0][condition_type]=eq',{headers:{'Authorization':'Bearer wb2s1euayoz8sszqdktjxxxd8ud7jwp1'}})
    //  .then(response=>{
    //    console.log(response.data.items)
    //  })
    //  .catch(e=>{
    //    alert(e)
    //  })
    props.navigation.closeDrawer();
  };

  const onSetItem = (item) => {
    setValue(item);
    setOpen(false);
    setBrandValue(item.brand_id)
    
  }
  const resetOnPress=()=>{
    setValue('');
    setBrandValue("");
    setMinValue('');
    setMaxValue('');
    setAvailableInStock(false);
  }

  const {
    container,
    InputContainer,
    textStyle,
    minInputStyle,
    maxInputStyle,
    brandInputStyle,
    dashTextStyle,
  } = styles;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={container(theme)}>
        <View style={InputContainer(theme)}>
          <Text type="heading" style={textStyle(theme)}>
            Price:
          </Text>
          <Input
            containerStyle={minInputStyle}
            placeholder={translate('common.min')}
            value={minValue}
            keyboardType="numeric"
            onChangeText={minValue => setMinValue(minValue)}
          />
          <Text style={dashTextStyle(theme)}>-</Text>
          <Input
            containerStyle={styles.maxInputStyle}
            value={maxValue}
            placeholder={translate('common.max')}
            keyboardType="numeric"
            onChangeText={maxValue => setMaxValue(maxValue)}
          />
        </View>
        <View >
          <Text type="heading" style={textStyle(theme)}>
            Brand:
          </Text>
          {/* <Input
            containerStyle={brandInputStyle}
            placeholder={translate('common.brand')}
            value={brandValue}
            keyboardType="default"
            onChangeText={brandValue => setBrandValue(brandValue)}
          /> */}
          <View style={{minHeight: 300}}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              onSelectItem={(item) => {
                onSetItem(item);
              }}
              setItems={setItems}
              containerStyle={brandInputStyle}
              schema={{
                label: 'name',
                value: 'url_key'
              }}
            />
            <BouncyCheckbox onPress={(isChecked) => {
              setAvailableInStock(isChecked);}} text='Only Available in Stock' textStyle={{textDecorationLine:'none'}} isChecked={avaiableInStock} fillColor='green' disableBuiltInState  />
          </View>
        </View>

        <View style={styles.buttonStyleWrap}>
        <View >
          <Pressable onPress={resetOnPress} style={styles.buttonStyle}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
              {'Reset'}
            </Text>
          </Pressable>
        </View>
          <Pressable onPress={onApplyPressed} style={styles.buttonStyle}>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
              {translate('common.apply')}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: '#fff',
  }),
  InputContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: theme.spacing.large,
  }),
  brandInputStyle: {
    width: '100%',
  },
  minInputStyle: {
    width: 50,
  },
  maxInputStyle: {
    width: 50,
  },
  textStyle: theme => ({
    paddingLeft: 50,
    paddingRight: theme.spacing.large,
    color: '#000',
    opacity: 0.7,
  }),
  dashTextStyle: theme => ({
    paddingHorizontal: theme.spacing.large,
  }),
  buttonStyle: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8BC63E',
  },
  buttonStyleWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

DrawerScreen.propTypes = {
  currencyRate: PropTypes.number,
  brands: PropTypes.array,
};

DrawerScreen.defaultProps = {
  currencyRate: 1,
  brands: [],
};

const mapStateToProps = ({ category, filters, search, magento }) => {
  const currentCategory = category.current.category;
  const { searchInput } = search;
  const {
    currency: { displayCurrencyExchangeRate: currencyRate },
    brands
  } = magento;
  return {
    filters,
    searchInput,
    currencyRate,
    category: currentCategory,
    brands,
  };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  addFilterData,
  getFilteredProducts,
  getSearchProducts,
})(DrawerScreen);
