import { test, expect } from "@playwright/test";

test("happy path: users list → details → back", async ({ page }) => {
  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

  // Desktop table links (mobile card links exist but are hidden on desktop).
  const firstUserLink = page.locator("table a[href^=\"/users/\"]").first();
  await expect(firstUserLink).toBeVisible();

  const firstName = (await firstUserLink.textContent())?.trim() ?? "";
  await firstUserLink.click();

  await expect(page).toHaveURL(/\/users\/\d+/);
  // Details page has user name as h1
  if (firstName) {
    await expect(page.getByRole("heading", { name: firstName })).toBeVisible();
  }

  await expect(page.getByText("Posts")).toBeVisible();
  await expect(page.getByText("Todos")).toBeVisible();

  await page.getByRole("link", { name: /back to list/i }).click();
  await expect(page).toHaveURL(/\/users/);
});

