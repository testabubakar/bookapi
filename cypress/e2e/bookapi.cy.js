import faker from "faker";
chai.use(require("chai-json-schema"));

describe("test book api", () => {
  let accessToken = Cypress.env("token");
  let fakeremail = faker.internet.email();
  let booktoken = "";
  let orderid = "";

  before("generate token", () => {
    cy.request({
      method: "POST",
      url: "/api-clients/",
      body: {
        clientName: accessToken.clientName,
        clientEmail: fakeremail,
      },
    }).then((response) => {
      booktoken = response.body.accessToken;
    });
  });

  it("should return a list of books", () => {
    cy.request({
      method: "GET",
      url: "/books",
    }).then((response) => {
      expect(response.status).to.eq(200);

      const schema = {
        type: "array",
        Welcome3Element: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            type: { type: "string" },
            available: { type: "boolean" },
          },
          required: ["available", "id", "name", "type"],
        },
      };

      expect(response.body).to.be.jsonSchema(schema);
    });
  });

  it("should return a single book", () => {
    cy.request({
      method: "GET",
      url: "/books/3",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(3);
      expect(response.body.type).to.eq("fiction");

      const schema = {
        Welcome9: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
            author: {
              type: "string",
            },
            type: {
              type: "string",
            },
            price: {
              type: "number",
            },
            "current-stock": {
              type: "integer",
            },
            available: {
              type: "boolean",
            },
          },
          required: [
            "author",
            "available",
            "current-stock",
            "id",
            "name",
            "price",
            "type",
          ],
          title: "Welcome9",
        },
      };
      expect(response.body).to.be.jsonSchema(schema);
    });
  });

  it("it should submit a order", () => {
    cy.request({
      method: "POST",
      url: "/orders/",
      headers: {
        Authorization: "Bearer " + booktoken,
      },
      body: {
        bookId: 5,
        customerName: "ali",
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.created).to.eq(true);
      orderid = response.body.orderId;

      const schema = {
        type: "object",
        properties: {
          created: {
            type: "boolean",
          },
          orderId: {
            type: "string",
          },
        },
        required: ["created", "orderId"],
      };
      expect(response.body).to.be.jsonSchema(schema);
    });
  });

  it("it should get all orders", () => {
    cy.request({
      method: "GET",
      url: "/orders",
      headers: {
        Authorization: "Bearer " + booktoken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const schema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            bookId: {
              type: "number",
            },
            customerName: {
              type: "string",
            },
            createdBy: {
              type: "string",
            },
            quantity: {
              type: "number",
            },
            timestamp: {
              type: "number",
            },
          },
          required: [
            "id",
            "bookId",
            "customerName",
            "createdBy",
            "quantity",
            "timestamp",
          ],
        },
      };
      expect(response.body).to.be.jsonSchema(schema);
    });
  });

  it("it should get a single order", () => {
    cy.request({
      method: "GET",
      url: `/orders/${orderid}`,
      headers: {
        Authorization: "Bearer " + booktoken,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.quantity).to.eq(1);
      expect(response.body.customerName).to.eq("ali");
      expect(response.body.bookId).to.eq(5);

      const schema = {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          bookId: {
            type: "number",
          },
          customerName: {
            type: "string",
          },
          createdBy: {
            type: "string",
          },
          quantity: {
            type: "number",
          },
          timestamp: {
            type: "number",
          },
        },
        required: [
          "id",
          "bookId",
          "customerName",
          "createdBy",
          "quantity",
          "timestamp",
        ],
      };
      expect(response.body).to.be.jsonSchema(schema);
    });
  });

  it("it should update a order", () => {
    cy.request({
      method: "PATCH",
      url: `/orders/${orderid}`,
      headers: {
        Authorization: "Bearer " + booktoken,
      },
      body: {
        customerName: "abuakar",
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it("it should delete a order", () => {
    cy.request({
      method: "DELETE",
      url: `orders/${orderid}`,
      headers: {
        Authorization: "Bearer " + booktoken,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
      expect(response.body).to.eq("");
    });
  });
});
