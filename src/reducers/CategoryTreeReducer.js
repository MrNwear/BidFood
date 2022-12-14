import {
  MAGENTO_GET_CATEGORY_TREE,
  MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE,
  MEGENTO_CLEAR_CATEGORY_TREE,
} from '../actions/types';

const INITIAL_STATE = {
  refreshing: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MAGENTO_GET_CATEGORY_TREE:
      return action.payload;
    case MEGENTO_CLEAR_CATEGORY_TREE:
      return INITIAL_STATE;
    case MAGENTO_UPDATE_REFRESHING_CATEGORY_TREE:
      return {
        ...state,
        refreshing: action.payload,
      };
    default:
      return state;
  }
};
