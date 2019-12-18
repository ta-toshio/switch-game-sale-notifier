import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import {
  Text,
  Button,
} from 'react-native-elements'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import ImageFullWidth from '../fullWidthImage'
import { addBookmark, deleteBookmark, setBookmarks } from '../../actions/bookmark.action'
import { register, release } from '../../domains/bookmark.service'
import { getUserId } from '../../domains/user'

const mapDispatchToProps = dispatch => ({
  bookmarking: async game => {
    const gameId = game.game_id
    const userId = await getUserId()
    register({ userId, gameId })
    dispatch(addBookmark(game))
  },
  unbookmarking: async game => {
    const gameId = game.game_id
    const userId = await getUserId()
    release({ userId, gameId })
    dispatch(deleteBookmark(gameId))
  }
})

const toThumbnailUrl = url => 
  'https://img-eshop.cdn.nintendo.net/i/' + url + '.jpg?w=402&h=226'

const GameRow = ({
  item,
  bookmarking,
  unbookmarking,
  bookmarkIds,
}) => {

  const bookmarked = bookmarkIds && bookmarkIds[item.game_id] ? true : false
  const [ bookmark, setBookmark ] = useState(bookmarked)

  useEffect(() => {
    const bookmarked = bookmarkIds && bookmarkIds[item.game_id] ? true : false
    setBookmark(bookmarked)
  }, [ bookmarkIds ])

  return (
    <View style={styles.item}>
      <ImageFullWidth
        source={{ uri: toThumbnailUrl(item.thumbnail) }}
        resizeMode='cover'
        ratio={1/2}
      />
      <Text style={styles.maker}>{item.maker}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.footer}>
        <View style={styles.priceItem}>
          {item.sale_price &&
            <Text style={styles.priceItemLabel}>{Math.floor(item.rate)}%</Text>
          }
          <View style={styles.priceWrap}>
            {item.sale_price && (
              <>
                <Text style={styles.priceBefore}>{item.list_price.toLocaleString()}円</Text>
                <Ionicons
                  name={Platform.OS === 'ios'
                    ? 'ios-arrow-round-forward'
                    : 'md-arrow-forward'}
                  size={18}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.priceAfter}>{item.sale_price.toLocaleString()}円</Text>
              </>
            )}
            {!item.sale_price &&
              <Text style={styles.price}>{item.list_price.toLocaleString()}円</Text>
            }
          </View>
        </View>
        <View style={styles.actions}>
          <Button
            type='clear'
            icon={
              <MaterialIcons
                name={bookmark === true ? 'bookmark' : 'bookmark-border'}
                size={36}
                onPress={e => {
                  setBookmark(!bookmark)
                  bookmark
                    ? unbookmarking(item)
                    : bookmarking(item);
                }}
              />
            }
          />
        </View>
      </View>
    </View>
  )
}

export default connect(null, mapDispatchToProps)(GameRow)

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingRight: 5,
    paddingLeft: 5,
    marginBottom: 5,
  },
  maker: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  priceItem: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  priceItemLabel: {
    marginRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#fc8e26',
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 16,
  },
  priceWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceBefore: {
    marginRight: 5,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  priceAfter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e60012'
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  actions: {
    flex: 1,
    width: "100%",
    alignItems: "flex-end",
  }
})