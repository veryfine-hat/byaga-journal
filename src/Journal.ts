import {LogParameters, logParamsToData} from "./log-params-to-data";
import { Span } from "./Span";
import {ConfigurationOptions} from './ConfigurationOptions'
import {StructuredLog} from "./StructuredLog";

export class Journal extends Span {
  write(data: StructuredLog): void {console.log(data)}

  configure(options: ConfigurationOptions ) {
    this.write = options.write || this.write;
  }

  log(...args: LogParameters): void {
    this.write({
      ...this.context,
      ...logParamsToData(args)
    });
  }

  end(): void {
    throw new Error("Method not implemented on root.");
  }
}
export default Journal;