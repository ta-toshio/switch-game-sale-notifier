import React from 'react'
import { 
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { AppLoading } from 'expo'
import { ThemeProvider } from 'react-native-elements'
import { Provider } from 'react-redux'
import store from './utils/createStore'
import NotificationHandler from './components/NotificationHandler'
import AppNavigator from './navigation/AppNavigator'
import { userRegister } from './domains/user.service'

export default class App extends React.Component {

  state = {
    isReady: false,
  }

  startAsync = async () => {
    return await userRegister()
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this.startAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      )
    }
    return (
      <ThemeProvider>
        <Provider store={store}>
          <View style={styles.container}>
            <NotificationHandler />
            <AppNavigator />
            {Platform.OS === 'ios' && <StatusBar barStyle="default" hidden={false} />}
          </View>
        </Provider>
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
