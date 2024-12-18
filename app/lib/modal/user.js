import {Schema,model,models} from 'mongoose'

const userScehma= new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true}
)

const User=models.User|| model('User',userScehma)

export default User