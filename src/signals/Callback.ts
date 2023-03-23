export class Callback {

    private fSuccess: Function;
    private fError: Function;

    public then(success: Function): Callback{
        if(!(success instanceof Function))
            throw new Error("Param must be function!");
        this.fSuccess = success;
        return this;
    }

    public error(error: Function): Callback{
        if(!(error instanceof Function))
            throw new Error("Param must be function!");
        this.fError = error;
        return this;
    }

    public execThen(): void{
        if(this.fSuccess instanceof Function)
            this.fSuccess();
    }
    public execError(): void{
        if(this.fError instanceof Function)
            this.fError();
    }

}