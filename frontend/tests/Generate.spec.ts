import { test, expect } from "@playwright/test"
import { exec } from "child_process"

test.beforeAll(async () => {
    console.log("Before tests")
    exec("cd ../contracts && yarn deploy:local")
})

test("test run", async ({ page }) => {
    await page.goto("/")
    await page.getByTestId("dev-btn").click()
    await page.getByTestId("generate-nav-btn").click()
    await expect(page).toHaveURL("/generate")
})
