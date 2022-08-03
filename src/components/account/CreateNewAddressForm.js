import React, { Component } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  getCountries,
  addNewAddress,
  updateAccountAddressUI,
  accountAddressNextLoading,
  resetAccountAddressUI,
} from '../../actions';
import { Spinner, ModalSelect, Button, Text } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { CityDropDown } from '../common/CityDropDown';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../../navigation/NavigationService';

class CreateNewAddressForm extends Component {
  static contextType = ThemeContext;

  state = {
    selectedCity: this.props.city ? this.props.city : 'Select Your City',
    postcode: '', street: '', telephone: ''
  };
  r = (x) => {
    console.log(x)
  }
  componentWillUnmount() {

    this.props.updateAccountAddressUI('error', false);
  }

  componentDidMount() {
    AsyncStorage.getItem('storeCity').then((res) => {
      this.setState({ 'selectedCity': res });
      console.log("storeCity", "storeCity==> " + res);
    })

    this.props.getCountries();
    this.props.resetAccountAddressUI();

    if (
      this.props.customer &&
      this.props.customer.addresses &&
      this.props.customer.addresses.length
    ) {
      const address = this.props.customer.addresses[0];
      console.log("address 0", JSON.stringify(address))
      const regionData = address.region;
      const region = {
        regionCode: regionData.region_code,
        region: regionData.region,
        regionId: regionData.region_id,
      };
      this.updateUI('region', region);
      this.updateUI('countryId', address.country_id);
      this.updateUI('street', '');
      this.updateUI('city', address.city);
      this.updateUI('postcode', '');
      this.updateUI('telephone', '');
    }
  }

  onNextPressed = () => {
    const { countryId, city, region, customer } =
      this.props;

    const { postcode, telephone, street } = this.state;


    const regionValue =
      typeof region === 'object'
        ? {
          region: region.region,
          region_id: region.regionId,
          region_code: region.regionCode,
        }
        : {
          region,
        };

    let previousAddresses = customer.addresses;
    previousAddresses.push({
      region: regionValue,
      country_id: countryId,
      street: [street],
      postcode,
      City: city,
      // same_as_billing: 1,
      firstname: customer.firstname,
      lastname: customer.lastname,
      telephone,
    })

    const data = {
      customer: {
        ...customer,
        addresses: previousAddresses,
      },
    };

    this.props.updateAccountAddressUI('error', false);
    this.props.accountAddressNextLoading(true);
    this.props.addNewAddress(customer.id, data, (result) => {
      console.log("addNewAddress(c==> ", result);

      alert(
        
        (result) ? "Address added successfully!" : "Address not added!",
        [

          {
            text: "OK", onPress: () => {
              console.log("OK Pressed")
              NavigationService.goBack()

            }
          }
        ]
      );

    });





    // this.props.resetAccountAddressUI();

    // addNewAddress(customer.id, data).then(()=>{

    //   console.log("addNewAddress(c==> ", result);

    // })



  };

  updateUI = (key, value) => {
    this.props.updateAccountAddressUI(key, value);
  };

  countrySelect = (attributeId, optionValue) => {
    this.props.updateAccountAddressUI('countryId', optionValue);
  };

  regionSelect = (attributeId, selectedRegion) => {
    const { countryId, countries } = this.props;
    if (countryId && countryId.length) {
      const country = countries.find(item => item.id === countryId);
      const regionData = country.available_regions.find(
        item => item.id === selectedRegion,
      );
      const region = {
        regionCode: regionData.code,
        region: regionData.name,
        regionId: regionData.id,
      };
      this.updateUI('region', region);
    }
  };

  renderButton = () => {
    const theme = this.context;
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button onPress={this.onNextPressed} style={styles.buttonStyle(theme)}>
        {translate('common.update')}
      </Button>
    );
  };

  renderRegions = () => {
    const theme = this.context;
    const { countryId, countries, region } = this.props;
    if (countryId && countryId.length && countries && countries.length) {
      const country = countries.find(item => item.id === countryId);
      if (country && country.available_regions) {
        const data = country.available_regions.map(value => ({
          label: value.name,
          key: value.id,
        }));

        const label = region?.region
          ? region?.region
          : translate('common.region');

        return (
          <ModalSelect
            withLabel={false}
            disabled={data.length === 0}
            key="regions"
            label={label}
            attribute="Region"
            value="Region"
            data={data}
            onChange={this.regionSelect}
            style={styles.inputContainer1(theme)}
          />
        );
      }
    }

    const regionValue =
      typeof this.props.region === 'string'
        ? this.props.region
        : this.props.region.region;
    return (
      <TextInput
        value={regionValue}
        placeholder={translate('common.region')}
        placeholderTextColor={'grey'}
        onChangeText={value => this.updateUI('region', value)}
        style={styles.inputStyle}
        selectionColor={'grey'}
      />
    );
  };

  renderCountries = () => {
    const theme = this.context;
    const { countries, countryId } = this.props;

    if (!countries || !countries.length) {
      return (
        <TextInput
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          placeholder={translate('common.country')}
          placeholderTextColor={'grey'}
          keyboardType="email-address"
          autoCorrect={false}
          value={this.props.country}
          selectionColor={'grey'}
          onChangeText={value => this.updateUI('country', value)}
          style={styles.inputStyle}
        />
      );
    }

    const data = countries.map(value => ({
      label: value.full_name_locale,
      key: value.id,
    }));

    const country = countries.find(item => item.id === countryId);
    const label = country
      ? country.full_name_locale
      : translate('common.country');

    return (
      <ModalSelect
        withLabel={false}
        disabled={data.length === 0}
        key="countries"
        label={label}
        attribute={translate('common.country')}
        value={translate('common.country')}
        data={data}
        onChange={this.countrySelect}
      />
    );
  };

  render() {
    const theme = this.context;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container(theme)}>
          {this.renderCountries()}

          {this.renderRegions()}

          <TextInput
            value={this.state.postcode}
            placeholder={translate('common.postcode')}
            placeholderTextColor={'grey'}
            onChangeText={value => {
              this.setState({ postcode: value })
            }}
            style={styles.inputStyle}
            selectionColor={'grey'}
          />

          <TextInput
            value={this.state.street}
            placeholder={translate('common.street')}
            placeholderTextColor={'grey'}
            onChangeText={value => {
              this.setState({ street: value })
            }}
            style={styles.inputStyle}
            selectionColor={'grey'}
          />

          {/* <TextInput
            value={this.state.selectedCity}
            placeholder={translate('common.city')}
            onChangeText={value => this.updateUI('city', value)}
            style={styles.inputStyle}
            editable={false} 
            selectTextOnFocus={false}
            selectionColor={'grey'}
          /> */}
          <CityDropDown
            selectedCity={this.state.selectedCity}
            onPressCity={city => {
              this.setState({ selectedCity: city });
              this.updateUI('city', city);
            }}
            style={styles.inputStyle}
          />

          <TextInput
            value={this.state.telephone}
            placeholder={translate('common.telephone')}
            placeholderTextColor={'grey'}
            onChangeText={value => {
              this.setState({ telephone: value })
            }}
            style={styles.inputStyle}
            selectionColor={'grey'}
          />
          {/* <Checkbox 
          Icn={this.r()} 

          /> */}

          {this.renderButton()}
          <Text type="heading" style={styles.errorTextStyle(theme)}>
            {this.props.error}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.large,
  }),
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 10,
    borderRadius: 6,
    width: '100%',
    height: 32,
    marginVertical: 12,
    flex: 1,
  },
  errorTextStyle: theme => ({
    color: theme.colors.error,
    alignSelf: 'center',
  }),
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
    backgroundColor: '#8BC63E',
    borderWidth: 0,
    borderRadius: 5,
  }),
  inputContainer1: theme => ({
    marginBottom: theme.spacing.large,
  }),
  inputStyle: {
    height: 48,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#E5E5E5',
    color:'#000',
    marginVertical: 16,
    borderRadius: 6,
    paddingLeft: 8,
  },
});

const mapStateToProps = ({ account, magento }) => {
  const { customer } = account;
  const { countries } = magento;
  return {
    ...account.ui,
    countries,
    customer,
  };
};

export default connect(mapStateToProps, {
  getCountries,
  updateAccountAddressUI,
  addNewAddress,
  accountAddressNextLoading,
  resetAccountAddressUI,
})(CreateNewAddressForm);
