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
            Certificates: like([]),
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
            Certificates: expect.any(Array),
          }),
        ])
      );
    });
  });

  describe('POST /api/Family', () => {
    it('should create a new family and return it with members and certificates', async () => {
      const requestBody = {
        Id: 0,
        Name: 'Familie Testers',
        Address: 'Teststraat 123',
        Members: [
          {
            Id: 0,
            Name: 'Test Persoon',
            DateOfBirth: '2000-01-01T00:00:00Z',
            FamilyId: 0,
          },
        ],
        Certificates: [
          {
            Id: 0,
            Title: 'Test Certificaat',
            IssueDate: '2025-05-28T13:09:30.169Z',
            ExpiryDate: '2026-05-28T13:09:30.169Z',
            FamilyId: 0,
          },
        ],
      };

      const expectedResponse = like({
        Id: like(1),
        Name: like('Familie Testers'),
        Address: like('Teststraat 123'),
        Members: eachLike({
          Id: like(1),
          Name: like('Test Persoon'),
          DateOfBirth: like('2000-01-01T00:00:00Z'),
          FamilyId: like(1),
        }),
        Certificates: eachLike({
          Id: like(1),
          Title: like('Test Certificaat'),
          IssueDate: like('2025-05-28T13:09:30.169Z'),
          ExpiryDate: like('2026-05-28T13:09:30.169Z'),
          FamilyId: like(1),
        }),
      });

      await provider.addInteraction({
        state: 'ready to create a new family',
        uponReceiving: 'a POST request to create a family',
        withRequest: {
          method: 'POST',
          path: '/api/Family',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: expectedResponse,
        },
      });

      const response = await axios.post('http://127.0.0.1:12345/api/Family', requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toEqual(201);
      expect(response.data).toEqual(
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
        })
      );
    });
    describe('PUT /api/Family/{id}', () => {
      it('should update a family and return the updated family with members and certificates', async () => {
        const familyId = 1;
        const requestBody = {
          Id: familyId,
          Name: 'Familie Janssens Updated',
          Address: 'Nieuwe Straat 5',
          Members: [
            {
              Id: 1,
              Name: 'Jan Janssens',
              DateOfBirth: '1980-05-15T00:00:00Z',
              FamilyId: familyId,
            },
            {
              Id: 2,
              Name: 'Marie Janssens',
              DateOfBirth: '1985-08-20T00:00:00Z',
              FamilyId: familyId,
            },
          ],
          Certificates: [
            {
              Id: 1,
              Title: 'Voedselattest Updated',
              IssueDate: '2024-05-28T12:17:01.312Z',
              ExpiryDate: '2026-05-28T12:17:01.312Z',
              FamilyId: familyId,
            },
          ],
        };

        await provider.addInteraction({
          state: 'family with id 1 exists and can be updated',
          uponReceiving: 'a PUT request to update a family',
          withRequest: {
            method: 'PUT',
            path: `/api/Family/${familyId}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          },
          willRespondWith: {
            status: 204,
          },
        });

        const response = await axios.put(`http://127.0.0.1:12345/api/Family/${familyId}`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(response.status).toEqual(204);
      });
    });
  });
});