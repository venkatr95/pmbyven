import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";

describe("Card", () => {
  it("renders composed card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Platform health</CardDescription>
        </CardHeader>
        <CardContent>
          <p>42 posts</p>
        </CardContent>
        <CardFooter>
          <button type="button">Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Platform health")).toBeInTheDocument();
    expect(screen.getByText("42 posts")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });
});
