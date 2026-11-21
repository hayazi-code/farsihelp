import { expect, test } from "@playwright/test";

const typeGameWord = (page, word) =>
  page.evaluate((letters) => {
    letters
      .split("")
      .forEach((key) =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key, bubbles: true }),
        ),
      );
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
    );
  }, word);

test("migrates legacy progress and keeps the player on their last board", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "vazhechin-v01",
      JSON.stringify({ 0: ["روزنامه"], 3: ["باران"] }),
    ),
  );
  await page.goto("/vazhechin/");
  await expect(page.locator("#shortCount")).toHaveText("۱");
  await expect(page.locator("#score")).toHaveText("۱۴");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("vazhechin-v02")),
  );
  expect(saved.version).toBe(3);
  expect(saved.boards[0]).toContain("روزنامه");
});

test("accepts a valid keyboard-entered word and persists it", async ({
  page,
}) => {
  await page.goto("/vazhechin/");
  await typeGameWord(page, "روزنامه");
  await expect(page.locator("#msg")).toContainText("۱۴ امتیاز");
  await expect(page.locator("#shortCount")).toHaveText("۱");
  await page.reload();
  await expect(page.locator("#shortCount")).toHaveText("۱");
});

test("offers progressive hints without changing score", async ({ page }) => {
  await page.goto("/vazhechin/");
  await page.locator("#hint").click();
  await expect(page.locator("#msg")).toContainText("راهنما");
  await expect(page.locator("#score")).toHaveText("۰");
  await page.locator("#hint").click();
  await expect(page.locator("#msg")).toContainText("•");
  await page.locator("#hint").click();
  await page.locator("#hint").click();
  await page.locator("#hint").click();
  await expect(page.locator("#hintRemaining")).toHaveText("۰");
  await page.locator("#hint").click();
  await expect(page.locator("#msg")).toContainText("سقف پنج راهنما");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("vazhechin-v02")),
  );
  expect(saved.hints[0]).toBe(5);
});

test("saves the selected color scheme", async ({ page }) => {
  await page.goto("/vazhechin/");
  await page.locator("#settings").click();
  await page.getByRole("button", { name: "شب" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "night");
});

test("dialogs trap focus and return it to their trigger", async ({ page }) => {
  await page.goto("/vazhechin/");
  await page.locator("#help").click();
  await expect(page.locator("#modal")).toHaveClass(/open/);
  await expect(page.locator("#close")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#modal")).not.toHaveClass(/open/);
  await expect(page.locator("#help")).toBeFocused();
});

test("focus mode is reversible and the layout does not overflow", async ({
  page,
}) => {
  await page.goto("/vazhechin/");
  await page.locator("#focusToggle").click();
  await expect(page.locator("body")).toHaveClass(/focus-mode/);
  await page.locator("#focusToggle").click();
  await expect(page.locator("body")).not.toHaveClass(/focus-mode/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  const resetIsVisible = await page.locator("#reset").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  });
  if (page.viewportSize().width < 601) expect(resetIsVisible).toBe(true);
  else
    expect(
      await page
        .locator("main")
        .evaluate((element) => getComputedStyle(element).overflowY),
    ).toBe("auto");
});
