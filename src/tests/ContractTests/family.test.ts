import path from "path";
import { Pact } from "@pact-foundation/pact";
import { Matchers } from "@pact-foundation/pact";
import { fetchFamilies } from "../src/services/api";

const { like, eachLike, iso8601DateTime } = Matchers;

const provider = new Pact({
  consumer: "frontend-app",
  provider: "family-api",
  port: 1234,
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "info",
});

describe("Pact - GET /api/Family", () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it("returns expected family data", async () => {
    await provider.addInteraction({
      state: "database contains families",
      uponReceiving: "a request to GET /api/Family",
      withRequest: {
        method: "GET",
        path: "/api/Family",
      },
      willRespondWith: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: {
          items: eachLike({
            Id: like(1),
            Name: like("Familie Janssens"),
            Address: like("Kerkstraat 1"),
            Members: eachLike({
              Id: like(1),
              Name: like("Jan Janssens"),
              DateOfBirth: iso8601DateTime("1980-05-15T00:00:00"),
              FamilyId: like(1),
            }),
            Certificates: eachLike({
              Id: like(1),
              Title: like("Voedselattest"),
              IssueDate: iso8601DateTime("2024-05-28T12:17:01.312178"),
              ExpiryDate: iso8601DateTime("2026-05-28T12:17:01.3121783"),
              FamilyId: like(1),
            }),
          }),
        },
      },
    });

    // Override de API URL naar Pact mock server
    const originalFetch = global.fetch;
    global.fetch = (...args) =>
      fetch(`http://localhost:1234/api/Family`);

    const data = await fetchFamilies();
    expect(data.items.length).toBeGreaterThan(0);
    expect(data.items[0].Name).toContain("Familie");

    global.fetch = originalFetch;
  });
});
