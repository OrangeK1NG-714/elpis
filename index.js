const Koa = require('koa')

const app = new Koa();
try {
    const port = process.env.PORT || 8080;
    const host = process.env.IP || '0.0.0.0';
    app.listen(port, host);
    console.log(`server is running at http://${host}:${port}`);
} catch (error) {
    console.log(error);

}

