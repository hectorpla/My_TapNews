const expect = require('chai').expect;
const sinon  = require('sinon');
const check_auth =  require("../midleware/check_auth");

describe("Check auth middleware", () => {
  let req;
  let getStub;
  let res;
  let statusStub;
  let respond;

  before((() => {
    // mock based on the implementation of response express
    // or restore after each test
    req = {get: () => {}};
    res = { 
      status: () => {},
      json: () => {}
    };
    statusStub = sinon.stub(res, "status");
    respond = sinon.spy(res, "json");
    statusStub.returns(res);

  }))
   
  describe("Unauthorized tests", () => {


    before(() => {
      
    })

    beforeEach(() => {
      getStub = sinon.stub(req, "get");
    })

    afterEach(() => {
      getStub.restore();
    })

    it("should response status 401 when given undefined Authorization Info", () => {
      getStub.withArgs('Authorization').returns(undefined);

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
      // TODO: check content
    })

    it("should response status 401 when given without Bearer as the first field", () => {
      getStub.withArgs('Authorization').returns("someToken");

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
    })

    it("should response status 401 when given too many fields", () => {
      getStub.withArgs('Authorization').returns("Bearer someToken extra");

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
    })

    describe("Normal tests", () => {

    })
  })


})