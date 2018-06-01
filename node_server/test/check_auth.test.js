const expect = require('chai').expect;
const sinon  = require('sinon');
const check_auth =  require("../midleware/check_auth");

describe("Check auth middleware", () => {
  let req;
  let res;
  let statusStub;
  let respond;
  let getStub;

  before(() => {
    // mock based on the implementation of response express
    // or restore after each test
    req = {get: () => {}};
    res = { 
      status: () => {},
      json: () => {}
    };
    getAuthStub = sinon.stub(req, "get").withArgs('Authorization');
  })

  beforeEach(() => {
    statusStub = sinon.stub(res, "status");
    respond = sinon.spy(res, "json");
    statusStub.returns(res);
  })

  afterEach(() => {
    statusStub.restore();
    respond.restore();
  })
  
  describe("Unauthorized tests", () => {

    it("should response status 401 when given undefined Authorization Info", () => {
      getAuthStub.returns(undefined);

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
      // TODO: check content
    })

    it("should response status 401 when given without Bearer as the first field", () => {
      getAuthStub.returns("someToken");

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
      // console.log(respond.getCalls());
    })

    it("should response status 401 when given too many fields", () => {
      getAuthStub.returns("Bearer someToken extra");

      check_auth(req, res);

      expect(statusStub.withArgs(401).calledOnce).to.be.true;
      expect(respond.calledOnce).to.be.true;
    })

    describe("Normal tests", () => {

      it("should response status 401 when given by random token", () => {
        getAuthStub.returns("Bearer random")

        check_auth(req, res);

        expect(statusStub.withArgs(401).calledOnce).to.be.true;
        expect(respond.calledOnce).to.be.true;
      })
    })
  })
  
})