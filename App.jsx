/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import LokSetuLogin from './src/LokSetuLogin';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <LokSetuLogin />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
