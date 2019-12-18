import { connect } from 'react-redux'
import ListPresentation from './../presentations/List'
import { fetchAll as fetchBookmark } from '../../../domains/bookmark.service'

const mapStateToProps = state => ({
  bookmarks: state.bookmark.bookmarks,
  bookmarkIds: state.bookmark.bookmarkIds,
})

const mapDispatchToProps = dispatch => ({
  fetchBookmark: async () => {
    return await fetchBookmark()
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListPresentation)