import React, {  } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  addFilterData,
  getProductsForCategoryOrChild,
  setCurrentProduct,
  updateProductsForCategoryOrChild,
  getCategoryTree,
  resetFilters,
  setCurrentCategory,
} from '../../actions';
import NavigationService from '../../navigation/NavigationService';
import {
  NAVIGATION_CATEGORY_DRILL_PATH,
} from '../../navigation/routes';
import { getCategoriesChildrenWithData } from '../common/utils';
import place_holder from '../../assets/productDetails/place_holder.png'

const Category = ({
  categoryTree,
  addFilterData: _addFilterData,
  getProductsForCategoryOrChild: _getProductsForCategoryOrChild,
  getCategoryTree: _getCategoryTree,
  setCurrentProduct: _setCurrentProduct,
  updateProductsForCategoryOrChild: _updateProductsForCategoryOrChild,
}) => {
  const dispatch = useDispatch();
  
  const categories = (categoryTree && categoryTree.children_data)? categoryTree.children_data.filter(
    data => data.name === 'Categories',
  ):[];

  const filterData = (categories.length>0)?getCategoriesChildrenWithData(categories[0]):[];


  const renderAllCategoriesFilters = () => {
    var clubbedData = [
      {
        "id":91,
        "parent_id":87,
        "name":"All Items",
        "is_active":true,
        "position": 1,
        "level": 2,
        "product_count": 1121,
        "children_data":[]
      },
      {
        "id":196,
        "parent_id":87,
        "name":"Flash Sales",
        "is_active":true,
        "position":10,
        "level":4,
        "product_count":53,
        "children_data":[]
      },
    ];
    filterData.map((item)=>{
      if (item.isActive) {
        item.data.map((item)=>{
          if(item.is_active==true)
          clubbedData = [...clubbedData, item];
        })
      }
    });
    
    return (
      <FlatList
        style={{ width: '100%', flex: 1, marginVertical: 15 }}
        data={clubbedData}
        numColumns={3}
        renderItem={renderCategory}
        scrollEnabled={true}
      />
    );
  };

  const renderCategory = ({item}) =>{
    console.log('categ', item);
    return(
      <TouchableOpacity
      onPress={() => onCategoryPress(item)}
        style={{ flexDirection: 'column', marginTop: 15, alignItems: 'center', width: Dimensions.get('screen').width / 3 }}>
        <Image source={place_holder} resizeMode={'contain'} />
        <Text style={{ fontSize: 14, fontWeight:'bold', textAlign:'center' }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  const onCategoryPress = (item) => {
    //console.log('Products ===> ' +  JSON.stringify(item))
    
    dispatch(resetFilters());
    dispatch(setCurrentCategory({ category: item }));
    NavigationService.navigate(NAVIGATION_CATEGORY_DRILL_PATH, {
      title: item.name,
      selectedCategory: item
    });
  };

  return (
    <View style={styles.wrapper}>
      {renderAllCategoriesFilters()}
    </View>
  );
};

Category.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params?.title.toUpperCase(),
  headerBackTitle: ' ',
  headerRight: () => '',
});

const styles = StyleSheet.create({
  containerStyle: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  iconWrapper: theme => ({
    flex: 1,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  headerTextStyle: theme => ({
    textTransform: 'capitalize',
    color: '#759744',
    marginLeft: theme.spacing.small,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  }),
  flashSalesContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: '#8BC63E',
  },
  topButtonContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
    flex: 1,
  },
  flashSalePillText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moreFilterPillStyle: {
    padding: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#759744',
    minWidth: 64,
    marginRight: 10,
  },
  moreFiltersContainer: { flexDirection: 'row', paddingVertical: 20 },
  moreFilterText: {
    fontSize: 14,
  },
  resetFilterContainer: {
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    width: '30%',
    alignSelf: 'flex-end',
    padding: 3,
  },
});

Category.propTypes = {
  addFilterData: PropTypes.func.isRequired,
  getProductsForCategoryOrChild: PropTypes.func.isRequired,
  setCurrentProduct: PropTypes.func.isRequired,
  updateProductsForCategoryOrChild: PropTypes.func.isRequired,
};

Category.defaultProps = {};

const mapStateToProps = state => {
  const categoryTree = state.categoryTree;

  return {
    categoryTree,
  };
};

export default connect(mapStateToProps, {
  getProductsForCategoryOrChild,
  updateProductsForCategoryOrChild,
  setCurrentProduct,
  addFilterData,
  getCategoryTree,
})(Category);
