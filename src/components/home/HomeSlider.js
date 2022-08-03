import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import { Text } from '../common';
import { magento } from '../../magento';
import { ThemeContext } from '../../theme';
import { getFeaturedCategoryProducts, getProductBySKU } from '../../actions';
import { result } from 'lodash';
import NavigationService from '../../navigation/NavigationService';
import { NAVIGATION_FEATURED_CATEGORIES, NAVIGATION_HOME_PRODUCT_PATH } from '../../navigation/routes';

const HomeSlider = ({ slider, style, setCurrentProduct }) => {
  const theme = useContext(ThemeContext);

  const renderMediaItems = () =>
    slider.map((slide, index) => {
      return(
      
      <View key={index} style={styles.slide}>
        <TouchableOpacity
          onPress={() => {
            //  Linking.openURL('https://bidfoodhome.ae/') 
            console.log("slide==>", JSON.stringify(slide))
            // magento.getProductsByCategoryId

            

            getProductBySKU(slide.item_id, (result)=>{
              const product = result.payload.product;
              setCurrentProduct({ product });
              NavigationService.navigate(NAVIGATION_HOME_PRODUCT_PATH, {
                product,
                title: product.name,
              });
            })

            // getFeaturedCategoryProducts(slide.cid,(result)=>{
            //   // console.log("result==>", JSON.stringify(result));

            //   let products = result.payload.products;
            //   let title = "Featured Products"

            //   NavigationService.navigate(NAVIGATION_FEATURED_CATEGORIES, {
            //     products,
            //     title,
            //   });

            // })
             
             }}>
          <FastImage
            style={styles.imageStyle(theme)}
            resizeMode="cover"
            source={{ uri: magento.getMediaUrl() + slide.slide_image_mobile }}
          />



        </TouchableOpacity>
        {/* <Text style={styles.slideTitle(theme)}>{slide.title}</Text> */}
      </View>
    )});

  return (
    <View style={[styles.imageContainer(theme), style]}>

      <Swiper showsPagination={false} pagingEnabled autoplay={true} loop={true} autoplayTimeout={6}>
        {renderMediaItems()}
      </Swiper>
    </View>
  );
};

HomeSlider.propTypes = {
  slider: PropTypes.array,
  style: PropTypes.object,
};

HomeSlider.defaultProps = {
  slider: [],
  style: {},
};

const styles = StyleSheet.create({
  imageContainer: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.3,
    // paddingHorizontal:10,
    marginTop: 8,
  }),
  imageStyle: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.3,
    width: theme.dimens.WINDOW_WIDTH - 20,
    top: 0,
  }),
  slide: {
    alignItems: 'center',
  },
  slideTitle: theme => ({
    marginTop: theme.dimens.WINDOW_HEIGHT * 0.1,
    marginLeft: theme.dimens.WINDOW_WIDTH * 0.2,
    marginRight: theme.dimens.WINDOW_WIDTH * 0.2,
    position: 'absolute',
    fontSize: 24,
    color: theme.colors.white,
    textAlign: 'center',
  }),
});

export default HomeSlider;
