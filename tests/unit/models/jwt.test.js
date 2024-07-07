const {User} = require("../../../models/user")
const jwt = require("jsonwebtoken");
const config = require('config');
const mongoose = require("mongoose")

describe("generateAuthToken",()=>{
    it("should return signed jwt token",()=>{
        const payload = {_id:new mongoose.Types.ObjectId().toHexString(),isAdmin:true,}
        const user = new User(payload)
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token,config.get("vidly_jwtPrivateKey"))
        expect(decoded).toMatchObject(payload)
    })

})