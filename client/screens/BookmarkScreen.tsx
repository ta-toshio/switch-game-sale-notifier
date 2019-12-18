import React from 'react';
import store from '../utils/createStore'
import { fetchAll } from '../domains/bookmark.service'
import BookmarkList from '../modules/bookmarks/containers/List'
import { setBookmarks } from '../actions/bookmark.action'

export default function BookmarkScreen() {
  return <BookmarkList />
}

BookmarkScreen.getInitial = async () => {
  const games = await fetchAll()
  store.dispatch(setBookmarks(games))
}

BookmarkScreen.navigationOptions = {
  title: 'お気に入り',
}