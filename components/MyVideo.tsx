import config from '@/lib/config';
import { Video, buildSrc } from '@imagekit/next';

interface Props {
  myalt: string;
  mysrc: string;
}

const MyVideo = ({ mysrc = '/video.mp4' }: Props) => {
  return (
    <Video
      urlEndpoint={config.env.imagekit.urlEndpoint}
      src={mysrc}
      width={500}
      height={500}
      controls
      preload="none"
      poster={buildSrc({
        urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
        src: `/video.mp4/ik-thumbnail.jpg`, // Append ik-thumbnail.jpg after the video URL
      })}
      transformation={[
        {
          overlay: {
            type: 'video',
            input: 'overlay.mp4',
            transformation: [
              { width: 100, height: 100 }, // Transformations for the overlay video and not the background video
            ],
          },
        },
        {
          overlay: {
            type: 'subtitle',
            input: 'subtitle.srt',
          },
        },
      ]}
    />
  );
};

export default MyVideo;
