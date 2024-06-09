  import { 
    PropTypes 
  } from './index'

  import './assets/wordCount.css'
  
  //adding a wordcount to the creating a tutorial
  // using split method to split string and to only count each string instead of each characters
  const WordCount = ({ content }) => {
  const charCount = content.split(" ").length

  if (charCount < 2000 ) {
    return (
    <div className="text-center charCount" 
      style={
        { fontSize: '15px', color: 'green' }
        } >
    {charCount}/2000
  </div>
    )
  } else {
    return (
    <div className="text-center charCountOver" 
      style={
        { fontSize: '15px', color: 'red' }
        } >
    {charCount}/2000
    </div>
    )
  }
};

WordCount.propTypes = {
  content: PropTypes.string.isRequired,
}

export default WordCount;