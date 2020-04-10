const { setupDatabase, resetDatabase } = require('../setup/testDatabase');

const Handler = require('../setup/testHandler');
const mockRequest = require('../setup/mockRequest');
const mockResponse = require('../setup/mockResponse');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createHandler methods -> Handler.delete', () => {
  test('should return status code 204', async () => {
    const req = mockRequest({ params: { id: 5 } });
    const res = mockResponse();

    await Handler.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
  });

  test('should call the res.end', async () => {
    const req = mockRequest({ params: { id: 5 } });
    const res = mockResponse();

    await Handler.delete(req, res);

    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
