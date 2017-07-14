import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);

export default function getMockStore(mockInitialState) {
  const initialState = {};
  const store = mockStore(mockInitialState || initialState);
  return store;
}
