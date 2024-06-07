import '../../App.css';

import {
  katyImage,
  danielImage,
  tamerImage,
  rafaImage
} from './index'

const teamMembers = [
  {
    name: 'Daniel Araujo',
    role: 'Full Stack Developer',
    bio: 'Daniel is originally from Venezuela and has been living in the USA for the past three years. With a background in economics and a passion for technology, he transitioned into web development. Enrolled in Columbia\'s full stack web developer bootcamp, he is honing his skills in JavaScript, React, MySQL, and MongoDB. Daniel enjoys fitness and running, which keep him energized and clear-minded. His analytical rigor and tech prowess drive his contributions to Instructify, where he focuses on creating efficient and user-friendly web solutions. Daniel combines his knowledge of computer science with practical coding applications to enhance the platform\'s functionality.',
    image: danielImage,
    github: 'https://github.com/danielhe27',
  },
  {
    name: 'Tamer Bekir',
    role: 'Full Stack Developer',
    bio: 'Tamer is a web developer from Westchester, NY, who enjoys blending technology and creativity to build new web experiences. He is currently enrolled in Columbia University\'s full stack web development bootcamp, where he is developing skills in both front-end and back-end technologies, including React, Node.js, and MongoDB. Tamer\'s passion for crafting sleek user interfaces and robust systems drives his work on Instructify. He brings a unique perspective to the team, combining his knowledge of computer science with practical coding applications to enhance the platform\'s functionality and user experience.',
    image: tamerImage,
    github: 'https://github.com/Tamerbekir',
  },
  {
    name: 'Rafa Rizvi',
    role: 'Full Stack Developer',
    bio: 'Rafa transitioned from chemical engineering to web development, leveraging his analytical skills to master both front-end and back-end technologies. Currently enrolled in Columbia\'s full stack web developer bootcamp, he has honed his abilities in HTML, CSS, and JavaScript. Rafa is passionate about problem-solving and continuously improving his craft through collaborative projects. His engineering background equips him with valuable problem-solving abilities, analytical thinking, and attention to detail, which are crucial in web development. Rafa\'s dedication to learning and innovation fuels his contributions to Instructify.',
    image: rafaImage,
    github: 'https://github.com/rafarizvi',
  },
  {
    name: 'Katy Totah',
    role: 'Full Stack Developer',
    bio: 'Katy is originally from Seattle but moved to NYC to attend Columbia University, where she received her bachelor\'s degree in economics. Currently living in Brooklyn, she works full-time as a project manager for an event tech company. Although she always considered exploring coding during her undergraduate studies, she never got around to it. Now, as a student in Columbia\'s full stack web developer bootcamp, Katy is learning to build dynamic web applications using technologies such as React, Node.js, and MongoDB. Her lifelong love for learning drives her passion for developing Instructify, a platform dedicated to facilitating community-driven knowledge sharing.',
    image: katyImage,
    github: 'https://github.com/ktotah',
  },
];

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Instructify</h1>
      <p className="about-description">Welcome to Instructify! Our platform is dedicated to providing a community-driven space for sharing and discovering tutorials on a wide range of topics. Whether you're looking to learn a new skill, find instructional videos, or share your knowledge with others, Instructify is the place for you.</p>
      <p className="about-description">Our team consists of passionate developers and content creators who believe in the power of collaborative learning. We have built Instructify using the latest technologies to ensure a seamless and engaging user experience.</p>
      <p className="about-description">Our mission is to make learning accessible and enjoyable for everyone. We strive to create a platform where users can easily find quality tutorials, connect with others, and contribute their own knowledge.</p>
      
      <h2 className="team-title">Meet the Team</h2>
      <div className="team-container">
        {teamMembers.map(member => (
          <div key={member.name} className="team-member">
            <img src={member.image} alt={`${member.name}`} className="team-member-image"/>
            <h3 className="team-member-name">{member.name}</h3>
            <p className="team-member-role">{member.role}</p>
            <a href={member.github} className="team-member-github" target="_blank" rel="noopener noreferrer">GitHub Profile</a>
            <p className="team-member-bio">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
