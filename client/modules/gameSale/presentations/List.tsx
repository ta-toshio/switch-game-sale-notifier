import React from 'react'
import {
  StyleSheet,
  View,
  SectionList,
} from 'react-native'
import { ListItem } from 'react-native-elements'
import GameRow from './../../../components/list/GameRow'
import useSaleItems from '../containers/useSaleItems'

const renderSectionHeader = ({ section }) => (
  <ListItem
    titleStyle={styles.headerTitle}
    title={section.title}
  />
)

export default function List({ bookmarkIds }) {

  const { saleItems } = useSaleItems()

  return (
    <View style={styles.container}>
      {saleItems && (
        <SectionList
          style={styles.container}
          sections={saleItems}
          keyExtractor={({ id }) => id}
          renderItem={props => <GameRow {...props} bookmarkIds={bookmarkIds} />}
          renderSectionHeader={renderSectionHeader}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
})
