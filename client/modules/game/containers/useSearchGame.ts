import React, { useEffect, useState, useMemo } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import useConstant from '../../../utils/useConstant'
import {
  fetchGame,
  searchGame,
} from '../../../domains/game'

export const useSearchGame = () => {

  const [ games, setGames ] = useState([])
  const [ page, setPage ] = useState(1)
  const [ lastGame, setLastGame ] = useState(null)
  const [ searchText, setSearchText ] = useState('')
  const [ hasMore, setHasMore ] = useState(true)
  const [ loading, setLoading ] = useState(false)

  const searchDebounce = useConstant(() => AwesomeDebouncePromise(
    async (searchText, lastGame) => {
      return searchText
        ? searchGame(searchText)
        : fetchGame({ lastGame })
    },
    500
  ))

  useEffect(() => {
    const afterFetch = async (_games) => {
      // const _games = await fetchGame({ lastGame })
      if (_games && _games.length) {
        lastGame
          ? setGames([...games, ..._games])
          : setGames(_games)

        const _lastGame = _games[_games.length - 1]
        setLastGame(_lastGame)

        // confirm hasMore
        const __games = await fetchGame({ lastGame: _lastGame })
        __games && __games.length
          ? setHasMore(true)
          : setHasMore(false)

      } else {
        setLastGame(null)
        setHasMore(false)
      }
    }

    const afterSearch = (_games) => {
      setGames(_games)
    }

    const search = async () => {
      setLoading(true)
      if (searchText) {
        setPage(1)
        setLastGame(null)
        setHasMore(false)
      }

      const _games = await searchDebounce(searchText, lastGame)
      searchText ? afterSearch(_games) : afterFetch(_games)
      setLoading(false)
    }

    search()

  }, [ page, searchText ])

  return {
    games,
    setGames,
    page,
    setPage,
    searchText,
    setSearchText,
    hasMore,
    loading,
  }
}
