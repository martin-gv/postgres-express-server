const { setupDatabase, resetDatabase } = require('../setup/testDatabase');

const Handler = require('../setup/testHandler');
const mockRequest = require('../setup/mockRequest');
const mockResponse = require('../setup/mockResponse');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

const sampleData = {
  first_name: 'foo',
};

describe('createHandler methods -> Handler.put', () => {
  test('should return status code 200', async () => {
    const req = mockRequest({ params: { id: 5 }, body: sampleData });
    const res = mockResponse();

    await Handler.put(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should return the updated record', async () => {
    const sampleReturnData = [
      {
        id: 5,
        first_name: 'foo',
        last_name: 'Sporer',
        job_title: 'Dynamic Mobility Orchestrator',
        tsv: "'dynam':1 'mobil':2 'orchestr':3",
      },
    ];

    const req = mockRequest({ params: { id: 5 }, body: sampleData });
    const res = mockResponse();

    await Handler.put(req, res);

    expect(res.json).toHaveBeenCalledWith(sampleReturnData);
  });
});
