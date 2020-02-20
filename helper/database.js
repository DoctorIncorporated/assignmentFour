if(process.env.NODE_ENV === "production"){
    module.exports ={
        //connection to cloud mongodb server 
        mongoURI:"mongodb+srv://HapShapIncorporated:nitsujSHAPPY2298%40%40%28%2A@web-api-for-games-f34dp.mongodb.net/test?retryWrites=true&w=majority"
    }
}
else{
    module.exports ={
        mongoURI:"mongodb://localhost:27017/gamelibrary"
    }
}