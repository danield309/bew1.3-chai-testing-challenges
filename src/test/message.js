require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa'

describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id:SAMPLE_OBJECT_ID
        })
        const sampleMessage = new Message({
            title:'Test Title',
            body:'Test Body',
            author:sampleUser._id,
            _id:SAMPLE_OBJECT_ID_2,
        })
        sampleUser.save().then(
            sampleMessage.save()
        ).then(
            done()
        ).catch(err => {
            console.log(err)})
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        User.deleteMany({ username: ['myuser'] }).then(() => {
            Message.deleteMany({ title: "Test Title" })
            .then(() => {
                done()
            })
        })
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err,res)=>{
            if(err) {done(err)}
            expect(res).to.have.status(200)
            expect(res.body.message).to.be.an("array")
            done()
        })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res)=>{
            if(err) {done(err)}
            expect(res).to.have.status(200)
            expect(res.body).to.be.an("object")
            expect(res.body.message.title).to.equal('Sample Title')
            expect(res.body.message.body).to.equal('Testing Testing Testing')
            done()
        })
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({
            title:'Another Title',
            body: 'Another Body',
            author: SAMPLE_OBJECT_ID,
        }).end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('title', 'Another Title')
            expect(res.body).to.have.property('body', 'Another Body')
            done()
        })
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .put(`/messages/${SAMPLE_OBJECT_ID}`)
        .send({body:'UpdatemyBody'})
        .end((err, res)=>{
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('title', 'Title Updated')
            done()
        })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .delete(`/messages/${SAMPLE_OBJECT_ID}`)
        .end((err, res)=> {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('Message Deleted')
            done()
        })
    })
})
