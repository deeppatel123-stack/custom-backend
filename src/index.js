import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
})

connectDB()




// const app = express()

// ;( async () => {
//     try {
//         DB = await mongoose.connect(`${process.env.DB_URL}/${db_name}`)
//         app.on("error", (error) => {
//             console.log("ERROR : ",error);
//             throw error  
//         })

//         app.listen(process.env.PORT, () => {
//             console.log("App is listening on PORT ", process.env,PORT);
            
//         })
//     } catch (error) {
//         console.error("ERROR :",error)
//         throw error
//     }
// })()