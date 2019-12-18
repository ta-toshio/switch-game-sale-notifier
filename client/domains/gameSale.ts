import firebase, { firestore } from '../config/firebase'
import moment from 'moment'

export const toGameSale = data => ({
  id: data.uuid,
  game_id: data.id,
  title: data.title,
  // desc: data.text,
  sale_start_date: data.ssdate,
  sale_end_date: data.sedate,
  rate: data.drate[0],
  list_price: data.price,
  sale_price: data.sprice,
  maker: data.maker,
  dsdate: data.dsdate,
  thumbnail: data.iurl,
})

export const getGameSale = async () => {
  const snapshot = await firestore
    .collection("gameSales")
    .where('sedate', '>',  firebase.firestore.Timestamp.now())
    .orderBy('sedate', 'asc')
    .get();
  
  const sales = []
  const sectionSales = {}

  snapshot.forEach(function(doc) {
    const saleData = toGameSale(doc.data())

    sales.push(saleData)

    const date = moment.unix(saleData.sale_end_date.seconds)
    const ymd = date.format('YYYY-MM-DD')

    if (!sectionSales[ymd]) {
      sectionSales[ymd] = {
        id: ymd,
        title: ymd,
        date: date,
        data: [ saleData ],
      }
    } else {
      sectionSales[ymd].data.push(saleData)
    }
  });

  const arrSectionSales = []
  for (const key in sectionSales) {
    arrSectionSales.push(sectionSales[key])
  }

  return arrSectionSales
}