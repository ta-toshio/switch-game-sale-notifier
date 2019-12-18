import { connect } from 'react-redux'
import ListPresentation from './../presentations/List'

const mapStateToProps = state => ({
  bookmarkIds: state.bookmark.bookmarkIds
})

export default connect(mapStateToProps)(ListPresentation)