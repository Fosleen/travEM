import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "REST API dokumentacija",
      version: "1.0.0",
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app/routes/*"],
};

const swagerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // docs page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagerSpec));

  // json docs
  app.get("docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
