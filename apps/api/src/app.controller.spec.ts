import { Test, TestingModule } from "@nestjs/testing";

import { AppController } from "./app.controller";

describe("AppController", () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe("health", () => {
    it("returns a deterministic health response", () => {
      expect(controller.getHealth()).toEqual({
        status: "ok",
        service: "api",
      });
    });
  });
});
