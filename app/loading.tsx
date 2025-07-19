import loader from '@/assets/loader.gif'
import Image from 'next/image'

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Image
        unoptimized
        src={loader}
        height={150}
        width={150}
        alt="Loading..."
      />
    </div>
  )
}

export default LoadingPage
