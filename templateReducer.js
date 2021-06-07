import {
    FETCH_TEMPLATE_REQUEST,
    FETCH_TEMPLATE_SUCCESS,
    FETCH_TEMPLATE_FAILURE,
    SHOW_TEMPLATE_ALERT
} from './templateTypes';

const initialState = {
    loading: false,
    templateList: [],
    error: '',
    showTemplateAlert:  false,
    alertType: '',
}

const templateReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_TEMPLATE_ALERT:
        return {
          ...state,
          showTemplateAlert: action.payload,
          alertType:action.alertType,
        }
      case FETCH_TEMPLATE_REQUEST:
        return {
          ...state,
          loading: true
        }
      case FETCH_TEMPLATE_SUCCESS:
        return {
          ...state,
          loading: false,
          templateList: action.payload,
          error: ''
        }
      case FETCH_TEMPLATE_FAILURE:
        return {
          ...state,
          loading: false,
          templateList: [],
          error: action.payload
        }
      default: return state
    }
  }
  
  export default templateReducer;
  