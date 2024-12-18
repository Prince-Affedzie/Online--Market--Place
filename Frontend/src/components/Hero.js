import React, {useState} from 'react';
import { Button } from '@mui/material';
import image1 from '../assets/clothing store banner.jpg'
import image2 from '../assets/Opening-A-Fashion-Boutique.png'
import image3 from '../assets/beauty banner.jpg'
const images = [image1, image2, image3];
const Hero = () => {

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  setTimeout(nextImage, 5000);
  return (
    <section className="hero">
      <img src={images[currentImage]} alt="Hero" />
      <h1>Welcome to Prinztech Market</h1>
      <p>Your go-to marketplace for everything you need.</p>
      {/*<button className="cta-button" onClick={() => window.location.href = "/sell"}>Start Selling</button>*/}
      <Button  className='cta-button' variant="contained" color="primary" onClick={() => window.location.href = "/sell"} 
         style={{ marginLeft: '20px' }}>
         Start Selling
      </Button>
      <Button className='cta-button' variant="contained" color="primary"   style={{ marginLeft: '20px' }} > 
         Browse Products
      </Button>
    </section>
  );
};

export default Hero;
