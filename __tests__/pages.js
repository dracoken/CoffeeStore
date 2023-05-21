import { render } from "@testing-library/react";
import Home from "@/pages/index";
import Menu from "@/pages/menu";
import Cart from "@/pages/cart";

jest.mock('next/router', () => require('next-router-mock'));

describe("pages", () => {
  it("renders homepage unchanged", () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });

  it("renders menu unchanged", () => {
    const { container } = render(<Menu />);
    expect(container).toMatchSnapshot();
  });

  it("renders cart unchanged", () => {
    const { container } = render(<Cart />);
    expect(container).toMatchSnapshot();
  });
});
