import { type Session } from 'next-auth';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
interface Props {
  session: Session | null;
}

const Header = ({ session }: Props) => {
  return (
    <header className="admin-header">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400">{session?.user?.name}</h2>
        <p className="text-base text-slate-500">Monitor all of your users and books here</p>
      </div>

      <div className='admin-search'>

        <Image src="/icons/search-fill.svg" alt="calendar" width={18} height={18} />
        <Input type="text" className='admin-search_input' placeholder='Search users, books  by title,author,genre.' />
      </div>
    </header>
  );
};
export default Header;
