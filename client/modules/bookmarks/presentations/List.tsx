import React from 'react'
import { StyleSheet, FlatList, View } from 'react-native';
import GameRow from './../../../components/list/GameRow'
import { useBookmark } from '../containers/useBookmark'

export default function BookmarkListScreen({
  bookmarks,
  bookmarkIds,
  fetchBookmark,
}) {

  const { loading } = useBookmark({ fetchBookmark })

  return (
    <View style={styles.container}>
      {bookmarks && (
        <FlatList
          style={styles.container}
          data={bookmarks}
          renderItem={props => <GameRow {...props} bookmarkIds={bookmarkIds} />}
          keyExtractor={({ id }) => id}
          onEndReachedThreshold={1}
          initialNumToRender={30}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
