import {Get} from '../src/router-mapping.decorator'
import {log} from '../src/speed'

export default class FirstPage {
    @Get('/first')
    public index(req: any, res: any) {
        log('first page is running!')
        res.send('first page is running')
    }
}