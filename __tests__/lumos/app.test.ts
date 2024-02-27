import { App } from "@/api/lumos/model/app";
import "@testing-library/jest-dom";

describe("测试App类", () => {
  const app = new App();
  describe("未初始化app", () => {
    it("执行getTicker", () => expect(app.getTicker).toThrow());
    it("执行getView", () => expect(app.getView).toThrow());
    it("执行render", () => expect(app.render).toThrow());
    it("执行resize", () => expect(app.resize).toThrow());
  });
});
