import { useState, useEffect } from 'react'

export const useBookmark = ({ fetchBookmark }) => {

  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    const fetch = async() => {
      setLoading(true)
      await fetchBookmark()
      setLoading(false)
    }

    fetch()
  }, [])

  return {
    loading,
    setLoading,
    fetch,
  }
}