import {Controller, Get, Route, Security, Tags} from "tsoa";

@Tags('Example')
@Route('/example')
export class ExampleController extends Controller {

    @Get('/public')
    public async getPublicData(): Promise<string> {
        return "This is public data.";
    }

    @Get('/private')
    @Security('BearerAuth')
    public async getPrivateData(): Promise<string> {
        return "This is private data, accessible only with valid credentials.";
    }
}