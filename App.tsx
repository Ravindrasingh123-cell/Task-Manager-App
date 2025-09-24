import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';

import {store, persistor} from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/utils/theme';
import {setNetworkStatus} from './src/store/slices/networkSlice';

const App: React.FC = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      store.dispatch(setNetworkStatus(state.isConnected));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <StatusBar
              barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
              backgroundColor={theme.colors.primary}
            />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
