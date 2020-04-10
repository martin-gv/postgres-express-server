const { setupDatabase, resetDatabase } = require('../setup/testDatabase');

const Handler = require('../setup/testHandler');
const mockRequest = require('../setup/mockRequest');
const mockResponse = require('../setup/mockResponse');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

const sampleData = {
  first_name: 'foo',
  last_name: 'bar',
  job_title: 'ceo',
};

describe('createHandler methods -> Handler.post', () => {
  test('should return status code 201', async () => {
    const req = mockRequest({ body: sampleData });
    const res = mockResponse();

    await Handler.post(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('should return the newly created record', async () => {
    const sampleReturnData = [
      {
        id: 11,
        first_name: 'foo',
        last_name: 'bar',
        job_title: 'ceo',
        tsv: "'ceo':1",
      },
    ];

    const req = mockRequest({ body: sampleData });
    const res = mockResponse();

    await Handler.post(req, res);

    expect(res.json).toHaveBeenCalledWith(sampleReturnData);
  });
});
