import * as express from 'express'
import ServerFactory from "../factory/server-factory.class";
import { bean, log } from '../speed';
import {setRouter} from '../router-mapping.decorator'

export default class ExpressServer extends ServerFactory {
    @bean
    public getServer(): ServerFactory {
        return new ExpressServer()
    }

    public setMiddleware(middleware: any) {
        this.middlewares.push(middleware)
    }

    public start(port: number) {
        const app: express.Application = express()
        this.middlewares.forEach(m => app.use(m))
        setRouter(app)
        app.listen(port, () => {
            log('server is running at port: ' + port)
        })
    }
}