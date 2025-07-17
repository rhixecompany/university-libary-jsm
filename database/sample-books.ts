import data from './dummybooks';
import { Convert } from './utils';

const books = Convert.bookToJson(data);
console.log('Books:', books);
