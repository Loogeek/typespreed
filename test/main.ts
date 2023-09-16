import { app, autoware, log } from "../src/speed";
import ServerFactory from "../src/factory/server-factory.class";

@app
class Main {
    @autoware
    server: ServerFactory

    public main() {
        this.server.start(8000)
        log('start application');
    }
}
