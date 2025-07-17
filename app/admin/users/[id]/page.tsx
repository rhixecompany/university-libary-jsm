import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/users">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <form action="">
          <div className="">
            <div>
              <label htmlFor="Email">Email</label>
              <input type="email" name="email" id="email" />
            </div>
          </div>
          <div className="">
            <button>Submit</button>
          </div>

        </form>
      </section>
    </>
  );
};
export default Page;
