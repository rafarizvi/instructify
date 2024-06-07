// Adding format for date and passing it through as a prop to be used with dashboard, view tutorial and comments

import {
  PropTypes
} from './index'

const DateFormatComment = ({ createdAt }) => {
  return (
    <small>{new Date(parseInt(createdAt)).toLocaleString('en-US', 
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>

  )
}

DateFormatComment.propTypes = {
  createdAt: PropTypes.string.isRequired
}


export default DateFormatComment