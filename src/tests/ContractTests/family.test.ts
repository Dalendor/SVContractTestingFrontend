const { Pact, Matchers } = require('@pact-foundation/pact');
const { like, eachLike } = Matchers;
const axios = require('axios');

describe('Family API Pact Tests', () => {
  const provider = new Pact({
    consumer: 'ReactFrontend',
    provider: 'DotNetBackend',
    port: 12345,
    host: '127.0.0.1',
    log: '../../pacts/logs/pact.log',
    dir: '../../pacts',
    logLevel: 'INFO',
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /api/Family', () => {
    it('should return a list of families with members and certificates', async () => {
      const expectedResponse = {
        items: like([
          {
            Id: like(1),
            Name: like('Familie Janssens'),
            Address: like('Kerkstraat 1'),
            Members: like([
              {
                Id: like(1),
                Name: like('Jan Janssens'),
                DateOfBirth: like('1980-05-15T00:00:00'),
                FamilyId: like(1),
              },
            ]),
            Certificates: like([
              {
                Id: like(1),
                Title: like('Voedselattest'),
                IssueDate: like('2024-05-28T12:17:01.312Z'),
                ExpiryDate: like('2026-05-28T12:17:01.312Z'),
                FamilyId: like(1),
              },
            ]),
          },
        ]),
      };

      await provider.addInteraction({
        state: 'families with members and certificates exist',
        uponReceiving: 'a request to get all families',
        withRequest: {
          method: 'GET',
          path: '/api/Family',
          headers: { 'Accept': '*/*' },
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: expectedResponse,
        },
      });

      const response = await axios.get('http://127.0.0.1:12345/api/Family', {
        headers: { 'Accept': '*/*' },
      });

      expect(response.status).toEqual(200);
      expect(response.data.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Id: expect.any(Number),
            Name: expect.any(String),
            Address: expect.any(String),
            Members: expect.arrayContaining([
              expect.objectContaining({
                Id: expect.any(Number),
                Name: expect.any(String),
                DateOfBirth: expect.any(String),
                FamilyId: expect.any(Number),
              }),
            ]),
            Certificates: expect.arrayContaining([
              expect.objectContaining({
                Id: expect.any(Number),
                Title: expect.any(String),
                IssueDate: expect.any(String),
                ExpiryDate: expect.any(String),
                FamilyId: expect.any(Number),
              }),
            ]),
          }),
        ])
      );
    });

    it('should return 200 with families that may have empty certificates', async () => {
      const expectedResponse = {
        items: like([
          {
            Id: like(3),
            Name: like('Test'),
            Address: like('Adress 1'),
            Members: like([
              {
                Id: like(6),
                Name: like('Jean-Claude'),
                DateOfBirth: like('2025-05-08T00:00:00'),
                FamilyId: like(3),
              },
            ]),
            Certificates: like([]), // explicitly empty array
          },
        ]),
      };

      await provider.addInteraction({
        state: 'families with members but no certificates exist',
        uponReceiving: 'a request to get all families with empty certificates',
        withRequest: {
          method: 'GET',
          path: '/api/Family',
          headers: { 'Accept': '*/*' },
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: expectedResponse,
        },
      });

      const response = await axios.get('http://127.0.0.1:12345/api/Family', {
        headers: { 'Accept': '*/*' },
      });

      expect(response.status).toEqual(200);
      expect(response.data.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Id: expect.any(Number),
            Name: expect.any(String),
            Address: expect.any(String),
            Members: expect.arrayContaining([
              expect.objectContaining({
                Id: expect.any(Number),
                Name: expect.any(String),
                DateOfBirth: expect.any(String),
                FamilyId: expect.any(Number),
              }),
            ]),
            Certificates: expect.any(Array), // may be empty
          }),
        ])
      );
    });
  });
});
