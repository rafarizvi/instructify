  //adding a wordcount to the creating a tutorial

  // using split method to split string and to only count each string instead of each characters
  const WordCount = ({ content }) => {
  const charCount = content.split(" ").length

  if (charCount < 2000 ) {
    return (
    <div className="text-center" style={{ fontSize: '15px', color: 'green'}} >
    {charCount}/2000
  </div>
    )
  } else {
    return (
    <div className="text-center" style={{ fontSize: '15px', color: 'red'}} >
    {charCount}/2000
    </div>

    )
  }
};

export default WordCount;