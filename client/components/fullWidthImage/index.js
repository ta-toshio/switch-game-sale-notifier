import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Image } from 'react-native-elements'

export default class FullWidthImage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      width: props.width || null,
      height: props.height || null
    }
  }

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  _onLayout(event) {
    const containerWidth = event.nativeEvent.layout.width

    if (this.props.ratio) {
      this.setState({
        width: containerWidth,
        height: containerWidth * this.props.ratio
      })
    } else if (this.props.width && this.props.height) {
      this.setState({
        width: containerWidth,
        height: containerWidth * (this.props.height / this.props.width)
      })
    } else if (this.props.source) {
      let source = this.props.source
      if (typeof source !== 'string') {
        source = this.props.source.uri
      }
      Image.getSize(source, (width, height) => {
        this.setState({
          width: containerWidth,
          height: (containerWidth * height) / width
        })
      })
    }
  }

  render() {
    return (
      <View
        ref={component => (this._root = component)}
        onLayout={this._onLayout.bind(this)}
        style={styles.container}
      >
        <Image
          source={this.props.source}
          style={[
            this.props.style,
            {
              width: this.state.width,
              height: this.state.height
            }
          ]}
          onLoad={this.props.onLoad}
          onLoadEnd={this.props.onLoadEnd}
          onLoadStart={this.props.onLoadStart}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch'
  }
})