//using to render the text AS the user writes it, with

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const TutorialDisplay = ({ title, content, author, category, images }) => {

  return (
    <div className="tutorial-display" >
      <br />
      <h2>{title}</h2>
      <h4>By {author.name}</h4>
      <div className="category badge text-bg-info">{category.name}</div>
      <br />
      <br />
      <br />

      <div>
        <PhotoProvider>
          <div className="foo">
            {images.map((image) => (
              <PhotoView key={image._id} src={image.link}>
                <img src={image.link} style={{ width: '135px', height: '135px', objectFit: 'cover', margin: '0 5px 5px 0', borderRadius: '10px' }}/>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </div>

      <div style={{ 'fontSize': '16px', whiteSpace: 'pre-wrap', marginTop: '25px' }} className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default TutorialDisplay;
