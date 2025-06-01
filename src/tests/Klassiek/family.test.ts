import axios, { AxiosResponse, AxiosError } from 'axios';
import https from 'https';

const API_BASE_URL = 'https://localhost:7063';

describe('Family API Integration Tests', () => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { Accept: '*/*', 'Content-Type': 'application/json' },
    timeout: 5000,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error(`API request failed: ${error.message}, URL: ${error.config?.url}`);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      return Promise.reject(error);
    }
  );

  let createdFamilyIds: number[] = [];

  afterEach(async () => {
    for (const familyId of createdFamilyIds) {
      try {
        await apiClient.delete(`/api/Family/${familyId}`);
        console.log(`Cleaned up family ID ${familyId}`);
      } catch (error) {
        console.warn(`Cleanup failed for family ID ${familyId}:`, error);
      }
    }
    createdFamilyIds = [];
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe('GET /api/Family', () => {
    it('should return a list of families with members and certificates', async () => {
      try {
        const response: AxiosResponse = await apiClient.get('/api/Family');
        expect(response.status).toEqual(200);
        expect(response.data.items).toBeInstanceOf(Array);
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
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    });

    it('should return 200 with families that may have empty certificates', async () => {
      try {
        const response: AxiosResponse = await apiClient.get('/api/Family');
        expect(response.status).toEqual(200);
        expect(response.data.items).toBeInstanceOf(Array);
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
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
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

      try {
        const response: AxiosResponse = await apiClient.post('/api/Family', requestBody);
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
        createdFamilyIds.push(response.data.Id);
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    });
  });

  describe('PUT /api/Family/{id}', () => {
    it('should update a family and return 204', async () => {
      const createBody = {
        Id: 0,
        Name: 'Familie Janssens',
        Address: 'Kerkstraat 1',
        Members: [
          {
            Id: 0,
            Name: 'Jan Janssens',
            DateOfBirth: '1980-05-15T00:00:00Z',
            FamilyId: 0,
          },
        ],
        Certificates: [
          {
            Id: 0,
            Title: 'Voedselattest',
            IssueDate: '2024-05-28T12:17:01.312Z',
            ExpiryDate: '2026-05-28T12:17:01.312Z',
            FamilyId: 0,
          },
        ],
      };

      try {
        const createResponse: AxiosResponse = await apiClient.post('/api/Family', createBody);
        const familyId = createResponse.data.Id;
        createdFamilyIds.push(familyId);

        const updateBody = {
          Id: familyId,
          Name: 'Familie Janssens Updated',
          Address: 'Nieuwe Straat 5',
          Members: [
            {
              Id: createResponse.data.Members[0].Id,
              Name: 'Jan Janssens',
              DateOfBirth: '1980-05-15T00:00:00Z',
              FamilyId: familyId,
            },
            {
              Id: 0,
              Name: 'Marie Janssens',
              DateOfBirth: '1985-08-20T00:00:00Z',
              FamilyId: familyId,
            },
          ],
          Certificates: [
            {
              Id: createResponse.data.Certificates[0].Id,
              Title: 'Voedselattest Updated',
              IssueDate: '2024-05-28T12:17:01.312Z',
              ExpiryDate: '2026-05-28T12:17:01.312Z',
              FamilyId: familyId,
            },
          ],
        };

        const response: AxiosResponse = await apiClient.put(`/api/Family/${familyId}`, updateBody);
        expect(response.status).toEqual(204);
      } catch (error) {
        console.error('Test failed:', error);
        throw error;
      }
    });
  });
});