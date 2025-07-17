'use client'; // This component must be a client component
import config from '@/lib/config';
import { Image, ImageKitProvider, buildSrc } from '@imagekit/next';
import { useState } from 'react';
interface Props {
  myalt: string;
  mysrc: string;
}

const MyImage = ({ myalt = 'Picture of the author', mysrc = 'https://placehold.co/400x600.png' }: Props) => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  return (
    <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
      <Image
        src={mysrc}
        width={500}
        height={500}
        alt={myalt}
        transformation={[
          {
            overlay: {
              type: 'text',
              text: 'Hello, ImageKit!',
              transformation: [
                { fontSize: 20, fontColor: 'FF0000' }, // Specify font size and color of the text
              ],
            },
          },
          { quality: 80 },
          { width: 500, height: 500 },
          // { format: "webp" },
          // { background: "#000000" }, // Background color for the image
          // { border: "10px solid #ffffff" }, // Border around the image
          { rotation: 90 },
        ]}
        loading="eager" // Use "eager" to load immediately. `lazy` is the default value
        style={
          showPlaceholder
            ? {
                backgroundImage: `url(${buildSrc({
                  urlEndpoint: 'https://ik.imagekit.io/ikmedia',
                  src: '/default-image.jpg',
                  transformation: [
                    // {}, // Any other transformation you want to apply
                    {
                      quality: 10,
                      blur: 90,
                    },
                  ],
                })})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }
            : {}
        }
        onLoad={() => {
          setShowPlaceholder(false);
        }}
      />
    </ImageKitProvider>
  );
};

export default MyImage;
