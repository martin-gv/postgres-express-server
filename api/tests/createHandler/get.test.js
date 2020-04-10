const { setupDatabase, resetDatabase } = require('../setup/testDatabase');

const Handler = require('../setup/testHandler');
const mockRequest = require('../setup/mockRequest');
const mockResponse = require('../setup/mockResponse');
const expectedResults = require('./getExpected');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createHandler methods -> Handler.get', () => {
  test('should return status code 200 and the 10 most recent records, by default', async () => {
    const req = mockRequest();
    const res = mockResponse();

    await Handler.get(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResults);
  });

  test('should return status code 200 and a specific record when req.params.id exists', async () => {
    const req = mockRequest({ params: { id: 2 } });
    const res = mockResponse();

    await Handler.get(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        first_name: 'Grayce',
        id: 2,
        job_title: 'Human Accounts Technician',
        last_name: 'Tillman',
        tsv: "'account':2 'human':1 'technician':3",
      },
    ]);
  });

  const exampleLocals = {
    documents: [
      {
        first_name: 'Marjolaine',
        id: 5,
        job_title: 'Dynamic Mobility Orchestrator',
        last_name: 'Sporer',
        tsv: "'dynam':1 'mobil':2 'orchestr':3",
      },
    ],
  };

  test('should return status code 200 and the record saved in locals when res.locals.documents exists', async () => {
    const req = mockRequest();
    const res = mockResponse({ locals: exampleLocals });

    await Handler.get(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(exampleLocals.documents);
  });

  test('res.locals.documents should override req.params.id', async () => {
    const req = mockRequest({ params: { id: 2 } });
    const res = mockResponse({ locals: exampleLocals });

    await Handler.get(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(exampleLocals.documents);
  });
});
