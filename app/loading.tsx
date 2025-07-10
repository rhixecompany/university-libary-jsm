import Image from 'next/image';

const LoadingPage = () => {
  return (


    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <Image
            unoptimized
            src='/images/loader.gif'
            height={150}
            width={150}
            alt="Loading..."
            priority={true}
          />
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
