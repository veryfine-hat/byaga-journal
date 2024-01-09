import { Journal } from './Journal';
import * as Context from './context';

const journal = new Journal();
Context.configure({logger: journal})

export { Context, journal }
export default Context;