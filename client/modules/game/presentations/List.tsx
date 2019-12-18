import React from 'react'
import {
  StyleSheet,
  FlatList,
  View,
} from 'react-native';
import { SearchBar } from 'react-native-elements'
import { useSearchGame } from '../containers/useSearchGame'
import GameRow from './../../../components/list/GameRow'

export default function GameListScreen({ bookmarkIds }) {

  const {
    games,
    page,
    setPage,
    searchText,
    setSearchText,
    hasMore,
    loading,
  } = useSearchGame()

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={{
          backgroundColor: '#fff',
          borderBottomColor: 'transparent',
          borderTopColor: 'transparent',
        }}
        inputContainerStyle={{
          backgroundColor: '#fff',
        }}
        inputStyle={{
          borderColor: '#fff',
          borderWidth: 0,
        }}
        cancelIcon
        showCancel
        showLoading={loading}
        placeholder="Type Here..."
        onChangeText={(search) => {
          setSearchText(search)
        }}
        value={searchText}
      />
      {games && (
        <FlatList
          style={styles.container}
          data={games}
          renderItem={props => <GameRow {...props} bookmarkIds={bookmarkIds} />}
          keyExtractor={({ id }) => id}
          onEndReached={() => {
            hasMore && setPage(page + 1)
          }}
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
