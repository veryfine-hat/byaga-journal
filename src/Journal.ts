import {logParamsToData} from "./log-params-to-data";
import { Span } from "./Span";
import {ConfigurationOptions} from './ConfigurationOptions'

export class Journal extends Span {
  write(data: Object): void {console.log(data)}

  configure(options: ConfigurationOptions ) {
    this.write = options.write || this.write;
  }

  log(...args: any[]): void {
    this.write({
      ...this.context,
      ...logParamsToData(args)
    });
  }

  end(...args: any[]): void {
    throw new Error("Method not implemented on root.");
  }
}
export default Journal;