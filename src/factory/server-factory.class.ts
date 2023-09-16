export default abstract class ServerFactory {
    protected middlewares:any[] = []
    public abstract setMiddleware(middleware: any)
    public abstract start(port: number)
}