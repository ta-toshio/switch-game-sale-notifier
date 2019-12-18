import { useEffect, useState } from 'react'
import { getGameSale } from './../../../domains/gameSale'

const useSaleItems = () => {

  const [ saleItems, setSaleItems ] = useState(null)

  useEffect(() => {
    const fetchGameSale = async() => {
      const arrSectionSales = await getGameSale()
      setSaleItems(arrSectionSales)
    }

    fetchGameSale()
    
  }, [])

  return {
    saleItems,
  }
}

export default useSaleItems